// Rebuilds the Clang sysroot from the two upstream trees it is a pruned copy of.
//
// TWO UPSTREAM TREES, because the shipped sysroot is pruned from two:
//
//   libc++   --libcxx <llvm>/libcxx/include      lands at include/c++/v1
//   wasi-libc --libc  <wasi-sdk>/share/wasi-sysroot/include/wasm32-wasi
//                                                lands at include/wasm32-wasi
//
// Why restoring is safe for both: the shipped sysroot is a *pure prune* of its upstreams with zero
// modifications, so re-adding files reproduces the original tree - no patches, no version skew, and
// no ABI risk against the prebuilt libc.a / libc++.a already in lib/.
//
// libc++ is verified against llvm-project tag llvmorg-22.1.0 (its _LIBCPP_VERSION is 220100, matching
// the sysroot exactly): all 825 shared files are byte-identical.
//
// The C headers are the reason this script has a second source. A prune cannot be referentially
// closed: pruning wasi-libc keeps <unistd.h>, which includes <__header_unistd.h> and <bits/posix.h>,
// and drops both - so a header the sysroot ships cannot be preprocessed at all. Restoring the C tree
// wholesale is the fix, because any subset can be broken the same way. It is cheap: the C headers are
// ~200 files and ~0.4 MB, against the 15 MB of libc++ the tree also carries (under
// wasm32-wasi/c++ in the SDK, which is skipped here - this sysroot keeps its libc++ at include/c++/v1).
//
// MODES for libc++, because memfs historically had ~41 spare nodes:
//
//   --all                      restore all missing libc++ headers
//   --features bit,expected    restore only the transitive closure of those headers
//
// The C headers have no modes: all missing files are restored, always.
//
// Usage:
//   node build-sysroot.mjs --sysroot <extracted> \
//        [--libcxx <llvm>/libcxx/include (--all | --features a,b)] \
//        [--libc <wasi-sdk>/share/wasi-sysroot/include/wasm32-wasi] \
//        [--out sysroot.tar.gz] [--capacity 4091]

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const arg = (name, fallback) => {
	const index = process.argv.indexOf('--' + name);
	return index === -1 ? fallback : process.argv[index + 1];
};

const libcxxDir = arg('libcxx');
const libcDir = arg('libc');
const sysrootDir = arg('sysroot');
const out = arg('out', 'sysroot.tar.gz');
const featuresArg = arg('features');
const restoreAll = process.argv.includes('--all');
const exact = process.argv.includes('--exact');

if ((!libcxxDir && !libcDir) || !sysrootDir) {
	console.error(
		'usage: node build-sysroot.mjs --sysroot <extracted> ' +
			'[--libcxx <libcxx/include> (--all | --features a,b)] [--libc <wasm32-wasi include>] ' +
			'[--out sysroot.tar.gz]'
	);
	process.exit(1);
}

const SKIP = new Set(['CMakeLists.txt', '__config_site.in', 'module.modulemap.in']);

const walk = (dir, rel = '') => {
	const result = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const r = rel ? rel + '/' + entry.name : entry.name;
		if (entry.isDirectory()) result.push(...walk(path.join(dir, entry.name), r));
		else result.push(r);
	}
	return result;
};

const cxxTarget = path.join(sysrootDir, 'include', 'c++', 'v1');
const cTarget = path.join(sysrootDir, 'include', 'wasm32-wasi');

if (libcxxDir && !fs.existsSync(cxxTarget)) {
	console.error(`not an extracted clang sysroot: ${sysrootDir}`);
	process.exit(1);
}
if (libcDir && !fs.existsSync(cTarget)) {
	console.error(`the extracted sysroot has no include/wasm32-wasi: ${sysrootDir}`);
	process.exit(1);
}

// What is already mounted, relative to each target, so "missing" means missing from the tarball
// rather than merely absent from the working copy.
const presentCxx = new Set(libcxxDir ? walk(cxxTarget) : []);
const presentC = new Set(libcDir ? walk(cTarget) : []);

/** @type {{ source: string, target: string, files: string[], label: string }[]} */
const plans = [];

if (libcxxDir) {
	const upstream = walk(libcxxDir).filter((f) => !f.startsWith('__cxx03/'));
	const upstreamSet = new Set(upstream);

	const includes = new Map();
	for (const f of upstream) {
		const text = fs.readFileSync(path.join(libcxxDir, f), 'utf8');
		const set = new Set();
		for (const m of text.matchAll(/#\s*include\s*<([^>]+)>/g)) {
			const inc = m[1].trim();
			if (upstreamSet.has(inc)) set.add(inc);
		}
		includes.set(f, set);
	}

	const missing = new Set(upstream.filter((f) => !presentCxx.has(f)));

	let wanted;
	if (restoreAll) {
		wanted = new Set(missing);
		console.log(`libc++ mode: --all (${wanted.size} missing headers)`);
	} else if (featuresArg) {
		const features = featuresArg.split(',').map((f) => f.trim()).filter(Boolean);
		wanted = new Set();
		for (const feature of features) {
			if (!upstreamSet.has(feature)) {
				console.error(`  ! unknown header: ${feature}`);
				continue;
			}
			if (exact) {
				wanted.add(feature);
				continue;
			}
			// The include graph over-approximates badly because it ignores #if guards: the closure
			// of __ostream/print.h pulls in 46 files the C++23 code path never reaches. Use --exact
			// with a list verified against a real compile.
			const stack = [feature];
			while (stack.length) {
				const cur = stack.pop();
				if (wanted.has(cur)) continue;
				wanted.add(cur);
				for (const dep of includes.get(cur) || []) stack.push(dep);
			}
		}
		const already = [...wanted].filter((f) => !missing.has(f)).length;
		wanted = new Set([...wanted].filter((f) => missing.has(f)));
		console.log(
			`libc++ mode: --features [${features.join(', ')}]${exact ? ' --exact' : ''} -> ` +
				`${wanted.size} new files (${already} already present)`
		);
	} else {
		console.error('pick --all or --features for libc++');
		process.exit(1);
	}

	plans.push({ source: libcxxDir, target: cxxTarget, files: [...wanted], label: 'libc++', present: presentCxx, text: true });
}

if (libcDir) {
	// wasi-sdk also carries libc++ under this directory - twice, once per exception model, as `eh/`
	// and `noeh/` (and as `c++/` in older SDKs). This sysroot keeps its libc++ at include/c++/v1,
	// restored from llvm-project, so those are not the C headers being restored here and are skipped.
	// What is left is ~206 files and ~380 KB.
	const upstream = walk(libcDir).filter(
		(f) => !f.startsWith('c++/') && !f.startsWith('eh/') && !f.startsWith('noeh/')
	);
	const missing = upstream.filter((f) => !presentC.has(f));
	console.log(
		`wasi-libc: ${upstream.length} C headers upstream, ${presentC.size} present, ` +
			`${missing.length} to restore`
	);
	plans.push({ source: libcDir, target: cTarget, files: missing, label: 'wasi-libc', present: presentC, text: false });
}

// Directories that will be created (they consume memfs nodes too).
const newDirs = new Set();
for (const plan of plans) {
	for (const f of plan.files) {
		const parts = f.split('/');
		for (let i = 1; i < parts.length; i++) {
			const dir = parts.slice(0, i).join('/');
			if (!plan.present.has(dir) && !fs.existsSync(path.join(plan.target, dir))) {
				newDirs.add(path.join(plan.target, dir));
			}
		}
	}
}

let added = 0;
for (const plan of plans) {
	for (const rel of [...plan.files].sort()) {
		const destination = path.join(plan.target, rel);
		if (fs.existsSync(destination)) continue;

		if (plan.text) {
			// A checkout may be CRLF; the sysroot ships LF. Normalise so the result is
			// byte-identical to upstream.
			const contents = fs.readFileSync(path.join(plan.source, rel), 'utf8').replace(/\r\n/g, '\n');
			fs.mkdirSync(path.dirname(destination), { recursive: true });
			fs.writeFileSync(destination, contents);
		} else {
			// Copied as bytes: this source is an unpacked release archive, not a checkout.
			fs.mkdirSync(path.dirname(destination), { recursive: true });
			fs.copyFileSync(path.join(plan.source, rel), destination);
		}
		added++;
	}
	if (plan.label === 'libc++') console.log(`  libc++: added ${plan.files.length} files`);
}

const nodeCost = added + newDirs.size;
// The stock memfs tops out at 1019 usable nodes; a memfs rebuilt by build-memfs.mjs with --nodes N
// provides N-5. Pass --capacity to compare against the one you are deploying.
const capacity = Number(arg('capacity', '4091'));
console.log(`added ${added} files + ${newDirs.size} dirs = ${nodeCost} memfs nodes  (capacity ~${capacity})`);
if (nodeCost > capacity) {
	console.log(`  !! over capacity - memfs will abort while mounting (stock memfs is only 1019)`);
}

console.log('re-tarring…');
execFileSync('tar', ['-czf', path.resolve(out), 'include', 'lib'], { cwd: sysrootDir, stdio: 'inherit' });
console.log(`${out}: ${(fs.statSync(out).size / 1048576).toFixed(1)} MB`);

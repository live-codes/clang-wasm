// Rebuilds the Clang sysroot, restoring libc++ headers the producer pruned out.
//
// Why this is safe: the shipped sysroot is a *pure prune* of upstream libc++ with zero
// modifications. Verified against llvm-project tag llvmorg-22.1.0 (its _LIBCPP_VERSION is
// 220100, matching the sysroot exactly): all 825 shared files are byte-identical. So
// re-adding files reproduces the original tree - no patches, no version skew, and no ABI
// risk against the prebuilt libc++.a already in lib/.
//
// TWO MODES, because memfs only has ~41 spare nodes (ceiling is 1019 total):
//
//   --all                      restore all 849 missing headers (needs a rebuilt memfs)
//   --features bit,expected    restore only the transitive closure of those headers
//
// Usage:
//   node build-sysroot.mjs --libcxx <llvm>/libcxx/include --sysroot <extracted> \
//        --features bit,expected,numbers,source_location,typeindex --out sysroot.tar.gz

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const arg = (name, fallback) => {
	const index = process.argv.indexOf('--' + name);
	return index === -1 ? fallback : process.argv[index + 1];
};

const libcxxDir = arg('libcxx');
const sysrootDir = arg('sysroot');
const out = arg('out', 'sysroot.tar.gz');
const featuresArg = arg('features');
const restoreAll = process.argv.includes('--all');
const exact = process.argv.includes('--exact');

if (!libcxxDir || !sysrootDir) {
	console.error('usage: node build-sysroot.mjs --libcxx <libcxx/include> --sysroot <extracted> (--all | --features a,b) [--out sysroot.tar.gz]');
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

const target = path.join(sysrootDir, 'include', 'c++', 'v1');
if (!fs.existsSync(target)) {
	console.error(`not an extracted clang sysroot: ${sysrootDir}`);
	process.exit(1);
}

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

// Which upstream files are absent from the mounted sysroot.
const present = new Set(walk(target));
const missing = new Set(upstream.filter((f) => !present.has(f)));

let wanted;
let stack;
if (restoreAll) {
	wanted = new Set(missing);
	console.log(`mode: --all (${wanted.size} missing headers)`);
} else if (featuresArg) {
	const features = featuresArg.split(',').map((f) => f.trim()).filter(Boolean);
	wanted = new Set();
	stack = [];
	for (const feature of features) {
		if (!upstreamSet.has(feature)) {
			console.error(`  ! unknown header: ${feature}`);
			continue;
		}
		stack.push(feature);
	}
	// --exact adds only the named files. The include graph over-approximates badly
	// because it ignores #if guards: the closure of __ostream/print.h pulls in 46
	// files that the C++23 code path never reaches. Use --exact with a list verified
	// against a real compile.
	if (!exact) {
		while (stack.length) {
			const cur = stack.pop();
			if (wanted.has(cur)) continue;
			wanted.add(cur);
			for (const dep of includes.get(cur) || []) stack.push(dep);
		}
	} else {
		for (const feature of stack) wanted.add(feature);
	}

	// Only actually add what is missing; already-present deps cost nothing.
	const already = [...wanted].filter((f) => !missing.has(f)).length;
	wanted = new Set([...wanted].filter((f) => missing.has(f)));
	console.log(
		`mode: --features [${features.join(', ')}]${exact ? ' --exact' : ''} -> ` +
			`${wanted.size} new files (${already} already present)`
	);
} else {
	console.error('pick --all or --features');
	process.exit(1);
}

// Directories that will be created (they consume memfs nodes too).
const newDirs = new Set();
for (const f of wanted) {
	const parts = f.split('/');
	for (let i = 1; i < parts.length; i++) {
		const dir = parts.slice(0, i).join('/');
		if (!present.has(dir) && !fs.existsSync(path.join(target, dir))) newDirs.add(dir);
	}
}

let added = 0;
for (const rel of [...wanted].sort()) {
	const destination = path.join(target, rel);
	if (fs.existsSync(destination)) continue;

	// The checkout may have CRLF; the sysroot ships LF. Normalise so the result is
	// byte-identical to upstream.
	const contents = fs.readFileSync(path.join(libcxxDir, rel), 'utf8').replace(/\r\n/g, '\n');
	fs.mkdirSync(path.dirname(destination), { recursive: true });
	fs.writeFileSync(destination, contents);
	added++;
}

const nodeCost = added + newDirs.size;
// The stock memfs tops out at 1019 usable nodes; a memfs rebuilt by build-memfs.mjs with
// --nodes N provides N-5. Pass --capacity to compare against the one you are deploying.
const capacity = Number(arg('capacity', '4091'));
console.log(`added ${added} files + ${newDirs.size} dirs = ${nodeCost} memfs nodes  (capacity ~${capacity})`);
if (nodeCost > capacity) {
	console.log(`  !! over capacity - memfs will abort while mounting (stock memfs is only 1019)`);
}

console.log('re-tarring…');
execFileSync('tar', ['-czf', path.resolve(out), 'include', 'lib'], { cwd: sysrootDir, stdio: 'inherit' });
console.log(`${out}: ${(fs.statSync(out).size / 1048576).toFixed(1)} MB`);

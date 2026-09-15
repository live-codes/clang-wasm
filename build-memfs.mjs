// Rebuilds the memfs module with a larger node table.
//
// memfs is the in-memory filesystem the Clang runtime mounts the sysroot into. Its node
// table is a static array, so it must be recompiled to hold more files - that is the only
// way to mount a complete libc++.
//
//   node build-memfs.mjs --src <dir with memfs.c + stb_sprintf.h> --wasi-sdk <dir> [--nodes 4096] [--out memfs.wasm]
//
// Source: binji/llvm-project/binji/memfs.c (referenced by binji/wasm-clang's README as the
// implementation of its in-memory filesystem). The binary published by @wasm-idle/llvm-core
// and @chriskoch/cpp-wasm is byte-identical to the one that repo builds.
//
// Two patches are needed against modern wasi-libc:
//   1. <wasi/core.h> was renamed to <wasi/api.h> around 2020 (the original used clang 9).
//   2. MAX_NODES 1024 -> N. The default ceiling is 1019 usable nodes, and the stock sysroot
//      already consumes 978, which is why libc++ ships pruned.

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { createHash } from 'crypto';
import { execFileSync } from 'child_process';

const arg = (name, fallback) => {
	const i = process.argv.indexOf('--' + name);
	return i === -1 ? fallback : process.argv[i + 1];
};

const lockPath = arg('lock', path.join(import.meta.dirname, 'toolchain.lock.json'));
const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));

const srcDir = arg('src');
const wasiSdk = arg('wasi-sdk');
const nodes = Number(arg('nodes', '4096'));
const out = arg('out', 'memfs.wasm');
const work = arg('work', 'memfs-build');
const verifyOnly = process.argv.includes('--verify-only');

const sha256 = (p) => createHash('sha256').update(fs.readFileSync(p)).digest('hex');

// --- verify the pinned source files ---------------------------------------
function verifySource() {
	if (!srcDir) return { ok: true, checked: 0, failures: [] };
	const failures = [];
	let checked = 0;
	const files = lock.memfs.files;
	for (const [name, pin] of Object.entries(files)) {
		const p = path.join(srcDir, name);
		if (!fs.existsSync(p)) {
			failures.push(`missing ${name}`);
			continue;
		}
		checked++;
		const want = pin.replace(/^sha256:/, '');
		const got = sha256(p);
		if (got !== want) failures.push(`${name} expected ${want.slice(0, 16)}… got ${got.slice(0, 16)}…`);
	}
	return { ok: failures.length === 0, checked, failures };
}

if (verifyOnly) {
	const r = verifySource();
	console.log(`pinned source files checked: ${r.checked}`);
	for (const f of r.failures) console.log('  FAIL ' + f);
	// The published output pins are what a consumer deploys.
	const dist = path.join(import.meta.dirname, 'dist');
	for (const [name, pin] of Object.entries(lock.memfs.outputs)) {
		const p = path.join(dist, name);
		if (!fs.existsSync(p)) {
			console.log(`  ${name}: (not built)`);
			continue;
		}
		const got = sha256(p);
		console.log(`  ${name}: ${got === pin.sha256 ? 'matches lock' : 'MISMATCH'}`);
	}
	for (const [name, pin] of Object.entries(lock.sysroot.outputs)) {
		const p = path.join(dist, name);
		if (!fs.existsSync(p)) {
			console.log(`  ${name}: (not built)`);
			continue;
		}
		const got = sha256(p);
		console.log(`  ${name}: ${got === pin.sha256 ? 'matches lock' : 'MISMATCH'}`);
	}
	process.exit(r.ok ? 0 : 1);
}

if (!srcDir || !wasiSdk) {
	console.error('usage: node build-memfs.mjs --src <memfs source dir> --wasi-sdk <dir> [--nodes 4096] [--out memfs.wasm]');
	console.error('       node build-memfs.mjs --src <memfs source dir> --verify-only');
	process.exit(1);
}

const sourceCheck = verifySource();
console.log(`pinned source files verified: ${sourceCheck.checked} (lock: ${lockPath})`);
for (const f of sourceCheck.failures) console.log('  ! ' + f);
if (!sourceCheck.ok) {
	console.error('\nSource does not match toolchain.lock.json. Refusing to build from unpinned input.');
	process.exit(1);
}

const resolveBin = (dir, name) => {
	for (const candidate of [name, name + '.exe']) {
		const p = path.join(dir, candidate);
		if (fs.existsSync(p)) return p;
	}
	return path.join(dir, name);
};

const clang = resolveBin(path.join(wasiSdk, 'bin'), 'clang');
const wasmLd = resolveBin(path.join(wasiSdk, 'bin'), 'wasm-ld');
const sysroot = path.join(wasiSdk, 'share', 'wasi-sysroot');

for (const [label, p] of [['clang', clang], ['wasm-ld', wasmLd], ['sysroot', sysroot]]) {
	if (!fs.existsSync(p)) {
		console.error(`missing ${label}: ${p}`);
		process.exit(1);
	}
}

fs.mkdirSync(work, { recursive: true });

// --- patch the source ------------------------------------------------------
// memfs.c was written against clang 9 / wasi-libc of 2019. WASI preview1 was finalised
// afterwards and renamed several things, so a modern toolchain needs these mechanical
// fixes. Nothing here changes behaviour.
let source = fs.readFileSync(path.join(srcDir, 'memfs.c'), 'utf8');
const applied = [];

const rename = (label, from, to, global = true) => {
	const re = new RegExp(from, global ? 'g' : '');
	const before = source;
	source = source.replace(re, to);
	if (source !== before) applied.push(label);
};

// 1. wasi/core.h was renamed to wasi/api.h around 2020.
rename('<wasi/core.h> -> <wasi/api.h>', '#include <wasi/core.h>', '#include <wasi/api.h>');
if (!applied.length) console.warn('  ! wasi/core.h include not found (already patched?)');

// 2. The capacity change this rebuild exists for.
rename('MAX_NODES=' + nodes, '#define MAX_NODES \\d+', `#define MAX_NODES ${nodes}`);
if (!applied.some((a) => a.startsWith('MAX_NODES'))) console.warn('  ! MAX_NODES define not found');

// 3. errno constants gained an ERRNO_ infix: __WASI_EINVAL -> __WASI_ERRNO_INVAL.
const errnoNames = ['BADF', 'EXIST', 'INVAL', 'MFILE', 'NODEV', 'NOENT', 'NOTCAPABLE', 'NOTDIR', 'SUCCESS'];
for (const name of errnoNames) {
	rename('errno ' + name, '__WASI_E' + name + '\\b', '__WASI_ERRNO_' + name);
}

// 4. Flag constants were pluralised: FDFLAG_ -> FDFLAGS_, O_ -> OFLAGS_.
for (const [from, to] of [
	['__WASI_FDFLAG_APPEND', '__WASI_FDFLAGS_APPEND'],
	['__WASI_O_CREAT', '__WASI_OFLAGS_CREAT'],
	['__WASI_O_DIRECTORY', '__WASI_OFLAGS_DIRECTORY'],
	['__WASI_O_EXCL', '__WASI_OFLAGS_EXCL'],
	['__WASI_O_TRUNC', '__WASI_OFLAGS_TRUNC']
]) {
	rename('flag ' + from, from + '\\b', to);
}

// 5. __wasi_filestat_t dropped the st_ prefix on its fields, and __wasi_prestat_t
//    renamed pr_type -> tag.
for (const [from, to] of [
	['st_dev', 'dev'],
	['st_ino', 'ino'],
	['st_filetype', 'filetype'],
	['st_nlink', 'nlink'],
	['st_size', 'size'],
	['st_atim', 'atim'],
	['st_mtim', 'mtim'],
	['st_ctim', 'ctim'],
	['pr_type', 'tag']
]) {
	rename('field ' + from, '\\b' + from + '\\b', to);
}

// 6. Assert() calls libc abort(), which on modern wasi-libc reaches __wasi_proc_exit and
//    therefore a wasi_snapshot_preview1 import. The runtime only satisfies env.* imports.
rename(
	'self-contained abort',
	'void Assert\\(bool result, const char\\* cond\\) \\{',
	`// keep the module's imports limited to env.* so the runtime can instantiate it
void abort(void);
void abort(void) { __builtin_trap(); }

void Assert(bool result, const char* cond) {`
);

fs.writeFileSync(path.join(work, 'memfs.c'), source);
fs.copyFileSync(path.join(srcDir, 'stb_sprintf.h'), path.join(work, 'stb_sprintf.h'));

console.log(`patched (${applied.length} edits): MAX_NODES=${nodes}`);
for (const a of applied) console.log('   ' + a);

// --- compile and link (mirrors binji's Makefile) ---------------------------
const run = (cmd, args) => {
	console.log('  ' + path.basename(cmd) + ' ' + args.join(' '));
	execFileSync(cmd, args, { cwd: work, stdio: 'inherit' });
};

run(clang, ['--sysroot=' + sysroot, '-O2', '-Wall', '-Wextra', '-Wno-unused-parameter', '-c', '-o', 'memfs.o', 'memfs.c']);
run(clang, ['--sysroot=' + sysroot, '-DSTB_SPRINTF_IMPLEMENTATION', '-x', 'c', '-O2', '-c', '-o', 'stb_sprintf.o', 'stb_sprintf.h']);
run(wasmLd, [
	'-L' + path.join(sysroot, 'lib', 'wasm32-wasi'),
	'--no-entry',
	'--export-dynamic',
	'--allow-undefined',
	'-o', 'memfs',
	'memfs.o',
	'stb_sprintf.o',
	'-lc'
]);

// --- verify the module shape ----------------------------------------------
const wasm = fs.readFileSync(path.join(work, 'memfs'));
const module = await WebAssembly.compile(wasm);
const imports = WebAssembly.Module.imports(module);
const exports_ = WebAssembly.Module.exports(module);

const importModules = [...new Set(imports.map((i) => i.module))];
console.log('\nimports (' + imports.length + '):');
for (const i of imports) console.log('   ' + i.module + '.' + i.name);
console.log('export count:', exports_.length);

const required = [
	'memory', 'init', 'GetPathBuf', 'GetPathBufLen', 'FindNode', 'AddDirectoryNode',
	'AddFileNode', 'GetFileNodeAddress', 'GetFileNodeSize'
];
const exported = new Set(exports_.map((e) => e.name));
const missing = required.filter((r) => !exported.has(r));
if (missing.length) console.log('  !! MISSING EXPORTS: ' + missing.join(', '));
else console.log('  all required exports present');

// The runtime only supplies env.* imports, so anything else will fail to instantiate.
const badImports = importModules.filter((m) => m !== 'env');
if (badImports.length) console.log('  !! UNSUPPORTED IMPORT MODULES: ' + badImports.join(', '));
else console.log('  imports are env.* only (runtime-compatible)');

fs.copyFileSync(path.join(work, 'memfs'), out);
const gz = zlib.gzipSync(wasm, { level: 9 });
fs.writeFileSync(out + '.gz', gz);
console.log(`\n${out}: ${(wasm.length / 1024).toFixed(0)} KiB`);

// Compare against the pinned output. gzip is deterministic across Node versions here
// because zlib.gzipSync does not embed a timestamp, so this is a real reproducibility check.
const pinnedOut = lock.memfs.outputs['memfs.wasm.gz'];
const gotGz = createHash('sha256').update(gz).digest('hex');
console.log(`${out}.gz: ${(gz.length / 1024).toFixed(0)} KiB`);
if (pinnedOut) {
	const match = gotGz === pinnedOut.sha256;
	console.log(`  reproducibility: ${match ? 'MATCHES lock (' + gotGz.slice(0, 16) + '…)' : 'DIFFERS from lock'}`);
	if (!match) {
		console.log(`    lock:    ${pinnedOut.sha256}`);
		console.log(`    built:   ${gotGz}`);
		console.log('    (a mismatch means the toolchain or patches changed - re-run the feature verification)');
	}
}

// Report the toolchain identity so a bump is visible in the build log.
try {
	const version = execFileSync(clang, ['--version'], { encoding: 'utf8' }).split('\n')[0].trim();
	const pinned = lock.memfs.toolchain.clangVersion;
	console.log(`\nclang: ${version}`);
	console.log(version === pinned ? '  matches lock' : `  differs from lock (${pinned})`);
} catch {
	// non-fatal
}

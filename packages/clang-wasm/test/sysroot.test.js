// The sysroot has to be *referentially closed*: every header it ships must preprocess with nothing
// but the sysroot and Clang's own resource headers.
//
// That is what a prune breaks, and did. Pruning wasi-libc kept <unistd.h> and dropped the two headers
// it includes, <__header_unistd.h> and <bits/posix.h>, so a header the sysroot ships could not be
// compiled at all - by any C program that included it, not just the one that reported it. A test that
// only compiles a few sample programs cannot see that; this one asks the question of every header.
//
// The headers are read out of the shipped tarball rather than listed here, so the test grows with the
// sysroot instead of with someone remembering to update a list. The first test is therefore a list -
// the specific headers that went missing - and the rest are the property.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import { createCompiler } from '@live-codes/clang-wasm';
import { createToolchain, compilerDiagnostics } from '@live-codes/clang-wasm/toolchain';

const SYSROOT = fileURLToPath(new URL('../assets/bin/sysroot.tar.gz', import.meta.url));
const INCLUDE = 'include/wasm32-wasi/';

// wasi-libc gates a few headers behind an opt-in, with an `#error` that names the option. These are
// the options the toolchain's own link lines already carry - the Objective-C driver links
// -lwasi-emulated-mman, for one - so a program built by this package is compiled with them.
const WASI_EMULATION = [
	'-D_WASI_EMULATED_MMAN',
	'-D_WASI_EMULATED_SIGNAL',
	'-D_WASI_EMULATED_PROCESS_CLOCKS',
	'-D_WASI_EMULATED_GETPID'
];

// <setjmp.h> is the one header a program cannot include here, and it says so itself: WASI has no
// setjmp without the exception-handling proposal, and the runtime's engine does not implement it -
// the same limit the README records for Objective-C exceptions. Upstream's `#error` names the flag
// that would be needed, which makes this a platform limit rather than a broken header.
const PLATFORM_GATED = new Set(['setjmp.h']);

/** The tar's paths and file bytes. Only the entry types a `tar -czf` writes are handled. */
function readTarGz(file) {
	const tar = gunzipSync(readFileSync(file));
	const entries = new Map();
	const text = (start, length) =>
		tar.toString('utf8', start, start + length).replace(/\0.*$/, '');

	let longName = null;
	for (let offset = 0; offset + 512 <= tar.length; ) {
		if (tar.subarray(offset, offset + 512).every((byte) => byte === 0)) break;

		const size = Number.parseInt(text(offset + 124, 12).trim(), 8) || 0;
		const type = tar[offset + 156] === 0 ? '0' : String.fromCharCode(tar[offset + 156]);
		const data = tar.subarray(offset + 512, offset + 512 + size);

		if (type === 'L') {
			longName = data.toString('utf8').replace(/\0.*$/, '');
		} else {
			const prefix = text(offset + 345, 155);
			const name = longName ?? (prefix ? prefix + '/' + text(offset, 100) : text(offset, 100));
			longName = null;
			// A directory entry is kept as null so a caller can tell the two apart.
			if (type === '0') entries.set(name, data);
			else if (type === '5') entries.set(name, null);
		}
		offset += 512 + Math.ceil(size / 512) * 512;
	}
	return entries;
}

// What a program can include by name: not musl's `bits/` internals, not the `__*` helpers those are
// assembled from, not wasi-libc's own `wasi/libc-*.h` (other headers include those; they are not
// self-contained), and not the libc++ trees the SDK keeps under `eh/` and `noeh/` - this sysroot's
// libc++ lives at include/c++/v1.
const isPublicHeader = (relative) =>
	!relative.startsWith('__') &&
	!relative.startsWith('bits/') &&
	!relative.startsWith('c++/') &&
	!relative.startsWith('eh/') &&
	!relative.startsWith('noeh/') &&
	!relative.startsWith('wasi/libc-');

const publicCHeaders = (entries) =>
	[...entries.entries()]
		.filter(([name, data]) => data !== null && name.startsWith(INCLUDE))
		.map(([name]) => name.slice(INCLUDE.length))
		.filter(isPublicHeader)
		.sort();

test('the headers that went missing are in the sysroot', () => {
	// The report that started this: <unistd.h> could not be preprocessed, because the two headers it
	// includes had been pruned. These are the headers a C program reaches for that the sysroot was
	// missing entirely - named, so a future prune fails here rather than in someone's build.
	const shipped = new Set(publicCHeaders(readTarGz(SYSROOT)));
	const expected = [
		'arpa/inet.h',
		'assert.h',
		'ctype.h',
		'dirent.h',
		'dlfcn.h',
		'errno.h',
		'fcntl.h',
		'inttypes.h',
		'limits.h',
		'math.h',
		'netinet/in.h',
		'pthread.h',
		'semaphore.h',
		'setjmp.h',
		'signal.h',
		'stdint.h',
		'stdio.h',
		'stdlib.h',
		'string.h',
		'sys/ioctl.h',
		'sys/mman.h',
		'sys/resource.h',
		'sys/socket.h',
		'sys/stat.h',
		'sys/time.h',
		'sys/types.h',
		'sys/utsname.h',
		'sys/un.h',
		'time.h',
		'unistd.h',
		'utime.h',
		'wchar.h'
	];
	const missing = expected.filter((header) => !shipped.has(header));
	assert.deepEqual(missing, [], 'these headers are missing from the shipped sysroot');

	// And the referential closure itself: <unistd.h> includes these two, so both have to be here.
	// A name resolves in the sysroot or in Clang's own resource headers, which are in the same
	// tarball under lib/clang/<version>/include - <stddef.h> comes from there, not from wasi-libc.
	const entries = readTarGz(SYSROOT);
	const resource = new Set(
		[...entries.keys()]
			.filter((name) => /^lib\/clang\/[^/]+\/include\//.test(name))
			.map((name) => name.split('/').pop())
	);
	const unistd = entries.get(`${INCLUDE}unistd.h`)?.toString('utf8') ?? '';
	for (const dependency of unistd.matchAll(/^\s*#\s*include\s*<([^>]+)>/gm)) {
		const name = dependency[1];
		assert.ok(
			entries.has(INCLUDE + name) || resource.has(name),
			`<unistd.h> includes <${name}>, which the sysroot does not have`
		);
	}
});

test('every public C header in the sysroot compiles on its own', async () => {
	const headers = publicCHeaders(readTarGz(SYSROOT)).filter(
		(header) => !PLATFORM_GATED.has(header)
	);
	assert.ok(headers.length > 100, `expected the whole C header set, got ${headers.length}`);

	const toolchain = await createToolchain();
	const { runtime } = toolchain;
	// The runtime's filesystem rejects a duplicate path, so every compile gets its own names.
	let builds = 0;
	const failures = [];

	for (const header of headers) {
		const n = ++builds;
		const built = await toolchain.captureCompilerOutput(() =>
			runtime.compile({
				input: `hdr${n}.c`,
				code: `#include <${header}>\n`,
				obj: `hdr${n}.o`,
				language: 'C',
				compileArgs: ['-w', ...WASI_EMULATION]
			})
		);
		if (built.error) {
			failures.push(`${header}: ${compilerDiagnostics(built.raw).join(' ')}`);
		}
	}

	toolchain.dispose();
	assert.deepEqual(failures, [], 'headers the sysroot ships but cannot preprocess');
});

test('the POSIX headers compile together in one translation unit', async () => {
	// Individually is not enough: a language frontend emits one prelude that includes all of them at
	// once, which is the shape this arrived in (V's C preamble). Conflicts between them - redefinitions,
	// a struct declared twice - only show up here.
	const headers = [
		'arpa/inet.h',
		'dirent.h',
		'dlfcn.h',
		'fcntl.h',
		'inttypes.h',
		'netinet/in.h',
		'netinet/tcp.h',
		'pthread.h',
		'semaphore.h',
		'signal.h',
		'sys/ioctl.h',
		'sys/mman.h',
		'sys/resource.h',
		'sys/socket.h',
		'sys/stat.h',
		'sys/statvfs.h',
		'sys/time.h',
		'sys/types.h',
		'sys/utsname.h',
		'sys/un.h',
		'unistd.h',
		'utime.h'
	];

	const compiler = await createCompiler('c');
	const result = await compiler.run(
		headers.map((header) => `#include <${header}>`).join('\n') +
			'\nint main(void) { return 0; }\n',
		'',
		{ compileArgs: [...WASI_EMULATION] }
	);
	assert.deepEqual(result.errors, []);
	assert.equal(result.exitCode, 0);
});

test('the C header set is whole, not a sample of it', () => {
	// A number, so that a future prune shows up as a change rather than as a missing header somebody
	// notices later. The counts are the ones the sysroot was built with; see toolchain.lock.json.
	const entries = readTarGz(SYSROOT);
	const headers = publicCHeaders(entries);
	const bytes = headers.reduce((sum, header) => sum + entries.get(INCLUDE + header).length, 0);

	assert.ok(
		headers.length >= 110,
		`expected the full C header set, got ${headers.length} headers`
	);
	assert.ok(bytes > 300_000, `expected a full C header set, got ${bytes} bytes of headers`);
});

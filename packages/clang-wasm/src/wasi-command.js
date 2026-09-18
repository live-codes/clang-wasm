// Running a `wasi_snapshot_preview1` command module.
//
// This is the other half of what a language driver needs. The Clang runtime can compile C, but a
// language whose compiler is not written in C has to run that compiler first - Fortran goes through
// `f2c.wasm` before there is any C to compile - and the result of that run is usually a file rather
// than stdout.
//
// The host comes from `@wasm-idle/llvm-core`'s Clang entry, so a command sees the same preopened
// filesystem the compiler does.
import { WASI } from '@bjorn3/browser_wasi_shim';
import { createBrowserWasiHost } from '@wasm-idle/llvm-core/clang';

/**
 * Instantiate and run a WASI command module.
 *
 * @param {WebAssembly.Module} module - the compiled command.
 * @param {object} [options]
 * @param {string[]} [options.args] - argv, without the program name.
 * @param {Record<string, string>} [options.env] - environment for the command.
 * @param {Array<{path: string, contents: string|Uint8Array|ArrayBuffer}>} [options.files] - files to
 *   write into the command's filesystem before it starts.
 * @param {string} [options.programName] - argv[0], for a command that reports its own name.
 * @param {() => string|Uint8Array|ArrayBuffer|null} [options.stdin] - stdin, `null` for EOF.
 * @returns {Promise<{exitCode: number|null, stdout: string, stderr: string,
 *   readFile: (path: string) => Uint8Array|null}>}
 *   `readFile` is the command's filesystem after it ran, which is how a translator hands its output
 *   back. It returns null for a path that is not there, so a caller can try the name it expected and
 *   then decide what to do.
 */
export async function runWasiCommand(module, options = {}) {
	const stdout = [];
	const stderr = [];

	const host = createBrowserWasiHost({
		args: options.args ?? [],
		env: options.env ?? {},
		files: options.files ?? [],
		programName: options.programName,
		stdin: options.stdin,
		stdout: (chunk) => stdout.push(chunk),
		stderr: (chunk) => stderr.push(chunk)
	});

	const wasi = new WASI(host.args, host.envEntries, host.fds, { debug: false });
	// Compiling the module first is what makes `instantiate` hand back the instance itself rather
	// than a `{ module, instance }` pair.
	const instance = await WebAssembly.instantiate(module, {
		wasi_snapshot_preview1: wasi.wasiImport,
		wasi_unstable: wasi.wasiImport
	});
	const exitCode = wasi.start(instance);

	return {
		exitCode,
		stdout: stdout.join(''),
		stderr: stderr.join(''),
		readFile: (path) => readHostFile(host, path)
	};
}

// The host's preopened root, walked by name. Segments are filtered rather than trusted because a
// caller is free to pass a path it composed from user input.
function readHostFile(host, path) {
	const segments = String(path)
		.replaceAll('\\', '/')
		.split('/')
		.filter((segment) => segment && segment !== '.' && segment !== '..');

	let node = host.rootDirectory;
	for (const segment of segments) {
		node = node?.contents?.get(segment);
		if (!node) return null;
	}

	const data = node?.data;
	if (data instanceof Uint8Array) return new Uint8Array(data);
	if (data instanceof ArrayBuffer) return new Uint8Array(data);
	return null;
}

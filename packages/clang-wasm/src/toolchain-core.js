// The low-level entry: the Clang runtime itself, for a language that is not C, C++ or Objective-C.
//
// `createCompiler` covers the four languages this package runs. Anything else that compiles *through*
// Clang - a language whose frontend translates to C, or one that links its own runtime - needs the
// runtime rather than a compiler, and it needs the same one: a second `BrowserClangRuntime` costs
// another ~28 MB of assets and another ~84 MB resident.
//
// So `createToolchain()` acquires the runtime from the same pool `createCompiler` uses, keyed by the
// same asset source. A page that runs C/C++ through this package and Fortran through a toolchain gets
// one runtime and one asset load. It also shares that runtime's lock, so a Fortran run and a C run
// queue instead of writing over each other's files.
//
// What a driver gets is deliberately the plumbing and not a policy: compile a translation unit, link
// it with whatever objects and archives it supplies, run it, and run a WASI command before any of
// that. Assembling those into a language is the driver's job - see the Fortran driver in the
// browser-fortran repository for one that does.
import { executeBrowserClangArtifact } from '@wasm-idle/llvm-core/clang';
import { resolveAssetSource } from './assets.js';
import {
	acquireRuntime,
	addFileWithDirectories,
	captureCompilerOutput,
	releaseRuntime,
	withRuntimeLock
} from './runtime.js';
import { runWasiCommand } from './wasi-command.js';

export function createToolchainFactory({ packaged }) {
	/**
	 * Acquire the shared Clang runtime.
	 *
	 * @param {object} [options] - the same asset options `createCompiler` takes: `baseUrl`, optional
	 *   in Node; `maxAssetBytes`; `onProgress`.
	 */
	async function createToolchain(options = {}) {
		const source = resolveAssetSource(options, packaged);
		const record = await acquireRuntime(source, options);
		let disposed = false;

		return {
			/**
			 * The Clang runtime, as `@wasm-idle/llvm-core/clang` defines it: `compile`, `run`,
			 * `memfs`, `getModule`, `assetUrls`, `compilerConfig`. This is the escape hatch, and it
			 * is the one part of this API that follows someone else's shape.
			 */
			runtime: record.runtime,

			/** Where the assets came from, for an error message a user can act on. */
			assetSource: source.description,

			/** Write a file into the runtime's filesystem, creating any directories it needs. */
			addFile: (path, contents) => addFileWithDirectories(record.runtime, path, contents),

			/** Run `work` with exclusive use of the runtime, which owns one compiler process. */
			lock: (work) => withRuntimeLock(record, work),

			/**
			 * Run `work` with the compiler's output collected instead of logged.
			 *
			 * @returns {Promise<{result: any, raw: string, error: Error|null}>} `raw` is what clang
			 *   and wasm-ld said, ANSI colour included; `output.js`'s `compilerDiagnostics` turns it
			 *   into lines. Hold the lock while doing this.
			 */
			captureCompilerOutput: (work) => captureCompilerOutput(record, work),

			/** Instantiate and run a `wasi_snapshot_preview1` command module. */
			runCommand: (module, commandOptions) => runWasiCommand(module, commandOptions),

			/** Execute an artifact the runtime built. */
			execute: (artifact, executionOptions) => executeBrowserClangArtifact(artifact, executionOptions),

			/**
			 * Drop this toolchain's hold on the shared runtime. The runtime stays loaded for as
			 * long as anything else holds it - a compiler, or another toolchain - and is released
			 * when the last one goes. Calling this twice is a no-op.
			 */
			dispose() {
				if (disposed) return;
				disposed = true;
				releaseRuntime(record, options.onProgress);
			}
		};
	}

	return { createToolchain };
}

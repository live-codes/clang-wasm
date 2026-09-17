import { runClangFamily, runObjectiveC } from './compile.js';
import { LANGUAGE_IDS, resolveLanguage, resolveStd, standardsFor } from './languages.js';
import { acquireRuntime, releaseRuntime, withRuntimeLock } from './runtime.js';

export { LANGUAGE_IDS, standardsFor };

/**
 * Create a compiler for one language.
 *
 * The runtime is shared between every compiler created against the same `baseUrl`, so asking for
 * C, C++ and Objective-C costs one asset load rather than three.
 *
 * @param {'c'|'cpp'|'objc'|'objcpp'} language
 * @param {object} options
 * @param {string} options.baseUrl - where the runtime assets are served from. Required.
 * @param {string} [options.objectiveCBaseUrl] - where the Objective-C runtime is served from.
 *   Defaults to `objective-c/` under `baseUrl`.
 * @param {string|null} [options.std] - the standard to compile at, e.g. `gnu++20`. One of the
 *   language's own values - `standardsFor(language)` lists them - and `null` for no `-std=` at all.
 * @param {string[]} [options.compileArgs] - extra clang flags.
 * @param {string[]} [options.args] - default program argv.
 * @param {string} [options.fileName] - the name the source is compiled under.
 * @param {(value: number) => void} [options.onProgress] - asset download progress, 0 to 1.
 * @param {number} [options.maxAssetBytes] - ceiling for a decompressed asset.
 */
export async function createCompiler(language, options = {}) {
	const resolved = resolveLanguage(language);
	const std = resolveStd(
		resolved,
		'std' in options ? options.std : resolved.defaultStandard
	);
	const record = await acquireRuntime(options.baseUrl, options);

	const defaults = {
		compileArgs: options.compileArgs ?? [],
		args: options.args ?? [],
		fileName: options.fileName ?? resolved.fileName
	};

	let disposed = false;

	return {
		/** The resolved language id, e.g. `cpp`. */
		language: resolved.id,

		/** The standard this compiler compiles at, or null for the compiler's own default. */
		std,

		/** Every `std` value this language accepts, for building a picker. */
		standards: [...resolved.standards],

		/**
		 * Compile and run a program.
		 *
		 * @param {string} code - the program source.
		 * @param {string|Uint8Array} [input] - stdin, handed to the program once and then closed.
		 * @param {object} [runOptions] - per-run overrides: `std`, `args`, `compileArgs`, `fileName`.
		 * @returns {Promise<{stdout: string, stderr: string, output: string, errors: string[],
		 *   exitCode: number|null, compileMs: number, runMs: number|null}>}
		 *   `output` is stdout and stderr in the order the program wrote them. `errors` holds the
		 *   compiler's diagnostics and is empty when it compiled; `exitCode` is null when the program
		 *   never ran.
		 */
		async run(code, input, runOptions = {}) {
			if (disposed) throw new Error('This compiler has been disposed.');
			if (typeof code !== 'string') {
				throw new Error('run() needs the program source as its first argument.');
			}

			const runStd = resolveStd(resolved, 'std' in runOptions ? runOptions.std : std);
			const params = {
				code,
				input: input ?? '',
				language: resolved,
				fileName: runOptions.fileName ?? defaults.fileName,
				args: runOptions.args ?? defaults.args,
				std: runStd,
				compileArgs: [
					...(runStd ? [`-std=${runStd}`] : []),
					...defaults.compileArgs,
					...(runOptions.compileArgs ?? [])
				]
			};

			// The runtime holds one memfs and one compiler process, so two runs at once would write
			// over each other's files. Runs queue instead.
			return withRuntimeLock(record, () =>
				resolved.objectiveC ? runObjectiveC(record, params) : runClangFamily(record, params)
			);
		},

		/** Release this compiler's hold on the shared runtime. Further runs throw. */
		dispose() {
			if (disposed) return;
			disposed = true;
			releaseRuntime(record, options.onProgress);
		}
	};
}

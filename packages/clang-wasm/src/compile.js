// The three drivers. C and C++ reuse the runtime's own compile-and-link; Objective-C cannot,
// because a program links a runtime library that the runtime's link line does not know about.
import { executeBrowserClangArtifact } from '@wasm-idle/llvm-core/clang';
import {
	OBJECTIVE_C_RUNTIME_FLAGS,
	clangSystemIncludePaths
} from '@wasm-idle/llvm-core/core/clang-profile';
import { cleanProgramOutput, compilerDiagnostics, makeStdin } from './output.js';
import {
	addFileWithDirectories,
	captureCompilerOutput,
	ensureObjectiveCRuntime
} from './runtime.js';

// Called once per Objective-C translation unit that declares a class. GNUstep's libobjc2 exposes its
// load function as `.objcv2_load_function` and expects it to be called before any class is used;
// this constructor is that call, and the weak declaration keeps a program that does not need it
// linking anyway. The Clang runtime knows nothing about it - only the upstream package's own
// Objective-C worker did, and this is the same source it compiles.
const OBJECTIVE_C_CONSTRUCTOR_SOURCE = `extern void __wasm_idle_objc_load(void) __asm__(".objcv2_load_function") __attribute__((weak));

__attribute__((constructor))
static void __wasm_idle_objc_ctor(void)
{
    if (__wasm_idle_objc_load) __wasm_idle_objc_load();
}
`;

const DECLARES_OBJECTIVE_C_CLASS = /@\s*(?:interface|implementation|protocol)\b/;

export async function runClangFamily(record, params) {
	const { runtime } = record;
	const { code, fileName, compileArgs, args, input, language } = params;

	const compileStarted = performance.now();
	const compiled = await captureCompilerOutput(record, () =>
		runtime.compileArtifact(code, {
			language: language.compilerLanguage,
			fileName,
			compileArgs
		})
	);
	const compileMs = Math.round(performance.now() - compileStarted);

	if (compiled.error) {
		return failed(compiled.raw, compiled.error, compileMs);
	}

	const running = await execute(compiled.result, params);
	return {
		...running,
		errors: [],
		compileMs
	};
}

export async function runObjectiveC(record, params) {
	const { runtime } = record;
	const { code, fileName, compileArgs, std, language } = params;

	await ensureObjectiveCRuntime(record);

	// Every run gets its own directory: memfs asserts on a duplicate node, so the source cannot be
	// written twice under the same name, and the runtime's build cache only helps when the input is
	// byte-identical.
	const build = `objc_${++record.objectiveCRuntime.builds}`;
	const sourcePath = `${build}/${fileName}`;
	addFileWithDirectories(runtime, sourcePath, code);

	const objects = [];
	if (DECLARES_OBJECTIVE_C_CLASS.test(code)) {
		const constructorPath = `${build}/objc_ctor.c`;
		addFileWithDirectories(runtime, constructorPath, OBJECTIVE_C_CONSTRUCTOR_SOURCE);
		objects.push(`${build}/objc_ctor.o`);
	}

	const objectPath = `${build}/main.o`;
	const wasmPath = `${build}/main.wasm`;

	const compileStarted = performance.now();
	const built = await captureCompilerOutput(record, async () => {
		if (objects.length) {
			await compileObjectiveCTranslationUnit(runtime, {
				language: 'c',
				input: `${build}/objc_ctor.c`,
				objectPath: objects[0],
				std: null,
				compileArgs: []
			});
		}
		await compileObjectiveCTranslationUnit(runtime, {
			language: language.compilerLanguage,
			input: sourcePath,
			objectPath,
			std,
			compileArgs
		});
		await linkObjectiveC(runtime, { objects: [...objects, objectPath], wasmPath });
	});
	const compileMs = Math.round(performance.now() - compileStarted);

	if (built.error) {
		return failed(built.raw, built.error, compileMs);
	}

	const bytes = Uint8Array.from(runtime.memfs.getFileContents(wasmPath));
	const running = await execute(
		{ bytes, target: 'wasm32-wasi', format: 'wasi-core-wasm', fileName: wasmPath },
		params
	);
	return {
		...running,
		errors: [],
		compileMs
	};
}

// The runtime buffers the artifact it just built, so execution is a separate step for both drivers.
async function execute(artifact, { args, input }) {
	const order = [];
	const stdout = [];
	const stderr = [];

	const runStarted = performance.now();
	const result = await executeBrowserClangArtifact(artifact, {
		args,
		stdin: makeStdin(input),
		stdout: (chunk) => {
			order.push(chunk);
			stdout.push(chunk);
		},
		stderr: (chunk) => {
			order.push(chunk);
			stderr.push(chunk);
		}
	});
	const runMs = Math.round(performance.now() - runStarted);

	// `output` is the two streams in the order the program wrote them, which is what a terminal
	// would have shown.
	return {
		stdout: cleanProgramOutput(stdout.join('')),
		stderr: cleanProgramOutput(stderr.join('')),
		output: cleanProgramOutput(order.join('')),
		exitCode: result.exitCode,
		runMs
	};
}

function failed(raw, error, compileMs) {
	const errors = compilerDiagnostics(raw);
	// If the compiler said nothing, the failure is the runtime's own - a missing asset, a wasm
	// instantiation failure - and that message is the only thing worth returning.
	if (!errors.length) errors.push(String(error?.message ?? error));
	return { stdout: '', stderr: '', output: '', errors, exitCode: null, compileMs, runMs: null };
}

// Objective-C goes through clang's cc1 directly rather than through the runtime's compile() because
// that method only knows C, C++ and Objective-C - a `.mm` source would be compiled as C++ - and
// because the runtime's link line cannot carry libobjc.a. This mirrors what the upstream package's
// own Objective-C worker does, minus the Foundation path, which is not usable (see README).
async function compileObjectiveCTranslationUnit(runtime, { language, input, objectPath, std, compileArgs }) {
	const resourceDir = runtime.compilerConfig?.resourceDir || '/lib/clang/8.0.1';
	const includePaths = clangSystemIncludePaths(
		language === 'objective-c++' ? 'OBJCXX' : language === 'c' ? 'C' : 'OBJC',
		'',
		resourceDir
	);

	const clang = await runtime.getModule(runtime.assetUrls.clang);
	await runtime.run(
		clang,
		true,
		'clang',
		'-cc1',
		'-triple',
		'wasm32-wasi',
		'-emit-obj',
		'-disable-free',
		'-isysroot',
		'/',
		'-resource-dir',
		resourceDir,
		...includePaths.flatMap((path) => ['-internal-isystem', path]),
		// The Objective-C runtime headers are mounted at the memfs root.
		'-I.',
		'-ferror-limit',
		'20',
		'-O2',
		'-o',
		objectPath,
		...(std ? [`-std=${std}`] : []),
		'-x',
		language,
		...(language === 'c' ? [] : OBJECTIVE_C_RUNTIME_FLAGS),
		input,
		...compileArgs
	);
}

async function linkObjectiveC(runtime, { objects, wasmPath }) {
	const libdir = 'lib/wasm32-wasi';
	const compilerRuntimeLibDir =
		runtime.compilerConfig?.compilerRuntimeLibDir || 'lib/clang/8.0.1/lib/wasi';

	const lld = await runtime.getModule(runtime.assetUrls.lld);
	await runtime.run(
		lld,
		runtime.log,
		'wasm-ld',
		'--export-dynamic',
		'--gc-sections',
		'-z',
		'stack-size=1048576',
		`-L${libdir}/noeh`,
		`-L${libdir}`,
		`${libdir}/crt1.o`,
		...objects,
		'libobjc.a',
		'-lwasi-emulated-mman',
		'-lc',
		'-lc++',
		'-lc++abi',
		'-lm',
		`-L${compilerRuntimeLibDir}`,
		'-lclang_rt.builtins-wasm32',
		'-o',
		wasmPath
	);
}

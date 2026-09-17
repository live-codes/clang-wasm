// Compiler worker.
//
// Runs the whole Clang toolchain off the main thread, so the page stays responsive while a
// compile is in flight. This mirrors how LiveCodes runs its C/C++ compiler
// (`createWorkerFromContent` in lang-cpp-wasm-script.ts) - the runtime blocks whatever thread
// it lives on, and compilation takes seconds.
//
// C, C++ and Objective-C all go through here. C/C++ use the Clang runtime's compile-artifact path;
// Objective-C additionally needs a runtime library and its own link line, which the package ships
// as a worker installer - see the Objective-C section below.
//
// Protocol:
//   main -> worker   { type: 'run', id, moduleUrl, baseUrl, code, language, fileName,
//                      compileArgs, args, stdin }
//                    `language` is 'C' | 'CPP' | 'OBJC' | 'OBJCXX'; `moduleUrl` is the matching
//                    package entry point (/clang or /objective-c).
//   worker -> main   { type: 'status', text }        loading / compiling / running
//                    { type: 'progress', value }     0..1 during asset download
//                    { type: 'compiled', ok, compilerOutput, compileMs, error? }
//                    { type: 'stdout' | 'stderr', text }
//                    { type: 'done', exitCode, runMs, artifactBytes }
//                    `artifactBytes` is null for Objective-C, which does not report its artifact.
//                    { type: 'error', message }
//
// The runtime is built once and kept warm, so repeat compiles skip the ~29 MB asset load.

// core/memory.js does `buf instanceof SharedArrayBuffer`, which throws in a worker that is not
// cross-origin isolated. The non-debug path never allocates a real one.
globalThis.SharedArrayBuffer ??= class SharedArrayBuffer {};

let modulePromise = null;
let runtimePromise = null;
let compilerOutput = [];
let executeBrowserClangArtifact = null;
let baseUrl = '/clang/';

const post = (message) => self.postMessage(message);

const loadModule = (moduleUrl) => {
	if (!modulePromise) {
		modulePromise = import(moduleUrl).then((mod) => {
			executeBrowserClangArtifact = mod.executeBrowserClangArtifact;
			return mod;
		});
	}
	return modulePromise;
};

const getRuntime = async (moduleUrl, runtimeBaseUrl) => {
	baseUrl = runtimeBaseUrl;
	if (runtimePromise) return runtimePromise;

	runtimePromise = (async () => {
		post({ type: 'status', text: 'loading toolchain…' });
		const mod = await loadModule(moduleUrl);
		const manifest = await mod.loadRuntimeManifest(mod.resolveRuntimeManifestUrl(runtimeBaseUrl));
		const runtime = new mod.BrowserClangRuntime({
			runtimeBaseUrl,
			manifest,
			stdin: () => '',
			stdout: (chunk) => compilerOutput.push(chunk),
			progress: (value) => post({ type: 'progress', value }),
			// The linker's diagnostics are only forwarded when logging is on: link() passes
			// `this.log` as the output flag, so without this a link failure surfaces as a bare
			// "process exited with code 1" with no explanation. The main thread filters the
			// extra chatter back out.
			log: true
		});
		await runtime.ready;
		post({ type: 'status', text: 'ready' });
		return runtime;
	})().catch((error) => {
		runtimePromise = null;
		throw error;
	});

	return runtimePromise;
};

const drainCompilerOutput = () => {
	const text = compilerOutput.join('');
	compilerOutput = [];
	return text;
};

// stdin provider: hand the buffer over once, then signal EOF with null.
const makeStdin = (text) => {
	if (!text) return () => null;
	let sent = false;
	return () => {
		if (sent) return null;
		sent = true;
		return text;
	};
};

// ---------------------------------------------------------------------------
// Objective-C
//
// Objective-C is not a variation of the C compile path. A program links a runtime library, the
// runtime headers are mounted into memfs rather than the sysroot, and libobjc2 needs a constructor
// to call its load function - none of which the Clang runtime's own link line does. The package
// ships that whole pipeline as a worker installer, so it is reused here instead of reimplemented,
// with the four host services it expects supplied locally.
//
// It is driven through a detached scope: the installer owns `scope.onmessage` and reports through
// `scope.postMessage`, so handing it a plain object instead of `self` keeps this worker's protocol
// on the outside. Compile and run are separate requests (`prepare`, then a re-run that reuses the
// cached artifact), which is what lets the page time them separately.
//
// What this gives is libobjc2 - a runtime, not a class library. There is no Foundation: the
// installer links GNUstep Base and inlines its headers when the source imports Foundation, but
// that path does not survive that header set (thirteen headers import <GNUstepBase/GSBlocks.h>,
// which is never mounted, and headers first reached inside an #if branch are emitted there whether
// or not the branch is taken). It also does not implement the Object root class the libobjc2
// headers declare, so programs declare their own root class with objc_root_class. That is the
// shape @wasm-idle's own Objective-C example uses.
//
// Cost: libobjc.a + headers.json, 273 KB.
// ---------------------------------------------------------------------------
const OBJECTIVE_C_ASSETS = [
	'libobjc.a',
	'headers.json',
	'libgnustep-base.a',
	'libgnustep-base.o',
	'foundation-headers.json',
	'libffi.a'
];

// The receipts are not duplicated here - they are read from the same lock the build scripts verify
// against, so the bytes the browser checks and the bytes CI pins cannot drift apart.
let runtimeLockPromise = null;
const loadRuntimeLock = () => {
	if (!runtimeLockPromise) {
		runtimeLockPromise = (async () => {
			const url = new URL('toolchain.lock.json', self.location.href).href;
			const response = await fetch(url);
			if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
			return response.json();
		})().catch((error) => {
			runtimeLockPromise = null;
			throw error;
		});
	}
	return runtimeLockPromise;
};

const resolveObjectiveCAssets = async (runtimeBaseUrl) => {
	const lock = await loadRuntimeLock();
	const receipts = lock.objectiveC?.assets;
	if (!receipts) throw new Error('toolchain.lock.json has no objectiveC.assets section');

	const base = new URL('objective-c/', runtimeBaseUrl);
	const urls = {};
	const integrity = {};
	for (const name of OBJECTIVE_C_ASSETS) {
		const receipt = receipts[name];
		if (!receipt) throw new Error(`toolchain.lock.json has no receipt for the Objective-C asset ${name}`);
		urls[name] = new URL(name, base).href;
		integrity[name] = { bytes: receipt.bytes, sha256: receipt.sha256 };
	}

	return {
		baseUrl: base.href,
		libobjcUrl: urls['libobjc.a'],
		headersUrl: urls['headers.json'],
		libgnustepBaseUrl: urls['libgnustep-base.a'],
		libgnustepBaseObjectUrl: urls['libgnustep-base.o'],
		foundationHeadersUrl: urls['foundation-headers.json'],
		libffiUrl: urls['libffi.a'],
		integrity
	};
};

const toHex = (bytes) => [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('');

const verifyRuntimeAssetIntegrity = async (request) => {
	if (!globalThis.crypto?.subtle) {
		throw new Error('Objective-C runtime asset verification needs crypto.subtle, so a secure context');
	}
	const bytes = request.bytes;
	if (bytes.byteLength !== request.expected.bytes) {
		throw new Error(`Objective-C runtime asset ${request.asset} is ${bytes.byteLength} bytes, expected ${request.expected.bytes}`);
	}
	const digest = toHex(await crypto.subtle.digest('SHA-256', bytes));
	if (digest !== request.expected.sha256) {
		throw new Error(
			`Objective-C runtime asset ${request.asset} failed SHA-256 verification: expected ${request.expected.sha256}, got ${digest}`
		);
	}
};

let objectiveCModulePromise = null;
let objectiveCLoaded = false;
let objectiveCPending = null;
let objectiveCPhase = 'compile';
let objectiveCCompilerOutput = [];

const objectiveCScope = {
	document: { querySelectorAll: () => [] },
	onmessage: null,
	postMessage: (message) => {
		if (!message || typeof message !== 'object') return;

		// The installer merges the compiler's diagnostics and the program's output into one
		// `output` stream, so the phase that produced them is what tells them apart.
		if ('output' in message) {
			if (objectiveCPhase === 'run') post({ type: 'stdout', text: message.output });
			else objectiveCCompilerOutput.push(message.output);
			return;
		}
		if ('progress' in message) {
			const value = typeof message.progress === 'number' ? message.progress : (message.progress?.percent ?? 0) / 100;
			post({ type: 'progress', value });
			return;
		}
		if ('load' in message) return settleObjectiveC({});
		if ('error' in message) return settleObjectiveC({ error: message.error });
		if ('results' in message) return settleObjectiveC({});
		// `buffer` is the interactive-stdin handshake, which this worker does not use, and
		// `debugEvent` only arrives for debug runs.
	}
};

const settleObjectiveC = (result) => {
	const resolve = objectiveCPending;
	objectiveCPending = null;
	if (resolve) resolve(result);
};

// `handleObjectiveCWorkerMessage` is async and reports through the scope, so the promise it
// returns is deliberately dropped.
const askObjectiveC = (phase, message) =>
	new Promise((resolve) => {
		objectiveCPending = resolve;
		objectiveCPhase = phase;
		objectiveCScope.onmessage({ data: message });
	});

const loadObjectiveC = (moduleUrl) => {
	if (!objectiveCModulePromise) {
		objectiveCModulePromise = (async () => {
			const module = await import(moduleUrl);
			if (typeof module.installObjectiveCWorker !== 'function') {
				throw new Error(`${moduleUrl} does not export installObjectiveCWorker`);
			}
			module.installObjectiveCWorker(objectiveCScope, {
				// Assets are fetched straight from the runtime base URL here, so the worker-side
				// asset bridge the product uses to stream them from the main thread stays unused.
				configureRuntimeAssets: () => {},
				handleAssetMessage: () => false,
				// Only reached when stdin arrives through a shared buffer. This worker hands the
				// whole string over on the first read, so the installer never gets here.
				waitForStdin: () => null,
				verifyRuntimeAssetIntegrity
			});
			return module;
		})().catch((error) => {
			objectiveCModulePromise = null;
			throw error;
		});
	}
	return objectiveCModulePromise;
};

const drainObjectiveCCompilerOutput = () => {
	const text = objectiveCCompilerOutput.join('');
	objectiveCCompilerOutput = [];
	return text;
};

const runObjectiveC = async (request) => {
	await loadObjectiveC(request.moduleUrl);
	const clangAssets = { baseUrl: request.baseUrl, useAssetBridge: false };
	const objectivecAssets = await resolveObjectiveCAssets(request.baseUrl);

	if (!objectiveCLoaded) {
		post({ type: 'status', text: 'loading toolchain…' });
		const loaded = await askObjectiveC('load', { load: true, log: true, clangAssets, objectivecAssets });
		if (loaded.error) throw new Error(loaded.error);
		objectiveCLoaded = true;
		objectiveCCompilerOutput = [];
		post({ type: 'status', text: 'ready' });
	}

	// `activePath` is what selects the language: .m is Objective-C, .mm is Objective-C++.
	const build = {
		code: request.code,
		activePath: request.fileName,
		workspaceFiles: [],
		compileArgs: request.compileArgs ?? [],
		debug: false,
		log: true,
		clangAssets,
		objectivecAssets
	};

	post({ type: 'status', text: 'compiling…' });
	const compileStart = performance.now();
	const compiled = await askObjectiveC('compile', { ...build, prepare: true, programArgs: [], stdin: '' });
	const compileMs = Math.round(performance.now() - compileStart);
	const compilerOutput = drainObjectiveCCompilerOutput();
	if (compiled.error) {
		post({ type: 'compiled', ok: false, compilerOutput, error: compiled.error });
		return;
	}
	post({ type: 'compiled', ok: true, compilerOutput, compileMs });

	post({ type: 'status', text: 'running…' });
	const runStart = performance.now();
	const ran = await askObjectiveC('run', {
		...build,
		prepare: false,
		programArgs: request.args ?? [],
		stdin: request.stdin ?? ''
	});
	const runMs = Math.round(performance.now() - runStart);

	if (ran.error) {
		// The installer reports a non-zero exit as an error rather than carrying the code, so the
		// code is recovered from its message when this is that error and not a real failure.
		const exit = /exited with (\d+)/.exec(ran.error);
		if (!exit) {
			post({ type: 'error', message: ran.error });
			return;
		}
		post({ type: 'done', exitCode: Number(exit[1]), runMs, artifactBytes: null });
		return;
	}
	post({ type: 'done', exitCode: 0, runMs, artifactBytes: null });
};

self.onmessage = async (event) => {
	const request = event.data;
	if (!request || request.type !== 'run') return;

	try {
		if (request.language === 'OBJC' || request.language === 'OBJCXX') {
			await runObjectiveC(request);
			return;
		}

		const runtime = await getRuntime(request.moduleUrl, request.baseUrl);

		post({ type: 'status', text: 'compiling…' });
		const compileStart = performance.now();
		let artifact;
		try {
			artifact = await runtime.compileArtifact(request.code, {
				language: request.language,
				fileName: request.fileName,
				compileArgs: request.compileArgs || []
			});
		} catch (error) {
			post({
				type: 'compiled',
				ok: false,
				compilerOutput: drainCompilerOutput(),
				error: String(error?.message ?? error)
			});
			return;
		}

		post({
			type: 'compiled',
			ok: true,
			compilerOutput: drainCompilerOutput(),
			compileMs: Math.round(performance.now() - compileStart)
		});

		post({ type: 'status', text: 'running…' });
		const runStart = performance.now();
		const result = await executeBrowserClangArtifact(artifact, {
			args: request.args || [],
			stdin: makeStdin(request.stdin),
			stdout: (chunk) => post({ type: 'stdout', text: chunk }),
			stderr: (chunk) => post({ type: 'stderr', text: chunk })
		});

		post({
			type: 'done',
			exitCode: result.exitCode,
			runMs: Math.round(performance.now() - runStart),
			artifactBytes: artifact.bytes.byteLength
		});
	} catch (error) {
		post({ type: 'error', message: String(error?.message ?? error) });
	}
};

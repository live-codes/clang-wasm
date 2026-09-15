// Compiler worker.
//
// Runs the whole Clang toolchain off the main thread, so the page stays responsive while a
// compile is in flight. This mirrors how LiveCodes runs its C/C++ compiler
// (`createWorkerFromContent` in lang-cpp-wasm-script.ts) - the runtime blocks whatever thread
// it lives on, and compilation takes seconds.
//
// Protocol:
//   main -> worker   { type: 'run', id, moduleUrl, baseUrl, code, language, fileName,
//                      compileArgs, args, stdin }
//   worker -> main   { type: 'status', text }        loading / compiling / running
//                    { type: 'progress', value }     0..1 during asset download
//                    { type: 'compiled', ok, compilerOutput, compileMs, error? }
//                    { type: 'stdout' | 'stderr', text }
//                    { type: 'done', exitCode, runMs, artifactBytes }
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

self.onmessage = async (event) => {
	const request = event.data;
	if (!request || request.type !== 'run') return;

	try {
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

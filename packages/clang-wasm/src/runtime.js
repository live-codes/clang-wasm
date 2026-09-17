// One Clang runtime per asset source, shared by every compiler created against it.
//
// The runtime costs ~29 MB of assets and ~84 MB unpacked, and C, C++ and Objective-C all compile
// with the same clang/lld/memfs/sysroot set, so creating one per language would be wasteful - the
// common case of a page offering all three would otherwise pay for it three times. Compilers hold a
// reference; `dispose()` drops it when the last one goes.
import { BrowserClangRuntime } from '@wasm-idle/llvm-core/clang';

// The runtime decompresses clang.wasm and the sysroot through this, so it has to clear the largest
// asset, not the largest download.
const DEFAULT_MAX_ASSET_BYTES = 128 * 1024 * 1024;

const runtimes = new Map();

export async function acquireRuntime(source, options = {}) {
	let pending = runtimes.get(source.key);
	if (!pending) {
		pending = createRecord(source, options).catch((error) => {
			// A failed load must not poison the cache - the next caller should be able to retry.
			runtimes.delete(source.key);
			throw error;
		});
		runtimes.set(source.key, pending);
	}

	const record = await pending;
	record.references += 1;
	if (options.onProgress) record.progressSinks.add(options.onProgress);
	return record;
}

export function releaseRuntime(record, progressSink) {
	if (progressSink) record.progressSinks.delete(progressSink);
	record.references -= 1;
	if (record.references <= 0) runtimes.delete(record.key);
}

// The runtime keeps one memfs and one compiler process, so two runs at once would write over each
// other's files and redirect each other's output. Runs queue on the record instead.
export async function withRuntimeLock(record, work) {
	const previous = record.queue;
	let release;
	record.queue = new Promise((resolve) => {
		release = resolve;
	});
	await previous;
	try {
		return await work();
	} finally {
		release();
	}
}

// The runtime's memory wrapper does `buf instanceof SharedArrayBuffer` unconditionally, which throws
// "SharedArrayBuffer is not defined" on a page that is not cross-origin isolated. Nothing on this
// path allocates a real one - only the package's LLDB debug runtime would, and this package does not
// use it - so a stub is enough to keep that branch from throwing and let a plain origin work.
// On an isolated origin, or in Node, the real constructor is already there and this does nothing.
function ensureSharedArrayBufferStub() {
	if (typeof globalThis.SharedArrayBuffer === 'undefined') {
		globalThis.SharedArrayBuffer = class SharedArrayBuffer {};
	}
}

async function createRecord(source, options) {
	ensureSharedArrayBufferStub();

	const record = {
		key: source.key,
		source,
		references: 0,
		queue: Promise.resolve(),
		progressSinks: new Set(),
		runtime: null,
		objectiveCRuntime: { pending: null, builds: 0 },
		// Where the compiler's diagnostics go. The runtime is built with a stable callback that reads
		// this field, rather than one bound to a per-run collector, because the memfs keeps the
		// function it was constructed with - reassigning `runtime.stdout` later never reaches it.
		compilerOutput: () => {}
	};

	let manifest;
	try {
		manifest = await source.loadManifest();
	} catch (error) {
		throw new Error(`Failed to load the runtime manifest from ${source.description}: ${error.message}`, {
			cause: error
		});
	}

	// Must happen before the runtime exists: it fetches clang, lld, memfs and the sysroot itself.
	source.installFetch();

	const runtime = new BrowserClangRuntime({
		runtimeBaseUrl: source.baseUrl,
		manifest,
		// The compiler's own stdin is never read; the program gets its input at execution time.
		stdin: () => '',
		stdout: (chunk) => record.compilerOutput(chunk),
		progress: (value) => {
			for (const sink of record.progressSinks) sink(value);
		},
		maxAssetBytes: options.maxAssetBytes ?? DEFAULT_MAX_ASSET_BYTES
	});
	await runtime.ready;
	record.runtime = runtime;
	return record;
}

// Mounts the Objective-C runtime into the shared memfs: the libobjc2 headers and the archive. It is
// idempotent because the files must not be added twice - memfs asserts on a duplicate node.
export async function ensureObjectiveCRuntime(record) {
	if (!record.objectiveCRuntime.pending) {
		record.objectiveCRuntime.pending = installObjectiveCRuntime(record).catch((error) => {
			record.objectiveCRuntime.pending = null;
			throw error;
		});
	}
	return record.objectiveCRuntime.pending;
}

async function installObjectiveCRuntime(record) {
	const [archive, headersBytes] = await Promise.all([
		record.source.readAsset('objective-c/libobjc.a'),
		record.source.readAsset('objective-c/headers.json')
	]);

	for (const [path, contents] of parseHeaders(headersBytes)) {
		addFileWithDirectories(record.runtime, path, contents);
	}
	record.runtime.memfs.addFile('libobjc.a', archive);
}

// The headers arrive as a JSON map of path to source. The bytes are already checked against a pinned
// digest, but the paths become filesystem paths, so they are still constrained to something that
// cannot escape the memfs root.
function parseHeaders(bytes) {
	let parsed;
	try {
		parsed = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
	} catch (error) {
		throw new Error('The Objective-C headers asset is not valid UTF-8 JSON', { cause: error });
	}
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		throw new Error('The Objective-C headers asset is not an object');
	}

	const entries = [];
	for (const [path, contents] of Object.entries(parsed)) {
		if (typeof contents !== 'string') {
			throw new Error(`The Objective-C headers asset has a non-string source for ${path}`);
		}
		if (!isSafeHeaderPath(path)) {
			throw new Error(`The Objective-C headers asset has an unsafe path: ${path}`);
		}
		entries.push([path, contents]);
	}
	return entries;
}

const isSafeHeaderPath = (path) =>
	path.length > 0 &&
	!path.startsWith('/') &&
	!path.includes('\\') &&
	!/^[A-Za-z]:/.test(path) &&
	path.split('/').every((part) => part && part !== '.' && part !== '..');

export const addFileWithDirectories = (runtime, path, contents) => {
	const parts = path.split('/').slice(0, -1);
	let directory = '';
	for (const part of parts) {
		directory = directory ? `${directory}/${part}` : part;
		try {
			runtime.memfs.addDirectory(directory);
		} catch {
			// Already there from an earlier file or run; memfs.addDirectory is a no-op for those,
			// but it is still worth not letting one failure abort the whole install.
		}
	}
	runtime.memfs.addFile(path, contents);
};

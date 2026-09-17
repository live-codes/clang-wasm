// One Clang runtime per asset base URL, shared by every compiler created against it.
//
// The runtime costs ~29 MB of assets and ~84 MB unpacked, and C, C++ and Objective-C all compile
// with the same clang/lld/memfs/sysroot set, so creating one per language would be wasteful - the
// common case of a page offering all three would otherwise pay for it three times. Compilers hold a
// reference; `dispose()` drops it when the last one goes.
import {
	BrowserClangRuntime,
	loadRuntimeManifest,
	resolveRuntimeBaseUrl,
	resolveRuntimeManifestUrl
} from '@wasm-idle/llvm-core/clang';
import { OBJECTIVE_C_ASSET_RECEIPTS } from './objective-c-assets.js';

// The runtime decompresses clang.wasm and the sysroot through this, so it has to clear the largest
// asset, not the largest download.
const DEFAULT_MAX_ASSET_BYTES = 128 * 1024 * 1024;

const runtimes = new Map();

export async function acquireRuntime(baseUrl, options = {}) {
	if (baseUrl == null || baseUrl === '') {
		throw new Error('baseUrl is required: point it at the directory that hosts the runtime assets.');
	}

	let resolvedBaseUrl;
	try {
		resolvedBaseUrl = resolveRuntimeBaseUrl(baseUrl);
	} catch (error) {
		throw new Error(
			`baseUrl must be an absolute http(s) URL (a browser may give it relative to the page): ` +
				`${error.message}`
		);
	}

	const objectiveCBaseUrl = options.objectiveCBaseUrl
		? resolveRuntimeBaseUrl(options.objectiveCBaseUrl)
		: new URL('objective-c/', resolvedBaseUrl).href;
	const key = `${resolvedBaseUrl}\u0000${objectiveCBaseUrl}\u0000${options.maxAssetBytes ?? ''}`;

	let pending = runtimes.get(key);
	if (!pending) {
		pending = createRecord({ key, baseUrl: resolvedBaseUrl, objectiveCBaseUrl, options }).catch(
			(error) => {
				// A failed load must not poison the cache - the next caller should be able to retry.
				runtimes.delete(key);
				throw error;
			}
		);
		runtimes.set(key, pending);
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
// other's files and swap each other's output stream. Runs queue on the record instead.
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

async function createRecord({ key, baseUrl, objectiveCBaseUrl, options }) {
	ensureSharedArrayBufferStub();

	const record = {
		key,
		baseUrl,
		objectiveCBaseUrl,
		references: 0,
		queue: Promise.resolve(),
		progressSinks: new Set(),
		runtime: null,
		objectiveCRuntime: { pending: null, builds: 0 },
		// Where the compiler's diagnostics go. The runtime is built with a stable callback that
		// reads this field, rather than one bound to a per-run collector, because the memfs keeps
		// the function it was constructed with - reassigning `runtime.stdout` later never reaches it.
		compilerOutput: () => {}
	};

	const manifestUrl = resolveRuntimeManifestUrl(baseUrl);
	let manifest;
	try {
		manifest = await loadRuntimeManifest(manifestUrl);
	} catch (error) {
		throw new Error(`Failed to load the runtime manifest from ${manifestUrl}: ${error.message}`, {
			cause: error
		});
	}

	const runtime = new BrowserClangRuntime({
		runtimeBaseUrl: baseUrl,
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
	const base = record.objectiveCBaseUrl;
	const [archive, headersBytes] = await Promise.all([
		readVerifiedAsset(`${base}libobjc.a`, 'libobjc.a'),
		readVerifiedAsset(`${base}headers.json`, 'headers.json')
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

async function readVerifiedAsset(url, name) {
	const receipt = OBJECTIVE_C_ASSET_RECEIPTS[name];
	if (!receipt) throw new Error(`No pinned receipt for the Objective-C runtime asset ${name}`);

	const bytes = await readAssetBytes(url, name);
	if (bytes.byteLength !== receipt.bytes) {
		throw new Error(
			`The Objective-C runtime asset ${name} is ${bytes.byteLength} bytes, expected ${receipt.bytes}`
		);
	}
	const digest = await sha256Hex(bytes);
	if (digest !== receipt.sha256) {
		throw new Error(
			`The Objective-C runtime asset ${name} failed SHA-256 verification: ` +
				`expected ${receipt.sha256}, got ${digest}`
		);
	}
	return bytes;
}

async function readAssetBytes(url, name) {
	let response = await fetch(url);
	if (!response.ok) {
		// Three of the six assets are published only gzipped, at <name>.gz.
		const gzipped = await fetch(`${url}.gz`);
		if (!gzipped.ok) {
			throw new Error(`Failed to load the Objective-C runtime asset ${name} from ${url}: ${response.status}`);
		}
		response = gzipped;
	}
	const bytes = new Uint8Array(await response.arrayBuffer());
	return isGzip(bytes) ? await inflateGzip(bytes, name) : bytes;
}

const isGzip = (bytes) => bytes.byteLength > 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;

async function inflateGzip(bytes, name) {
	if (typeof DecompressionStream !== 'function') {
		throw new Error(`Inflating the Objective-C runtime asset ${name} needs DecompressionStream`);
	}
	const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
	return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function sha256Hex(bytes) {
	const subtle = globalThis.crypto?.subtle;
	if (!subtle) {
		throw new Error(
			'Verifying the Objective-C runtime assets needs crypto.subtle: a secure context in the ' +
				'browser, or Node 20 and later.'
		);
	}
	const digest = await subtle.digest('SHA-256', bytes);
	return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

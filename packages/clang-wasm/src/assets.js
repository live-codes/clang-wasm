// Where the runtime's assets come from, and how they are read.
//
// Two sources behind one shape, because everything downstream only needs "give me this asset" and
// "what base URL should the runtime use":
//
//   hosted   - a base URL, as before. The runtime fetches it, and this package fetches the two
//              Objective-C assets itself.
//   packaged - the assets that ship inside this package, on disk. The runtime only accepts http(s),
//              so a fetch interceptor maps a reserved origin onto those files. This is why that
//              origin is under .invalid: if the interceptor is ever missing, the request fails
//              loudly rather than silently reaching a real host.
import {
	loadRuntimeManifest,
	parseRuntimeManifest,
	resolveRuntimeBaseUrl,
	resolveRuntimeManifestUrl
} from '@wasm-idle/llvm-core/clang';
import { ASSET_RECEIPTS } from './asset-receipts.js';

// Reserved by RFC 2606 and guaranteed not to resolve.
const PACKAGED_ORIGIN = 'https://clang-wasm-assets.invalid/';

export function resolveAssetSource(options, packaged) {
	if (options.baseUrl != null && options.baseUrl !== '') {
		return createHostedSource(options);
	}
	if (!packaged) {
		throw new Error(
			'baseUrl is required here. The assets that ship in this package can only be read where ' +
				'there is a filesystem, and a browser cannot reach a file inside an npm package - copy ' +
				'them somewhere your page can fetch with `npx --package @live-codes/clang-wasm ' +
				'clang-wasm-copy-assets <dir>` and pass that directory as baseUrl.'
		);
	}
	return createPackagedSource(packaged);
}

function createHostedSource(options) {
	let baseUrl;
	try {
		baseUrl = resolveRuntimeBaseUrl(options.baseUrl);
	} catch (error) {
		throw new Error(
			`baseUrl must be an absolute http(s) URL, or relative to the page in a browser: ${error.message}`,
			{ cause: error }
		);
	}
	const objectiveCBaseUrl = options.objectiveCBaseUrl
		? resolveRuntimeBaseUrl(options.objectiveCBaseUrl)
		: new URL('objective-c/', baseUrl).href;

	return {
		kind: 'hosted',
		key: `${baseUrl}\u0000${objectiveCBaseUrl}`,
		baseUrl,
		objectiveCBaseUrl,
		description: baseUrl,
		async loadManifest() {
			return loadRuntimeManifest(resolveRuntimeManifestUrl(baseUrl));
		},
		readAsset: (relativePath) => readHostedAsset(new URL(relativePath, baseUrl), relativePath),
		// The runtime fetches its own assets, so there is nothing to intercept.
		installFetch() {}
	};
}

function createPackagedSource(packaged) {
	const source = {
		kind: 'packaged',
		key: `packaged\u0000${packaged.root.href}`,
		baseUrl: PACKAGED_ORIGIN,
		objectiveCBaseUrl: new URL('objective-c/', PACKAGED_ORIGIN).href,
		description: `the assets packaged with this library (${packaged.root.href})`,
		readAsset: (relativePath) => readPackagedAsset(packaged, relativePath),
		async loadManifest() {
			const bytes = await source.readAsset('runtime-manifest.v1.json');
			return parseRuntimeManifest(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)));
		},
		installFetch: () => installPackagedFetch(source)
	};
	return source;
}

let fetchingSource = null;

function installPackagedFetch(source) {
	if (fetchingSource === source) return;
	const original = globalThis.fetch;
	globalThis.fetch = (input, init) => {
		const url =
			typeof input === 'string' ? input : input instanceof URL ? input.href : (input?.url ?? '');
		if (url.startsWith(PACKAGED_ORIGIN)) {
			return source
				.readAsset(url.slice(PACKAGED_ORIGIN.length))
				.then((bytes) => new Response(bytes));
		}
		return original.call(globalThis, input, init);
	};
	fetchingSource = source;
}

// Three of the Objective-C assets are published only gzipped, at <name>.gz, so a host that mirrors
// the producer verbatim is usable as-is.
async function readHostedAsset(url, name) {
	let response = await fetch(url);
	if (!response.ok) {
		const gzipped = await fetch(`${url}.gz`);
		if (!gzipped.ok) {
			throw new Error(`Failed to load the runtime asset ${url}: ${response.status}`);
		}
		response = gzipped;
	}
	const bytes = new Uint8Array(await response.arrayBuffer());
	return verifyReceipt(name, isGzip(bytes) ? await inflateGzip(bytes, name) : bytes);
}

async function readPackagedAsset(packaged, relativePath) {
	let bytes;
	try {
		bytes = await packaged.readFile(relativePath);
	} catch (error) {
		throw new Error(
			`Failed to read the packaged asset ${relativePath} from ${packaged.root.href}: ${error.message}`,
			{ cause: error }
		);
	}
	return verifyReceipt(relativePath, bytes);
}

async function verifyReceipt(name, bytes) {
	const receipt = ASSET_RECEIPTS[name];
	if (!receipt) throw new Error(`No pinned receipt for the runtime asset ${name}`);
	if (bytes.byteLength !== receipt.bytes) {
		throw new Error(`The runtime asset ${name} is ${bytes.byteLength} bytes, expected ${receipt.bytes}`);
	}
	const digest = await sha256Hex(bytes);
	if (digest !== receipt.sha256) {
		throw new Error(
			`The runtime asset ${name} failed SHA-256 verification: expected ${receipt.sha256}, got ${digest}`
		);
	}
	return bytes;
}

const isGzip = (bytes) => bytes.byteLength > 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;

async function inflateGzip(bytes, label) {
	if (typeof DecompressionStream !== 'function') {
		throw new Error(`Inflating the runtime asset ${label} needs DecompressionStream`);
	}
	const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
	return new Uint8Array(await new Response(stream).arrayBuffer());
}

export async function sha256Hex(bytes) {
	const subtle = globalThis.crypto?.subtle;
	if (!subtle) {
		throw new Error(
			'Verifying the runtime assets needs crypto.subtle: a secure context in the browser, or ' +
				'Node 20 and later.'
		);
	}
	const digest = await subtle.digest('SHA-256', bytes);
	return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

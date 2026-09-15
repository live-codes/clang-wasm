// Minimal self-hosted mirror of the Clang toolchain assets.
//
//   node mirror.mjs          # http://localhost:4174/clang/
//
// Then point the demo at it:  http://localhost:4173/?baseUrl=http://localhost:4174/clang/
//
// In production, replace this with the same five files copied into your own static
// host / CDN, and verify their SHA-256 against the receipts pinned in
// src/lib/playground/clangAssetIntegrity.ts.

import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { createHash } from 'node:crypto';

const UPSTREAM = 'https://seorii.page/wasm-idle/clang/';
const PORT = Number(process.env.MIRROR_PORT || 4174);
const cacheDir = resolve(import.meta.dirname, '.mirror-cache');

const ALLOWED = new Set([
	'runtime-manifest.v1.json',
	'bin/memfs.wasm.gz',
	'bin/clang.wasm.gz',
	'bin/lld.wasm.gz',
	'bin/sysroot.tar.gz'
]);

createServer(async (req, res) => {
	const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/clang\//, '');

	const headers = {
		// The demo page is cross-origin isolated (COEP: require-corp), so these
		// CORS headers are what let the fetch succeed.
		'access-control-allow-origin': '*',
		'cache-control': 'public, max-age=3600'
	};

	if (!ALLOWED.has(path)) {
		res.writeHead(404, { ...headers, 'content-type': 'text/plain' });
		res.end(`not mirrored: ${path}`);
		return;
	}

	const cached = join(cacheDir, path);
	try {
		const body = await readFile(cached);
		res.writeHead(200, {
			...headers,
			'content-type': path.endsWith('.json') ? 'application/json' : 'application/octet-stream'
		});
		res.end(body);
		return;
	} catch {
		// fall through to upstream
	}

	try {
		const upstream = await fetch(UPSTREAM + path);
		if (!upstream.ok) throw new Error(`upstream ${upstream.status}`);
		const body = Buffer.from(await upstream.arrayBuffer());
		await mkdir(dirname(cached), { recursive: true });
		await writeFile(cached, body);
		console.log(
			`fetched ${path} (${body.length} bytes, sha256 ${createHash('sha256').update(body).digest('hex').slice(0, 12)}…)`
		);
		res.writeHead(200, {
			...headers,
			'content-type': path.endsWith('.json') ? 'application/json' : 'application/octet-stream'
		});
		res.end(body);
	} catch (error) {
		res.writeHead(502, { ...headers, 'content-type': 'text/plain' });
		res.end(String(error));
	}
}).listen(PORT, () => {
	console.log(`Clang asset mirror on http://localhost:${PORT}/clang/`);
});

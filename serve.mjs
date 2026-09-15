import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname);
const port = Number(process.env.PORT || 4173);

const MIME = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.mjs': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.wasm': 'application/wasm',
	'.css': 'text/css; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.gz': 'application/gzip'
};

// Cross-origin isolation is NOT required for normal compile+run. The library's
// core/memory.js does `buf instanceof SharedArrayBuffer` unconditionally, which throws
// on a non-isolated page; index.html installs a stub so the ordinary path is fine.
// Real shared memory — and therefore these headers — is only needed for the LLDB
// debug runtime. Set ISOLATE=1 to enable them when experimenting with that.
const ISOLATION_HEADERS = process.env.ISOLATE
	? {
			'cross-origin-opener-policy': 'same-origin',
			'cross-origin-embedder-policy': 'require-corp'
		}
	: {};

const send = (res, status, contentType, body) => {
	res.writeHead(status, {
		'content-type': contentType,
		'cache-control': 'no-cache',
		...ISOLATION_HEADERS
	});
	res.end(body);
};

createServer(async (req, res) => {
	const url = new URL(req.url, 'http://localhost');
	const requested = decodeURIComponent(url.pathname);
	const target = resolve(join(root, normalize(requested === '/' ? '/index.html' : requested)));

	if (target !== root && !target.startsWith(root + sep)) {
		send(res, 403, 'text/plain; charset=utf-8', 'Forbidden');
		return;
	}

	try {
		const info = await stat(target);
		if (info.isDirectory()) {
			send(res, 404, 'text/plain; charset=utf-8', 'Not found');
			return;
		}
		const body = await readFile(target);
		send(res, 200, MIME[extname(target).toLowerCase()] || 'application/octet-stream', body);
	} catch {
		send(res, 404, 'text/plain; charset=utf-8', 'Not found');
	}
}).listen(port, () => {
	console.log(`Clang/WASM demo running at http://localhost:${port}/`);
});

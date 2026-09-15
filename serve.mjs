// Static server for the demo, and the toolchain asset host.
//
//   node serve.mjs          # http://localhost:4173
//
// Serves two things from one origin:
//   /            the demo page
//   /clang/*     the Clang toolchain assets the page fetches
//
// The rebuilt assets come from dist/ and are required - the upstream pruned memfs/sysroot are
// deliberately NOT served, because that toolchain cannot compile most of C++20/23 and serving it
// would be a silent downgrade. clang, lld and the manifest are not rebuilt, so they are proxied
// from upstream once and cached.
//
// To deploy, put all five files on a static host / CDN, verify them against toolchain.lock.json,
// and point the page at it with ?baseUrl=https://your-cdn/clang/.

import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname);
const port = Number(process.env.PORT || 4173);

// ---------------------------------------------------------------- toolchain

const UPSTREAM = 'https://seorii.page/wasm-idle/clang/';
const cacheDir = resolve(root, '.asset-cache');

// Rebuilt locally by build-memfs.mjs / build-sysroot.mjs.
const REBUILT = {
	'bin/memfs.wasm.gz': 'dist/memfs.wasm.gz',
	'bin/sysroot.tar.gz': 'dist/sysroot.tar.gz'
};

// Not rebuilt - proxied from upstream and cached.
const PROXIED = ['runtime-manifest.v1.json', 'bin/clang.wasm.gz', 'bin/lld.wasm.gz'];

const missingRebuilt = Object.values(REBUILT).filter((file) => !existsSync(join(root, file)));

// ------------------------------------------------------------------- static

const MIME = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.mjs': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.wasm': 'application/wasm',
	'.css': 'text/css; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.gz': 'application/gzip',
	'.png': 'image/png'
};

// Cross-origin isolation is NOT required for normal compile+run. The library's core/memory.js
// does `buf instanceof SharedArrayBuffer` unconditionally, which throws on a non-isolated page;
// index.html installs a stub so the ordinary path is fine. Real shared memory - and therefore
// these headers - is only needed for the LLDB debug runtime. Set ISOLATE=1 to enable them.
const ISOLATION_HEADERS = process.env.ISOLATE
	? {
			'cross-origin-opener-policy': 'same-origin',
			'cross-origin-embedder-policy': 'require-corp'
		}
	: {};

const send = (res, status, contentType, body, extra = {}) => {
	res.writeHead(status, {
		'content-type': contentType,
		'cache-control': 'no-cache',
		...ISOLATION_HEADERS,
		...extra
	});
	res.end(body);
};

const sendToolchainAsset = async (res, path) => {
	const rebuilt = REBUILT[path];
	if (rebuilt) {
		const file = join(root, rebuilt);
		if (!existsSync(file)) {
			send(
				res,
				500,
				'text/plain; charset=utf-8',
				`${rebuilt} is missing.\n\n` +
					'The rebuilt toolchain has to be built before the demo can run:\n' +
					'  npm run build:memfs\n  npm run build:sysroot\n\n' +
					'See README.md. The upstream pruned toolchain is not served instead.'
			);
			return;
		}
		send(res, 200, 'application/gzip', await readFile(file), {
			'cache-control': 'public, max-age=3600'
		});
		return;
	}

	if (!PROXIED.includes(path)) {
		send(res, 404, 'text/plain; charset=utf-8', `not a toolchain asset: ${path}`);
		return;
	}

	const cached = join(cacheDir, path);
	if (existsSync(cached)) {
		send(res, 200, MIME[extname(path)] || 'application/octet-stream', await readFile(cached), {
			'cache-control': 'public, max-age=3600'
		});
		return;
	}

	try {
		const upstream = await fetch(UPSTREAM + path);
		if (!upstream.ok) throw new Error(`upstream responded ${upstream.status}`);
		const body = Buffer.from(await upstream.arrayBuffer());
		await mkdir(dirname(cached), { recursive: true });
		await writeFile(cached, body);
		console.log(`  cached ${path} (${body.length} bytes)`);
		send(res, 200, MIME[extname(path)] || 'application/octet-stream', body, {
			'cache-control': 'public, max-age=3600'
		});
	} catch (error) {
		send(res, 502, 'text/plain; charset=utf-8', `could not fetch ${path} from upstream: ${error}`);
	}
};

// ------------------------------------------------------------------- server

createServer(async (req, res) => {
	const requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);

	// Toolchain assets, from the same origin as the page.
	if (requested.startsWith('/clang/')) {
		await sendToolchainAsset(res, requested.slice('/clang/'.length));
		return;
	}

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
		send(res, 200, MIME[extname(target).toLowerCase()] || 'application/octet-stream', await readFile(target));
	} catch {
		send(res, 404, 'text/plain; charset=utf-8', 'Not found');
	}
}).listen(port, () => {
	console.log(`Demo + toolchain on http://localhost:${port}/`);
	console.log(`  toolchain assets: http://localhost:${port}/clang/`);
	if (missingRebuilt.length) {
		console.log('\n  WARNING: the rebuilt toolchain is not built, so the demo will fail to load:');
		for (const file of missingRebuilt) console.log(`    missing ${file}`);
		console.log('  Run:  npm run build:memfs && npm run build:sysroot');
		console.log('  (npm run mirror is not needed - this server hosts the assets itself)');
	} else {
		for (const [path, file] of Object.entries(REBUILT)) console.log(`  ${path}  <- ${file}`);
	}
});

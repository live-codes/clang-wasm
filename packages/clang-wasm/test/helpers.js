// The package fetches its assets over HTTP, so the tests need a server. The repository's `serve.mjs`
// already hosts the whole runtime - including the Objective-C mirror - so the tests start it on a
// free port rather than keeping a second copy of that logic.
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';

const SERVE_SCRIPT = fileURLToPath(new URL('../../../serve.mjs', import.meta.url));

export async function startAssetsServer() {
	const port = 4400 + Math.floor(Math.random() * 400);
	const child = spawn(process.execPath, [SERVE_SCRIPT], {
		env: { ...process.env, PORT: String(port) },
		stdio: ['ignore', 'pipe', 'pipe']
	});

	let log = '';
	child.stdout.on('data', (chunk) => {
		log += chunk;
	});
	child.stderr.on('data', (chunk) => {
		log += chunk;
	});

	const baseUrl = `http://127.0.0.1:${port}/clang/`;
	const deadline = Date.now() + 30000;
	for (;;) {
		try {
			const response = await fetch(`${baseUrl}runtime-manifest.v1.json`);
			if (response.ok) break;
		} catch {
			// Not listening yet.
		}
		if (Date.now() > deadline) {
			child.kill();
			throw new Error(`The asset server did not come up.\n${log}`);
		}
		await new Promise((resolve) => setTimeout(resolve, 200));
	}

	return {
		baseUrl,
		async stop() {
			child.kill();
			await Promise.race([once(child, 'exit'), new Promise((resolve) => setTimeout(resolve, 5000))]);
		}
	};
}

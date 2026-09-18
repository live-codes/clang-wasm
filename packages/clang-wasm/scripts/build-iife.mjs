// Builds the IIFE bundles: one classic script each, for workers and pages that cannot use ES modules.
//
//   npm run build:iife
//
// The output is committed, because a classic worker can only `importScripts()` a URL and consumers
// should not need a bundler to get one. Both are built from browser entries, so neither pulls in the
// Node-only packaged-assets code.
//
// There are two, and they stay separate. `clang-wasm.global.js` is the language API and is what
// almost every consumer wants; growing it with the low-level entry would make every classic worker
// pay for an API it does not call. `clang-wasm-toolchain.global.js` is that low-level entry on its
// own, for a language driver that has to compile through Clang rather than being C, C++ or
// Objective-C. The two share their runtime code, so a consumer that needs both loads both.
import { build } from 'esbuild';
import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const BUNDLES = [
	{
		entry: '../src/index.js',
		outfile: '../dist/clang-wasm.global.js',
		globalName: 'clangWasm',
		banner: `/*! @live-codes/clang-wasm - MIT. IIFE build, sets self.clangWasm.
 *  importScripts('clang-wasm.global.js') then self.clangWasm.createCompiler(id, { baseUrl }).
 *  Bundles @wasm-idle/llvm-core (MIT AND Apache-2.0 WITH LLVM-exception), @bjorn3/browser_wasi_shim (MIT OR Apache-2.0) and fflate (MIT). */`
	},
	{
		entry: '../src/toolchain.js',
		outfile: '../dist/clang-wasm-toolchain.global.js',
		globalName: 'clangWasmToolchain',
		banner: `/*! @live-codes/clang-wasm - MIT. Low-level IIFE build, sets self.clangWasmToolchain.
 *  importScripts('clang-wasm-toolchain.global.js') then self.clangWasmToolchain.createToolchain({ baseUrl }).
 *  For a language that compiles through Clang rather than being C, C++ or Objective-C.
 *  Bundles @wasm-idle/llvm-core (MIT AND Apache-2.0 WITH LLVM-exception), @bjorn3/browser_wasi_shim (MIT OR Apache-2.0) and fflate (MIT). */`
	}
];

for (const { entry, outfile, globalName, banner } of BUNDLES) {
	const out = fileURLToPath(new URL(outfile, import.meta.url));
	await build({
		entryPoints: [fileURLToPath(new URL(entry, import.meta.url))],
		outfile: out,
		bundle: true,
		format: 'iife',
		globalName,
		minify: true,
		platform: 'browser',
		target: 'es2022',
		// Keeps any third-party @license comments in a sidecar rather than in the payload.
		legalComments: 'external',
		banner: { js: banner }
	});
	console.log(`${outfile.replace('../', '')}  ${(statSync(out).size / 1024).toFixed(1)} KB (minified)`);
}

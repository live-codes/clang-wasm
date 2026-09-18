// The low-level entry: what a language that compiles *through* Clang needs, rather than being C, C++
// or Objective-C.
//
// These tests are the two halves of that contract, and both are real compiles. The first links two
// translation units together with a link line this package did not write - which is the whole point
// of the entry, and the same shape the Objective-C driver uses for libobjc2. The second runs a WASI
// command and reads back a file it wrote, which is how a translator frontend like `f2c` returns its
// output.
import assert from 'node:assert/strict';
import test from 'node:test';
// By name, so the `node` condition brings the packaged assets in and no server is needed.
import { createToolchain } from '@live-codes/clang-wasm/toolchain';

// The runtime is shared by every toolchain and compiler in the process, and its filesystem rejects a
// duplicate path, so each test writes under names of its own.
let builds = 0;
const unique = (name) => `b${++builds}_${name}`;

test('a toolchain compiles two units and links them with its own link line', async () => {
	const toolchain = await createToolchain();
	const { runtime } = toolchain;

	const triple = unique('triple.c');
	const main = unique('main.c');
	const tripleObject = unique('triple.o');
	const mainObject = unique('main.o');
	const wasm = unique('main.wasm');

	const built = await toolchain.captureCompilerOutput(async () => {
		await runtime.compile({
			input: triple,
			code: 'int triple(int value) { return value * 3; }\n',
			obj: tripleObject,
			language: 'C',
			compileArgs: ['-w']
		});
		await runtime.compile({
			input: main,
			code: `#include <stdio.h>
int triple(int value);
int main(void) {
    printf("triple(14) = %d\\n", triple(14));
    return 0;
}
`,
			obj: mainObject,
			language: 'C',
			compileArgs: ['-w']
		});

		const libdir = 'lib/wasm32-wasi';
		const compilerRuntimeLibDir =
			runtime.compilerConfig?.compilerRuntimeLibDir || 'lib/clang/8.0.1/lib/wasi';
		const lld = await runtime.getModule(runtime.assetUrls.lld);
		await runtime.run(
			lld,
			runtime.log,
			'wasm-ld',
			'--export-dynamic',
			'-z',
			'stack-size=1048576',
			`-L${libdir}/noeh`,
			`-L${libdir}`,
			`${libdir}/crt1.o`,
			mainObject,
			tripleObject,
			'-lc',
			'-lm',
			`-L${compilerRuntimeLibDir}`,
			'-lclang_rt.builtins-wasm32',
			'-o',
			wasm
		);
	});
	assert.equal(built.error, null, `expected the link to succeed, got:\n${built.raw}`);

	const bytes = Uint8Array.from(runtime.memfs.getFileContents(wasm));
	const result = await toolchain.execute(
		{
			bytes,
			wasm: await WebAssembly.compile(bytes),
			target: 'wasm32-wasi',
			format: 'wasi-core-wasm'
		},
		{ args: [] }
	);

	assert.equal(result.exitCode, 0);
	// The two units are linked: the call into triple.c resolved.
	assert.equal(result.stdout, 'triple(14) = 42\n');
	toolchain.dispose();
});

test('runCommand runs a WASI command and hands back the files it wrote', async () => {
	const toolchain = await createToolchain();
	const { runtime } = toolchain;

	const source = `#include <ctype.h>
#include <stdio.h>
int main(int argc, char **argv) {
    if (argc != 3) return 2;
    FILE *in = fopen(argv[1], "r");
    if (!in) return 3;
    FILE *out = fopen(argv[2], "w");
    if (!out) return 4;
    int c;
    while ((c = fgetc(in)) != EOF) fputc(toupper((unsigned char)c), out);
    fclose(in);
    fclose(out);
    return 0;
}
`;
	const compiled = await toolchain.captureCompilerOutput(() =>
		runtime.compileArtifact(source, { language: 'C', fileName: unique('shout.c') })
	);
	assert.equal(compiled.error, null, `expected the compile to succeed, got:\n${compiled.raw}`);

	const command = await toolchain.runCommand(await WebAssembly.compile(compiled.result.bytes), {
		args: ['input.txt', 'output.txt'],
		// A command gets its own filesystem, so these names are not shared with the runtime's.
		files: [{ path: 'input.txt', contents: 'hello from a command\n' }],
		programName: 'shout.wasm'
	});

	assert.equal(command.exitCode, 0);
	assert.equal(command.stdout, '');
	assert.equal(command.stderr, '');
	assert.equal(new TextDecoder().decode(command.readFile('output.txt')), 'HELLO FROM A COMMAND\n');
	// A path that is not there is null rather than a throw, so a caller can try the name it expected
	// and then decide what to do - and a path that escapes the root is not a path.
	assert.equal(command.readFile('not-written.txt'), null);
	assert.equal(command.readFile('../outside'), null);
	toolchain.dispose();
});

test('a failing command reports its exit code and stderr rather than throwing', async () => {
	const toolchain = await createToolchain();
	const { runtime } = toolchain;

	const source = `#include <stdio.h>
int main(void) {
    fprintf(stderr, "nope\\n");
    return 7;
}
`;
	const compiled = await toolchain.captureCompilerOutput(() =>
		runtime.compileArtifact(source, { language: 'C', fileName: unique('fail.c') })
	);
	assert.equal(compiled.error, null, `expected the compile to succeed, got:\n${compiled.raw}`);

	const command = await toolchain.runCommand(await WebAssembly.compile(compiled.result.bytes), {});
	assert.equal(command.exitCode, 7);
	assert.equal(command.stderr, 'nope\n');
	assert.equal(command.stdout, '');
	toolchain.dispose();
});

test('toolchains for the same assets share one runtime', async () => {
	const first = await createToolchain();
	const second = await createToolchain();

	// The runtime owns ~84 MB of compiler and one filesystem, so a second one would be a second copy
	// of both. Compilers created against the same assets share it for the same reason.
	assert.equal(first.runtime, second.runtime);
	first.dispose();
	second.dispose();
});

test('a toolchain and a compiler work side by side on the shared runtime', async () => {
	const { createCompiler } = await import('@live-codes/clang-wasm');
	const toolchain = await createToolchain();
	const compiler = await createCompiler('c');

	// They queue on the same runtime rather than clobbering each other's files and output.
	const program = await compiler.run(
		`#include <stdio.h>\nint main(void) { printf("c\\n"); return 0; }\n`
	);

	assert.deepEqual(program.errors, []);
	assert.equal(program.stdout, 'c\n');
	assert.equal(program.exitCode, 0);
	assert.ok(toolchain.runtime, 'the toolchain still holds the runtime');
	toolchain.dispose();
	compiler.dispose();
});

test('dispose is idempotent', async () => {
	const toolchain = await createToolchain();
	toolchain.dispose();
	toolchain.dispose();
});

test('without a filesystem baseUrl is required, and the error says what to do', async () => {
	const browserEntry = await import('../src/toolchain.js');
	await assert.rejects(
		() => browserEntry.createToolchain(),
		/baseUrl is required here[\s\S]*copy-assets/
	);
});

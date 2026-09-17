import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test, { after, before } from 'node:test';
import { fileURLToPath } from 'node:url';
// By name, so the tests exercise the real entry point - including the `node` condition that wires
// the packaged assets in.
import { createCompiler, LANGUAGE_IDS, standardsFor } from '@live-codes/clang-wasm';
import { ASSET_RECEIPTS } from '../src/asset-receipts.js';
import { startAssetsServer } from './helpers.js';

let server;

before(async () => {
	server = await startAssetsServer();
});

after(async () => {
	await server?.stop();
});

test('the languages are the four the package documents', () => {
	assert.deepEqual([...LANGUAGE_IDS], ['c', 'cpp', 'objc', 'objcpp']);
});

test('an unknown language is rejected with the list of valid ones', async () => {
	await assert.rejects(() => createCompiler('rust', { baseUrl: server.baseUrl }), /Unknown language/);
});

test('a baseUrl that is not http(s) is rejected', async () => {
	await assert.rejects(
		() => createCompiler('c', { baseUrl: 'ftp://example.com/clang/' }),
		/baseUrl must be an absolute http\(s\) URL/
	);
});

test('C: stdout, stdin, exit code and the result shape', async () => {
	const compiler = await createCompiler('c', { baseUrl: server.baseUrl });
	const result = await compiler.run(
		`#include <stdio.h>
int main(void) {
    int a = 0, b = 0;
    if (scanf("%d %d", &a, &b) != 2) return 9;
    printf("%d\\n", a * b);
    return 0;
}
`,
		'6 7'
	);

	assert.deepEqual(Object.keys(result).sort(), [
		'compileMs',
		'errors',
		'exitCode',
		'output',
		'runMs',
		'stderr',
		'stdout'
	]);
	assert.equal(result.stdout, '42\n');
	assert.equal(result.stderr, '');
	assert.equal(result.output, '42\n');
	assert.deepEqual(result.errors, []);
	assert.equal(result.exitCode, 0);
	assert.ok(result.runMs >= 0);
	compiler.dispose();
});

test('C: a non-zero exit code is reported, not thrown', async () => {
	const compiler = await createCompiler('c', { baseUrl: server.baseUrl });
	const result = await compiler.run(`int main(void) { return 3; }\n`);

	assert.equal(result.exitCode, 3);
	assert.deepEqual(result.errors, []);
	compiler.dispose();
});

test('C++: a compile failure returns errors and does not run', async () => {
	const compiler = await createCompiler('cpp', { baseUrl: server.baseUrl });
	const result = await compiler.run(
		`#include <vector>
int main() {
    std::vector<int> values;
    return values.does_not_exist();
}
`
	);

	assert.equal(result.exitCode, null);
	assert.equal(result.runMs, null);
	assert.equal(result.stdout, '');
	assert.ok(result.errors.length > 0, 'expected diagnostics');
	assert.ok(
		result.errors.some((line) => /does_not_exist/.test(line)),
		`expected the diagnostic to name the bad call, got:\n${result.errors.join('\n')}`
	);
	// Diagnostics are colourless: the runtime compiles with -fcolor-diagnostics.
	assert.ok(!/\u001b\[/.test(result.errors.join('\n')), 'expected ANSI escapes to be stripped');
	// The runtime logs its own steps to the same stream; none of that belongs in errors.
	assert.ok(
		!result.errors.some((line) => /^>/.test(line) || /Fetching and compiling|Untarring/.test(line)),
		`expected runtime chatter to be filtered, got:\n${result.errors.join('\n')}`
	);
	compiler.dispose();
});

test('C++: runs a real header-heavy program', async () => {
	const compiler = await createCompiler('cpp', { baseUrl: server.baseUrl });
	const result = await compiler.run(
		`#include <algorithm>
#include <numeric>
#include <vector>
#include <cstdio>
int main() {
    std::vector<int> values{5, 3, 9, 1};
    std::sort(values.begin(), values.end());
    std::printf("sum=%d first=%d\\n", std::accumulate(values.begin(), values.end(), 0), values.front());
    return 0;
}
`
	);

	assert.deepEqual(result.errors, []);
	assert.equal(result.stdout, 'sum=18 first=1\n');
	assert.equal(result.exitCode, 0);
	compiler.dispose();
});

test('Objective-C: runs a root-class program', async () => {
	const compiler = await createCompiler('objc', { baseUrl: server.baseUrl });
	const result = await compiler.run(
		`#include <objc/runtime.h>
#include <stdio.h>

__attribute__((objc_root_class))
@interface Counter {
    Class isa;
    int _sum;
}
- (void)add:(int)amount;
- (int)sum;
@end

@implementation Counter
- (void)add:(int)amount { _sum += amount; }
- (int)sum { return _sum; }
@end

int main(void) {
    id counter = class_createInstance(objc_getClass("Counter"), 0);
    for (int value = 1; value <= 10; value++) [counter add:value];
    printf("Counter(sum = %d)\\n", [counter sum]);
    return 0;
}
`
	);

	assert.deepEqual(result.errors, []);
	assert.equal(result.stdout, 'Counter(sum = 55)\n');
	assert.equal(result.exitCode, 0);
	compiler.dispose();
});

test('Objective-C++: C++ containers across a message send', async () => {
	const compiler = await createCompiler('objcpp', { baseUrl: server.baseUrl });
	const result = await compiler.run(
		`#include <objc/runtime.h>
#include <cstdio>
#include <numeric>
#include <vector>

__attribute__((objc_root_class))
@interface Summer {
    Class isa;
}
- (int)total:(const std::vector<int> &)values;
@end

@implementation Summer
- (int)total:(const std::vector<int> &)values {
    return std::accumulate(values.begin(), values.end(), 0);
}
@end

int main() {
    std::vector<int> values{1, 2, 3, 4, 5};
    id summer = class_createInstance(objc_getClass("Summer"), 0);
    std::printf("total=%d\\n", [summer total:values]);
    return 0;
}
`
	);

	assert.deepEqual(result.errors, []);
	assert.equal(result.stdout, 'total=15\n');
	assert.equal(result.exitCode, 0);
	compiler.dispose();
});

test('output is stdout and stderr in the order the program wrote them', async () => {
	const compiler = await createCompiler('c', { baseUrl: server.baseUrl });
	const result = await compiler.run(
		`#include <stdio.h>
int main(void) {
    // Unbuffered, so the two streams interleave by write order instead of by flush order.
    setvbuf(stdout, NULL, _IONBF, 0);
    setvbuf(stderr, NULL, _IONBF, 0);
    printf("out-1\\n");
    fprintf(stderr, "err-1\\n");
    printf("out-2\\n");
    fprintf(stderr, "err-2\\n");
    return 0;
}
`
	);

	assert.equal(result.stdout, 'out-1\nout-2\n');
	assert.equal(result.stderr, 'err-1\nerr-2\n');
	assert.equal(result.output, 'out-1\nerr-1\nout-2\nerr-2\n');
	compiler.dispose();
});

test('std selects the standard the program is compiled at', async () => {
	const compiler = await createCompiler('cpp', { baseUrl: server.baseUrl, std: 'gnu++20' });
	const result = await compiler.run(
		`#include <cstdio>
int main() { std::printf("%ld\\n", (long)__cplusplus); return 0; }
`
	);

	assert.deepEqual(result.errors, []);
	assert.equal(result.stdout, '202002\n');
	assert.equal(compiler.std, 'gnu++20');
	compiler.dispose();
});

test('std can be overridden for a single run', async () => {
	const compiler = await createCompiler('c', { baseUrl: server.baseUrl, std: 'gnu17' });
	const probe = `#include <stdio.h>
int main(void) { printf("%ld\\n", (long)__STDC_VERSION__); return 0; }
`;

	assert.equal((await compiler.run(probe)).stdout, '201710\n');
	assert.equal((await compiler.run(probe, '', { std: 'gnu23' })).stdout, '202311\n');
	// An override applies to that run only.
	assert.equal((await compiler.run(probe)).stdout, '201710\n');
	compiler.dispose();
});

test('std: null passes no -std, leaving the compiler its own default', async () => {
	const compiler = await createCompiler('c', { baseUrl: server.baseUrl, std: null });
	const result = await compiler.run(
		`#include <stdio.h>
int main(void) { printf("%ld\\n", (long)__STDC_VERSION__); return 0; }
`
	);

	assert.deepEqual(result.errors, []);
	assert.equal(compiler.std, null);
	// Whatever clang defaults to, it is not the gnu23 this package would otherwise have asked for.
	assert.notEqual(result.stdout, '202311\n');
	compiler.dispose();
});

test('a std the language does not offer is rejected, listing the ones it does', async () => {
	await assert.rejects(
		() => createCompiler('c', { baseUrl: server.baseUrl, std: 'gnu++23' }),
		/std must be null or one of gnu11, gnu17, gnu23 for c/
	);
	await assert.rejects(
		() => createCompiler('objc', { baseUrl: server.baseUrl, std: 'c++20' }),
		/gnu11, gnu17, gnu23 for objc/
	);
});

test('the standards a language accepts are discoverable without creating a compiler', async () => {
	assert.deepEqual(standardsFor('cpp'), ['gnu++11', 'gnu++14', 'gnu++17', 'gnu++20', 'gnu++23']);
	assert.deepEqual(standardsFor('objective-c'), ['gnu11', 'gnu17', 'gnu23']);

	const compiler = await createCompiler('objcpp', { baseUrl: server.baseUrl });
	assert.equal(compiler.std, 'gnu++23');
	assert.deepEqual(compiler.standards, standardsFor('objcpp'));
	compiler.dispose();
});

test('program args come from the compiler and can be overridden per run', async () => {
	const compiler = await createCompiler('c', { baseUrl: server.baseUrl, args: ['one'] });
	const program = `#include <stdio.h>
int main(int argc, char **argv) {
    for (int i = 1; i < argc; i++) printf("[%s]", argv[i]);
    printf("\\n");
    return 0;
}
`;

	assert.equal((await compiler.run(program)).stdout, '[one]\n');
	assert.equal((await compiler.run(program, '', { args: ['two', 'three'] })).stdout, '[two][three]\n');
	compiler.dispose();
});

test('one compiler keeps working across runs with different sources', async () => {
	const compiler = await createCompiler('c', { baseUrl: server.baseUrl });

	assert.equal((await compiler.run(`int main(void) { return 0; }\n`)).exitCode, 0);
	assert.equal((await compiler.run(`int main(void) { return 1; }\n`)).exitCode, 1);
	assert.equal((await compiler.run(`int main(void) { return 2; }\n`)).exitCode, 2);
	compiler.dispose();
});

test('the runtime is shared, so the languages can be used side by side', async () => {
	const c = await createCompiler('c', { baseUrl: server.baseUrl });
	const cpp = await createCompiler('cpp', { baseUrl: server.baseUrl });
	const objc = await createCompiler('objc', { baseUrl: server.baseUrl });

	const results = await Promise.all([
		c.run(`#include <stdio.h>\nint main(void) { printf("c\\n"); return 0; }\n`),
		cpp.run(`#include <cstdio>\nint main() { std::printf("cpp\\n"); return 0; }\n`),
		objc.run(
			`#include <objc/runtime.h>\n#include <stdio.h>\n__attribute__((objc_root_class))\n@interface Thing { Class isa; }\n- (const char *)name;\n@end\n@implementation Thing\n- (const char *)name { return "objc"; }\n@end\nint main(void) { id thing = class_createInstance(objc_getClass("Thing"), 0); printf("%s\\n", [thing name]); return 0; }\n`
		)
	]);

	assert.deepEqual(
		results.map((result) => result.stdout),
		['c\n', 'cpp\n', 'objc\n']
	);
	for (const result of results) assert.deepEqual(result.errors, []);

	c.dispose();
	cpp.dispose();
	objc.dispose();
});

test('a disposed compiler refuses further runs', async () => {
	const compiler = await createCompiler('c', { baseUrl: server.baseUrl });
	compiler.dispose();
	await assert.rejects(() => compiler.run(`int main(void) { return 0; }\n`), /disposed/);
});

test('an unreachable asset host fails with the URL it tried', async () => {
	const compiler = await createCompiler('c', { baseUrl: 'http://127.0.0.1:9/clang/' }).catch(
		(error) => error
	);
	assert.ok(compiler instanceof Error, 'expected createCompiler to reject');
	assert.match(String(compiler.message), /127\.0\.0\.1:9/);
});

test('the pinned receipts match the repository lock file', async (t) => {
	const lockPath = fileURLToPath(new URL('../../../toolchain.lock.json', import.meta.url));
	if (!existsSync(lockPath)) {
		t.skip('no toolchain.lock.json next to this package');
		return;
	}
	const lock = JSON.parse(readFileSync(lockPath, 'utf8'));
	const pinned = {
		'runtime-manifest.v1.json': lock.hosted.assets['runtime-manifest.v1.json'],
		'bin/clang.wasm.gz': lock.hosted.assets['bin/clang.wasm.gz'],
		'bin/lld.wasm.gz': lock.hosted.assets['bin/lld.wasm.gz'],
		'bin/memfs.wasm.gz': lock.memfs.outputs['memfs.wasm.gz'],
		'bin/sysroot.tar.gz': lock.sysroot.outputs['sysroot.tar.gz'],
		'objective-c/libobjc.a': lock.objectiveC.assets['libobjc.a'],
		'objective-c/headers.json': lock.objectiveC.assets['headers.json']
	};

	for (const [name, receipt] of Object.entries(ASSET_RECEIPTS)) {
		assert.deepEqual(
			{ bytes: receipt.bytes, sha256: receipt.sha256 },
			{ bytes: pinned[name].bytes, sha256: pinned[name].sha256 },
			`${name} disagrees with toolchain.lock.json`
		);
	}
	assert.deepEqual(
		Object.keys(ASSET_RECEIPTS).sort(),
		Object.keys(pinned).sort(),
		'every shipped asset should be pinned in both places'
	);
});

test('every asset shipped in the package matches its pinned receipt', async () => {
	for (const [name, receipt] of Object.entries(ASSET_RECEIPTS)) {
		const bytes = await readFile(new URL(`../assets/${name}`, import.meta.url));
		assert.equal(bytes.length, receipt.bytes, `${name} is the wrong size`);
		assert.equal(
			createHash('sha256').update(bytes).digest('hex'),
			receipt.sha256,
			`${name} does not hash to its receipt`
		);
	}
});

test('Node needs no baseUrl: the packaged assets are the default', async () => {
	const compiler = await createCompiler('c');
	const result = await compiler.run(
		`#include <stdio.h>
int main(void) { printf("packaged\\n"); return 0; }
`
	);

	assert.deepEqual(result.errors, []);
	assert.equal(result.stdout, 'packaged\n');
	assert.equal(result.exitCode, 0);
	compiler.dispose();
});

test('the packaged Objective-C assets are read and verified too', async () => {
	const compiler = await createCompiler('objc');
	const result = await compiler.run(
		`#include <objc/runtime.h>
#include <stdio.h>
__attribute__((objc_root_class))
@interface Thing { Class isa; }
- (const char *)name;
@end
@implementation Thing
- (const char *)name { return "packaged"; }
@end
int main(void) { id thing = class_createInstance(objc_getClass("Thing"), 0); printf("%s\\n", [thing name]); return 0; }
`
	);

	assert.deepEqual(result.errors, []);
	assert.equal(result.stdout, 'packaged\n');
	compiler.dispose();
});

test('without a filesystem baseUrl is required, and the error says what to do', async () => {
	const browserEntry = await import('../src/index.js');
	await assert.rejects(
		() => browserEntry.createCompiler('c'),
		/baseUrl is required here[\s\S]*copy-assets/
	);
});

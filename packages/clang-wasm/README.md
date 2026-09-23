# @live-codes/clang-wasm

Run **C**, **C++**, **Objective-C** and **Objective-C++** through one API, on Clang 22 compiled to
WebAssembly. No native toolchain, and no host to set up: the runtime assets ship inside the package.

There is also a lower-level entry, `@live-codes/clang-wasm/toolchain`, for a language that compiles
*through* Clang rather than being one of those four — see
[Building another language on the same runtime](#building-another-language-on-the-same-runtime).

```js
import { createCompiler } from '@live-codes/clang-wasm';

const compiler = await createCompiler('cpp');

const { stdout, stderr, output, errors, exitCode } = await compiler.run(`
    #include <cstdio>
    int main() { std::puts("hello"); }
`);

console.log(output);   // "hello\n" - stdout and stderr in the order the program wrote them
console.log(exitCode); // 0
```

That is Node, where the packaged assets can be read off disk. **In a browser there is no filesystem**,
so a page has to be given a URL - copy the assets into whatever serves your page and pass it:

```bash
npx --package @live-codes/clang-wasm clang-wasm-copy-assets public/clang
```

```js
const compiler = await createCompiler('cpp', { baseUrl: new URL('/clang/', location.href) });
```

Either way the package is bundled like any other npm package, because it imports
`@wasm-idle/llvm-core` by name.

## API

### `createCompiler(language, options)`

Returns a promise for a compiler. The heavy part - roughly 29 MB of assets that unpack to about
84 MB of clang, lld, memfs and sysroot - is fetched here, so a bad `baseUrl` fails at this point
rather than at the first `run`.

| Language | Accepted ids | Compiles as | `std` values |
| --- | --- | --- | --- |
| C | `c` | `main.c` | `gnu11`, `gnu17`, **`gnu23`** |
| C++ | `cpp`, `c++`, `cc`, `cxx` | `main.cpp` | `gnu++11`, `gnu++14`, `gnu++17`, `gnu++20`, **`gnu++23`** |
| Objective-C | `objc`, `objective-c` | `main.m` | `gnu11`, `gnu17`, **`gnu23`** |
| Objective-C++ | `objcpp`, `objc++`, `objective-c++` | `main.mm` | `gnu++11`, `gnu++14`, `gnu++17`, `gnu++20`, **`gnu++23`** |

| Option | Meaning |
| --- | --- |
| `baseUrl` | Where the runtime assets are served from. **Optional in Node**, where omitting it uses the assets the package ships; required anywhere else, and absolute http(s) except in a browser, where it may be relative to the page. |
| `objectiveCBaseUrl` | Where the Objective-C runtime is served from. Defaults to `objective-c/` under `baseUrl`. |
| `std` | The standard to compile at, e.g. `'gnu++20'`. One of the values in the table above; anything else is rejected rather than passed through. `null` passes no `-std=` at all and leaves the compiler its own default. |
| `compileArgs` | Extra clang flags, e.g. `['-Wall', '-O2']`. |
| `args` | Default program argv. |
| `fileName` | The name the source is compiled under. |
| `onProgress` | `(value) => {}`, called with 0 to 1 while assets download. |
| `maxAssetBytes` | Ceiling for a decompressed asset. Defaults to 128 MB. |

#### Choosing a standard

`std` takes the same choices the demo's Std dropdown offers, in the same `gnu*` spellings, and it is
validated against the language, so a typo fails immediately with the values that would have worked:

```js
await createCompiler('cpp', { baseUrl, std: 'gnu++20' });
// Error: std must be null or one of gnu++11, gnu++14, gnu++17, gnu++20, gnu++23 for cpp (got "c++20").
```

Use `standardsFor(language)` to build the picker without creating a compiler, or read it back off
one you already have:

```js
import { standardsFor } from '@live-codes/clang-wasm';

standardsFor('cpp');       // ['gnu++11', 'gnu++14', 'gnu++17', 'gnu++20', 'gnu++23']
standardsFor('objective-c'); // aliases work here too: ['gnu11', 'gnu17', 'gnu23']

const compiler = await createCompiler('c', { baseUrl, std: 'gnu17' });
compiler.std;              // 'gnu17'
compiler.standards;        // ['gnu11', 'gnu17', 'gnu23']
```

The list is deliberately limited to the `gnu*` spellings. Strict `-std=c++17` is a different
language - it rejects the GNU extensions clang accepts by default - so it is not offered as if it were
the same thing. Pass it through `compileArgs` if you want it, where it lands after the `std` flag and
therefore wins:

```js
await compiler.run(code, input, { compileArgs: ['-std=c++17'] });
```

### `compiler.run(code, input, runOptions?)`

Compiles and runs. `input` is stdin as a string or `Uint8Array`, handed to the program once and then
closed. `runOptions` may override `std`, `args`, `compileArgs` and `fileName` for that run - `std`
is validated the same way, and `compileArgs` are appended to the ones from `createCompiler`.

```js
const { stdout, stderr, output, errors, exitCode } = await compiler.run(code, '5 3\n', {
    args: ['--verbose'],
    compileArgs: ['-Wall']
});
```

| Field | Meaning |
| --- | --- |
| `stdout` | Everything the program wrote to fd 1. |
| `stderr` | Everything it wrote to fd 2. |
| `output` | Both, in the order the program wrote them - what a terminal would have shown. |
| `errors` | The compiler's diagnostics, one string per line, ANSI colour and the runtime's own log lines removed. **Empty when the program compiled.** |
| `exitCode` | The program's exit status, or `null` if it never ran because the compile or link failed. |
| `compileMs` | Wall clock for the compile and link. |
| `runMs` | Wall clock for the run, or `null` if it did not run. |

Two things about `errors` worth knowing, since they are choices rather than accidents:

- It is empty on success so that `errors.length` is a reliable failure test. That means **warnings
  from a successful compile are not surfaced**; a separate `diagnostics` field is the natural place
  for them if you need them.
- On failure it holds whatever the compiler said, and if the compiler said nothing - a missing asset,
  a wasm instantiation failure - it holds that error's message instead, so a failure is never silent.

### `compiler.dispose()`

The runtime is shared between every compiler created against the same `baseUrl`, so C, C++ and
Objective-C together cost one asset load rather than three. Each compiler holds a reference;
`dispose()` drops it, and the runtime is released when the last one goes. Further runs on a disposed
compiler throw.

### `LANGUAGE_IDS` and `standardsFor(language)`

For building pickers without creating a compiler: the accepted canonical ids, and the `std` values
each language takes.

```js
import { LANGUAGE_IDS, standardsFor } from '@live-codes/clang-wasm';

LANGUAGE_IDS;              // ['c', 'cpp', 'objc', 'objcpp']
standardsFor('c');         // ['gnu11', 'gnu17', 'gnu23']
standardsFor('objcpp');    // ['gnu++11', 'gnu++14', 'gnu++17', 'gnu++20', 'gnu++23']
```

## Building another language on the same runtime

`createCompiler` covers the four languages above. A language that is not C, C++ or Objective-C but
still compiles *through* Clang — one whose frontend translates to C, or one that links a runtime of
its own — cannot use it: the entry point and the link line are decided inside those drivers.

`@live-codes/clang-wasm/toolchain` is that same runtime with the policy taken out.

```js
import { createToolchain } from '@live-codes/clang-wasm/toolchain';

const toolchain = await createToolchain({ baseUrl });
const { runtime } = toolchain;
```

It hands over the pieces a driver needs and says nothing about how to use them:

| Member | What it is |
| --- | --- |
| `runtime` | The `@wasm-idle/llvm-core/clang` runtime — `compile`, `run`, `memfs`, `getModule`, `assetUrls`, `compilerConfig`. The escape hatch, and the one part of this API that follows someone else's shape. |
| `addFile(path, contents)` | Write a file into the runtime's filesystem, creating any directories it needs. |
| `lock(work)` | Run `work` with exclusive use of the runtime. |
| `captureCompilerOutput(work)` | Collect clang's and wasm-ld's output, instead of it being logged. Returns `{ result, raw, error }`. |
| `runCommand(module, options)` | Instantiate and run a `wasi_snapshot_preview1` command module. |
| `execute(artifact, options)` | Run an artifact the runtime built. |
| `assetSource` | Where the assets came from, for an error message a user can act on. |
| `dispose()` | Drop this toolchain's hold on the shared runtime. |

`captureCompilerOutput` hands back clang's and wasm-ld's output exactly as it arrived — ANSI colour
included, and mixed with the runtime's own log lines. `compilerDiagnostics(raw)` is the export beside
`createToolchain` that turns it into the lines a caller wants:

```js
const { raw } = await toolchain.captureCompilerOutput(work);
compilerDiagnostics(raw);   // string[], runtime chatter and colour removed
```

`CLANG_DRIVER_DEFAULT_ARGS` is the other export beside `createToolchain`, and it exists for the same
reason: clang's frontend does not apply every default its driver does, so a driver that compiles C
itself has to pass them. It currently holds `-fgnuc-version=4.2.1` - what the driver passes - which
sets `__GNUC__`, `__GNUC_MINOR__` and `__GNUC_PATCHLEVEL__`. Without it, C asking
`#if defined(__GNUC__)` quietly takes its fallback branch, which is how Nim's `nimbase.h` comes to emit
C that does not compile. Spread it into the `compileArgs` of your own clang invocation:

```js
import { CLANG_DRIVER_DEFAULT_ARGS } from '@live-codes/clang-wasm/toolchain';

await runtime.compile({
    input, code, obj, language: 'C',
    compileArgs: [...CLANG_DRIVER_DEFAULT_ARGS, ...yourArgs]
});
```

**It shares the runtime with `createCompiler`.** Both acquire from one pool, keyed by asset source, so
a page that runs C/C++ *and* another language pays for one runtime — one ~28 MB asset load, one ~84 MB
resident — and both queue on the same lock, so they cannot write over each other's files or redirect
each other's output.

`runCommand` is the half a translator frontend needs. It gives the command its own filesystem, takes
argv, env and stdin, and hands back what it wrote:

```js
const command = await toolchain.runCommand(compiledModule, {
    args: ['main.f'],
    files: [{ path: 'main.f', contents: source }]
});

command.exitCode;                                          // the command's own status
new TextDecoder().decode(command.readFile('main.c'));       // null if it is not there
```

**This entry is plumbing, not a language.** It will not tell you which objects to link, or where a
frontend puts its output. The driver is yours to write — the first one is in the `browser-fortran`
repository, which uses `runCommand` to translate Fortran to C, then `runtime.compile` and a hand-written
`wasm-ld` line to link `libf2c` in, then `execute` to run it.

## Loading it without a bundler

`dist/clang-wasm.global.js` is a **minified IIFE bundle** - one classic script, 296 KB - for anywhere
an ES module cannot go: a classic (non-module) worker, a plain `<script>`, a CDN URL handed to
`importScripts()`. It is self-contained, so it needs no bundler and no import map.

```js
// worker.js - a classic worker: no { type: 'module' }, no imports
importScripts('clang-wasm.global.js');

const compiler = await self.clangWasm.createCompiler('cpp', { baseUrl: '/clang/' });
const { stdout, errors, exitCode } = await compiler.run('int main() { return 0; }');
```

It sets `self.clangWasm` to the same three exports the module has - `createCompiler`, `LANGUAGE_IDS`
and `standardsFor` - so the API above is unchanged.

It is reachable as `@live-codes/clang-wasm/iife` if you want your tooling to find it, and it is
committed rather than built on install, so a consumer never needs esbuild. Rebuild it with
`npm run build:iife` after changing anything under `src/`.

The low-level entry has its own bundle, `dist/clang-wasm-toolchain.global.js` (290 KB), reachable as
`@live-codes/clang-wasm/iife/toolchain` and setting `self.clangWasmToolchain`:

```js
// a classic worker that has to compile through Clang rather than being C, C++ or Objective-C
importScripts('clang-wasm-toolchain.global.js');

const toolchain = await self.clangWasmToolchain.createToolchain({ baseUrl: '/clang/' });
```

They are separate on purpose. The two share their runtime code, so folding the toolchain into the
language bundle would make every classic worker pay for an API it does not call; a consumer that
wants both loads both. `clang-wasm.global.js` is unchanged by the addition.

`npm run build:iife` writes both.

**A worker still has no filesystem**, so this bundle always needs a `baseUrl`: it is the browser entry,
not the Node one. The assets themselves have to be served from somewhere a worker can fetch - see
[Where the assets come from](#where-the-assets-come-from).

## Where the assets come from

The runtime ships inside the package, about 28 MB compressed, laid out as the runtime expects a base
URL to be:

```
runtime-manifest.v1.json     876 B
bin/memfs.wasm.gz             38 KB
bin/clang.wasm.gz           15.0 MB
bin/lld.wasm.gz              7.5 MB
bin/sysroot.tar.gz           5.2 MB
objective-c/                          <- only fetched if you use Objective-C
  libobjc.a                  190 KB
  headers.json                83 KB
```

There are three ways to reach it, and the first two need no host of your own.

**In Node, nothing.** Omit `baseUrl` and the package reads those files directly. The runtime insists
on http(s) for its assets, so the package maps a reserved `.invalid` origin onto the files with a
narrow `fetch` shim installed only around its own URL prefix - which is also why that origin is
`.invalid`: if the shim were ever missing, the request fails loudly instead of quietly reaching a
real host.

**In a browser, one command.** A page cannot read a file inside an npm package, so copy the assets
somewhere it can fetch them:

```bash
npx --package @live-codes/clang-wasm clang-wasm-copy-assets public/clang
```

That writes the tree above, plus an `asset-receipts.json` describing its own bytes, into a directory
you already serve. Then `baseUrl: new URL('/clang/', location.href)`.

**Or point `baseUrl` at a host you already have** - a CDN, an S3 bucket, whatever serves the tree
above. `objectiveCBaseUrl` overrides just the Objective-C part if it lives somewhere else. Three of
the Objective-C assets are published upstream only gzipped at `<name>.gz`; the loader retries that
path and inflates what it gets, so a verbatim mirror of the upstream directory works too.

### Verification

Every asset the package reads is checked against a pinned SHA-256 receipt before it is used, and the
receipts live in `src/asset-receipts.js`.

- **Packaged (Node):** all seven, always.
- **Hosted:** the two Objective-C assets, which this package fetches itself. They are the ones where
  getting the wrong bytes produces the worst failure - a program that links against the wrong runtime
  behaves unpredictably rather than failing.

The compiler assets under `bin/` are fetched by `@wasm-idle/llvm-core`'s own loader, which this
package cannot hook, so **a host is trusted for those**. If you need them covered, verify at your CDN
or in your build - `asset-receipts.json` is written next to the copy for exactly that.

### Size

28 MB compressed, about 85 MB unpacked and resident. `npm install` pays it once; the runtime keeps it
in memory between runs, which is what makes a warm compile ~100 ms instead of ~3 s.

## What each language can do

C and C++ are the full toolchain: C++23 and C23 with a complete libc++, and the whole of wasi-libc's C
header tree - every public C header it ships preprocesses, which a test asserts one header at a time.
The standards are real, not decorative - pass `std: 'gnu++20'` and `__cplusplus` becomes `202002`.

Objective-C is **GNUstep's libobjc2, which is a runtime and not a class library**. There is no
`NSObject` and no `NSString`, and although the shipped headers declare an `Object` root class,
nothing implements it - subclassing `Object` fails to link. A program declares its own root class and
makes instances directly:

```objc
__attribute__((objc_root_class))
@interface Counter {
    Class isa;
    int _sum;
}
- (void)add:(int)amount;
@end

id counter = class_createInstance(objc_getClass("Counter"), 0);
```

Two things are **not** supported, and both are limitations of the runtime rather than of this API:

- **Foundation.** `#import <Foundation/Foundation.h>` does not compile. GNUstep Base is not usable
  with this toolchain; the parent repository's README has the full diagnosis.
- **Exceptions.** `@try`/`@catch`/`@throw` fail to compile (`cannot use '@try' with Objective-C
  exceptions disabled`), and `-fobjc-exceptions` only moves the failure to the link: `undefined
  symbol: objc_exception_throw`, which the archived libobjc2 does not provide.

## Notes

- **Memory.** Budget for the shared runtime: a few hundred MB with the toolchain resident, plus the
  program's own memory while it runs. Assets are kept around between runs on purpose - that is what
  makes a warm compile ~100 ms instead of ~3 s.
- **The runtime cannot be used concurrently.** It owns one memfs and one compiler process, so runs
  queue on it rather than interleaving. Two runs started at once will both finish; the second waits.
- **`output` follows writes, not terminal flush order.** C stdio block-buffers stdout when it is not
  a terminal, so a buffered `printf` can be flushed after a later write to stderr. Call
  `setvbuf(stdout, NULL, _IONBF, 0)` if you need exact interleaving.
- **Objective-C runs allocate memfs nodes.** Each run compiles into its own directory, because memfs
  rejects a duplicate file and the runtime's build cache only helps for byte-identical input. That is
  about four nodes per run out of several thousand free, so it is only a concern for a long-lived
  session that runs thousands of Objective-C programs.
- **`__GNUC__` is defined.** The runtime drives clang's frontend rather than its driver, and a few
  driver defaults are not frontend defaults, so `-fgnuc-version=4.2.1` is passed for C, C++,
  Objective-C and Objective-C++. C that branches on `#if defined(__GNUC__)` therefore takes the branch
  a plain `clang` invocation would give it. It goes in first, so `compileArgs` still overrides it -
  pass `-fgnuc-version=0` for the bare frontend.
- **Node needs `crypto.subtle`** for the Objective-C asset check: Node 20 and later, or a browser in
  a secure context.

## Development

```bash
npm test
```

Real compiles for all four languages, in two halves. The packaged half runs straight off `assets/`
with no server at all; the hosted half starts the parent repository's `serve.mjs` on a free port, so
it also needs the rebuilt sysroot in `dist/` (see the parent README). The suite also checks that the
shipped bytes hash to their receipts and that those receipts still agree with
`toolchain.lock.json`. `test/sysroot.test.js` reads the headers out of the shipped tarball and
compiles each public one on its own, then compiles the POSIX ones together in a single translation
unit - a prune that keeps a header and drops a file it includes fails there rather than in someone's
build.

## License

**MIT.** One license, for everything in this package that we wrote - and nothing here is copyleft, so
nothing about it constrains the programs you compile or a project that bundles it.

The runtime in `assets/` and the JavaScript embedded in `dist/clang-wasm.global.js` are other projects'
work, under their own permissive licenses: Apache-2.0 with the LLVM exception for Clang, LLD, memfs and
the sysroot, MIT for GNUstep's libobjc2, and MIT / Apache-2.0 for the three packages the IIFE build
bundles. Permissive licenses come with an attribution condition, so the bundle carries a three-line
comment header and `THIRD-PARTY-NOTICES.md` records what is whose. That is the entire requirement - it
is not a second license on this package, and it is why the bundle does not need to change anything
about how it is used.

**Nothing copyleft is here**, deliberately. The runtime the producer also publishes includes GNUstep
Base, which is LGPL-2.1; it is left out so that a consumer never has to think about it, and it is also
the Foundation path that does not work with this toolchain.

## Relationship to the demo in the parent repository

The parent repository is a browser demo of the same toolchain, and it has its own worker-based
implementation. It is not built on this package, for two reasons: the demo streams a program's output
to the page as it arrives, while `run()` collects and returns it; and the demo loads the toolchain
from a CDN module URL so that it needs no bundler, which a package that imports its dependencies by
name cannot do. The Objective-C compile and link arguments are the one piece that appears in both,
and the demo's copy is the one that came first.

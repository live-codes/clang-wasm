# @live-codes/clang-wasm

Run **C**, **C++**, **Objective-C** and **Objective-C++** through one API, on Clang 22 compiled to
WebAssembly. No native toolchain, and no host to set up: the runtime assets ship inside the package.

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
npx @live-codes/clang-wasm-copy-assets public/clang
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
bin/sysroot.tar.gz           5.1 MB
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
npx @live-codes/clang-wasm-copy-assets public/clang
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

28 MB compressed, about 84 MB unpacked and resident. `npm install` pays it once; the runtime keeps it
in memory between runs, which is what makes a warm compile ~100 ms instead of ~3 s.

## What each language can do

C and C++ are the full toolchain: C++23 and C23 with a complete libc++. The standards are real, not
decorative - pass `std: 'gnu++20'` and `__cplusplus` becomes `202002`.

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
`toolchain.lock.json`.

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

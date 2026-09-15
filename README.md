# Clang/WASM playground — `@wasm-idle/llvm-core` feasibility demo

Answers: *can LiveCodes replace `@chriskoch/cpp-wasm` with a current Clang build, e.g.
`@wasm-idle/llvm-core`?* Short answer: **yes**, and this directory contains a verified, working demo.

## Run it

```bash
node serve.mjs          # http://localhost:4173
```

No bundler required — `index.html` pulls the runtime from esm.sh. To drop the CDN dependency:

```bash
npm install
npm run bundle          # writes vendor/llvm-core-clang.js (~456 KB)
```

then open <http://localhost:4173/?local=1>, or set `window.LLVM_CORE_URL` before the module script runs.

Both paths are verified working. Note that this machine has `npm config get omit` = `dev`, so the two
packages live under `dependencies` — otherwise a plain `npm install` would silently install nothing.

## Pointing at your own asset host

The compiler binaries are **not** in the npm package — they are fetched from a base URL. Supply yours
without editing any file, in this precedence order:

```
?baseUrl=https://cdn.example.com/clang/          # 1. query parameter
window.RUNTIME_BASE_URL = '...'                  # 2. global, set before the module script runs
https://seorii.page/wasm-idle/clang/             # 3. built-in default
```

The base URL must be `http(s)` and must serve exactly these five paths:

```
runtime-manifest.v1.json
bin/memfs.wasm.gz
bin/clang.wasm.gz
bin/lld.wasm.gz
bin/sysroot.tar.gz
```

`bin/` is taken from `manifest.compiler.*.asset`, and the manifest itself is resolved as
`<baseUrl>/runtime-manifest.v1.json`, so a trailing slash is optional. The active host is shown next
to the title, and an unparseable or non-http base URL is flagged there before you run anything.

A local mirror is included so you can test a self-hosted setup:

```bash
node mirror.mjs        # http://localhost:4174/clang/, proxies + caches upstream
```

then open <http://localhost:4173/?baseUrl=http://localhost:4174/clang/>. This is verified: a
cross-origin base URL (~28 MB over a second origin, `Access-Control-Allow-Origin: *`) compiles and
runs correctly. Failures stay readable — a bad path reports
`Failed to load wasm-clang runtime manifest from <url>: 404` rather than hanging.

Because the demo page is cross-origin isolated, **your asset host must send
`Access-Control-Allow-Origin`** (a CORS response is what COEP accepts); without it the fetch is
blocked. `mirror.mjs` sends it, and so does `seorii.page`.

## Verified result

Real Chromium, headless, over `http://localhost:4173/`:

```
Toolchain ready (clang 22.1.8, llvmorg-22.1.8).
clang 22.1.8 (https://github.com/llvm/llvm-project ca7933e47d3a3451d81e72ac174dcb5aa28b59d1)
__cplusplus = 202002
sorted: 1 3 4 5 9
sum = 22

[exit 0]  compiled in 8461 ms, ran in 10 ms, artifact 3886.0 KiB
```

C, C++ (C++20 default), diagnostics with `file:line:col`, stdin, argv, and stdout/stderr capture all work.
Warm recompiles (changed source) take ~3.5 s for a `<iostream>`-heavy program, ~0.7 s for a C program.
Identical source is served from an internal build cache in ~1 ms.

## What the package actually is

- `@wasm-idle/llvm-core@1.0.0`, MIT + Apache-2.0-with-LLVM-exception, published 2026-09-13.
- Code only — **no compiler binaries in the npm tarball**. Compiler, sysroot and runtime assets are
  fetched at runtime from an explicit HTTP(S) base URL.
- Toolchain: **LLVM 22.1.8** (`ca7933e47d3a3451d81e72ac174dcb5aa28b59d1`), WASI SDK 33, emsdk 6.0.0,
  targeting `wasm32-wasi` (WASI preview 1).
- Splits into `@wasm-idle/llvm-core/clang`, `/debug` (LLDB), `/objective-c`, `/cobol`, `/core`.
- Normal execution is **main-thread** (`WebAssembly` + `@bjorn3/browser_wasi_shim`). No worker on this path.

## Asset host

`https://seorii.page/wasm-idle/clang/` serves the published asset graph with `Access-Control-Allow-Origin: *`:

| Asset | Compressed | Uncompressed |
| --- | --- | --- |
| `runtime-manifest.v1.json` | 876 B | — |
| `bin/memfs.wasm.gz` | 19 KB | 345 KB |
| `bin/clang.wasm.gz` | 15.7 MB | 44.2 MB |
| `bin/lld.wasm.gz` | 7.8 MB | 20.8 MB |
| `bin/sysroot.tar.gz` | 5.1 MB | 19.3 MB |

~28.7 MB on the wire, ~84 MB decompressed. Hashes are pinned upstream in
`src/lib/playground/clangAssetIntegrity.ts`. For production you would mirror these yourself rather
than depend on someone else's deployment (the author hosts them for the wasm-idle demo only).

## Gotchas found while building this

These cost real debugging time; each one is a trap for an integrator.

1. **`SharedArrayBuffer` is referenced unconditionally — but can be stubbed away.** The README only
   mentions cross-origin isolation for the LLDB debugger, yet `<clang>`'s *normal* compile path throws
   first: `dist/core/src/memory.js` does `buf instanceof SharedArrayBuffer`, which raises
   `ReferenceError: SharedArrayBuffer is not defined` on a page that is not cross-origin isolated.
   The ordinary path never allocates a real one, so a stub is enough:
   ```js
   globalThis.SharedArrayBuffer ??= class SharedArrayBuffer {};
   ```
   With that, **no COOP/COEP is needed** and the demo runs on a plain origin — verified with
   `crossOriginIsolated === false`. Only the LLDB debug runtime needs real shared memory, so
   `serve.mjs` sends the headers only when `ISOLATE=1`.

2. **You must pass the manifest.** `new BrowserClangRuntime({ runtimeBaseUrl })` alone is not enough.
   Without `manifest`, `compilerConfig` is undefined and `resourceDir` falls back to the hardcoded
   `/lib/clang/8.0.1`, so even `#include <iostream>` fails with `'stddef.h' file not found`.
   Load it yourself:
   ```js
   const manifest = await loadRuntimeManifest(resolveRuntimeManifestUrl(baseUrl));
   const runtime = new BrowserClangRuntime({ runtimeBaseUrl: baseUrl, manifest, ... });
   ```

3. **`createClangCompiler()` does not keep the runtime warm.** The exported one (from `compiler.js`)
   returns `{ compile }`, and every `compile()` call constructs a *new* `Runtime`, re-downloading and
   re-instantiating 44 MB of clang. For a playground, use the stateful class instead:
   ```js
   const runtime = new BrowserClangRuntime({ runtimeBaseUrl, manifest, ... });
   await runtime.ready;                                   // once
   const artifact = await runtime.compileArtifact(code, { language, fileName });
   await executeBrowserClangArtifact(artifact, { args, stdin, stdout, stderr });
   ```

4. **Compile errors throw; diagnostics arrive on the runtime's `stdout`.** There is no exit-code
   check. Capture clang's output with the `stdout` option and surface it as the error message.

5. **Diagnostics are ANSI-coloured.** `-fcolor-diagnostics` is hardcoded into the cc1 argv, so message
   text arrives wrapped in SGR escapes. Strip them before display — and before matching on them,
   because the escapes also defeat `compileClang()`'s own `diagnostics` extractor (its regex expects
   `error:` with no colour codes around it, so `result.diagnostics` comes back empty).

6. **Compiling blocks the UI.** Main-thread execution means the editor freezes for the whole compile.
   LiveCodes should run this in a worker with the COOP/COEP headers on the sandbox origin.

## C++ standard library coverage is a real limitation

The compiler is current (LLVM 22.1.8), but the sysroot's libc++ header tree is a trimmed subset —
92 top-level headers, with some internal `__*` headers missing. Measured with `-std=c++23`:

**Available:** `iostream` `algorithm` `numeric` `string` `string_view` `vector` `optional` `variant`
`format` `print` `concepts` `compare` `execution` `atomic` `memory` `mutex` `tuple` `version` `ctime`
and the C headers.

**Not available** (`fatal error: '<x>' file not found`): `span` `ranges` `expected` `source_location`
`numbers` `mdspan` `coroutine` `any` `charconv` `filesystem` `regex` `thread` `chrono` `random`.

`<bit>` is a special case: the umbrella header exists but its internal dependency `__bit/byteswap.h`
is absent, so it fails. Several of the missing headers (`filesystem`, `regex`, `thread`) are absent for
legitimate WASI reasons; the header-only ones (`span`, `ranges`, `expected`, `bit`) are not, and are
worth raising with the producer.

So: a genuine upgrade in *language* and *diagnostics* quality over `@chriskoch/cpp-wasm`, but do not
market it as a full modern libc++. Verify the specific headers your users need.

## How this compares to LiveCodes' current implementation

LiveCodes ships **two** C++ languages, and only one of them is a compiler:

| | LiveCodes `cpp` | LiveCodes `cpp-wasm` | this demo (`@wasm-idle/llvm-core`) |
| --- | --- | --- | --- |
| Runtime | JSCPP — a **JS interpreter** | Clang **8.0.1** → Wasm | Clang **22.1.8** → Wasm |
| LLVM release | n/a (no LLVM) | 2019 (pkg published 2020-12) | 2026 |
| Default `-std` | n/a | none passed → `gnu++14` | `gnu++20` (C++), `gnu11` (C) |
| Compile flags exposed | — | no | yes (`compileArgs`) |
| Usable `-std` range | n/a | C++14 only (argv hardcoded) | C++11 … C++20 |
| Diagnostics | interpreter messages | `Error: ...` string | `file:line:col`, severity |
| Cross-origin isolation | no | no | no (with the stub above) |
| Runs in a Worker | yes | yes | **no — main thread** |
| Assets (unpacked) | tiny | 60.4 MB | 84.6 MB |
| Maintained | — | last publish 2022 | 2026-09 |

The hardcoded argv in `cpp-wasm`'s `shared.js` is:

```
clang -cc1 -emit-obj -disable-free -isysroot / \
  -internal-isystem /include/c++/v1 -internal-isystem /include \
  -internal-isystem /lib/clang/8.0.1/include \
  -ferror-limit 10 -fmessage-length 60 -o test.o -x c++ test.cc
```

Note the absence of `-std=`, so users get **C++14** with no way to opt into a newer standard, and
`/lib/clang/8.0.1/include` pins the Clang 8 resource directory. `cpp-wasm` also throws
`NotImplemented` from `clock_time_get` and `poll_oneoff`, so any program touching time or polling
aborts rather than compiling.

### Upper bound: C++20, not C++23

`compileArgs` does override the default standard (verified), and the language modes you can actually
use are narrower than "Clang 22" suggests. Compiling `#include <iostream>` across standards:

```
(default = gnu++20) => OK      -std=c++11 => OK     -std=c++14 => OK
-std=c++17          => OK      -std=c++20 => OK     -std=c++23 => FAIL
-std=gnu++17        => OK      -std=gnu++23 => FAIL
```

C++23 mode fails inside libc++ itself, not on user code: `<ostream>` gates
`#include <__ostream/print.h>` behind `_LIBCPP_STD_VER >= 23`, and that internal header is absent from
the trimmed sysroot. So the effective ceiling is **C++20** even though the frontend is Clang 22.

### Header counts are misleading — the real story is the locked standard

Raw top-level libc++ header counts in `include/c++/v1/`:

- `cpp-wasm` (Clang 8): **133** headers
- `llvm-core` (Clang 22): **91** headers

On that number the old toolchain wins. But `cpp-wasm` passes no `-std=`, so it compiles everything as
**C++14** (`__cplusplus == 201402`, verified). Most of its extra headers are standard-gated, so they
exist on disk but define nothing. Measured by actually *using* the feature, on both toolchains:

| Feature | `cpp-wasm` 1.0.2 (C++14) | `llvm-core` (C++20) |
| --- | --- | --- |
| `std::optional`, `std::variant` (C++17) | FAIL — *no member named* | **OK** |
| `std::clamp` (C++17) | FAIL — *no member named* | **OK** |
| `std::bit_cast` (C++20) | FAIL — *no member named* | **OK** |
| `std::format` (C++20) | FAIL — header missing | **OK** |
| `std::concepts` (C++20) | FAIL — header missing | **OK** |
| `std::string_view` | OK | OK |
| `std::to_chars` (`<charconv>`) | **OK** | FAIL — header missing |
| `std::mt19937` (`<random>`) | **OK** | FAIL — header missing |
| `std::thread` | compiles, but `hardware_concurrency() == 0` | FAIL — header missing |
| `std::regex` | **backend crash** — `Cannot select` | FAIL — header missing |
| `std::chrono::steady_clock` | FAIL at runtime (`clock_time_get` not implemented) | FAIL at compile time |
| `std::span`, `std::filesystem`, `std::any` | FAIL — *no member named* | FAIL — header missing |
| designated init, `if constexpr` | OK (GNU extension + warning) | OK |
| `__cplusplus` | **201402** (C++14) | **202002** (C++20) |

**9–6 for `llvm-core`** on this matrix — the ranking reverses once you test usage instead of file
presence. Two of `cpp-wasm`'s apparent wins are hollow: its `<thread>` offers no actual threads, and
its `<regex>` doesn't fail cleanly, it crashes the LLVM 8 backend. Its genuine exclusive wins are
`std::to_chars` and `std::mt19937`.

Reproduce the `cpp-wasm` column with `http://localhost:4173/cpp-wasm-probe.html`, which loads
`shared.js` from jsDelivr the same way `lang-cpp-wasm-script.ts` does and drives `window.CPP`
directly.

So the honest framing of the trimmed sysroot is not "LiveCodes would lose libraries" — it is:

- **The new one is better at C++17/20 library features**, because it can actually reach C++20. Six
  headers that are inert in `cpp-wasm` (optional, variant, clamp, bit_cast, format, concepts) work.
- **Two real regressions to check**: `<charconv>` and `<random>` are gone, plus `<thread>`/`<chrono>`
  which were already non-functional. `<chrono>` failing at compile time in the new one is arguably
  better than failing at runtime, but it is still a missing feature.
- `<span>`/`<ranges>`/`<expected>`/`<bit>` missing is **not** a WASI limitation — they are header-only
  and target-independent, so it is worth raising with the producer.
- The ceiling is **C++20**, not C++23 (see above).

Bottom line: the language and diagnostics story improves enormously and the library story is mostly
better too, but **do not delete `cpp-wasm` in the same release**. Ship `llvm-core` as a new language
(or behind a flag), diff real user snippets against both, and only then switch the default.

## LiveCodes integration sketch

- No COOP/COEP needed for normal runs (see gotcha 1). Keep the LLDB debug path, which does need real
  shared memory and cross-origin isolation, behind a separate opt-in.
- Self-host the ~28.7 MB asset graph (or vendor it in your CDN) and pin the SHA-256 receipts; do not
  ship a hardcoded dependency on `seorii.page`.
- Keep one `BrowserClangRuntime` per sandbox worker, lazily created on first C/C++ run. Expect a
  multi-second first compile and ~0.7–3.5 s warm compiles depending on header weight.
- **Move it off the main thread.** Unlike `cpp-wasm` (already in a Worker, via
  `createWorkerFromContent`), this runtime blocks the UI for the whole compile. The existing
  `cpp-wasm` worker plumbing is the natural place to host it, but note the worker needs the asset
  fetches to be CORS-enabled just like the page does.
- `compileLinkRun()` happens to match `cpp-wasm`'s `compileLinkRun()`, and both expose a `memfs`, so
  the existing `lang-cpp-wasm-script.ts` shim is a small diff — but stdin is handled differently
  (`cpp-wasm` uses `memfs.setStdinStr()`, `llvm-core` takes a `stdin()` callback in the runtime
  options), and error/exit-code handling differs.
- Emit `wasm32-wasi` preview 1 modules and run them with `executeBrowserClangArtifact`, which already
  wires stdin, argv, env and a preopened `/` filesystem.
- LLDB source-level debugging exists (`@wasm-idle/llvm-core/debug`, DAP over `SharedArrayBuffer`,
  backed by WAMR) if LiveCodes ever wants breakpoints — but it needs a second, larger asset fetch and
  is currently release-qualified only on desktop Chromium/Linux.

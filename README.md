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

### Using the demo

The demo uses **only the rebuilt toolchain** (full libc++, rebuilt memfs). The upstream one is not
offered: it ships a pruned libc++ that cannot compile most of C++20/23, so serving it would just be a
worse toolchain with no upside.

| Control | What it does |
| --- | --- |
| **Lang** | C++ or C — switches the standard list and the example |
| **Std** | `default` / C++11 … **C++23** (C: `default` / C11 / C17 / C23). Prepended as `-std=`, so the extra Compile args can still override it |
| **Example** | Four C++ samples plus one C sample — see below |
| **Compile args** | Extra clang flags, e.g. `-Wall -O2` |
| **Program args / stdin** | argv and stdin for the compiled program |

The toolchain has to be hosted somewhere reachable. Precedence:

```
?baseUrl=https://cdn.example.com/clang/          # 1. query parameter
window.RUNTIME_BASE_URL = '...'                  # 2. global, set before the module script runs
/clang/                                          # 3. default — relative to the page's own origin
```

The default is **relative**, so the page takes its toolchain from whatever origin is serving it.
`serve.mjs` hosts `/clang/` alongside the page, so `npm start` is all you need — there is no separate
asset server. The base URL must be `http(s)` and must serve exactly these five paths:

```
runtime-manifest.v1.json
bin/memfs.wasm.gz      <- rebuilt (4096 nodes)
bin/clang.wasm.gz
bin/lld.wasm.gz
bin/sysroot.tar.gz     <- rebuilt (full libc++)
```

`serve.mjs` serves the two rebuilt files from `dist/` and proxies the other three from upstream once,
caching them in `.asset-cache/`. It **refuses to serve the upstream memfs/sysroot**, so an unbuilt
`dist/` produces a clear error rather than a silent downgrade to the pruned toolchain. The active host
is shown next to the title, and if the assets can't be reached the output pane says which URL failed
and how to fix it rather than hanging.

To deploy: build the two files, copy all five to a static host / CDN, verify them against
`toolchain.lock.json`, and pass the CDN URL as `?baseUrl=`.

The examples:

| Example | Shows |
| --- | --- |
| C++ — containers & algorithms | `optional`, `format`, `iostream` at C++20 |
| C++20 — ranges & span | `std::views` pipeline, `std::span`, `std::numbers` |
| C++23 — expected, print, charconv | `std::expected`, `std::println`, `std::from_chars` |
| C++20 — `<bit>` (was broken) | `bit_cast`, `popcount`, `bit_ceil` — broken upstream |
| C — qsort over stdin | C path, `scanf`/`qsort` |

**Exceptions are disabled in this toolchain.** `try`/`catch` fails with *cannot use 'try' with
exceptions disabled*, and `-fcxx-exceptions` does **not** reliably fix it — a throwing program with
`<iostream>` still fails to compile, with no diagnostic text. Write non-throwing code (the C++23
example uses `std::from_chars` for this reason). I have not confirmed whether `cpp-wasm` has the same
limitation.

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

You do not need a second server for local work: `serve.mjs` serves `/clang/` from the same origin as
the page, and the default base URL is relative. To exercise a remote host, pass one explicitly:

```
http://localhost:4173/?baseUrl=https://your-cdn.example.com/clang/
```

This is verified against a genuinely separate origin (~29 MB over a second origin). Failures stay
readable — a bad path reports `Failed to load wasm-clang runtime manifest from <url>: 404` rather than
hanging.

If you do serve the assets from another origin, it **must send `Access-Control-Allow-Origin`** when
the page is cross-origin isolated (a CORS response is what COEP accepts); without it the fetch is
blocked. Under the default (non-isolated) mode the page no longer needs COOP/COEP, but a CDN should
send CORS anyway so it works in either mode. `seorii.page` does.

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

LiveCodes ships **two** C++ languages, and only one of them is a compiler.

| | LiveCodes `cpp` | LiveCodes `cpp-wasm` (**current**) | `llvm-core` stock | `llvm-core` **+ rebuild** |
| --- | --- | --- | --- | --- |
| Runtime | JSCPP — **JS interpreter** | Clang **8.0.1** → Wasm | Clang **22.1.8** → Wasm | Clang **22.1.8** → Wasm |
| LLVM release | n/a | 2019 | 2026 | 2026 |
| Package last published | — | **2022** | 2026-09 | — |
| Default `-std` | n/a | none passed → `gnu++14` | `gnu++20` / `gnu11` | `gnu++20` / `gnu11` |
| Usable standards | n/a | **C++14 only** | C++11 … C++20 | **C++11 … C++23** |
| Compile flags exposed | — | no (argv hardcoded) | yes | yes |
| Diagnostics | interpreter msgs | `Error: …` string | `file:line:col` + severity | `file:line:col` + severity |
| libc++ coverage | n/a (interpreter) | 133 top-level headers, **mostly inert at C++14** | 91 headers | **full** (~1104) |
| Runs in a Worker | yes | **yes** | no — main thread | no — main thread |
| COOP/COEP needed | no | no | no (with SAB stub) | no (with SAB stub) |
| Assets on the wire | tiny | 19.2 MB | **28.7 MB** | 28.7 MB (+19 KB) |
| Assets unpacked | tiny | 60.4 MB | 84.6 MB | 84.6 MB |
| Upstream-maintained | — | no (abandoned) | yes | **fork of memfs** |
| Everything below verified compiling | n/a | see table | see table | see table |

Measured feature support (real compiles, same snippets on each):

| Feature | `cpp-wasm` (C++14) | `llvm-core` stock | `llvm-core` + rebuild |
| --- | --- | --- | --- |
| `std::optional` `variant` `clamp` | FAIL — *no member named* | OK | OK |
| `std::bit_cast` | FAIL | **FAIL** (`<bit>` broken) | OK |
| `std::expected` `unexpected` (C++23) | FAIL | FAIL | **OK** |
| `std::print` / `println` (C++23) | FAIL | FAIL | **OK** |
| `<iostream>` under `-std=c++23` | n/a | **FAIL** | **OK** |
| `std::format`, `std::concepts` | FAIL | OK | OK |
| `std::span`, `std::ranges` | FAIL (header inert) | FAIL | **OK** |
| `std::to_chars`, `std::mt19937` | OK | FAIL | **OK** |
| `std::regex` | **LLVM backend crash** | FAIL | **OK** |
| `std::filesystem`, `std::chrono`, `std::thread` | FAIL / runtime-abort | FAIL | **OK** |
| `std::source_location`, `std::any` | FAIL | FAIL | **OK** |
| `iostream`/`vector`/`format`, C | OK | OK | OK (no regressions) |
| `__cplusplus` | **201402** | 202002 | 202002 / 202302 with `-std=c++23` |

`cpp-wasm`'s hardcoded argv has no `-std=` at all, which is why its extra headers are inert: `#include
<span>` succeeds and then `std::span<int>` reports *no member named 'span'*, because the header is
gated to C++20 and there is no way to select C++20. Its `<regex>` does not fail cleanly either — it
crashes the LLVM 8 backend. Counting headers is a poor proxy for what actually works.

### What you actually gain

- **A real upgrade path for language features**: fixed C++14 → C++23. That is the single biggest
  change; `cpp-wasm` users currently cannot even ask for C++17.
- **Usable C++20/23 library**: `span`, `ranges`, `expected`, `print`, `format`, `regex`, `filesystem`,
  `charconv`, `random`, `chrono`, `bit` all work.
- **Actionable diagnostics** — `file:line:col` with severity, instead of an unstructured string.
- **A maintained toolchain** (LLVM 22, published 2026) instead of LLVM 8 frozen in 2020.
- **User-selectable standards and flags** via `compileArgs`.

### What it costs — honestly

- **~1.5× the download** (28.7 MB vs 19.2 MB). Note this is *on the wire*; my rebuild adds only 19 KB.
- **You own a fork.** The memfs rebuild is a modified third-party component that `wasm-llvm` pins as
  an *immutable payload*. LiveCodes would carry it, re-verify it on toolchain bumps, and satisfy
  Apache-2.0 §4(b). That is real, ongoing maintenance — and it exists only because upstream will not
  bump one constant.
- **memfs is shared.** wasm-idle uses the same blob for its Nim toolchain
  (`static/wasm-nim/clang/memfs.wasm.gz` is the same 18,974-byte file). A deployment should scope the
  new memfs to the C/C++ runtime rather than replacing it globally.
- **Main thread.** The stock runtime blocks the UI for the whole compile. `cpp-wasm` already runs in a
  Worker; llvm-core would need the same treatment, and I have **not** proven it works in a Worker.
- **Heavy headers are slow.** `<ranges>`/`<span>` pull in a lot of template machinery — tens of seconds
  each in wasm, versus ~2.6 s for a plain `<iostream>` program. This is inherent to libc++, not to my
  build, but it is a user-visible change.
- **Exceptions are disabled.** `try`/`catch` does not compile, and `-fcxx-exceptions` is not a reliable
  workaround. This is a hard constraint on user code and should be checked against `cpp-wasm` before
  claiming feature parity — I did not test whether `cpp-wasm` has the same limitation.
- **Self-hosting the assets.** The stock default points at `seorii.page` (a demo host, CORS-enabled).
  Production should mirror the ~28.7 MB and pin the SHA-256 receipts.

### What I did not test (do not assume)

My verification is a **feature matrix plus manual runs**, not a test suite. Untested:

- Multi-file workspaces, and the trace/LLDB debug paths (LLDB uses a separate WAMR/LLDB asset set).
- stdin/stdout edge cases beyond simple line input; EOF and large-input behaviour.
- Memory pressure and long-running programs; the 4096-node memfs is not soak-tested.
- Cancellation, concurrency (several playgrounds at once), and worker execution.
- Anything under the COOP/COEP-isolated mode the debug runtime wants.
- Exceptions. They are disabled (see above); `-fcxx-exceptions` is not a reliable workaround, and I
  did not determine whether that is a toolchain build choice or a libc++abi limitation.

### Recommendation

The demo here commits to the rebuilt toolchain — that decision is made. What remains for a real
deployment:

1. **Push the one-line fix upstream.** The rebuild exists only because `MAX_NODES` is 1024. Report to
   `wasm-llvm` with the finding that the shipped sysroot is a *pure prune* (825/825 files identical to
   `llvmorg-22.1.0`) and that memfs is the sole constraint. If they bump it, this fork disappears.
2. **Self-host the assets and pin them.** Copy the ~29 MB from `dist/` plus the three proxied files
   to a static host / CDN, verify against `toolchain.lock.json`, and serve with CORS. `serve.mjs`'s
   same-origin hosting is for development.
3. **Scope the new memfs to C/C++.** wasm-idle uses the same blob for its Nim toolchain; do not
   replace it globally.
4. **Move compilation into a Worker.** It currently blocks the main thread, and `cpp-wasm` already runs
   in one.
5. **Ship it as a new language first**, not as a silent replacement — diff real user snippets against
   `cpp-wasm`, and check the exceptions question above before claiming parity.
6. **Keep `cpp` (JSCPP) alone** — it is an interpreter for quick snippets, a different tool with a
   different niche, and not a compiler to be replaced.


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

### Fixing the missing headers (a working partial fix, shipped in `dist/`)

The trim is recoverable. Verified against `llvm-project` tag **`llvmorg-22.1.0`** (the release whose
`_LIBCPP_VERSION` is `220100`, matching the sysroot exactly):

- 825 files are shared with upstream, and **all 825 are byte-identical** (LF-normalised; the apparent
  differences were CRLF from a Windows checkout). **Zero** were modified.
- 849 upstream files are missing.

So the shipped sysroot is a **pure prune of upstream libc++, with no patches** — restoring files
cannot introduce a version skew against the prebuilt `libc++.a` already in `lib/`.

The catch is memfs. Its node table is fixed at **1019 nodes** (measured: `memfs.wasm` traps on
`Assertion failed: node < MAX_NODES`, and payload size is irrelevant — 1019 × 256 KiB = 254 MiB mounts
fine). The stock sysroot already uses **978**, leaving **41 free**. The full libc++ needs ~1310, so a
complete restore is impossible without a rebuilt memfs.

But `--features` mode fits a real fix into the budget. `dist/sysroot.tar.gz` restores **10 files for
11 nodes**, and it was verified compiling in Chromium against the live toolchain:

| | before | after |
| --- | --- | --- |
| `<bit>` (`bit_cast`, `byteswap`) | **broken** — `__bit/byteswap.h` missing | works |
| `std::expected` / `std::unexpected` | no | works |
| `std::print` / `std::println` | no | works |
| `<iostream>` under `-std=c++23` | **broken** — `__ostream/print.h` missing | works |
| `std::numbers` | no | works |
| `std::source_location` | no | works |
| `<typeindex>` | no | works |
| `iostream`/`vector`/`format`/`optional`/`variant`, C | works | works (no regressions) |
| `std::span`, `std::ranges`, `<charconv>`, `<random>` | no | **still no** |

`-std=c++23` now works. `__ostream/print.h` is the single header that unblocked it — I found it by
iterating against the live compiler rather than by static analysis, because the include graph
over-approximates badly (it ignores `#if` guards: the closure of `__ostream/print.h` is 46 files, of
which exactly 1 is needed).

`std::span` (59 nodes) and `std::ranges` (93) do **not** fit in the remaining budget — that genuinely
requires a bigger memfs.

Rebuild it yourself (deterministic):

```bash
git clone --filter=blob:none --no-checkout --depth 1 --branch llvmorg-22.1.0 \
  https://github.com/llvm/llvm-project.git llvm-src
git -C llvm-src sparse-checkout init --cone
git -C llvm-src sparse-checkout set libcxx/include
git -C llvm-src checkout
tar -xzf <upstream>/sysroot.tar.gz -C wfinal
node build-sysroot.mjs --libcxx llvm-src/libcxx/include --sysroot wfinal --exact \
  --features bit,expected,numbers,source_location,typeindex,__bit/byteswap.h,\
__expected/bad_expected_access.h,__expected/expected.h,__expected/unexpect.h,\
__expected/unexpected.h,__ostream/print.h --out dist/sysroot.tar.gz
```

Serve `dist/sysroot.tar.gz` as `bin/sysroot.tar.gz` alongside the other assets. `serve.mjs` does this
automatically when the file is in `dist/`.

Note the build-time header files (`CMakeLists.txt`, `__config_site.in`, `module.modulemap.in`) are
skipped, and `__config_site` is never overwritten — it is generated for WASI and must stay.

### The remaining blocker, and the real fix

Everything above is a workaround inside a fixed budget. The genuine fix is a memfs with a larger node
table — **and it is rebuildable.** See the next section; this is kept for context on why the stock
toolchain ships pruned.

memfs's node table is a **static** array, so it must be recompiled to hold more files. Two things I
first got wrong and later corrected by reading the source:

- There is no separate inode table to grow. `g_nodes[MAX_NODES]` is 96 B/slot; the other static array
  is `g_fdescs[MAX_FDS]` (48 B/slot), indexed by **fd**, not inode, and `MAX_FDS` is already 4096.
- So the whole capacity problem is one constant: `#define MAX_NODES 1024`.

## Rebuilding memfs (this is the actual fix, verified)

I found the source. `binji/wasm-clang`'s README points at
`binji/llvm-project/binji/memfs.c`, and that repo's `memfs` blob is byte-identical (345,442 bytes) to
the one `@wasm-idle/llvm-core` and `@chriskoch/cpp-wasm` ship. So the published module is exactly
this file, built with clang 9.0.0.

```bash
# source (4 files) — hashes pinned in toolchain.lock.json
curl -O https://raw.githubusercontent.com/binji/llvm-project/master/binji/memfs.c
curl -O https://raw.githubusercontent.com/binji/llvm-project/master/binji/stb_sprintf.h
curl -O https://raw.githubusercontent.com/binji/llvm-project/master/binji/Makefile
curl -O https://raw.githubusercontent.com/binji/llvm-project/master/binji/imports.txt

# toolchain: wasi-sdk 26.0, ~543 MB — version AND sha256 pinned in toolchain.lock.json
curl -L -o wasi-sdk.tar.gz \
  https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-26/wasi-sdk-26.0-x86_64-windows.tar.gz
tar -xzf wasi-sdk.tar.gz -C .tools

node build-memfs.mjs --src . --wasi-sdk .tools/wasi-sdk-26.0-x86_64-windows \
  --nodes 4096 --out memfs.wasm
```

### Pinning

`toolchain.lock.json` records every build input and its SHA-256, and `build-memfs.mjs` **refuses to
build** if a source file does not match. It also compares the produced module against the pinned
output, so a toolchain bump is caught immediately:

```
pinned source files verified: 4
  all required exports present
  imports are env.* only (runtime-compatible)
  reproducibility: MATCHES lock (cbca9e27ceafbca8…)
clang: clang version 20.1.8 (https://github.com/llvm/llvm-project 87f0227c…)
  matches lock
```

The build is **bit-for-bit reproducible** — rebuilding from the pinned inputs reproduces
`dist/memfs.wasm.gz` exactly (gzip embeds no timestamp). Check without rebuilding:

```bash
node build-memfs.mjs --verify-only --src .
```

Pinned: wasi-sdk **26.0** (clang 20.1.8, LLVM `87f0227cb60147a26a1eeb4fb06e3b505e9c7261`), sysroot from
LLVM tag **`llvmorg-22.1.0`** (`_LIBCPP_VERSION 220100`), and the four memfs source files.

**Licensing.** `memfs.c` carries no per-file license header. The containing repos are Apache-2.0
(`binji/wasm-clang`) and Apache-2.0 WITH LLVM-exception (`binji/llvm-project`); `stb_sprintf.h` is stb
(public domain / MIT). Since this build **modifies** memfs.c, Apache-2.0 §4(b) applies — ship a notice
that the file was changed. Confirm with the author before relying on it, as the file itself is unmarked.

`build-memfs.mjs` applies the patches a modern toolchain needs. memfs.c targets clang 9 /
wasi-libc of 2019 and WASI preview1 was renamed afterwards — all mechanical, no behaviour changes:

| | old | new |
| --- | --- | --- |
| header | `<wasi/core.h>` | `<wasi/api.h>` |
| capacity | `MAX_NODES 1024` | `MAX_NODES 4096` |
| errno | `__WASI_EINVAL` | `__WASI_ERRNO_INVAL` |
| fd flags | `__WASI_FDFLAG_APPEND` | `__WASI_FDFLAGS_APPEND` |
| open flags | `__WASI_O_CREAT` | `__WASI_OFLAGS_CREAT` |
| filestat | `st_dev` `st_ino` `st_filetype` `st_nlink` `st_size` … | `dev` `ino` `filetype` `nlink` `size` … |
| prestat | `pr_type` | `tag` |
| `abort()` | reaches `__wasi_proc_exit` → a `wasi_snapshot_preview1` import | `__builtin_trap()` |

That last row matters: the runtime only satisfies `env.*` imports, so libc `abort()` would make the
module fail to instantiate. The script asserts the final module imports **only** the five `env.*`
functions before it will emit it.

**Result** — measured by driving the module directly, the ceiling goes from 1019 to **4091 nodes**.
`dist/memfs.wasm.gz` (38 KiB) plus `dist/sysroot.tar.gz` (5.1 MB, full libc++: 279 files restored,
296 nodes) were verified in Chromium against the live toolchain:

```
OK std::span        OK std::ranges      OK std::expected   OK std::println
OK std::bit_cast    OK std::to_chars    OK std::mt19937    OK std::regex
OK std::any         OK std::filesystem  OK std::chrono     OK std::thread header
OK std::source_location                OK iostream under -std=c++23
OK regressions: C++20 iostream/vector, optional/variant/format, C program
```

**17/17 — every previously-missing feature now compiles, including C++23, with no regressions.**

Deploy by serving these as `bin/memfs.wasm.gz` and `bin/sysroot.tar.gz` alongside the other assets.
`serve.mjs` picks them up from `dist/` automatically for local work; for production copy all five to
your own host and pass `?baseUrl=`.

Two notes for whoever ships this:

- **Compile cost.** Full libc++ makes the heavy C++20 headers compilable but slow — `<ranges>`/`<span>`
  pull in a lot of template machinery and take tens of seconds each in wasm (a plain `<iostream>`
  program is ~2.6 s). Budget for that, and keep long compiles off the main thread.
- **Toolchain drift.** memfs.c is a 2020 file being built with a 2025 toolchain via mechanical renames.
  It works and is verified, but pin the wasi-sdk version and re-run the verification when bumping it.

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

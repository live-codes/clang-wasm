# Third-party notices

The code written for this repository is **MIT** (see `LICENSE`): the demo page, its worker and
server, the build scripts, and the package in `packages/clang-wasm`.

The binaries that live alongside it are not. This file covers the repository as a whole;
`packages/clang-wasm/THIRD-PARTY-NOTICES.md` covers the seven assets the npm package ships, which is a
subset of what is here.

## `.asset-cache/` - the mirror kept in version control

This directory is normally a cache: `serve.mjs` proxies each asset from upstream once and writes it
here, and it is where the assets come from if the upstream host ever disappears. It is committed on
purpose for that last reason.

| Path | What it is | License |
| --- | --- | --- |
| `bin/clang.wasm.gz` | Clang 22.1.8 compiled to WebAssembly | Apache-2.0 WITH LLVM-exception |
| `bin/lld.wasm.gz` | `wasm-ld` from the same build | Apache-2.0 WITH LLVM-exception |
| `runtime-manifest.v1.json` | Toolchain metadata from the wasm-llvm project | no separate license statement in the file |
| `objective-c/libobjc.a/body` | GNUstep libobjc2 | MIT |
| `objective-c/headers.json/body` | libobjc2 headers | MIT |
| `objective-c/libffi.a/body` | libffi, for the Foundation path | MIT |
| `objective-c/libgnustep-base.a/body` | GNUstep Base, static archive | **LGPL-2.1-or-later** |
| `objective-c/libgnustep-base.o/body` | GNUstep Base, one object file | **LGPL-2.1-or-later** |
| `objective-c/foundation-headers.json/body` | GNUstep Base headers, plus the system and third-party headers bundled with them | **mixed**, 168 of 262 files LGPL-2.1-or-later |

`<asset>/meta.json` beside each of those records what the proxy stored, not third-party content.

### The LGPL files, and what keeping them here obliges you to

**This does not change the license of anything of ours.** The repository stays MIT. The LGPL attaches
to those files, not to the work they sit next to - putting LGPL binaries in an MIT repository is
aggregation, not a relicensing, and it does not make any of our code, or the npm package, LGPL.

It does, however, mean the repository is a redistributor of LGPL code, which comes with
obligations - and they are not the same for the two kinds of file here.

**What the files actually are.** `libgnustep-base.a` and `libgnustep-base.o` are GNUstep Base in
object-code form. `foundation-headers.json` is source: a JSON map of header path to header text.
The license is **LGPL-2.1-or-later** - GNUstep Base's `COPYING.LIB` is the LGPL 2.1 text, and 168 of
the 262 headers in that JSON carry the notice granting "either version 2 of the License, or (at your
option) any later version". None of them carries a linking exception, so the LGPL's own terms are the
whole story. The remaining 94 files are system and third-party headers bundled alongside, so treat
that JSON as mixed rather than as a single-licensed artifact.

**What that requires of us, and where it stands.**

- **Section 1** - keep the copyright and warranty notices intact, and **ship a copy of the LGPL**. Both
  are met: the headers are verbatim upstream copies with their notices, and the licence text is at
  `LICENSES/LGPL-2.1.txt`.
- **Section 4** - redistributing the object-code files means making the **complete corresponding
  machine-readable source** available from the same place. The upstream source is now committed at
  `third-party-sources/gnustep-base-1.31.1.tar.gz`, the exact release the binaries were built from,
  which was not recorded anywhere until it was read out of them (see
  [`third-party-sources/README.md`](third-party-sources/README.md) for how, and for the verification).
  **This is met for upstream GNUstep Base and not for the producer's own additions**, which are not
  public - see the gap below.
- **Section 6** - applies to anyone who links the archive into a program they then distribute. That is
  the case that made the npm package leave GNUstep Base out entirely.

**The one remaining gap.** `libgnustep-base.a` is not a pure build of that tarball: one of its 219
object members is the producer's `wasm_llvm_foundation_support.o`, and the exact `configure` flags and
any patches are in a build repository that is not public. So what is shipped is the upstream
corresponding source, not a recipe that reproduces the archive byte for byte. The producer is the only
source for the rest (`seorii`, via `@wasm-idle/llvm-core` and the asset host the packages fetch from),
and anything they provide belongs in `third-party-sources/`.

**Written offer.** Should the committed source ever be insufficient or incomplete, both this
repository and the maintainer of the npm package will supply it on request, and will pass on whatever
further material is obtained from the producer, for as long as this repository exists.

**What this does not affect.** The npm package ships none of these files and stays MIT; the demo
fetches none of them either, because Foundation does not work with this toolchain. All of this changes
only what the committed cache redistributes.

None of this is legal advice. If it matters to you, have someone qualified read it.

## Built here, not third-party

- `dist/memfs.wasm.gz` is **rebuilt and modified** from `binji/llvm-project`'s `memfs.c`. That comes
  with an Apache-2.0 section 4(b) notice, which is in
  `packages/clang-wasm/THIRD-PARTY-NOTICES.md` (see "memfs modification notice") and in
  `toolchain.lock.json`. `dist/sysroot.tar.gz` is the producer's sysroot with the pruned libc++
  headers restored.
- `vendor/llvm-core-clang.js` is generated by `npm run bundle` and is a build of
  `@wasm-idle/llvm-core` (MIT AND Apache-2.0 WITH LLVM-exception). It is not committed.

## What the demo loads

The page pulls `@wasm-idle/llvm-core` from esm.sh unless it is bundled, and the toolchain assets from
`/clang/` on its own origin. Nothing else is fetched at runtime.

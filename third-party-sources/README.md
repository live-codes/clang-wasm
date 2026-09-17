# Third-party sources

This directory holds source, not binaries, and it is here for one licence reason: `.asset-cache/`
redistributes GNUstep Base, which is LGPL-2.1-or-later, and the LGPL asks for the corresponding
source to be available from the same place as the object code (sections 4 and 6). See
[THIRD-PARTY-NOTICES.md](../THIRD-PARTY-NOTICES.md) for the obligation itself and `LICENSES/LGPL-2.1.txt`
for the licence text.

Nothing here is compiled or used by anything in the repository. It is a compliance artifact, and it
exists so that the LGPL files in `.asset-cache/` can stay there.

## What is here

| File | What it is | SHA-256 |
| --- | --- | --- |
| `gnustep-base-1.31.1.tar.gz` | The GNUstep Base 1.31.1 release, exactly as published: <https://github.com/gnustep/libs-base/releases/download/base-1_31_1/gnustep-base-1.31.1.tar.gz> (tag `base-1_31_1`, 3,831,129 bytes) | `e7546f1c978a7c75b676953a360194a61e921cb45a4804497b4f346a460c545cd` |
| `gnustep-base-1.31.1-configured/` | The five GNUstep Base headers that only exist after `configure` has run, taken from `foundation-headers.json` | see below |

The five configured headers are `config.h`, `GSConfig.h`, `GNUstepBase/config.h`,
`GNUstepBase/GSConfig.h` and `GNUstepBase/preface.h`. The tarball has the `.in` templates for four of
them; `preface.h` carries the version macros and is written during the build. They are included
because they are what the compiler actually read, and because `GSConfig.h` records the configuration
the library was built with - which is the first thing you would need to rebuild it.

## How the version was established

Nothing in the published assets says which GNUstep Base they were built from, so it was read out of
them:

- The shipped `GNUstepBase/preface.h` defines `GNUSTEP_BASE_VERSION 13101`, `GNUSTEP_BASE_MAJOR_VERSION 1`,
  `GNUSTEP_BASE_MINOR_VERSION 31`, `GNUSTEP_BASE_SUBMINOR_VERSION 1` - that is 1.31.1.
- `libgnustep-base.a` contains the string `1.31` and a toolchain marker,
  `clang_22.1.0-wasi-sdk (https://github.com/llvm/llvm-project 4434dabb69916856b824f68a64b029c67175e532)`.
- It also contains a build path, `/data/wasm-llvm-producer-build/objective-c/foundation/...`, which
  names the producer.

## How well it matches

Every header in `foundation-headers.json` was compared against this tarball, byte for byte after
normalising line endings:

```
shipped headers:                     262
byte-identical to the 1.31.1 source: 201
differ:                                0
configure-generated, included above:   5
from other projects:                  56
```

So the GNUstep headers are verbatim upstream with their notices intact, and none of them was
modified. The 56 that are not from this tarball are other projects' headers that GNUstep needs to
build against and that the producer bundled alongside: libffi 3.6.0 (`ffi.h`, `ffitarget.h`,
`ffi_common.h`, `fficonfig.h`), the blocks runtime (`Block.h`, `objc/blocks_runtime.h`), libdispatch
(`dispatch/dispatch.h`), curl (`curl/curl.h`), and libc/system headers (`stdio.h`, `stdlib.h`,
`sys/*`, `netinet/*`, `arpa/*`, and so on). All of those are permissive licences; none of them is
copyleft, and none is covered by the LGPL obligation this directory exists for.

## What is not here, and why

`libgnustep-base.a` is not a pure build of the tarball. It has 219 object members, and one of them is
the producer's own: `wasm_llvm_foundation_support.o`, whose symbols include
`GSWasmLlvmInitializeNSStringCluster`. Its source, the exact `configure` flags, and any patches the
producer applied are in the `wasm-llvm` build repository, which is not public - it is referenced by
`@wasm-idle/llvm-core`'s README but does not appear on GitHub or npm, and the npm package publishes
no repository URL.

**So this is the upstream corresponding source, not a byte-for-byte recipe for the binary.** That is
the honest limit of what can be obtained from here, and it is worth stating plainly rather than
implying a rebuild that would not reproduce the archive.

If you need the missing part, the route is the producer: the assets come from
`https://seorii.page/wasm-idle/wasm-objectivec/` and the package that consumes them is
`@wasm-idle/llvm-core`, maintained by `seorii`. Any answer they give belongs in this directory.

## How to check any of this

```bash
sha256sum gnustep-base-1.31.1.tar.gz   # expect e7546f1c978a7c75b676953a360194a61e921cb45a4804497b4f346a460c545cd
tar -tzf gnustep-base-1.31.1.tar.gz | head
```

The comparison above is reproducible: decompress `foundation-headers.json` from `.asset-cache/`,
and for each key compare `Source/<key>` or `Headers/<key>` inside the tarball.

// Flags the package has to add to clang's own arguments, kept in a module with no imports.
//
// The import graph matters here, not just the values. The low-level `/toolchain` entry is for pages
// that resolve bare specifiers themselves - an import map, or a CDN - and every bare specifier its
// graph reaches is one more thing such a page has to map. `compile.js` pulls
// `@wasm-idle/llvm-core/core/clang-profile`, a deep subpath such a page is unlikely to have mapped, so
// a constant that lives there cannot be re-exported from `/toolchain` without moving that requirement
// onto it. Anything in this file is safe for a driver to reach.

// What a direct `clang -cc1` invocation does not get.
//
// The runtime drives clang's frontend itself rather than going through the driver, and some defaults
// the driver supplies are not frontend defaults. The one that has caught a real language out is
// `__GNUC__`: `clang -cc1` leaves it undefined, so any C that asks `#if defined(__GNUC__)` quietly
// takes its fallback branch instead of the GNU one.
//
// Nim's nimbase.h is one of those, and it matters. Without `__GNUC__` it defines
// `N_INLINE(rettype, name)` as `rettype __inline name`, and the wasi-libc `features.h` reached by
// `<string.h>` rewrites `__inline` to the standard `inline` keyword - a syntax error in that
// position, because the parser is inside the declarator by then.
//
// 4.2.1 is what clang's driver passes by default, so this only tells the frontend what it would have
// been told anyway. It comes first, so a caller's own `compileArgs` can still override it.
export const CLANG_DRIVER_DEFAULT_ARGS = Object.freeze(['-fgnuc-version=4.2.1']);

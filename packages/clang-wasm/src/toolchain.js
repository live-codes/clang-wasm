// The low-level entry for anything without a filesystem, so `baseUrl` is required - the same rule,
// and the same reason, as `index.js`.
import { createToolchainFactory } from './toolchain-core.js';

const { createToolchain } = createToolchainFactory({ packaged: null });

// What `captureCompilerOutput` returns is clang's and wasm-ld's output mixed with the runtime's own
// log lines and ANSI colour; this is the package's own filter for it, so a driver does not have to
// work out which lines are the runtime's.
export { compilerDiagnostics } from './output.js';
// The flags a driver's own clang invocation needs in order to behave like a driver-invoked compile.
// A driver translates its language to C and compiles the result itself, so it is the driver that has
// to pass these. They are re-exported from `clang-flags.js` rather than `compile.js` so that this
// entry does not reach the four-language drivers at all: `compile.js` needs
// `@wasm-idle/llvm-core/core/clang-profile`, and a page that resolves specifiers itself would have to
// map that module just to import the toolchain.
export { CLANG_DRIVER_DEFAULT_ARGS } from './clang-flags.js';
export { createToolchain };

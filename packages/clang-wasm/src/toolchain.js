// The low-level entry for anything without a filesystem, so `baseUrl` is required - the same rule,
// and the same reason, as `index.js`.
import { createToolchainFactory } from './toolchain-core.js';

const { createToolchain } = createToolchainFactory({ packaged: null });

// What `captureCompilerOutput` returns is clang's and wasm-ld's output mixed with the runtime's own
// log lines and ANSI colour; this is the package's own filter for it, so a driver does not have to
// work out which lines are the runtime's.
export { compilerDiagnostics } from './output.js';
export { createToolchain };

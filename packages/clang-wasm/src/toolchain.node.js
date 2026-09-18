// The low-level entry for Node, where the packaged assets can be read off disk, so `baseUrl` is
// optional - the same rule as `index.node.js`.
import { createToolchainFactory } from './toolchain-core.js';
import { packagedAssets } from './packaged.node.js';

const { createToolchain } = createToolchainFactory({ packaged: packagedAssets });

export { compilerDiagnostics } from './output.js';
// From the same leaf module as the browser entry, so the two cannot drift - see the note there.
export { CLANG_DRIVER_DEFAULT_ARGS } from './clang-flags.js';
export { createToolchain };

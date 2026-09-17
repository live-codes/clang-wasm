// Single bundle entry for the demo's `?local=1` path. It carries both package entry points, so one
// file serves the Clang runtime and the Objective-C worker installer: the shared Clang runtime is
// deduplicated by the bundler, and `installObjectiveCWorker` is the only name the second entry
// adds. The CDN default uses the two entry points directly instead.
export * from '@wasm-idle/llvm-core/clang';
export * from '@wasm-idle/llvm-core/objective-c';

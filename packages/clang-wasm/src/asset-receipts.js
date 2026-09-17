// Receipts for the assets this package ships in `assets/`, keyed by their path under it.
//
// They are pinned here because a consumer only has the package: there is nothing to read a lock file
// from. Every one of them is checked before the bytes are used - in packaged mode for all seven, and
// in hosted mode for the Objective-C two, which are the ones this package fetches itself. The
// compiler assets fetched by the runtime's own loader cannot be intercepted, so a host is trusted for
// those.
//
// A test asserts these agree with `toolchain.lock.json` in the repository this package is developed
// in, so the two cannot drift.

export const ASSET_RECEIPTS = Object.freeze({
	'runtime-manifest.v1.json': Object.freeze({
		bytes: 876,
		sha256: '1420808d0391ff2d8a2fdf2a9f6bbce8f728e06b1ed1651029ed80b226101444'
	}),
	'bin/memfs.wasm.gz': Object.freeze({
		bytes: 38702,
		sha256: 'cbca9e27ceafbca840603a39fc71e4f83bfb085237c8eab84fd0401ac76806c7'
	}),
	'bin/clang.wasm.gz': Object.freeze({
		bytes: 15721977,
		sha256: 'b1174438d9a67b7ff11e623541b9a0572c024a9e798084b9b021dd9da2da0874'
	}),
	'bin/lld.wasm.gz': Object.freeze({
		bytes: 7837837,
		sha256: 'f842a9b5df3c6d326f0260bfd313c11c2e22bc8b8ae0387deede9a4af55779cd'
	}),
	'bin/sysroot.tar.gz': Object.freeze({
		bytes: 5334358,
		sha256: '71c0ca54a2153bba59b4a80f68d2030142cc78aad48e76c0b73493cf5078dd19'
	}),
	'objective-c/libobjc.a': Object.freeze({
		bytes: 190272,
		sha256: '1dde20d4ce78eed271ab725062ef25f1923b20d51384943c9b8f7177eb1fc2d9'
	}),
	'objective-c/headers.json': Object.freeze({
		bytes: 83231,
		sha256: '64bf5a09feffa612e6f82cfc52f3d6a9c5e4fc3064c3824c24aeea59cb544d8e'
	})
});

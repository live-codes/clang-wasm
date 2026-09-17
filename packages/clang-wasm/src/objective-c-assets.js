// The Objective-C runtime this package links.
//
// The names are the six the upstream package's own `/objective-c` entry point declares. The receipts
// are pinned here because a consumer of this package only has a base URL - there is nothing to read
// a lock file from - and they are the same ones the upstream app ships. Only `libobjc.a` and
// `headers.json` are ever fetched; the other four belong to the Foundation path this package does
// not use, and are listed so the map matches the asset set a deployment has to mirror.
//
// A test asserts these agree with toolchain.lock.json in the repository this package is developed in,
// so the two cannot drift.

export const OBJECTIVE_C_ASSET_RECEIPTS = Object.freeze({
	'libobjc.a': Object.freeze({
		bytes: 190272,
		sha256: '1dde20d4ce78eed271ab725062ef25f1923b20d51384943c9b8f7177eb1fc2d9'
	}),
	'headers.json': Object.freeze({
		bytes: 83231,
		sha256: '64bf5a09feffa612e6f82cfc52f3d6a9c5e4fc3064c3824c24aeea59cb544d8e'
	}),
	'libgnustep-base.a': Object.freeze({
		bytes: 15220588,
		sha256: '1915b83476f7a520d8ae85c2e02603d245ba6bfc96d7e2593a552d079a7c4526'
	}),
	'libgnustep-base.o': Object.freeze({
		bytes: 13557664,
		sha256: '4022983db158350fe82ccd8c6eaf1c9e1305ee9233a6d7e3f9d5508a4f937aa7'
	}),
	'foundation-headers.json': Object.freeze({
		bytes: 1581430,
		sha256: '116eaafa65f0bf65d64bd4143abc5c00aea54de19fe4bf9e4cbe88965db9d719'
	}),
	'libffi.a': Object.freeze({
		bytes: 4966,
		sha256: 'dcdf2754536c93dcadca640a26fe4eb415ee58c15db7a53072e0f18f322e2cbd'
	})
});

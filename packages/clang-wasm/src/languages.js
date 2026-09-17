// The languages the package runs, and the standards each one can be compiled at.
//
// `compilerLanguage` is what the Clang runtime calls the mode. The standards are the same choices the
// demo's Std dropdown offers, and the same `gnu*` spellings on purpose: passing strict `-std=c++NN`
// would reject the GNU extensions clang accepts by default, so those are left to `compileArgs` rather
// than quietly rewritten here.
const C_STANDARDS = Object.freeze(['gnu11', 'gnu17', 'gnu23']);
const CPP_STANDARDS = Object.freeze(['gnu++11', 'gnu++14', 'gnu++17', 'gnu++20', 'gnu++23']);

const LANGUAGES = {
	c: {
		fileName: 'main.c',
		compilerLanguage: 'C',
		objectiveC: false,
		standards: C_STANDARDS,
		defaultStandard: 'gnu23'
	},
	cpp: {
		fileName: 'main.cpp',
		compilerLanguage: 'CPP',
		objectiveC: false,
		standards: CPP_STANDARDS,
		defaultStandard: 'gnu++23'
	},
	objc: {
		fileName: 'main.m',
		compilerLanguage: 'objective-c',
		objectiveC: true,
		standards: C_STANDARDS,
		defaultStandard: 'gnu23'
	},
	objcpp: {
		fileName: 'main.mm',
		compilerLanguage: 'objective-c++',
		objectiveC: true,
		standards: CPP_STANDARDS,
		defaultStandard: 'gnu++23'
	}
};

const ALIASES = new Map([
	['c', 'c'],
	['cpp', 'cpp'],
	['c++', 'cpp'],
	['cc', 'cpp'],
	['cxx', 'cpp'],
	['objc', 'objc'],
	['objective-c', 'objc'],
	['objectivec', 'objc'],
	['objcpp', 'objcpp'],
	['objc++', 'objcpp'],
	['objective-c++', 'objcpp'],
	['objectivec++', 'objcpp']
]);

export const LANGUAGE_IDS = Object.freeze(Object.keys(LANGUAGES));

export function resolveLanguage(value) {
	const id = ALIASES.get(String(value ?? '').trim().toLowerCase());
	if (!id) {
		throw new Error(
			`Unknown language ${JSON.stringify(value)}. Expected one of: ${LANGUAGE_IDS.join(', ')}.`
		);
	}
	return Object.freeze({ id, ...LANGUAGES[id] });
}

/** The `std` values a language accepts, for building a picker before creating a compiler. */
export const standardsFor = (language) => [...resolveLanguage(language).standards];

// `null` means pass no `-std=` at all, which leaves whatever the compiler defaults to.
export function resolveStd(language, std) {
	if (std == null) return null;
	if (!language.standards.includes(std)) {
		throw new Error(
			`std must be null or one of ${language.standards.join(', ')} for ${language.id} ` +
				`(got ${JSON.stringify(std)}). Pass a different -std= through compileArgs if you need one.`
		);
	}
	return std;
}

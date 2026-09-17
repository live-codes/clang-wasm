// `-fcolor-diagnostics` is hardcoded into the runtime's clang invocation, so both the compiler's
// diagnostics and the runtime's own log lines arrive wrapped in SGR escapes. Those escapes also
// defeat anything matching on the text, so everything returned to a caller goes through here.
const ANSI = /\u001b\[[0-9;]*[A-Za-z]/g;

const stripAnsi = (text) => String(text ?? '').replace(ANSI, '');

// The runtime logs its own steps to the same stream the compiler writes to - `> Fetching and
// compiling …`, `> wasm-ld …`, a bare `done.` - and it has to, because with logging off the linker's
// errors are not forwarded at all. So diagnostics are what is left once those lines are dropped.
const RUNTIME_LINE = /^\s*>|^\s*done\.?\s*$/;

export const compilerDiagnostics = (raw) =>
	stripAnsi(raw)
		.split(/\r?\n/)
		.map((line) => line.replace(/\s+$/, ''))
		.filter((line) => line && !RUNTIME_LINE.test(line));

// Program output keeps its formatting, so only the ANSI escapes go.
export const cleanProgramOutput = (text) => stripAnsi(text);

// stdin is read in chunks: whatever is handed over is consumed before the next read, and `null`
// means EOF. The whole input is offered once, so a program that reads more than it was given sees
// EOF rather than a repeat of its own input.
export const makeStdin = (input) => {
	if (input == null || input.length === 0) return () => null;
	let sent = false;
	return () => {
		if (sent) return null;
		sent = true;
		return input;
	};
};

// Funniest One-Line Out-of-Office Reply — make.fun entry.
//
// The program composes exactly one out-of-office reply and writes it to
// /output/entry.txt. The reply is deterministic: no randomness, no clock,
// no input, so every run produces byte-identical output.
//
// The line's angle: the auto-reply itself is the joke. The person is away
// and has left their own auto-reply in charge — and the auto-reply is
// already better at the job than they are. It reads like a real away
// message someone would gladly switch on, it needs no setup, and the
// punchline lands on the last words. No beach, no inbox, no "limited
// access to email" — the twist is on the auto-reply mechanism itself.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The two clauses of the reply, kept separate so each can be checked on
// its own before they are joined.
const SETUP = "Out of office.";
const PUNCH =
  "I've left my auto-reply in charge, and it's already better at my job than I am.";

function composeReply(setup: string, punch: string): string {
  const parts = [setup.trim(), punch.trim()].filter((p) => p.length > 0);
  return parts.join(" ");
}

function validateReply(line: string): void {
  // The sealed gate: 1 to 160 UTF-8 characters, not only white space,
  // a single line. Count code points, not UTF-16 units or bytes.
  const chars = [...line];
  if (chars.length < 1 || chars.length > 160) {
    throw new Error(
      `entry is ${chars.length} characters, outside the 1-160 gate`,
    );
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must stay on one line");
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (line !== line.trim()) {
    throw new Error("entry must not start or end with white space");
  }
}

const ENTRY = composeReply(SETUP, PUNCH);
validateReply(ENTRY);

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUT_PATH = `${OUT_DIR}/entry.txt`;

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_PATH, ENTRY, "utf8");

// Read back and confirm the file holds exactly the validated text.
const written = readFileSync(OUT_PATH, "utf8");
if (written !== ENTRY) {
  throw new Error("read-back mismatch: entry.txt does not hold the entry text");
}

console.log(`wrote ${[...ENTRY].length} chars to ${OUT_PATH}`);
console.log(ENTRY);

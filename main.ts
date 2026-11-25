import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const EXCUSE = "I finished it 4,000 times. I did not know you only wanted one.";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const filePath = join(outputDir, "entry.txt");

type ExcuseFacts = {
  excuse: string;
  characters: number;
  bytes: number;
  lines: number;
};

function excuseFacts(text: string): ExcuseFacts {
  return {
    excuse: text,
    characters: [...text].length,
    bytes: Buffer.byteLength(text, "utf8"),
    lines: text.split(/\r\n|\r|\n/).length,
  };
}

function fail(message: string): never {
  process.stderr.write(message + "\n");
  process.exit(1);
}

const facts = excuseFacts(EXCUSE);

if (facts.characters < 1 || facts.characters > 200) {
  fail(`Expected 1..200 characters, got ${facts.characters}.`);
}
if (facts.bytes < 1 || facts.bytes > 200) {
  fail(`Expected 1..200 bytes, got ${facts.bytes}.`);
}
if (facts.excuse.trim().length === 0) {
  fail("Excuse is empty after trimming.");
}
if (facts.excuse !== facts.excuse.trim()) {
  fail("Excuse has leading or trailing whitespace.");
}
if (facts.lines !== 1) {
  fail(`Excuse must be a single line, got ${facts.lines} lines.`);
}

const text = facts.excuse + "\n";

mkdirSync(outputDir, { recursive: true });
writeFileSync(filePath, text, { encoding: "utf8" });

const expected = Buffer.from(text, "utf8");
const actual = readFileSync(filePath);
if (!actual.equals(expected)) {
  fail(`Read-back mismatch for ${filePath}.`);
}

process.stdout.write(
  `path: ${filePath}\n` +
    `excuse: ${facts.excuse}\n` +
    `characters: ${facts.characters}\n` +
    `bytes: ${facts.bytes}\n` +
    `lines: ${facts.lines}\n`,
);

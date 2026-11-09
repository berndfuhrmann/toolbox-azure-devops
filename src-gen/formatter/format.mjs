// Formats TypeScript read from stdin with the project's prettier config and writes it to stdout.
// Invoked by PrettierFormatter.java for every EGL template output.
import * as prettier from "prettier";
import path from "node:path";
import { text } from "node:stream/consumers";

const projectRoot = path.resolve(import.meta.dirname, "../..");
// Placeholder path: lets prettier pick the config and infer the typescript parser.
const filepath = path.join(projectRoot, "src/generated/generated.ts");

try {
  const input = await text(process.stdin);
  const config = await prettier.resolveConfig(filepath);
  process.stdout.write(await prettier.format(input, { ...config, filepath }));
} catch (error) {
  process.stderr.write(`Prettier error: ${error.message}\n`);
  process.exit(1);
}

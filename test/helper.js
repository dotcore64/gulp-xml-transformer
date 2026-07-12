import { join } from "node:path";
import { readFile } from "node:fs/promises";

export const readTestFile = (filePath) =>
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  readFile(join(import.meta.dirname, filePath), "utf8");

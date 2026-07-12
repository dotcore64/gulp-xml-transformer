import { join } from "node:path";
import { readFileSync } from "node:fs";
import { dirname } from "dirname-filename-esm";

export const readTestFile = (filePath) =>
  readFileSync(join(dirname(import.meta), filePath), "utf8");

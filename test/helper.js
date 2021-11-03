import { join } from 'path';
import { readFileSync } from 'fs';
import { dirname } from 'dirname-filename-esm';

// eslint-disable-next-line import/prefer-default-export
export const readTestFile = (filePath) => readFileSync(join(dirname(import.meta), filePath), 'utf8');

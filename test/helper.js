import path from 'path';
import { readFileSync } from 'fs';

export const readTestFile = // eslint-disable-line import/prefer-default-export
  filePath => readFileSync(path.join(__dirname, filePath), 'utf8');

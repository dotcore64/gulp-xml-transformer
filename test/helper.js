import path from 'path';
import { readFileSync } from 'fs';

export const readTestFile = filePath => readFileSync(path.join(__dirname, filePath), 'utf8');

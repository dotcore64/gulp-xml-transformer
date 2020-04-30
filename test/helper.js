const { join } = require('path');
const { readFileSync } = require('fs');

module.exports.readTestFile = (filePath) => readFileSync(join(__dirname, filePath), 'utf8');

import File from 'vinyl';
import { PassThrough } from 'stream';

import path from 'path';
import es from 'event-stream';
import { readFileSync } from 'fs';
import { expect } from 'chai';

import xmlTransformer from '../src';

const readTestFile = filePath => readFileSync(path.join(__dirname, filePath), 'utf8');
const testXml = readTestFile('test.xml');
const expectedXml = readTestFile('test.expected.xml');

describe('gulp-xml-editor', () => {
  describe('in streaming mode', () => {
    it('should transform given xml file', done => {
      // create the fake file
      const xmlFile = new File({
        contents: new PassThrough(),
      });
      xmlFile.contents.end(testXml);

      // Create a prefixer plugin stream
      const transformer = xmlTransformer([
        { path: '//name', text: 'new name' },
      ]);
      transformer.write(xmlFile);

      // wait for the file to come back out
      transformer.once('data', file => {
        // make sure it came out the same way it went in
        expect(file.isStream()).to.equal(true);

        // buffer the contents to make sure it got prepended to
        file.contents.pipe(es.wait((err, data) => {
          // check the contents
          expect(data.toString()).to.equal(expectedXml);
          done();
        }));
      });
    });
  });

  describe('in buffering mode', () => {
    it('should transform given xml file', done => {
      // create the fake file
      const xmlFile = new File({
        contents: new Buffer(testXml),
      });

      // Create a prefixer plugin stream
      const converter = xmlTransformer([
        { path: '//name', text: 'new name' },
      ]);
      converter.write(xmlFile);

      // wait for the file to come back out
      converter.once('data', file => {
        // make sure it came out the same way it went in
        expect(file.isBuffer()).to.equal(true);

        // buffer the contents to make sure it got prepended to
        expect(file.contents.toString()).to.equal(expectedXml);
        done();
      });
    });
  });
});

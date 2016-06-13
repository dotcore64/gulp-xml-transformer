import File from 'vinyl';
import { PassThrough } from 'stream';

import es from 'event-stream';
import { expect } from 'chai';

import tester from './tester.js';
import xmlTransformer from '../src';

describe('gulp-xml-editor', () => {
  describe('in streaming mode', () => {
    tester((transformation, xml, expectation, done) => {
      // create the fake file
      const xmlFile = new File({
        contents: new PassThrough(),
      });
      xmlFile.contents.end(xml);

      // Create a prefixer plugin stream
      const transformer = xmlTransformer(transformation);
      transformer.write(xmlFile);

      // wait for the file to come back out
      transformer.once('data', file => {
        // make sure it came out the same way it went in
        expect(file.isStream()).to.equal(true);

        // buffer the contents to make sure it got prepended to
        file.contents.pipe(es.wait((err, data) => {
          // check the contents
          expect(data.toString()).to.equal(expectation);
          done();
        }));
      });
    });
  });

  describe('in buffering mode', () => {
    tester((transformation, xml, expectation, done) => {
      // create the fake file
      const xmlFile = new File({
        contents: new Buffer(xml),
      });

      // Create a prefixer plugin stream
      const converter = xmlTransformer(transformation);
      converter.write(xmlFile);

      // wait for the file to come back out
      converter.once('data', file => {
        // make sure it came out the same way it went in
        expect(file.isBuffer()).to.equal(true);

        // buffer the contents to make sure it got prepended to
        expect(file.contents.toString()).to.equal(expectation);
        done();
      });
    });
  });
});

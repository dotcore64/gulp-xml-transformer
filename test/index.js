import File from 'vinyl';
import { PassThrough } from 'stream';
import { PluginError } from 'gulp-util';

import es from 'event-stream';
import { expect } from 'chai';

import tester from './tester.js';
import { readTestFile } from './helper.js';
import xmlTransformer from '../src';

const testXml = readTestFile('test.xml');

describe('gulp-xml-editor', () => {
  describe('in streaming mode', () => {
    tester((transformation, expectation, done) => {
      // create the fake file
      const xmlFile = new File({
        contents: new PassThrough(),
      });
      xmlFile.contents.end(testXml);

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
    tester((transformation, expectation, done) => {
      // create the fake file
      const xmlFile = new File({
        contents: new Buffer(testXml),
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

  describe('null file', () => {
    it('should return empty ', done => {
      xmlTransformer(() => {})
      .on('data', file => {
        expect(file.isNull()).to.equal(true);
        done();
      })
      .write(new File({}));
    });
  });

  describe('errors', () => {
    it('should raise error when missing option', () => {
      expect(xmlTransformer).to.throw(PluginError, /transformations option is required/);
    });


    it('should raise an error when invalid type of option', () => {
      const msg = /transformations option must be a function or an object/;
      expect(() => xmlTransformer(1)).to.throw(PluginError, msg);
    });

    it('should raise an error when passing an xpath which cannot be not found', done => {
      const transformer = xmlTransformer({ path: '//invalid', text: '' });
      transformer.on('error', err => {
        expect(err).to.be.instanceof(Error);
        expect(err.message).to.equal('Can\'t find element at "//invalid"');
        done();
      })
      .write(new File({
        contents: new Buffer(testXml),
      }));
    });

    it('should raise an error when passing an xpath with no path to element', done => {
      const transformer = xmlTransformer({ path: '//version/@major', text: '' });
      transformer.on('error', err => {
        expect(err).to.be.instanceof(Error);
        expect(err.message).to.equal('Can\'t find element at "//version/@major"');
        done();
      })
      .write(new File({
        contents: new Buffer(testXml),
      }));
    });
  });
});

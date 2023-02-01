import File from 'vinyl';
import PluginError from 'plugin-error';
import { expect } from 'chai';
import { spy } from 'sinon';
import { pEvent } from 'p-event';
import through from 'through2';
import vinylToString from 'vinyl-contents-tostring';

// https://github.com/import-js/eslint-plugin-import/issues/1649
// eslint-disable-next-line import/no-unresolved
import xmlTransformer from 'gulp-xml-transformer';

// https://github.com/import-js/eslint-plugin-import/issues/2104
import tester from './tester.js'; // eslint-disable-line import/extensions
import { readTestFile } from './helper.js'; // eslint-disable-line import/extensions

const testXml = readTestFile('test.xml');
const namespacedXml = readTestFile('namespaced.xml');

describe('gulp-xml-transformer', () => {
  tester('in streaming mode', async (transformation, expectation) => {
    const cb = spy();

    // create the fake file
    const xmlFile = new File({
      contents: through().end(testXml),
    });

    // Create a prefixer plugin stream
    const transformer = xmlTransformer(transformation);
    transformer.on('data', cb);
    transformer.end(xmlFile);

    await pEvent(transformer, 'end');

    expect(cb).to.have.been.calledOnce();
    const file = cb.firstCall.args[0];
    expect(file.isStream()).to.equal(true);
    return expect(vinylToString(file)).to.become(expectation);
  }, async (transformation, expectation, namespaces) => {
    const cb = spy();

    // create the fake file
    const xmlFile = new File({
      contents: through().end(namespacedXml),
    });

    // Create a prefixer plugin stream
    const transformer = xmlTransformer(transformation, namespaces);
    transformer.on('data', cb);
    transformer.end(xmlFile);

    await pEvent(transformer, 'end');

    expect(cb).to.have.been.calledOnce();
    const file = cb.firstCall.args[0];
    expect(file.isStream()).to.equal(true);
    return expect(vinylToString(file)).to.become(expectation);
  });

  tester('in buffering mode', async (transformation, expectation) => {
    const cb = spy();

    // create the fake file
    const xmlFile = new File({
      contents: Buffer.from(testXml),
    });

    // Create a prefixer plugin stream
    const converter = xmlTransformer(transformation);
    converter.on('data', cb);
    converter.end(xmlFile);

    await pEvent(converter, 'end');

    const file = cb.firstCall.args[0];
    expect(cb).to.have.been.calledOnce();
    expect(file.isBuffer()).to.equal(true);
    expect(file.contents.toString()).to.equal(expectation);
  }, async (transformation, expectation, namespaces) => {
    const cb = spy();

    // create the fake file
    const xmlFile = new File({
      contents: Buffer.from(namespacedXml),
    });

    // Create a prefixer plugin stream
    const converter = xmlTransformer(transformation, namespaces);
    converter.on('data', cb);
    converter.end(xmlFile);

    await pEvent(converter, 'end');

    const file = cb.firstCall.args[0];
    expect(cb).to.have.been.calledOnce();
    expect(file.isBuffer()).to.equal(true);
    expect(file.contents.toString()).to.equal(expectation);
  });

  describe('null file', () => {
    it('should return empty ', async () => {
      const cb = spy();

      const transformer = xmlTransformer(() => {});
      transformer.on('data', cb);
      transformer.end(new File({}));

      await pEvent(transformer, 'end');
      expect(cb).to.have.been.calledOnce();
      const file = cb.firstCall.args[0];
      expect(file.isNull()).to.be.true();
    });
  });

  describe('isMandatory', () => {
    it('should not throw error when isMandatory is false', async () => {
      const cb = spy();

      const transformer = xmlTransformer({ path: '//invalid', text: '', isMandatory: false });
      transformer.on('data', cb);
      transformer.on('error', cb);
      transformer.end(new File({
        contents: Buffer.from(testXml),
      }));

      await Promise.race([
        pEvent(transformer, 'end'),
        pEvent(transformer, 'error'),
      ]);

      const file = cb.firstCall.args[0];
      expect(cb).to.have.been.calledOnce();
      expect(file.contents.toString()).to.equal(testXml);
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

    it('should raise an error when passing invalid xml', () => {
      const transformer = xmlTransformer(() => {});
      transformer.end(new File({
        contents: Buffer.from(''),
      }));

      return expect(pEvent(transformer, 'error'))
        .to.eventually.be.instanceof(Error)
        .and.have.property('message')
        .equal('Could not parse XML string');
    });

    it('should raise an error when passing an xpath which cannot be not found', () => {
      const transformer = xmlTransformer({ path: '//invalid', text: '' });
      transformer.end(new File({
        contents: Buffer.from(testXml),
      }));

      return expect(pEvent(transformer, 'error'))
        .to.eventually.be.instanceof(Error)
        .and.have.property('message')
        .equal('Can\'t find element at "//invalid"');
    });

    it('should raise an error when passing an xpath with no path to element', () => {
      const transformer = xmlTransformer({ path: '//version/@major', text: '' });
      transformer.end(new File({
        contents: Buffer.from(testXml),
      }));

      return expect(pEvent(transformer, 'error'))
        .to.eventually.be.instanceof(Error)
        .and.have.property('message')
        .equal('Can\'t find element at "//version/@major"');
    });
  });
});

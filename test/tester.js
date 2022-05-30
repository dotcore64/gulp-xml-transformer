import libxmljs from 'libxmljs2';

// https://github.com/import-js/eslint-plugin-import/issues/2104
import { readTestFile } from './helper.js'; // eslint-disable-line import/extensions

const expectedText = readTestFile('test.text.xml');
const expectedAttr = readTestFile('test.attr.xml');
const expectedChild = readTestFile('test.child.xml');
const expectedAddAttr = readTestFile('test.add_attr.xml');
const expectedAddChangeAttr = readTestFile('test.add_change_attr.xml');
const expectedMulti = readTestFile('test.multi.xml');
const expectedMajorIncrease = readTestFile('test.major_increase.xml');
const expectedMajorMinorIncrease = readTestFile('test.major_minor_increase.xml');
const expectedNs = readTestFile('namespaced.expected.xml');

const nsUri = 'https://github.com/dotcore64/gulp-xml-transformer';

// eslint-disable-next-line mocha/no-exports
export default (name, tester, namespacedTester) => {
  const defineTest = ({ description, expected, transformation }) => {
    it(description, () => tester(transformation, expected));
  };

  const defineNamespacedTest = ({
    description,
    expected,
    namespaces,
    transformation,
  }) => {
    it(description, () => namespacedTester(transformation, expected, namespaces));
  };

  describe(name, () => {
    describe('functions', () => {
      [
        {
          description: 'should change name tag with function',
          expected: expectedText,
          transformation(xml) {
            xml.get('//name').text('new name');
            return xml;
          },
        },
        {
          description: 'should change attr value with function',
          expected: expectedAttr,
          transformation(xml) {
            xml.get('//version').attr({ major: '10' });
            return xml;
          },
        },
        {
          description: 'should add child node with function',
          expected: expectedChild,
          transformation(xml) {
            xml.get('//name').text('new name');

            const child = new libxmljs.Element(xml, 'child');
            child.text('child element');
            xml.get('//name').addChild(child);

            return xml;
          },
        },
        {
          description: 'should add child node with function asynchronously',
          expected: expectedChild,
          transformation(xml) {
            xml.get('//name').text('new name');

            const child = new libxmljs.Element(xml, 'child');
            child.text('child element');
            xml.get('//name').addChild(child);

            return Promise.resolve(xml);
          },
        },
      ].forEach(defineTest);
    });

    describe('objects', () => {
      [
        {
          description: 'should change name tag with object',
          expected: expectedText,
          transformation: {
            path: '//name',
            text: 'new name',
          },
        },
        {
          description: 'should change attr value with object',
          expected: expectedAttr,
          transformation: {
            path: '//version',
            attr: { major: 10 },
          },
        },
        {
          description: 'should add attr value with object',
          expected: expectedAddAttr,
          transformation: {
            path: '//version',
            attr: { build: 20 },
          },
        },
        {
          description: 'should add and change attr values with object',
          expected: expectedAddChangeAttr,
          transformation: {
            path: '//version',
            attrs: [
              { major: 10 },
              { minor: 11 },
              { build: 20 },
            ],
          },
        },
        {
          description: 'should increase major version',
          expected: expectedMajorIncrease,
          transformation: {
            path: '//version',
            attr: { major: (val) => Number.parseInt(val, 10) + 1 },
          },
        },
        {
          description: 'should increase major and minor versions',
          expected: expectedMajorMinorIncrease,
          transformation: {
            path: '//version',
            attrs: [
              { major: (val) => Number.parseInt(val, 10) + 1 },
              { minor: (val) => Number.parseInt(val, 10) + 1 },
            ],
          },
        },
        {
          description: 'should increase major and minor versions with one object without array',
          expected: expectedMajorMinorIncrease,
          transformation: {
            path: '//version',
            attrs: {
              major: (val) => Number.parseInt(val, 10) + 1,
              minor: (val) => Number.parseInt(val, 10) + 1,
            },
          },
        },
      ].forEach(defineTest);
    });

    describe('arrays', () => {
      [
        {
          description: 'should change name tag with array',
          expected: expectedMulti,
          transformation: [
            {
              path: '//version',
              attrs: [
                { major: 10 },
                { minor: 11 },
                { build: 20 },
              ],
            },
            {
              path: '//name',
              text: 'new name',
            },
          ],
        },
      ].forEach(defineTest);
    });

    describe('namespaced', () => {
      [
        {
          description: 'should change name tag within default ns',
          expected: expectedNs,
          namespaces: nsUri,
          transformation: {
            path: '//xmlns:name',
            text: 'new name',
          },
        },
        {
          description: 'should change name tag within a ns',
          expected: expectedNs,
          namespaces: { a: nsUri },
          transformation: {
            path: '//a:name',
            text: 'new name',
          },
        },
      ].forEach(defineNamespacedTest);
    });
  });
};

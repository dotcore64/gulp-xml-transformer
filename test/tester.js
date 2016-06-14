import { readTestFile } from './helper.js';
import {
  funcChangeText, funcChangeAttr, funcAddChild,
  objChangeText, objChangeAttr, objAddAttr, objAddChangeAttr,
  arrMultiChange, nsUri, nsDefault, nsA,
} from './transformations.js';

const expectedText = readTestFile('test.text.xml');
const expectedAttr = readTestFile('test.attr.xml');
const expectedChild = readTestFile('test.child.xml');
const expectedAddAttr = readTestFile('test.add_attr.xml');
const expectedAddChangeAttr = readTestFile('test.add_change_attr.xml');
const expectedMulti = readTestFile('test.multi.xml');

const expectedNs = readTestFile('namespaced.expected.xml');

export default (tester, namespacedTester) => {
  describe('functions', () => {
    it('should change name tag with function', done => {
      tester(funcChangeText, expectedText, done);
    });

    it('should change attr value with function', done => {
      tester(funcChangeAttr, expectedAttr, done);
    });

    it('should add child node with function', done => {
      tester(funcAddChild, expectedChild, done);
    });
  });

  describe('objects', () => {
    it('should change name tag with object', done => {
      tester(objChangeText, expectedText, done);
    });

    it('should change attr value with object', done => {
      tester(objChangeAttr, expectedAttr, done);
    });

    it('should add attr value with object', done => {
      tester(objAddAttr, expectedAddAttr, done);
    });

    it('should add and change attr values with object', done => {
      tester(objAddChangeAttr, expectedAddChangeAttr, done);
    });
  });

  describe('arrays', () => {
    it('should change name tag with array', done => {
      tester(arrMultiChange, expectedMulti, done);
    });
  });

  describe('namespaced', () => {
    it('should change name tag within default ns', done => {
      namespacedTester(nsDefault, expectedNs, nsUri, done);
    });

    it('should change name tag within a ns', done => {
      namespacedTester(nsA, expectedNs, { a: nsUri }, done);
    });
  });
};

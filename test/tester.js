import { readTestFile } from './helper.js';
import {
  funcChangeText, funcChangeAttr, funcAddChild,
  objChangeText, objChangeAttr, objAddAttr, objAddChangeAttr,
  arrMultiChange,
} from './transformations.js';

const expectedText = readTestFile('test.text.xml');
const expectedAttr = readTestFile('test.attr.xml');
const expectedChild = readTestFile('test.child.xml');
const expectedAddAttr = readTestFile('test.add_attr.xml');
const expectedAddChangeAttr = readTestFile('test.add_change_attr.xml');
const expectedMulti = readTestFile('test.multi.xml');

export default (tester) => {
  it('should change name tag with function', done => {
    tester(funcChangeText, expectedText, done);
  });

  it('should change attr value with function', done => {
    tester(funcChangeAttr, expectedAttr, done);
  });

  it('should add child node with function', done => {
    tester(funcAddChild, expectedChild, done);
  });

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

  it('should change name tag with array', done => {
    tester(arrMultiChange, expectedMulti, done);
  });
};

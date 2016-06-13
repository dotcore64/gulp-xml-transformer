import path from 'path';
import { readFileSync } from 'fs';
import {
  funcChangeText, funcChangeAttr, funcAddChild,
  objChangeText, objChangeAttr, objAddAttr, objAddChangeAttr,
  arrMultiChange,
} from './transformations.js';

const readTestFile = filePath => readFileSync(path.join(__dirname, filePath), 'utf8');

const testXml = readTestFile('test.xml');
const expectedText = readTestFile('test.text.xml');
const expectedAttr = readTestFile('test.attr.xml');
const expectedChild = readTestFile('test.child.xml');
const expectedAddAttr = readTestFile('test.add_attr.xml');
const expectedAddChangeAttr = readTestFile('test.add_change_attr.xml');
const expectedMulti = readTestFile('test.multi.xml');

export default (tester) => {
  it('should change name tag with function', done => {
    tester(funcChangeText, testXml, expectedText, done);
  });

  it('should change attr value with function', done => {
    tester(funcChangeAttr, testXml, expectedAttr, done);
  });

  it('should add child node with function', done => {
    tester(funcAddChild, testXml, expectedChild, done);
  });

  it('should change name tag with object', done => {
    tester(objChangeText, testXml, expectedText, done);
  });

  it('should change attr value with object', done => {
    tester(objChangeAttr, testXml, expectedAttr, done);
  });

  it('should add attr value with object', done => {
    tester(objAddAttr, testXml, expectedAddAttr, done);
  });

  it('should add and change attr values with object', done => {
    tester(objAddChangeAttr, testXml, expectedAddChangeAttr, done);
  });

  it('should change name tag with array', done => {
    tester(arrMultiChange, testXml, expectedMulti, done);
  });
};

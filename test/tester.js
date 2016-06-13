import path from 'path';
import { readFileSync } from 'fs';
import {
  funcChangeText, funcChangeAttr, funcAddChild,
  objChangeText, objChangeAttr,
} from './transformations.js';

const readTestFile = filePath => readFileSync(path.join(__dirname, filePath), 'utf8');

const testXml = readTestFile('test.xml');
const expectedTextXml = readTestFile('test.text.xml');
const expectedAttrXml = readTestFile('test.attr.xml');
const expectedChildXml = readTestFile('test.child.xml');

export default (tester) => {
  it('should change name tag with function', done => {
    tester(funcChangeText, testXml, expectedTextXml, done);
  });

  it('should change attr value with function', done => {
    tester(funcChangeAttr, testXml, expectedAttrXml, done);
  });

  it('should add child node with function', done => {
    tester(funcAddChild, testXml, expectedChildXml, done);
  });

  it('should change name tag with object', done => {
    tester(objChangeText, testXml, expectedTextXml, done);
  });

  it('should change attr value with object', done => {
    tester(objChangeAttr, testXml, expectedAttrXml, done);
  });

  it('should change name tag with array', done => {
    tester([objChangeText], testXml, expectedTextXml, done);
  });

  it('should change attr value with array', done => {
    tester([objChangeAttr], testXml, expectedAttrXml, done);
  });
};

import arrify from 'arrify';
import through from 'through2';
import vinylToString from 'vinyl-contents-tostring';
import PluginError from 'plugin-error';
import { parseXmlString } from 'libxmljs2';
import { nodeify } from 'promise-toolbox';

import { PLUGIN_NAME } from './const';
import {
  func as functionTransformer,
  obj as objectTransformer,
} from './transformers';

const clone = (fn) => (file, enc) => fn(file.clone(), enc);

const update = (file) => (xml) => Object.assign(file, {
  contents: file.isBuffer()
    ? Buffer.from(xml)
    : through().end(xml),
});

const getTransformStream = (transformer) => through.obj(
  nodeify(clone((file, enc) => (
    file.isNull()
      ? file
      : vinylToString(file, enc)
        .then(parseXmlString)
        .then(transformer)
        .then(update(file))))),
);

export default (transformations, nsUri) => {
  // check options
  switch (typeof transformations) {
    case 'function':
      return getTransformStream(functionTransformer(transformations));
    case 'object':
      return getTransformStream(objectTransformer(arrify(transformations), nsUri));
    case 'undefined':
      throw new PluginError(PLUGIN_NAME, 'transformations option is required');
    default:
      throw new PluginError(PLUGIN_NAME, 'transformations option must be a function or an object');
  }
};

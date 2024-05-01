import { callbackify } from 'node:util';
import arrify from 'arrify';
import through from 'through2';
import vinylToString from 'vinyl-contents-tostring';
import PluginError from 'plugin-error';
import { parseXmlAsync } from 'libxmljs';

// https://github.com/import-js/eslint-plugin-import/issues/2104
import { PLUGIN_NAME } from './lib/const.js'; // eslint-disable-line import/extensions
import {
  func as functionTransformer,
  obj as objectTransformer,
} from './lib/transformers.js'; // eslint-disable-line import/extensions

const clone = (fn) => (file, enc) => fn(file.clone(), enc);

const update = (file) => (xml) => Object.assign(file, {
  contents: file.isBuffer()
    ? Buffer.from(xml)
    : through().end(xml),
});

const getTransformStream = (transformer) => through.obj(
  callbackify(clone((file, enc) => (
    file.isNull()
      ? Promise.resolve(file)
      : vinylToString(file, enc)
        .then(parseXmlAsync)
        .then(transformer)
        .then(update(file))))),
);

export default (transformations, nsUri) => {
  // check options
  switch (typeof transformations) {
    case 'function': {
      return getTransformStream(functionTransformer(transformations));
    }
    case 'object': {
      return getTransformStream(objectTransformer(arrify(transformations), nsUri));
    }
    case 'undefined': {
      throw new PluginError(PLUGIN_NAME, 'transformations option is required');
    }
    default: {
      throw new PluginError(PLUGIN_NAME, 'transformations option must be a function or an object');
    }
  }
};

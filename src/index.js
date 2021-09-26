const arrify = require('arrify');
const through = require('through2');
const vinylToString = require('vinyl-contents-tostring');
const PluginError = require('plugin-error');
const { parseXmlString } = require('libxmljs2');
const { nodeify } = require('promise-toolbox');

const { PLUGIN_NAME } = require('./const');
const {
  function: functionTransformer,
  object: objectTransformer,
} = require('./transformers');

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

module.exports = (transformations, nsUri) => {
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

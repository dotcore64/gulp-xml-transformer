const arrify = require('arrify');
const through = require('through2');
const vinylToString = require('vinyl-contents-tostring');
const PluginError = require('plugin-error');
const { parseXmlString } = require('libxmljs2');
const asCallback = require('standard-as-callback').default;

const { PLUGIN_NAME } = require('./const');
const {
  function: functionTransformer,
  object: objectTransformer,
} = require('./transformers');

const getContents = (file, xml) => (file.isBuffer()
  ? Buffer.from(xml)
  : through().end(xml));

function transform(transformations, transformer, nsUri) {
  // create through object
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    return asCallback(vinylToString(file, enc)
      .then((xml) => transformer(transformations, parseXmlString(xml), nsUri))
      .then((transformedXml) => Object.assign(file, {
        contents: getContents(file, transformedXml),
      }))
      .then(this.push.bind(this)), cb);
  });
}

module.exports = function (transformations, nsUri) {
  // check options
  switch (typeof transformations) {
    case 'function':
      return transform(transformations, functionTransformer, nsUri);
    case 'object':
      return transform(arrify(transformations), objectTransformer, nsUri);
    case 'undefined':
      throw new PluginError(PLUGIN_NAME, 'transformations option is required');
    default:
      throw new PluginError(PLUGIN_NAME, 'transformations option must be a function or an object');
  }
};

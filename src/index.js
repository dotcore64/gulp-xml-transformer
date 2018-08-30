import arrify from 'arrify';
import through from 'through2';
import vinylToString from 'vinyl-contents-tostring';
import PluginError from 'plugin-error';
import { parseXmlString } from 'libxmljs';
import { functionTransformer, objectTransformer } from './transformers';
import { PLUGIN_NAME } from './const';

function getContents(file, xml) {
  if (file.isBuffer()) {
    return Buffer.from(xml);
  }

  /* elte if (file.isStream()) */
  const contents = through();
  contents.write(xml);
  contents.end();

  return contents;
}

function transform(transformations, transformer, nsUri) {
  // create through object
  return through.obj(function (file, enc, cb) {
    if (!file.isNull()) {
      return vinylToString(file, enc)
        .then(xml => transformer(transformations, parseXmlString(xml), nsUri))
        .then((transformedXml) => {
          const contents = getContents(file, transformedXml);

          Object.assign(file, { contents });
          this.push(file);

          cb();
        })
        .catch(cb);
    }

    this.push(file);
    return cb();
  });
}

function gulpXmlTransformer(transformations, nsUri) {
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
}

module.exports = gulpXmlTransformer;

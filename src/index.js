import through from 'through2';
import vinylToString from 'vinyl-contents-tostring';
import { PluginError } from 'gulp-util';
import { parseXmlString } from 'libxmljs';
import { functionTransformer, objectTransformer } from './transformers.js';
import { PLUGIN_NAME } from './const.js';

function transform(transformations, transformer, nsUri) {
  // create through object
  return through.obj(function (file, enc, cb) {
    const newFile = file.clone();

    vinylToString(file, enc)
    .then(xml => {
      const transformedXml = transformer(transformations, parseXmlString(xml), nsUri);

      if (file.isBuffer()) {
        newFile.contents = new Buffer(transformedXml);
      } else if (file.isStream()) {
        // start the transformation
        newFile.contents = through();
        newFile.contents.write(transformedXml);
        newFile.contents.end();
      } else {
        throw new PluginError(PLUGIN_NAME, 'Invalid file');
      }

      // make sure the file goes through the next gulp plugin
      this.push(newFile);
      cb();
    })
    .catch(cb);
  });
}

function gulpXmlTransformer(transformations, nsUri) {
  // check options
  switch (typeof transformations) {
    case 'function':
      return transform(transformations, functionTransformer, nsUri);
    case 'object':
      if (!Array.isArray(transformations)) {
        return transform([transformations], objectTransformer, nsUri);
      }

      return transform(transformations, objectTransformer, nsUri);
    case 'undefined':
      throw new PluginError(PLUGIN_NAME, 'transformations option is required');
    default:
      throw new PluginError(PLUGIN_NAME, 'transformations option must be a function or an object');
  }
}

module.exports = gulpXmlTransformer;

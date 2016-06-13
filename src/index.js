import through from 'through2';
import vinylToString from 'vinyl-contents-tostring';
import libxmljs, { parseXmlString } from 'libxmljs';
import { PluginError } from 'gulp-util';

const PLUGIN_NAME = 'gulp-xml-transformer';

// edit XML document by user specific function
function functionTransformer(tranformation, doc) {
  return tranformation(doc, libxmljs).toString();
}

function getTransformationAttrs(transformation) {
  if (transformation.attrs) {
    return transformation.attrs;
  } else if (transformation.attr) {
    return [transformation.attr];
  }

  return [];
}

// edit XML document by user specific object
function objectTransformer(transformations, doc, nsUri) {
  transformations.forEach(transformation => {
    const elem = (nsUri === undefined) ?
      doc.get(transformation.path) :
      doc.get(transformation.path, nsUri);

    if (!(elem instanceof libxmljs.Element)) {
      throw new PluginError(PLUGIN_NAME, `Can't find element at "${transformation.path}"`);
    }

    if (transformation.hasOwnProperty('text')) {
      elem.text(transformation.text);
    }

    const attrs = getTransformationAttrs(transformation);
    attrs.forEach(attr => elem.attr(attr));
  });

  return doc.toString();
}

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
    });
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

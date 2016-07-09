import libxmljs from 'libxmljs';
import { PluginError } from 'gulp-util';
import { PLUGIN_NAME } from './const.js';

// edit XML document by user specific function
export function functionTransformer(tranformation, doc) {
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
export function objectTransformer(transformations, doc, nsUri) {
  transformations.forEach(transformation => {
    const elem = (nsUri === undefined) ?
      doc.get(transformation.path) :
      doc.get(transformation.path, nsUri);

    if (!(elem instanceof libxmljs.Element)) {
      throw new PluginError(PLUGIN_NAME, `Can't find element at "${transformation.path}"`);
    }

    if ({}.hasOwnProperty.call(transformation, 'text')) {
      elem.text(transformation.text);
    }

    const attrs = getTransformationAttrs(transformation);
    attrs.forEach(attr => elem.attr(attr));
  });

  return doc.toString();
}

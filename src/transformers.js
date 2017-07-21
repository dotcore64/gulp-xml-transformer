import libxmljs from 'libxmljs';
import arrify from 'arrify';
import normalize from 'value-or-function';
import { PluginError } from 'gulp-util';
import { PLUGIN_NAME } from './const';

const stringOrNumber = (...args) => normalize(['number', 'string'], ...args);

// edit XML document by user specific function
export function functionTransformer(tranformation, doc) {
  return tranformation(doc, libxmljs).toString();
}

// edit XML document by user specific object
export function objectTransformer(transformations, doc, nsUri) {
  transformations.forEach((transformation) => {
    const elem = (nsUri === undefined) ?
      doc.get(transformation.path) :
      doc.get(transformation.path, nsUri);
    const { isMandatory = true } = transformation;

    if (!(elem instanceof libxmljs.Element)) {
      if (isMandatory) {
        throw new PluginError(PLUGIN_NAME, `Can't find element at "${transformation.path}"`);
      }

      return;
    }

    if ({}.hasOwnProperty.call(transformation, 'text')) {
      elem.text(transformation.text);
    }

    const attrs = arrify(transformation.attrs || transformation.attr);
    attrs.forEach((attr) => {
      Object.keys(attr).forEach((key) => {
        const oldAttr = elem.attr(key);
        const oldVal = oldAttr && oldAttr.value();
        const val = stringOrNumber(attr[key], oldVal);
        elem.attr({ [key]: val });
      });
    });
  });

  return doc.toString();
}

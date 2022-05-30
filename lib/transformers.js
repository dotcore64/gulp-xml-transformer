import libxmljs from 'libxmljs2';
import arrify from 'arrify';
import normalize from 'value-or-function';
import PluginError from 'plugin-error';

// https://github.com/import-js/eslint-plugin-import/issues/2104
import { PLUGIN_NAME } from './const.js'; // eslint-disable-line import/extensions

const stringOrNumber = (...args) => normalize(['number', 'string'], ...args);

// edit XML document by user specific function
export const func = (tranformation) => (xml) => Promise.resolve(tranformation(xml, libxmljs))
  .then((newDoc) => newDoc.toString());

// edit XML document by user specific object
export const obj = (transformations, nsUri) => (doc) => {
  transformations.forEach((transformation) => {
    const elem = (nsUri === undefined)
      ? doc.get(transformation.path)
      : doc.get(transformation.path, nsUri);
    const {
      path, text, attrs, attr, isMandatory = true,
    } = transformation;

    if (!(elem instanceof libxmljs.Element)) {
      if (isMandatory) {
        throw new PluginError(PLUGIN_NAME, `Can't find element at "${path}"`);
      }

      return;
    }

    if (text !== undefined) {
      elem.text(text);
    }

    // eslint-disable-next-line no-shadow
    arrify(attrs ?? attr).forEach((attr) => {
      Object.keys(attr).forEach((key) => {
        const oldAttr = elem.attr(key);
        const oldVal = oldAttr?.value();
        const val = stringOrNumber(attr[key], oldVal);
        elem.attr({ [key]: val });
      });
    });
  });

  return doc.toString();
};

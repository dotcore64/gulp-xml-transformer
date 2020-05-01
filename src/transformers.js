const libxmljs = require('libxmljs2');
const arrify = require('arrify');
const normalize = require('value-or-function');
const PluginError = require('plugin-error');
const { PLUGIN_NAME } = require('./const');

const stringOrNumber = (...args) => normalize(['number', 'string'], ...args);

// edit XML document by user specific function
module.exports.function = (tranformation) => (xml) => Promise.resolve(tranformation(xml, libxmljs))
  .then((newDoc) => newDoc.toString());

// edit XML document by user specific object
module.exports.object = (transformations, nsUri) => (doc) => {
  transformations.forEach((transformation) => {
    const elem = (nsUri === undefined)
      ? doc.get(transformation.path)
      : doc.get(transformation.path, nsUri);
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
};

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _libxmljs = require('libxmljs');

var _libxmljs2 = _interopRequireDefault(_libxmljs);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _vinylContentsTostring = require('vinyl-contents-tostring');

var _vinylContentsTostring2 = _interopRequireDefault(_vinylContentsTostring);

var _gulpUtil = require('gulp-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PLUGIN_NAME = 'gulp-xml-transformer';

// edit XML document by user specific function
function functionTransformer(tranformation, doc) {
  return tranformation(doc, _libxmljs2.default).toString();
}

// edit XML document by user specific object
function objectTransformer(transformations, doc, namespace) {
  transformations.forEach(function (transformation) {
    var elem = namespace === undefined ? doc.get(transformation.path) : doc.get(transformation.path, namespace);

    if (!(elem instanceof _libxmljs2.default.Element)) {
      throw new _gulpUtil.PluginError(PLUGIN_NAME, 'Can\'t find element at "' + transformation.path + '"');
    }

    if (transformation.hasOwnProperty('text')) {
      elem.text(transformation.text);
    }

    var attrs = void 0;

    if (transformation.attrs) {
      attrs = transformation.attrs;
    } else if (transformation.attr) {
      attrs = [transformation.attr];
    } else {
      attrs = [];
    }

    attrs.forEach(function (attr) {
      return elem.attr(attr);
    });
  });

  return doc.toString();
}

function gulpXmlTransformer(transformation, namespace) {
  var transformer = void 0;

  // check options
  switch (typeof transformation === 'undefined' ? 'undefined' : _typeof(transformation)) {
    case 'function':
      transformer = functionTransformer;
      break;
    case 'object':
      transformer = objectTransformer;
      break;
    case 'undefined':
      throw new _gulpUtil.PluginError(PLUGIN_NAME, 'transformation option is required');
    default:
      throw new _gulpUtil.PluginError(PLUGIN_NAME, 'transformation option must be a function or an object');
  }

  // create through object
  return _through2.default.obj(function (file, enc, cb) {
    var _this = this;

    var newFile = file.clone();

    (0, _vinylContentsTostring2.default)(file, enc).then(function (xml) {
      var transformedXml = transformer((0, _libxmljs.parseXmlString)(xml), namespace);

      if (file.isBuffer()) {
        newFile.contents = new Buffer(transformedXml);
      } else if (file.isStream()) {
        // start the transformation
        newFile.contents = (0, _through2.default)();
        newFile.contents.write(transformedXml);
        newFile.contents.end();
      } else {
        throw new _gulpUtil.PluginError(PLUGIN_NAME, 'Invalid file');
      }

      // make sure the file goes through the next gulp plugin
      _this.push(newFile);
      cb();
    });
  });
}

module.exports = gulpXmlTransformer;
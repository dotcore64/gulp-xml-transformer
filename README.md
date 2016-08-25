# gulp-xml-transformer

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coverage Status][coveralls-badge]][coveralls]
[![Dependency Status][dependency-status-badge]][dependency-status]
[![devDependency Status][dev-dependency-status-badge]][dev-dependency-status]

> Transform xml documents gulp plugin

## Install

```
$ npm install --save-dev gulp-xml-transformer
```

Supports node >= 0.10

## Usage

```javascript
var xmlTransformer = require("gulp-xml-transformer");

/*
 * edit XML document by using user specific object
 */
gulp.src("./manifest.xml")
  .pipe(xmlTransformer([
    { path: '//name', text: 'new names' },
    { path: '//version', attr: { 'major': '2' } }
  ]))
  .pipe(gulp.dest("./dest"));

/*
 * attributes can be functions too
 */
gulp.src("./manifest.xml")
  .pipe(xmlTransformer([
    { path: '//version', attr: { 'major': val => parseInt(val, 10) + 1 } }
  ])
  .pipe(gulp.dest("./dest"));

/*
 * edit XML document by using user specific object using a namespace
 */
gulp.src("./manifest.xml")
  .pipe(xmlTransformer([
    { path: '//xmlns:name', text: 'new names' },
    { path: '//xmlns:version', attr: { 'major': '2' } }
  ], 'http://www.w3.org/ns/widgets'))
  .pipe(gulp.dest("./dest"));

/*
 * edit XML document by using user specific object using a custom namespace
 */
gulp.src("./manifest.xml")
  .pipe(xmlTransformer([
    { path: '//a:name', text: 'new names' },
    { path: '//a:version', attr: { 'major': '2' } }
  ], { a: 'http://www.w3.org/ns/widgets' }))
  .pipe(gulp.dest("./dest"));

/*
 * edit XML document by using user specific function
 */
gulp.src("./manifest.xml")
  .pipe(xmlTransformer((xml, libxmljs) => {
    // 'xml' is libxmljs Document object.
    xml.get('//key[./text()="Version"]').nextElement().text('2.0.0');

    // 'libxmljs' is libxmljs object. you can call any libxmljs function.
    var child = new libxmljs.Element(xml, 'note');
    child.text('some text');
    xml.get('//description').addChild(child);

    // must return libxmljs Document object.
    return xml;
  }))
  .pipe(gulp.dest("./dest"));
```

### Note

Please see [libxmljs wiki page](https://github.com/polotek/libxmljs/wiki) to get more information about libxmljs API.

Based on [gulp-xml-editor](https://github.com/morou/gulp-xml-editor).

## API

### xmlTransformer(transformations, nsUri)

#### transformations

Type: `Object | Array<Object> | Function`

The objects must be one of following.

```javascript
// to modify(or add) the text of the element
{ path: 'xpath to the element', text: 'new text value' }

// to modify(or add) a attribute of the element
{ path: 'xpath to the element', attr: { 'attrName': 'attrValue' } }

// to modify(or add) some attributes of the element
{
  path: 'xpath to the element',
  attrs: [
    { 'attrName1': 'attrValue1' },
    { 'attrName2': 'attrValue2' }
  ]
}

// alternatively
{
  path: 'xpath to the element',
  attrs: {
    'attrName1': 'attrValue1',
    'attrName2': 'attrValue2',
  }
}

// if the new value of the attribute depends on the old value, pass in a function
{
  path: 'xpath to the element',
  attrs: {
    'foo': oldVal => oldVal.replace('bar', 'baz'),
  }
}
```


The if a function is supplied, it must have the following signature: `function (doc, [libxmljs]) {}`, and must return a libxmljs Document object. The `doc` argument is a libxmljs Document object, and the `libxmljs` argument is libxmljs object.

#### nsUri

Type: `Object | string`

A string representing the Namespace URI of the elements to transform, or an object literal with namespaces.

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).

[build-badge]: https://img.shields.io/travis/perrin4869/gulp-xml-transformer/master.svg?style=flat-square
[build]: https://travis-ci.org/perrin4869/gulp-xml-transformer

[npm-badge]: https://img.shields.io/npm/v/gulp-xml-transformer.svg?style=flat-square
[npm]: https://www.npmjs.org/package/gulp-xml-transformer

[coveralls-badge]: https://img.shields.io/coveralls/perrin4869/gulp-xml-transformer/master.svg?style=flat-square
[coveralls]: https://coveralls.io/r/perrin4869/gulp-xml-transformer

[dependency-status-badge]: https://david-dm.org/perrin4869/gulp-xml-transformer.svg?style=flat-square
[dependency-status]: https://david-dm.org/perrin4869/gulp-xml-transformer

[dev-dependency-status-badge]: https://david-dm.org/perrin4869/gulp-xml-transformer/dev-status.svg?style=flat-square
[dev-dependency-status]: https://david-dm.org/perrin4869/gulp-xml-transformer#info=devDependencies

export function funcChangeText(xml) {
  xml.get('//name').text('new name');
  return xml;
}

export function funcChangeAttr(xml) {
  xml.get('//version').attr({ major: '10' });
  return xml;
}

export function funcAddChild(xml, libxmljs) {
  xml.get('//name').text('new name');

  const child = new libxmljs.Element(xml, 'child');
  child.text('child element');
  xml.get('//name').addChild(child);

  return xml;
}

export const objChangeText = {
  path: '//name',
  text: 'new name',
};

export const objChangeAttr = {
  path: '//version',
  attr: { major: 10 },
};

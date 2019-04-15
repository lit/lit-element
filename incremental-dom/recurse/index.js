/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */

import * as bench from '/bench.js';

const genXChildData = (depth) => {
  let xChild = {};
  while (depth--) {
    xChild = {xChild};
  }
  return xChild;
};

const data = genXChildData(bench.config.depth);

IncrementalDOM.attributes[IncrementalDOM.symbols['default']] = function(
    el, name, value) {
  const isProperty = name[name.length - 1] != '$';

  if (isProperty) {
    IncrementalDOM.applyProp(el, name, value);
  } else {
    IncrementalDOM.applyAttr(el, name.slice(0, -1), value);
  }
};

const idom = IncrementalDOM;
const open = idom.elementOpen;
const close = idom.elementClose;
const text = idom.text;

function renderBox(title, id, content) {
  open('div');
  open('span');
  text(title);
  close('span');
  open('span', null, ['id', 'text']);
  if (content !== undefined) {
    text(content);
  }
  close('span');
  close('div');
}

function renderSimpleText(string) {
  renderBox('Simple Text: ', 'text', string);
}

function renderXChild(data, string, depth = 0) {
  if (!data) {
    return;
  }
  open('div');
  renderSimpleText(string);
  renderBox('Data Text: ', 'data-text', data.text);
  renderBox('depth: ', 'depth', depth);
  renderXChild(data.xChild ? data.xChild : undefined, string, depth + 1);
  close('div');
}

bench.start();
idom.patch(document.body, () => {renderXChild(data, 'hello')});
bench.stop();

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

const h = snabbdom.h;
const patch = snabbdom.init([]);

function renderBox(title, id, content) {
  return h('div', [
    h('span', title),
    h('span#text', content),
  ]);
}

function renderSimpleText(string) {
  return renderBox('Simple Text: ', 'text', string);
}

function renderXChild(data, string, depth = 0) {
  if (!data) {
    return;
  }
  return h('div', [
    renderSimpleText(string),
    renderBox('Data Text: ', 'data-text', data.text),
    renderBox('depth: ', 'depth', depth),
    renderXChild(data.xChild ? data.xChild : undefined, string, depth + 1),
  ]);
}

bench.start();
const div = document.createElement('div');
document.body.appendChild(div);
patch(div, renderXChild(data, 'hello'));
bench.stop();

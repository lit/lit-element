/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */

import * as bench from '/bench.js';
import {html, render} from '../node_modules/lit-html/lit-html.js';

const genXChildData = (depth) => {
  let xChild = {};
  while (depth--) {
    xChild = {xChild};
  }
  return xChild;
};

const renderBox = (title, id, content) => html`
  <div>
    <span>${title}</span>
    <span id=${id}>${content}</span>
  </div>
`;

const renderSimpleText = (string) => renderBox('Simple Text: ', 'text', string);

const renderXChild = (data, string, depth = 0) => {
  if (!data) {
    return;
  }
  return html`
    <div>
      ${renderSimpleText(string)}
      ${renderBox('Data Text: ', 'data-text', data.text)}
      ${renderBox('depth: ', 'depth', depth.toString())}
      ${renderXChild(data.xChild ? data.xChild : undefined, string, depth + 1)}
    </div>
  `;
};

const data = genXChildData(bench.config.depth || 500);

bench.start();
render(renderXChild(data, 'hello'), document.body);
bench.stop();

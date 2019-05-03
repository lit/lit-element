/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {html} from '../../node_modules/lit-html/lit-html.js';

export const itemTemplate = (title, price) => html`
  <div class="imagePlaceholder"></div>
  <span class="title">${title}</span>
  <span class="price">\$${price.toFixed(2)}</span>
`;

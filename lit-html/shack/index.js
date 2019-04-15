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

import * as bench from '/bench.js';
import {html, render} from '../node_modules/lit-html/lit-html.js';

const data = {
  page: 'mens_tshirts',
  categories: {
    'mens_outerwear': {
      title: 'Men\'s Outerwear',
    },
    'ladies_outerwear': {
      title: 'Ladies Outerwear',
    },
    'mens_tshirts': {
      title: 'Men\'s T-Shirts',
    },
    'ladies_tshirts': {
      title: 'Ladies T-Shirts',
    },
  },
  cart: [],
};

const renderPage = () => render(body(), document.body);

const body = () => html`
  <header id="pageHeader">${pageHeader()}</header>
  <main id="categoryList">${categoryList()}</main>
  <footer id="footer">${footer()}</footer>
`;

const pageHeader = () => html`
  <h1 id="logo">SHACK</h1>
  <div id="cartContainer">${cartContainer()}</div>
  <nav id="categoryNav">${categoryNav()}</nav>
`;

const cartContainer = () => html`
  <a id="cartButton">🛒</a>
  <div id="cartBadge">${data.cart.length}</div>
`;

const categoryNav = () =>
    Object.keys(data.categories)
        .map(
            (c) => html`<a ?active=${data.page === c} @click=${
                (e) => selectCategory(c, e)}>${data.categories[c].title}</a>`);

const selectCategory = (page, event) => {
  event.preventDefault();
  data.page = page;
  renderPage();
};

const categoryList = () => html`
  <div id="hero"></div>
  <h2 id="categoryTitle">${data.categories[data.page].title}</h2>
  <span id="numItems">(${data.categories[data.page].items.length} items)</span>

  <ul id="grid">
    ${data.categories[data.page].items.map(gridItem)}
  </ul>
`;

const gridItem = (item) => html`
  <li class="gridItem" @click=${(e) => clickItem(item, e)}>
    <div class="imagePlaceholder"></div>
    <span class="title">${item.title}</span>
    <span class="price">\$${item.price.toFixed(2)}</span>
  </li>
`;

const clickItem = (item, event) => {
  event.preventDefault();
  data.cart.push(item.title);
  renderPage();
};

const footer = () => html`
  <div id="demoNotice">DEMO ONLY</div>
`;

(async function() {
  const promises = [];
  for (const c in data.categories) {
    promises.push((async () => {
      const resp = await fetch(`./${c}.json`);
      data.categories[c].items = await resp.json();
    })());
  }
  await Promise.all(promises);

  setTimeout(() => {
    bench.start();
    renderPage();
    bench.stop();
  }, 100);
})();

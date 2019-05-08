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

import {html, render} from '../../node_modules/lit-html/lit-html.js';
import {cartTemplate} from './shack-cart.js';
import {itemTemplate} from './shack-item.js';

export const appData = {
  page: 'mens_tshirts',
  categories: {},
  cart: [],
};

export const renderApp = () => render(appTemplate(), document.body);

export const appTemplate = (page, cart, categories) => html`
  <header id="pageHeader">${pageHeader()}</header>
  <main id="categoryList">${categoryList()}</main>
  <footer id="footer">${footer()}</footer>
`;

const pageHeader = () => html`
  <h1 id="logo">SHACK</h1>
  <div id="cartContainer">${cartTemplate(appData.cart)}</div>
  <nav id="categoryNav">${categoryNav()}</nav>
`;

const categoryNav = () =>
    Object.keys(appData.categories)
        .map(
            (c) => html`<a ?active=${appData.page === c} @click=${
                (e) =>
                    selectCategory(c, e)}>${appData.categories[c].title}</a>`);

const selectCategory = (page, event) => {
  event.preventDefault();
  appData.page = page;
  renderApp();
};

const categoryList = () => html`
  <div id="hero"></div>
  <h2 id="categoryTitle">${appData.categories[appData.page].title}</h2>
  <span id="numItems">(${
    appData.categories[appData.page].items.length} items)</span>

  <div id="list">
    ${appData.categories[appData.page].items.map((item) => html`
      <div class="listItem" @click=${(e) => clickItem(item, e)}>
        ${itemTemplate(item.title, item.price)}
      </div>
    `)}
  </div>
`;

const clickItem = (item, event) => {
  event.preventDefault();
  appData.cart.push(item.title);
  renderApp();
};

const footer = () => html`
  <div id="demoNotice">DEMO ONLY</div>
`;

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

import './shack-item.js';
import './shack-cart.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import {html, PolymerElement} from '@polymer/polymer';

class ShackApp extends PolymerElement {
  static get properties() {
    return {
      page: {type: String},
      cart: {type: Array},
      categories: {type: Object},

      categoryList: {
        computed: 'computeCategoryList(categories)',
      },
      categoryPageTitle: {
        computed: 'computeCategoryPageTitle(page, categories)',
      },
      categoryItems: {
        computed: 'computeCategoryItems(page, categories)',
      },
      categoryNumItems: {
        computed: 'computeCategoryNumItems(page, categories)',
      }
    };
  }

  static get template() {
    return html`
      <style>
        :host {
          font-family: "Arial", sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        #pageHeader {
          flex-basis: 130px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        #logo {
          margin: 26px 0 0 0;
          font-size: 16px;
          letter-spacing: 4px;
          color: #202020;
        }

        shack-cart {
          position: absolute;
          right: 20px;
          top: 20px;
        }

        #categoryNav {
          display: flex;
          justify-content: center;
          margin-top: 46px;
        }

        #categoryNav > a {
          margin: 0 20px;
          text-decoration: none;
          color: #202020;
          font-size: 13px;
          padding-bottom: 9px;
          min-width: 110px;
          text-align: center;
          cursor: pointer;
        }

        #categoryNav > a[active] {
          border-bottom: 2px solid #172c50;
        }

        main {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 500px;
          flex-grow: 1;
          width: 100%;
        }

        #hero {
          width: 100%;
          flex-basis: 320px;
          flex-shrink: 0;
          background-color: #e7e7e7;
        }

        #categoryTitle {
          font-size: 16px;
          font-weight: normal;
          margin: 37px 0 0 0;
        }

        #numItems {
          color: #757575;
          font-size: 13px;
          margin-top: 8px;
        }

        #list {
          max-width: 1000px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          margin: 0;
          padding: 0;
        }

        shack-item {
          flex-basis: 33%;
          margin-top: 43px;
        }

        shack-item:nth-child(7n+1) {
          --shack-item-placeholder-color: #d1fdb5;
        }
        shack-item:nth-child(7n+2) {
          --shack-item-placeholder-color: #ffe7a6;
        }
        shack-item:nth-child(7n+3) {
          --shack-item-placeholder-color: #ffe4fe;
        }
        shack-item:nth-child(7n+4) {
          --shack-item-placeholder-color: #cfffff;
        }
        shack-item:nth-child(7n+5) {
          --shack-item-placeholder-color: #feff9b;
        }
        shack-item:nth-child(7n+6) {
          --shack-item-placeholder-color: #d0ebff;
        }
        shack-item:nth-child(7n+7) {
          --shack-item-placeholder-color: #ffd9d9;
        }

        #demoNotice {
          background-color: #202020;
          color: white;
          font-size: 12px;
          padding: 12px 24px;
          margin-top: 30px;
        }
      </style>

      <header id="pageHeader">
        <h1 id="logo">SHACK</h1>
        <shack-cart items=[[cart]]></shack-cart>

        <nav id="categoryNav">
          <dom-repeat items=[[categoryList]]>
            <template>
              <a active$="[[categoryIsActive(page, item.slug)]]"
                 on-click="clickCategory">
                [[item.title]]
              </a>
            </template>
          </dom-repeat>
        </nav>
      </header>

      <main id="categoryList">
        <div id="hero"></div>
        <h2 id="categoryTitle">[[categoryTitle]]</h2>
        <span id="numItems">([[categoryNumItems]] items)</span>

        <div id="list">
          <dom-repeat items=[[categoryItems]]>
            <template>
              <shack-item title=[[item.title]]
                          price=[[item.price]]
                          on-click="clickItem"
              </shack-item>
            </template>
          </dom-repeat>
        </div>
      </main>

      <footer id="footer">
        <div id="demoNotice">DEMO ONLY</div>
      </footer>
    `;
  }

  constructor() {
    super();
    this.cart = [];
  }

  computeCategoryList() {
    return Object.values(this.categories);
  }

  computeCategoryPageTitle() {
    return this.categories[this.page].title;
  }

  computeCategoryItems() {
    return this.categories[this.page].items;
  }

  computeCategoryNumItems() {
    return this.categories[this.page].items.length;
  }

  categoryIsActive(category, active) {
    return category === active;
  }

  clickCategory(event) {
    event.preventDefault();
    this.page = event.model.item.slug;
  }

  clickItem(event) {
    event.preventDefault();
    this.cart = [event.model.item.title, ...this.cart];
  }
}

customElements.define('shack-app', ShackApp);

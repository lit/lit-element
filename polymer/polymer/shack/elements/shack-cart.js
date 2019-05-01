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

import {html, PolymerElement} from '@polymer/polymer';

export class ShackCart extends PolymerElement {
  static get properties() {
    return {
      items: {type: Array},
      itemLength: {
        type: Number,
        computed: 'computeItemLength(items)',
      }
    };
  }

  static get template() {
    return html`
      <style>
        #button {
          font-size: 24px;
        }

        #badge {
          position: absolute;
          right: -7px;
          top: -7px;
          background-color: #172c50;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }
      </style>

      <a id="button">🛒</a>
      <div id="badge">[[itemLength]]</div>
    `;
  }

  computeItemLength() {
    console.log('ok', this.items);
    return this.items ? this.items.length : 0;
  }
}

customElements.define('shack-cart', ShackCart);

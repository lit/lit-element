/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

import * as ReactModule from 'react';
import * as ReactDOMModule from 'react-dom';

import {property} from '../../lib/decorators.js';
import {createReactComponent} from '../../lib/react.js';
import {html, LitElement} from '../../lit-element.js';
import {
  generateElementName,
  stripExpressionDelimeters
} from '../test-helpers.js';

const assert = chai.assert;

suite('createReactComponent', () => {
  let container: HTMLElement;

  setup(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  teardown(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  test('creates a React Component', async () => {
    class A extends LitElement {
      @property() items!: number[];

      render() {
        return html`
          <div>${this.items.join('-')}</div>
        `;
      }
    }
    const tagName = generateElementName();
    customElements.define(tagName, A);
    const ReactA = createReactComponent(window.React, A, tagName);
    window.ReactDOM.render(
        window.React.createElement(ReactA, {items : [ 1, 2, 3 ]} as any),
        container);

    await 0;
    assert.equal(stripExpressionDelimeters(container.innerHTML),
                 `<${tagName}></${tagName}>`);
    const el = container.querySelector(tagName)!;
    assert.equal(stripExpressionDelimeters(el.shadowRoot!.innerHTML).trim(),
                 `<div>1-2-3</div>`);
  });
});

declare global {
  interface Window {
    React: typeof ReactModule;
    ReactDOM: typeof ReactDOMModule;
  }
}

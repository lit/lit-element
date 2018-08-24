/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
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

import {html, LitElement} from '../lit-element.js';
import {classString, styleString} from '../lib/render-helpers.js';

import {generateElementName} from './test-helpers.js';

const assert = chai.assert;

suite('Render Helpers', () => {
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

  test('classString updates classes', async () => {
    class E extends LitElement {
      static get properties() {
        return {
          foo: {},
          bar: {},
          baz: {}
        };
      }

      foo = 0;
      bar = true;
      baz = false;

      render() {
        const {foo, bar, baz} = this;
        return html
        `<div class="${classString({ foo, bar, zonk: baz })}"></div>`;
      }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    const d = el.shadowRoot!.querySelector('div')!;
    assert.include(d.className, 'bar');
    el.foo = 1;
    el.baz = true;
    await el.updateComplete;
    assert.include(d.className, 'foo bar zonk');
    el.bar = false;
    await el.updateComplete;
    assert.include(d.className, 'foo zonk');
    el.foo = 0;
    el.baz = false;
    await el.updateComplete;
    assert.notInclude(d.className, 'foo bar zonk');
  });

  // TODO(sorvell): skip until fixed in IE11
  // blocked on https://github.com/Polymer/lit-html/issues/425.
  test.skip('styleString updates style', async () => {
    class E extends LitElement {
      static get properties() {
        return {
          marginTop: {},
          paddingTop: {},
          zug: {}
        };
      }

      marginTop = ``;
      paddingTop = ``;
      zug = `0px`;

      render() {
        const {marginTop, paddingTop, zug} = this;
        return html`<div style="${
            styleString({
              marginTop,
              paddingTop,
              height: zug
          })}"></div>`;
      }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    const d = el.shadowRoot!.querySelector('div')!;
    let computed = getComputedStyle(d);
    assert.equal(d.getAttribute('style'), 'height: 0px');
    assert.equal(computed.getPropertyValue('margin-top'), '0px');
    assert.equal(computed.getPropertyValue('height'), '0px');
    el.marginTop = `2px`;
    el.paddingTop = `5px`;
    await el.updateComplete;
    assert.equal(d.getAttribute('style'), 'margin-top: 2px; padding-top: 5px; height: 0px');
    el.offsetWidth;
    computed = getComputedStyle(d);
    assert.equal(computed.getPropertyValue('margin-top'), '2px');
    assert.equal(computed.getPropertyValue('height'), '1px');
    assert.equal(computed.getPropertyValue('padding-top'), '5px');
    el.marginTop = ``;
    el.paddingTop = ``;
    el.zug = ``;
    await el.updateComplete;
    assert.equal(d.getAttribute('style'), '');
  });

});

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

import { html, PolymerLit } from '../poly-lit-element.js';
import { PropertyAccessors } from '../../@polymer/polymer/lib/mixins/property-accessors.js';

/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />

const assert = chai.assert;

suite('PolymerList', () => {

  test('constructrs', () => {

    const C = class extends PolymerLit(PropertyAccessors(HTMLElement)) {
      foo: string = 'foo';

      render() {
        return html`
          <h1>${this.foo}</h1>
        `;
      }
    };

    const c = new C();
    const container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(c as any as HTMLElement);
    assert.equal(c.shadowRoot!.innerHTML, '<h1>foo</h1>');
  });

});

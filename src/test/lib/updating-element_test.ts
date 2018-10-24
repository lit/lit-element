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

import {UpdatingElement} from '../../lib/updating-element.js';

import {generateElementName} from '../test-helpers.js';

const assert = chai.assert;

suite('UpdatingElement', () => {
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

  test('can override _schedule()', async () => {
    class A extends UpdatingElement {
      scheduleCalled = false;
      updateCalled = false;

      _scheduleUpdate() {
        this.scheduleCalled = true;
        return new Promise((r) => setTimeout(r, 10));
      }

      update(changedProperties: Map<PropertyKey, unknown>) {
        this.updateCalled = true;
        super.update(changedProperties);
      }
    }
    customElements.define(generateElementName(), A);

    const a = new A();
    container.appendChild(a);
    assert.isTrue(a.scheduleCalled);

    // update is not called synchronously
    assert.isFalse(a.updateCalled);

    // update is not called after a microtask
    await 0;
    assert.isFalse(a.updateCalled);

    // update is not called after short timeout
    await new Promise((r) => setTimeout(r));
    assert.isFalse(a.updateCalled);

    // update is called after long timeout
    await new Promise((r) => setTimeout(r, 20));
    assert.isTrue(a.updateCalled);
  });

  test('overriding _schedule() still allows nested invalidations', async () => {
    class A extends UpdatingElement {
      scheduleCalledCount = 0;
      updatedCalledCount = 0;

      _scheduleUpdate() {
        this.scheduleCalledCount++;
        return new Promise((r) => setTimeout(r));
      }

      updated(_changedProperties: Map<PropertyKey, unknown>) {
        this.updatedCalledCount++;
        // trigger a nested invalidation just once
        if (this.updatedCalledCount === 1) {
          this.requestUpdate();
        }
      }
    }
    customElements.define(generateElementName(), A);

    const a = new A();
    container.appendChild(a);
    assert.equal(a.scheduleCalledCount, 1, 'a');
    assert.equal(a.updatedCalledCount, 0);

    const updateComplete1 = a.updateComplete;
    await updateComplete1;
    assert.equal(a.updatedCalledCount, 1, 'b');
    assert.equal(a.scheduleCalledCount, 2, 'c');

    const updateComplete2 = a.updateComplete;
    assert.notStrictEqual(updateComplete1, updateComplete2);

    await updateComplete2;
    assert.equal(a.updatedCalledCount, 2);
    assert.equal(a.scheduleCalledCount, 2);
  });
});

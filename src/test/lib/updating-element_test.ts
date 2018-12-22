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

import {property} from '../../lib/decorators.js';
import {UpdatingElement, PropertyValues} from '../../lib/updating-element.js';
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

  suite('scheduling', () => {

    test('can override performUpdate()', async () => {
      class A extends UpdatingElement {
        performUpdateCalled = false;
        updateCalled = false;

        async performUpdate() {
          this.performUpdateCalled = true;
          await new Promise((r) => setTimeout(r, 10));
          await super.performUpdate();
        }

        update(changedProperties: Map<PropertyKey, unknown>) {
          this.updateCalled = true;
          super.update(changedProperties);
        }
      }
      customElements.define(generateElementName(), A);

      const a = new A();
      container.appendChild(a);

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

    test('overriding performUpdate() allows nested invalidations', async () => {
      class A extends UpdatingElement {
        performUpdateCalledCount = 0;
        updatedCalledCount = 0;

        async performUpdate() {
          this.performUpdateCalledCount++;
          await new Promise((r) => setTimeout(r));
          super.performUpdate();
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
      assert.equal(a.updatedCalledCount, 0);

      const updateComplete1 = a.updateComplete;
      await updateComplete1;
      assert.equal(a.updatedCalledCount, 1);
      assert.equal(a.performUpdateCalledCount, 1);

      const updateComplete2 = a.updateComplete;
      assert.notStrictEqual(updateComplete1, updateComplete2);

      await updateComplete2;
      assert.equal(a.updatedCalledCount, 2);
      assert.equal(a.performUpdateCalledCount, 2);
    });

    test('update does not occur before element is connected', async () => {
      class A extends UpdatingElement {

        updatedCalledCount = 0;

        @property() foo = 5;

        constructor() {
          super();
          this.requestUpdate();
        }

        updated(_changedProperties: Map<PropertyKey, unknown>) {
          this.updatedCalledCount++;
        }
      }
      customElements.define(generateElementName(), A);
      const a = new A();
      await new Promise((r) => setTimeout(r, 20));
      assert.equal(a.updatedCalledCount, 0);
      container.appendChild(a);
      await a.updateComplete;
      assert.equal(a.updatedCalledCount, 1);
    });

  });

  suite('layout', () => {
    class Base extends UpdatingElement {

      @property()
      size = '';

      content: HTMLElement|undefined;

      _rendered = false;

      render() {
        this.style.display = 'block';
        this.content = document.createElement('div');
        this.renderRoot!.appendChild(this.content);
      }

      update(changedProperties: PropertyValues) {
        super.update(changedProperties);
        if (!this._rendered) {
          this.render();
        }
        if (changedProperties.has('size')) {
          this.content!.style.height = this.size;
        }
      }
    }
    customElements.define('update-base', Base);

    class Sub extends Base {

      base1: HTMLElement|undefined;
      base2: HTMLElement|undefined;

      render() {
        super.render();
        this.base1 = document.createElement('update-base');
        this.renderRoot!.appendChild(this.base1);
        this.base2 = document.createElement('update-base');
        this.renderRoot!.appendChild(this.base2);
      }
    }

    customElements.define('update-sub', Sub);

    class Container extends Base {

      sub1: HTMLElement|undefined;
      sub2: HTMLElement|undefined;

      render() {
        super.render();
        this.sub1 = document.createElement('update-sub');
        this.renderRoot!.appendChild(this.sub1);
        this.sub2 = document.createElement('update-sub');
        this.renderRoot!.appendChild(this.sub2);
      }
    }

    customElements.define('update-container', Container);

    test('`updateSubtreeComplete` awaits entire update subtree', async () => {
      const el = new Container();
      container.appendChild(el);
      await el.updateSubtreeComplete;
      assert.ok(el.sub1);
      assert.ok(el.sub2);
      assert.ok((el.sub1! as Sub).base1);
      assert.ok((el.sub1! as Sub).base2);
      assert.ok((el.sub2! as Sub).base1);
      assert.ok((el.sub2! as Sub).base2);
      assert.ok(((el.sub1! as Sub).base1 as Base).content);
      assert.ok(((el.sub1! as Sub).base2 as Base).content);
      assert.ok(((el.sub2! as Sub).base1 as Base).content);
      assert.ok(((el.sub2! as Sub).base2 as Base).content);
      el.size = '2px';
      (el.sub1 as Base).size = '2px';
      (el.sub2 as Base).size = '2px';
      ((el.sub1 as Sub).base1 as Base).size = '2px';
      ((el.sub1 as Sub).base2 as Base).size = '2px';
      ((el.sub2 as Sub).base1 as Base).size = '2px';
      ((el.sub2 as Sub).base2 as Base).size = '2px';
      await el.updateSubtreeComplete;
      assert.equal(el.offsetHeight, 14);
    });

    test('`flushUpdate` forces entire element update subtree to update', async () => {
      const el = new Container();
      container.appendChild(el);
      el.flushUpdate();
      assert.ok(el.sub1);
      assert.ok(el.sub2);
      assert.ok((el.sub1! as Sub).base1);
      assert.ok((el.sub1! as Sub).base2);
      assert.ok((el.sub2! as Sub).base1);
      assert.ok((el.sub2! as Sub).base2);
      assert.ok(((el.sub1! as Sub).base1 as Base).content);
      assert.ok(((el.sub1! as Sub).base2 as Base).content);
      assert.ok(((el.sub2! as Sub).base1 as Base).content);
      assert.ok(((el.sub2! as Sub).base2 as Base).content);
      el.size = '2px';
      (el.sub1 as Base).size = '2px';
      (el.sub2 as Base).size = '2px';
      ((el.sub1 as Sub).base1 as Base).size = '2px';
      ((el.sub1 as Sub).base2 as Base).size = '2px';
      ((el.sub2 as Sub).base1 as Base).size = '2px';
      ((el.sub2 as Sub).base2 as Base).size = '2px';
      el.flushUpdate();
      assert.equal(el.offsetHeight, 14);
    });

    test('`flushUpdates` forces entire page to update', async () => {
      const el1 = new Container();
      const el2 = new Container();
      container.appendChild(el1);
      container.appendChild(el2);
      UpdatingElement.flushUpdates();
      const test = (el: Container) => {
        assert.ok(el.sub1);
        assert.ok(el.sub2);
        assert.ok((el.sub1! as Sub).base1);
        assert.ok((el.sub1! as Sub).base2);
        assert.ok((el.sub2! as Sub).base1);
        assert.ok((el.sub2! as Sub).base2);
        assert.ok(((el.sub1! as Sub).base1 as Base).content);
        assert.ok(((el.sub1! as Sub).base2 as Base).content);
        assert.ok(((el.sub2! as Sub).base1 as Base).content);
        assert.ok(((el.sub2! as Sub).base2 as Base).content);
        el.size = '2px';
        (el.sub1 as Base).size = '2px';
        (el.sub2 as Base).size = '2px';
        ((el.sub1 as Sub).base1 as Base).size = '2px';
        ((el.sub1 as Sub).base2 as Base).size = '2px';
        ((el.sub2 as Sub).base1 as Base).size = '2px';
        ((el.sub2 as Sub).base2 as Base).size = '2px';
      };
      test(el1);
      test(el2);
      UpdatingElement.flushUpdates();
      assert.equal(container.offsetHeight, 28);
    });
  });
});

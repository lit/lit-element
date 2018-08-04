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

import {html, LitElement, BooleanAttribute} from '../lit-element.js';

import {stripExpressionDelimeters, generateElementName} from './test-helpers.js';

const assert = chai.assert;

suite('LitElement', () => {
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

  test('renders initial content into shadowRoot', async () => {
    const rendered = `hello world`;
    const name = generateElementName();
    customElements.define(name, class extends LitElement {
      render() { return html`${rendered}`; }
    });
    const el = document.createElement(name);
    container.appendChild(el);
    await new Promise((resolve) => {
      setTimeout(() => {
        assert.ok(el.shadowRoot);
        assert.equal(
            stripExpressionDelimeters(el.shadowRoot!.innerHTML),
            rendered);
        resolve();
      });
    });
  });

  test('invalidate waits until update/rendering', async () => {
    class E extends LitElement {
      updated = 0;
      render() { return html`${++this.updated}`; }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.invalidate();
    assert.equal(
        stripExpressionDelimeters(el.shadowRoot!.innerHTML),
        '1');
    await el.invalidate();
    assert.equal(
        stripExpressionDelimeters(el.shadowRoot!.innerHTML),
        '2');
    await el.invalidate();
    assert.equal(
        stripExpressionDelimeters(el.shadowRoot!.innerHTML),
        '3');
  });

  test('updateComplete waits for invalidate but does not trigger invalidation, async', async () => {
    class E extends LitElement {
      updated = 0;
      render() { return html`${++this.updated}`; }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    assert.equal(
        stripExpressionDelimeters(el.shadowRoot!.innerHTML),
        '1');
    await el.updateComplete;
    assert.equal(
        stripExpressionDelimeters(el.shadowRoot!.innerHTML),
        '1');
    el.invalidate();
    await el.updateComplete;
    assert.equal(
        stripExpressionDelimeters(el.shadowRoot!.innerHTML),
        '2');
    await el.updateComplete;
    assert.equal(
        stripExpressionDelimeters(el.shadowRoot!.innerHTML),
        '2');
  });

  test('shouldUpdate controls update/rendering',
       async () => {
         class E extends LitElement {

           needsUpdate = true;
           updated = 0;

           shouldUpdate() { return this.needsUpdate; }

           render() { return html`${++this.updated}`; }
         }
         customElements.define(generateElementName(), E);
         const el = new E();
         container.appendChild(el);
         await el.updateComplete;
         assert.equal(
             stripExpressionDelimeters(el.shadowRoot!.innerHTML),
             '1');
         el.needsUpdate = false;
         await el.invalidate();
         assert.equal(
             stripExpressionDelimeters(el.shadowRoot!.innerHTML),
             '1');
         el.needsUpdate = true;
         await el.invalidate();
         assert.equal(
             stripExpressionDelimeters(el.shadowRoot!.innerHTML),
             '2');
         await el.invalidate();
         assert.equal(
             stripExpressionDelimeters(el.shadowRoot!.innerHTML),
             '3');
       });

  test('can set render target to light dom', async () => {
    const rendered = `hello world`;
    const name = generateElementName();
    customElements.define(name, class extends LitElement {
      render() { return html`${rendered}`; }

      createRenderRoot() { return this; }
    });
    const el = document.createElement(name);
    container.appendChild(el);
    await (el as LitElement).updateComplete;
    assert.notOk(el.shadowRoot);
    assert.equal(stripExpressionDelimeters(el.innerHTML), rendered);
  });

  test('renders when created via constructor', async () => {
    const rendered = `hello world`;
    class E extends LitElement {
      render() { return html`${rendered}`; }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    assert.ok(el.shadowRoot);
    assert.equal(
        stripExpressionDelimeters(el.shadowRoot!.innerHTML),
        rendered);
  });

  test('property options', async() => {

    const shouldInvalidate = (value: any, old: any) => old === undefined || value > old;
    const fromAttribute = (value: any) => parseInt(value);
    const toAttribute = (value: any) => `${value}-attr`;
    class E extends LitElement {
      static get properties() {
        return {
          noAttr: {attribute: false},
          atTr: {attribute: true},
          customAttr: {attribute: 'custom', reflect: true},
          shouldInvalidate: {shouldInvalidate},
          fromAttribute: {type: fromAttribute},
          toAttribute: {reflect: true, type: {toAttribute}},
          all: {attribute: 'all-attr', shouldInvalidate, type: {fromAttribute, toAttribute}, reflect: true},
        };
      }

      noAttr = 'noAttr';
      atTr = 'attr';
      customAttr = 'customAttr';
      shouldInvalidate = 10;
      fromAttribute = 1;
      toAttribute = 1;
      all = 10;

      render() { return html``; }

    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    assert.equal(el.noAttr, 'noAttr');
    assert.equal(el.atTr, 'attr');
    assert.equal(el.customAttr, 'customAttr');
    assert.equal(el.shouldInvalidate, 10);
    assert.equal(el.fromAttribute, 1);
    assert.equal(el.toAttribute, 1);
    assert.equal(el.getAttribute('toAttribute'), '1-attr');
    assert.equal(el.all, 10);
    assert.equal(el.getAttribute('all-attr'), '10-attr');
    el.setAttribute('noattr', 'noAttr2');
    el.setAttribute('attr', 'attr2');
    el.setAttribute('custom', 'customAttr2');
    el.shouldInvalidate = 5;
    el.setAttribute('fromAttribute', '2attrr');
    el.toAttribute = 2;
    el.all = 5;
    await el.updateComplete;
    assert.equal(el.noAttr, 'noAttr');
    assert.equal(el.atTr, 'attr2');
    assert.equal(el.customAttr, 'customAttr2');
    assert.equal(el.shouldInvalidate, 10);
    assert.equal(el.fromAttribute, 2);
    assert.equal(el.toAttribute, 2);
    assert.equal(el.getAttribute('toAttribute'), '2-attr');
    assert.equal(el.all, 10);
    el.shouldInvalidate = 15;
    el.all = 15;
    await el.updateComplete;
    assert.equal(el.shouldInvalidate, 15);
    assert.equal(el.all, 15);
    assert.equal(el.getAttribute('all-attr'), '15-attr');
    el.setAttribute('all-attr', '16-attr');
    await el.updateComplete;
    assert.equal(el.getAttribute('all-attr'), '16-attr');
    assert.equal(el.all, 16);
  });


  test('property options compose when subclassing', async() => {

    const shouldInvalidate = (value: any, old: any) => old === undefined || value > old;
    const fromAttribute = (value: any) => parseInt(value);
    const toAttribute = (value: any) => `${value}-attr`;
    class E extends LitElement {
      static get properties() {
        return {
          noAttr: {attribute: false},
          atTr: {attribute: true},
          customAttr: {},
          shouldInvalidate: {},
        };
      }

      noAttr = 'noAttr';
      atTr = 'attr';
      customAttr = 'customAttr';
      shouldInvalidate = 10;
      fromAttribute = 1;
      toAttribute = 1;
      all = 10;

      render() { return html``; }

    }
    customElements.define(generateElementName(), E);

    class F extends E {
      static get properties() {
        return {
          customAttr: {attribute: 'custom', reflect: true},
          shouldInvalidate: {shouldInvalidate},
          fromAttribute: {},
          toAttribute: {},
        };
      }

      noAttr = 'noAttr';
      atTr = 'attr';
      customAttr = 'customAttr';
      shouldInvalidate = 10;
      fromAttribute = 1;
      toAttribute = 1;
      all = 10;

      render() { return html``; }

    }

    class G extends F {
      static get properties() {
        return {
          fromAttribute: {type: fromAttribute},
          toAttribute: {reflect: true, type: {toAttribute}},
          all: {attribute: 'all-attr', shouldInvalidate, type: {fromAttribute, toAttribute}, reflect: true},
        };
      }

      noAttr = 'noAttr';
      atTr = 'attr';
      customAttr = 'customAttr';
      shouldInvalidate = 10;
      fromAttribute = 1;
      toAttribute = 1;
      all = 10;

      render() { return html``; }

    }

    customElements.define(generateElementName(), G);

    const el = new G();
    container.appendChild(el);
    await el.updateComplete;
    assert.equal(el.noAttr, 'noAttr');
    assert.equal(el.atTr, 'attr');
    assert.equal(el.customAttr, 'customAttr');
    assert.equal(el.shouldInvalidate, 10);
    assert.equal(el.fromAttribute, 1);
    assert.equal(el.toAttribute, 1);
    assert.equal(el.getAttribute('toAttribute'), '1-attr');
    assert.equal(el.all, 10);
    assert.equal(el.getAttribute('all-attr'), '10-attr');
    el.setAttribute('noattr', 'noAttr2');
    el.setAttribute('attr', 'attr2');
    el.setAttribute('custom', 'customAttr2');
    el.shouldInvalidate = 5;
    el.setAttribute('fromAttribute', '2attrr');
    el.toAttribute = 2;
    el.all = 5;
    await el.updateComplete;
    assert.equal(el.noAttr, 'noAttr');
    assert.equal(el.atTr, 'attr2');
    assert.equal(el.customAttr, 'customAttr2');
    assert.equal(el.shouldInvalidate, 10);
    assert.equal(el.fromAttribute, 2);
    assert.equal(el.toAttribute, 2);
    assert.equal(el.getAttribute('toAttribute'), '2-attr');
    assert.equal(el.all, 10);
    el.shouldInvalidate = 15;
    el.all = 15;
    await el.updateComplete;
    assert.equal(el.shouldInvalidate, 15);
    assert.equal(el.all, 15);
    assert.equal(el.getAttribute('all-attr'), '15-attr');
    el.setAttribute('all-attr', '16-attr');
    await el.updateComplete;
    assert.equal(el.getAttribute('all-attr'), '16-attr');
    assert.equal(el.all, 16);

  });

   test('Attributes reflect with type.toAttribute and BooleanAttribute', async () => {
    class E extends LitElement {
      static get properties() {
        return {
          foo: {type: Number, reflect: true},
          bar: {type: BooleanAttribute, reflect: true}
        };
      }

      foo = 0;
      bar = true;

      render() { return html``; }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    assert.equal(el.getAttribute('foo'), '0');
    assert.equal(el.getAttribute('bar'), '');
    el.foo = 5;
    el.bar = false;
    await el.updateComplete;
    assert.equal(el.getAttribute('foo'), '5');
    assert.equal(el.hasAttribute('bar'), false);
  });

  test('updates/renders when properties change', async () => {
    class E extends LitElement {
      static get properties() { return { foo: {}}; }

      foo = 'one';

      render() { return html`${this.foo}`; }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    assert.ok(el.shadowRoot);
    await el.updateComplete;
    assert.equal(
        stripExpressionDelimeters(el.shadowRoot!.innerHTML),
        'one');
    el.foo = 'changed';
    await el.updateComplete;
    assert.equal(
        stripExpressionDelimeters(el.shadowRoot!.innerHTML),
        'changed');
  });

  test('updates/renders when properties and attributes change', async() => {
    class E extends LitElement {
      static get properties() {
        return {
          value: {},
          attrValue: {}
        };
      }

      value = '1';
      attrValue = 'attr';

      updatedValue = '';
      updatedAttrValue = '';

      render() { return html``; }

      update() {
        super.update();
        this.updatedValue = this.value;
        this.updatedAttrValue = this.attrValue;
      }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    assert.ok(el.shadowRoot);
    await el.updateComplete;
    assert.equal(el.updatedValue, '1');
    assert.equal(el.updatedAttrValue, 'attr');
    el.value = '2';
    await el.updateComplete;
    assert.equal(el.updatedValue, '2');
    assert.equal(el.updatedAttrValue, 'attr');
    el.attrValue = 'attr2';
    await el.updateComplete;
    assert.equal(el.updatedValue, '2');
    assert.equal(el.updatedAttrValue, 'attr2');
    el.setAttribute('attrValue', 'attr3');
    await el.updateComplete;
    assert.equal(el.updatedValue, '2');
    assert.equal(el.updatedAttrValue, 'attr3');
    el.value = '3';
    el.setAttribute('attrValue', 'attr4');
    await el.updateComplete;
    assert.equal(el.updatedValue, '3');
    assert.equal(el.updatedAttrValue, 'attr4');
  });

  test('updates/renders changes when attributes change', async () => {
    class E extends LitElement {
      static get properties() {
        return {foo: {}};
      }

      foo = 'one';

      render() { return html`${this.foo}`; }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    assert.ok(el.shadowRoot);
    assert.equal(
        stripExpressionDelimeters(el.shadowRoot!.innerHTML),
        'one');
    el.setAttribute('foo', 'changed');
    await el.updateComplete;
    assert.equal(
        stripExpressionDelimeters(el.shadowRoot!.innerHTML),
        'changed');
  });

  test('User defined accessor using setProperty/getProperty can trigger update/render', async () => {
    class E extends LitElement {
      __bar?: number;

      static get properties() { return {foo: {}, bar: {}}; }

      info: string[] = [];
      foo = 0;

      get bar() { return this.getProperty('bar'); }

      set bar(value) {
        this.__bar = Number(value);
        this.setProperty('bar', value);
      }

      render() {
        this.info.push('render');
        return html`${this.foo}${this.bar}`;
      }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    el.setAttribute('bar', '20');
    await el.updateComplete;
    assert.equal(el.bar, 20);
    assert.equal(el.__bar, 20);
    assert.equal(stripExpressionDelimeters(el.shadowRoot!.innerHTML), '020');
  });

  test('updates/renders attributes, properties, and event listeners via lit-html',
       async () => {
         class E extends LitElement {
           _event?: Event;

           render() {
             const attr = 'attr';
             const prop = 'prop';
             const event = (e: Event) => { this._event = e; };
             return html
             `<div attr$="${attr}" prop="${prop}" on-zug="${event}"></div>`;
           }
         }
         customElements.define(generateElementName(), E);
         const el = new E();
         container.appendChild(el);
         await el.updateComplete;
         const d = el.shadowRoot!.querySelector('div')! as (HTMLDivElement &
                                                            {prop: string});
         assert.equal(d.getAttribute('attr'), 'attr');
         assert.equal(d.prop, 'prop');
         const e = new Event('zug');
         d.dispatchEvent(e);
         assert.equal(el._event, e);
       });

  test(
      'render lifecycle order: shouldUpdate, update, render, updateComplete', async () => {
        class E extends LitElement {
          static get properties() { return {
            foo: {type: Number}
          }; }

          info: Array<string> = [];

          shouldUpdate() {
            this.info.push('shouldUpdate');
            return true;
          }

          render() {
            this.info.push('render');
            return html`hi`;
          }

          update() {
            this.info.push('before-update');
            super.update();
          }

          async finishUpdate() {
            this.info.push('finishUpdate');
          }


        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        await el.updateComplete;
        el.info.push('updateComplete');
        assert.deepEqual(
            el.info,
            [ 'shouldUpdate', 'before-update', 'render', 'finishUpdate', 'updateComplete' ]);
      });

  test('setting properties in update does not trigger invalidation', async () => {
    class E extends LitElement {

      static get properties() {
        return {
          foo: {}
        };
      }
      promiseFulfilled = false;
      foo = 0;
      updated = 0;

      update() {
        this.updated++;
        this.foo++;
        super.update();
      }

      render() {
        return html`${this.foo}`;
      }

    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    assert.equal(el.foo, 1);
    assert.equal(el.updated, 1);
    assert.equal(el.shadowRoot!.textContent, '1');
    el.foo = 5;
    await el.updateComplete;
    assert.equal(el.foo, 6);
    assert.equal(el.updated, 2);
    assert.equal(el.shadowRoot!.textContent, '6');
  });

  test('setting properties in finishUpdate does trigger invalidation blocks updateComplete', async () => {
    class E extends LitElement {

      static get properties() {
        return {
          foo: {}
        };
      }
      promiseFulfilled = false;
      foo = 0;
      updated = 0;
      fooMax = 2;

      async finishUpdate() {
        this.updated++;
        if (this.foo < this.fooMax) {
          this.foo++;
        }
      }

      render() {
        return html`${this.foo}`;
      }

    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    assert.equal(el.foo, 2);
    assert.equal(el.updated, 3);
    assert.equal(el.shadowRoot!.textContent, '2');
    el.fooMax = 10;
    el.foo = 5;
    await el.updateComplete;
    assert.equal(el.foo, 10);
    assert.equal(el.updated, 9);
    assert.equal(el.shadowRoot!.textContent, '10');
  });

  test('can await promise in finishUpdate', async () => {
    class E extends LitElement {

      static get properties() {
        return {
          foo: {}
        };
      }
      promiseFulfilled = false;
      foo = 0;

      render() {
        return html`${this.foo}`;
      }

      async finishUpdate() {
        await new Promise((resolve) => {
          setTimeout(() => {
            this.promiseFulfilled = true;
            resolve();
          }, 1);
        });
      }

    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    assert.isTrue(el.promiseFulfilled);
  });

  test('updateComplete resolved after any properties set within finishUpdate', async () => {
    class E extends LitElement {

      static get properties() {
        return {
          foo: {}
        };
      }

      foo = 0;

      render() {
        return html`${this.foo}`;
      }

      async finishUpdate() {
        if (this.foo < 10) {
          this.foo++;
        }
      }

    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    assert.equal(el.foo, 10);
    assert.equal(el.shadowRoot!.textContent, '10');
  });

  test('can await sub-element updateComplete in finishUpdate', async () => {
    class E extends LitElement {

      static get properties() {
        return {
          foo: {}
        };
      }
      promiseFulfilled = false;
      foo = 'hi';

      render() {
        return html`${this.foo}`;
      }

      async finishUpdate() {
        await new Promise((resolve) => {
          setTimeout(() => {
            this.promiseFulfilled = true;
            resolve();
          }, 0);
        });
      }

    }
    customElements.define('x-1224', E);

    class F extends LitElement {

      inner: E|null = null;

      render() {
        return html`<x-1224></x-1224>`;
      }

      async finishUpdate() {
        this.inner = this.shadowRoot!.querySelector('x-1224');
        this.inner!.foo = 'yo';
        await this.inner!.updateComplete;
      }

    }
    customElements.define(generateElementName(), F);
    const el = new F();
    container.appendChild(el);
    await el.updateComplete;
    assert.equal(el.inner!.shadowRoot!.textContent, 'yo');
    assert.isTrue(el.inner!.promiseFulfilled);
  });

  test('properties set before upgrade are applied', async () => {
    const name = generateElementName();
    const el = document.createElement(name);
    container.appendChild(el);
    (el as any).foo = 'hi';
    (el as any).bar = false;
    const objectValue = {};
    (el as any).zug = objectValue;
    class E extends LitElement {
      static get properties() {
        return {
          foo: {},
          bar: {},
          zug: {}
        };
      }

      foo = '';
      bar = true;
      zug = null;

      render() {
        return html`test`;
      }
    }
    customElements.define(name, E);
    await (el as LitElement).updateComplete;
    assert.equal((el as any).foo, 'hi');
    assert.equal((el as any).bar, false);
    assert.equal((el as any).zug, objectValue);
  });

});

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

import { LitElement, html, renderAttributes, classString, styleString } from '../lit-element.js';

/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />

const assert = chai.assert;

suite('LitElement', () => {

  test('renders initial content', () => {
    const rendered = `hello world`;
    class X1 extends LitElement {
      render() {
        return html`${rendered}`
      }
    }
    customElements.define('x-1', X1);
    const el = <X1>document.createElement('x-1');
    document.body.appendChild(el);
    assert.ok(el.shadowRoot);
    assert.equal(el.shadowRoot!.innerHTML, rendered);
    document.body.removeChild(el);
  });

  test('renders when created via constructor', () => {
    const rendered = `hello world`;
    class X2 extends LitElement {
      render() {
        return html`${rendered}`
      }
    };
    customElements.define('x-2', X2);
    const el = new X2();
    document.body.appendChild(el);
    assert.ok(el.shadowRoot);
    assert.equal(el.shadowRoot!.innerHTML, rendered);
    document.body.removeChild(el);
  });

  test('renders changes when properties change', (done) => {
    class X3 extends LitElement {
      static get properties() {
        return {
          foo: String
        }
      }

      foo = 'one';

      render(props: any) {
        return html`${props.foo}`
      }
    }
    customElements.define('x-3', X3);
    const el = <X3>document.createElement('x-3');
    document.body.appendChild(el);
    assert.ok(el.shadowRoot);
    assert.equal(el.shadowRoot!.innerHTML, 'one');
    el.foo = 'changed';
    requestAnimationFrame(() => {
      assert.equal(el.shadowRoot!.innerHTML, 'changed');
      document.body.removeChild(el);
      done();
    });
  });

  test('renders changes when attributes change', (done) => {
    class X4 extends LitElement {
      static get properties() {
        return {
          foo: String
        }
      }

      foo = 'one';

      render(props: any) {
        return html`${props.foo}`
      }
    }
    customElements.define('x-4', X4);
    const el = <X4>document.createElement('x-4');
    document.body.appendChild(el);
    assert.ok(el.shadowRoot);
    assert.equal(el.shadowRoot!.innerHTML, 'one');
    el.setAttribute('foo', 'changed');
    requestAnimationFrame(() => {
      assert.equal(el.shadowRoot!.innerHTML, 'changed');
      document.body.removeChild(el);
      done();
    });
  });

  test('renders changes made at `ready` time', () => {
    class X5 extends LitElement {
      static get properties() {
        return {
          foo: String
        }
      }

      foo = 'one';

      ready() {
        this.foo = 'changed';
        super.ready();
      }

      render(props: any) {
        return html`${props.foo}`
      }
    }
    customElements.define('x-5', X5);
    const el = <X5>document.createElement('x-5');
    document.body.appendChild(el);
    assert.ok(el.shadowRoot);
    assert.equal(el.shadowRoot!.innerHTML, 'changed');
    document.body.removeChild(el);
  });

  test('nextRendered waits until next rendering', async () => {
    class X6 extends LitElement {
      static get properties() {
        return {
          foo: Number
        }
      }

      foo = 0;

      render(props: any) {
        return html`${props.foo}`
      }
    }
    customElements.define('x-6', X6);
    const el = <X6>document.createElement('x-6');
    document.body.appendChild(el);
    el.foo++;
    await el.renderComplete;
    assert.equal(el.shadowRoot!.innerHTML, '1');
    el.foo++;
    await el.renderComplete;
    assert.equal(el.shadowRoot!.innerHTML, '2');
    el.foo++;
    await el.renderComplete;
    assert.equal(el.shadowRoot!.innerHTML, '3');
    document.body.removeChild(el);
  });

  test('propertiesChanged called after render', async () => {
    class X7 extends LitElement {
      static get properties() {
        return {
          foo: Number
        }
      }

      info: {text: string}[] = [];

      foo = 0;

      render(props: any) {
        return html`${props.foo}`
      }

      _propertiesChanged(props: any, changedProps: any, prevProps: any) {
        super._propertiesChanged(props, changedProps, prevProps);
        this.info.push({text: this.shadowRoot!.innerHTML});
      }
    }
    customElements.define('x-7', X7);
    const el = new X7();
    document.body.appendChild(el);
    assert.equal(el.info.length, 1);
    assert.equal(el.info[0].text, '0');
    el.foo = 5;
    await el.renderComplete;
    assert.equal(el.info.length, 2);
    assert.equal(el.info[1].text, '5');
    document.body.removeChild(el);
  });

  test('didRender called after render', async () => {
    class X8 extends LitElement {
      static get properties() {
        return {
          foo: Number
        }
      }

      info: {text: string}[] = [];

      foo = 0;

      render(props: any) {
        return html`${props.foo}`
      }

      didRender() {
          this.info.push({text: this.shadowRoot!.innerHTML});
      }
    }
    customElements.define('x-8', X8);
    const el = new X8();
    document.body.appendChild(el);
    assert.equal(el.info.length, 1);
    assert.equal(el.info[0].text, '0');
    el.foo = 5;
    await el.renderComplete;
    assert.equal(el.info.length, 2);
    assert.equal(el.info[1].text, '5');
    document.body.removeChild(el);
  });

  test('Rendering order is render, propertiesChanged, didRender, renderComplete', async () => {
    class X9 extends LitElement {
      static get properties() {
        return {
          foo: Number
        }
      }

      info: ('render'|'didRender'|'propertiesChanged')[] = [];
      foo = 0;

      render(props: any) {
        this.info.push('render');
        return html`${props.foo}`
      }

      didRender() {
        this.info.push('didRender');
      }

      _propertiesChanged(props: any, changedProps: any, prevProps: any) {
        super._propertiesChanged(props, changedProps, prevProps);
        this.info.push('propertiesChanged');
      }
    }
    customElements.define('x-9', X9);
    const el = new X9();
    document.body.appendChild(el);
    assert.deepEqual(el.info, ['render', 'didRender', 'propertiesChanged']);
    el.info = [];
    el.foo++;
    await el.renderComplete;
    assert.deepEqual(el.info, ['render', 'didRender', 'propertiesChanged']);
    document.body.removeChild(el);
  });

  test('User defined accessor can trigger rendering', async () => {
    class X10 extends LitElement {
      static get properties() {
        return {
          foo: Number,
          bar: Number
        }
      }

      info: 'render'[]= [];
      foo = 0;
      __bar: any;

      get bar() {
        return this._getProperty('bar');
      }

      set bar(value) {
        this.__bar = value;
        this._setProperty('bar', value);
      }

      render(props: any) {
        this.info.push('render');
        return html`${props.foo}${props.bar}`
      }

    }
    customElements.define('x-10', X10);
    const el = new X10();
    document.body.appendChild(el);
    el.setAttribute('bar', '20');
    await el.renderComplete;
    assert.equal(el.bar, 20);
    assert.equal(el.__bar, 20);
    assert.equal(el.shadowRoot!.innerHTML, '020');
    document.body.removeChild(el);
  });

  test('renderAttributes renders attributes on element', async () => {
    class X11 extends LitElement {
      static get properties() {
        return {
          foo: Number,
          bar: Boolean
        }
      }

      foo = 0;
      bar = true;

      render({foo, bar}: any) {
        renderAttributes(this, {foo, bar});
        return html`${foo}${bar}`
      }
    }
    customElements.define('x-11', X11);
    const el = new X11();
    document.body.appendChild(el);
    assert.equal(el.getAttribute('foo'), '0');
    assert.equal(el.getAttribute('bar'), '');
    el.foo = 5;
    el.bar = false;
    await el.renderComplete;
    assert.equal(el.getAttribute('foo'), '5');
    assert.equal(el.hasAttribute('bar'), false);
    document.body.removeChild(el);
  });

  test('classString updates classes', async () => {
    class X12 extends LitElement {
      static get properties() {
        return {
          foo: Number,
          bar: Boolean,
          baz: Boolean
        }
      }

      foo = 0;
      bar = true;
      baz = false;

      render({foo, bar, baz}: any) {
        return html`<div class$="${classString({foo, bar, zonk: baz})}"></div>`;
      }
    }
    customElements.define('x-12', X12);
    const el = new X12();
    document.body.appendChild(el);
    const d = <HTMLDivElement>el.shadowRoot!.querySelector('div');
    assert.equal(d.className, 'bar');
    el.foo = 1;
    el.baz = true;
    await el.renderComplete;
    assert.equal(d.className, 'foo bar zonk');
    el.bar = false;
    await el.renderComplete;
    assert.equal(d.className, 'foo zonk');
    el.foo = 0;
    el.baz = false;
    await el.renderComplete;
    assert.equal(d.className, '');
    document.body.removeChild(el);
  });

  test('styleString updates style', async () => {
    class X13 extends LitElement {
      static get properties() {
        return {
          transitionDuration: Number,
          borderTop: Boolean,
          zug: Boolean
        }
      }

      transitionDuration = `0ms`;
      borderTop = ``;
      zug = `0px`;

      render({transitionDuration, borderTop, zug}: any) {
        return html`<div style$="${styleString({transitionDuration, borderTop, height: zug})}"></div>`;
      }
    }
    customElements.define('x-13', X13);
    const el = new X13();
    document.body.appendChild(el);
    const d = <HTMLDivElement>el.shadowRoot!.querySelector('div');
    assert.equal(d.style.cssText, 'transition-duration: 0ms; height: 0px;');
    el.transitionDuration = `100ms`;
    el.borderTop = `5px`;
    await el.renderComplete;
    assert.equal(d.style.cssText, 'transition-duration: 100ms; border-top: 5px; height: 0px;');
    el.transitionDuration = ``;
    el.borderTop = ``;
    el.zug = ``;
    await el.renderComplete;
    assert.equal(d.style.cssText, '');
    document.body.removeChild(el);
  });

  test('render attributes, properties, and event listeners via lit-html', function() {
    class X14 extends LitElement {
      _event: Event | undefined;

      render() {
        const attr = 'attr';
        const prop = 'prop';
        const event = (e: Event) => {
          this._event = e;
        }
        return html`<div attr$="${attr}" prop="${prop}" on-zug="${event}"></div>`;
      }
    }

    interface X14DivElement {
      prop: string
    }

    customElements.define('x-14', X14);
    const el = new X14();
    document.body.appendChild(el);
    const d = <HTMLDivElement & X14DivElement>el.shadowRoot!.querySelector('div');
    assert.equal(d.getAttribute('attr'), 'attr');
    assert.equal(d.prop, 'prop');
    const e = new Event('zug');
    d.dispatchEvent(e);
    assert.equal(el._event, e);
    document.body.removeChild(el);
  });

});

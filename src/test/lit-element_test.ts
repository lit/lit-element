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

import {
  html,
  LitElement,
  property,
  PropertyDeclarations,
  PropertyValues
} from '../lit-element.js';

import {
  generateElementName,
  stripExpressionDelimeters
} from './test-helpers.js';

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
        assert.equal(stripExpressionDelimeters(el.shadowRoot!.innerHTML),
                     rendered);
        resolve();
      });
    });
  });

  test('`requestUpdate` waits until update/rendering', async () => {
    class E extends LitElement {
      updateCount = 0;
      render() { return html`${++this.updateCount}`; }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.requestUpdate();
    assert.equal(stripExpressionDelimeters(el.shadowRoot!.innerHTML), '1');
    await el.requestUpdate();
    assert.equal(stripExpressionDelimeters(el.shadowRoot!.innerHTML), '2');
    await el.requestUpdate();
    assert.equal(stripExpressionDelimeters(el.shadowRoot!.innerHTML), '3');
  });

  test(
      '`updateComplete` waits for `requestUpdate` but does not trigger update, async',
      async () => {
        class E extends LitElement {
          updateCount = 0;
          render() { return html`${++this.updateCount}`; }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        await el.updateComplete;
        assert.equal(stripExpressionDelimeters(el.shadowRoot!.innerHTML), '1');
        await el.updateComplete;
        assert.equal(stripExpressionDelimeters(el.shadowRoot!.innerHTML), '1');
        el.requestUpdate();
        await el.updateComplete;
        assert.equal(stripExpressionDelimeters(el.shadowRoot!.innerHTML), '2');
        await el.updateComplete;
        assert.equal(stripExpressionDelimeters(el.shadowRoot!.innerHTML), '2');
      });

  test('`shouldUpdate` controls update/rendering', async () => {
    class E extends LitElement {

      needsUpdate = true;
      updateCount = 0;

      shouldUpdate() { return this.needsUpdate; }

      render() { return html`${++this.updateCount}`; }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    assert.equal(stripExpressionDelimeters(el.shadowRoot!.innerHTML), '1');
    el.needsUpdate = false;
    await el.requestUpdate();
    assert.equal(stripExpressionDelimeters(el.shadowRoot!.innerHTML), '1');
    el.needsUpdate = true;
    await el.requestUpdate();
    assert.equal(stripExpressionDelimeters(el.shadowRoot!.innerHTML), '2');
    await el.requestUpdate();
    assert.equal(stripExpressionDelimeters(el.shadowRoot!.innerHTML), '3');
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
    assert.equal(stripExpressionDelimeters(el.shadowRoot!.innerHTML), rendered);
  });

  test('property options', async () => {
    const hasChanged = (value: any, old: any) =>
        old === undefined || value > old;
    const fromAttribute = (value: any) => parseInt(value);
    const toAttribute = (value: any) => `${value}-attr`;
    class E extends LitElement {
      static get properties() {
        return {
          noAttr : {attribute : false},
          atTr : {attribute : true},
          customAttr : {attribute : 'custom', reflect : true},
          hasChanged : {hasChanged},
          fromAttribute : {type : fromAttribute},
          toAttribute : {reflect : true, type : {toAttribute}},
          all : {
            attribute : 'all-attr',
            hasChanged,
            type : {fromAttribute, toAttribute},
            reflect : true
          },
        };
      }

      noAttr = 'noAttr';
      atTr = 'attr';
      customAttr = 'customAttr';
      hasChanged = 10;
      fromAttribute = 1;
      toAttribute = 1;
      all = 10;

      updateCount = 0;

      update(changed: PropertyValues) {
        this.updateCount++;
        super.update(changed);
      }

      render() { return html``; }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    assert.equal(el.updateCount, 1);
    assert.equal(el.noAttr, 'noAttr');
    assert.equal(el.atTr, 'attr');
    assert.equal(el.customAttr, 'customAttr');
    assert.equal(el.hasChanged, 10);
    assert.equal(el.fromAttribute, 1);
    assert.equal(el.toAttribute, 1);
    assert.equal(el.getAttribute('toattribute'), '1-attr');
    assert.equal(el.all, 10);
    assert.equal(el.getAttribute('all-attr'), '10-attr');
    el.setAttribute('noattr', 'noAttr2');
    el.setAttribute('attr', 'attr2');
    el.setAttribute('custom', 'customAttr2');
    el.setAttribute('fromattribute', '2attr');
    el.toAttribute = 2;
    el.all = 5;
    await el.updateComplete;
    assert.equal(el.updateCount, 2);
    assert.equal(el.noAttr, 'noAttr');
    assert.equal(el.atTr, 'attr2');
    assert.equal(el.customAttr, 'customAttr2');
    assert.equal(el.fromAttribute, 2);
    assert.equal(el.toAttribute, 2);
    assert.equal(el.getAttribute('toattribute'), '2-attr');
    assert.equal(el.all, 5);
    el.all = 15;
    await el.updateComplete;
    assert.equal(el.updateCount, 3);
    assert.equal(el.all, 15);
    assert.equal(el.getAttribute('all-attr'), '15-attr');
    el.setAttribute('all-attr', '16-attr');
    await el.updateComplete;
    assert.equal(el.updateCount, 4);
    assert.equal(el.getAttribute('all-attr'), '16-attr');
    assert.equal(el.all, 16);
    el.hasChanged = 5;
    await el.updateComplete;
    assert.equal(el.hasChanged, 5);
    assert.equal(el.updateCount, 4);
    el.hasChanged = 15;
    await el.updateComplete;
    assert.equal(el.hasChanged, 15);
    assert.equal(el.updateCount, 5);
    el.setAttribute('all-attr', '5-attr');
    await el.updateComplete;
    assert.equal(el.all, 5);
    assert.equal(el.updateCount, 5);
    el.all = 15;
    await el.updateComplete;
    assert.equal(el.all, 15);
    assert.equal(el.updateCount, 6);
  });

  test('property options via decorator', async () => {
    const hasChanged = (value: any, old: any) =>
        old === undefined || value > old;
    const fromAttribute = (value: any) => parseInt(value);
    const toAttribute = (value: any) => `${value}-attr`;
    class E extends LitElement {

      @property({attribute : false}) noAttr = 'noAttr';
      @property({attribute : true}) atTr = 'attr';
      @property({attribute : 'custom', reflect: true})
      customAttr = 'customAttr';
      @property({hasChanged}) hasChanged = 10;
      @property({type : fromAttribute}) fromAttribute = 1;
      @property({reflect : true, type: {toAttribute}}) toAttribute = 1;
      @property({
        attribute : 'all-attr',
        hasChanged,
        type: {fromAttribute, toAttribute},
        reflect: true
      })
      all = 10;

      updateCount = 0;

      update(changed: PropertyValues) {
        this.updateCount++;
        super.update(changed);
      }

      render() { return html``; }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    assert.equal(el.updateCount, 1);
    assert.equal(el.noAttr, 'noAttr');
    assert.equal(el.atTr, 'attr');
    assert.equal(el.customAttr, 'customAttr');
    assert.equal(el.hasChanged, 10);
    assert.equal(el.fromAttribute, 1);
    assert.equal(el.toAttribute, 1);
    assert.equal(el.getAttribute('toattribute'), '1-attr');
    assert.equal(el.all, 10);
    assert.equal(el.getAttribute('all-attr'), '10-attr');
    el.setAttribute('noattr', 'noAttr2');
    el.setAttribute('attr', 'attr2');
    el.setAttribute('custom', 'customAttr2');
    el.setAttribute('fromattribute', '2attr');
    el.toAttribute = 2;
    el.all = 5;
    await el.updateComplete;
    assert.equal(el.updateCount, 2);
    assert.equal(el.noAttr, 'noAttr');
    assert.equal(el.atTr, 'attr2');
    assert.equal(el.customAttr, 'customAttr2');
    assert.equal(el.fromAttribute, 2);
    assert.equal(el.toAttribute, 2);
    assert.equal(el.getAttribute('toattribute'), '2-attr');
    assert.equal(el.all, 5);
    el.all = 15;
    await el.updateComplete;
    assert.equal(el.updateCount, 3);
    assert.equal(el.all, 15);
    assert.equal(el.getAttribute('all-attr'), '15-attr');
    el.setAttribute('all-attr', '16-attr');
    await el.updateComplete;
    assert.equal(el.updateCount, 4);
    assert.equal(el.getAttribute('all-attr'), '16-attr');
    assert.equal(el.all, 16);
    el.hasChanged = 5;
    await el.updateComplete;
    assert.equal(el.hasChanged, 5);
    assert.equal(el.updateCount, 4);
    el.hasChanged = 15;
    await el.updateComplete;
    assert.equal(el.hasChanged, 15);
    assert.equal(el.updateCount, 5);
    el.setAttribute('all-attr', '5-attr');
    await el.updateComplete;
    assert.equal(el.all, 5);
    assert.equal(el.updateCount, 5);
    el.all = 15;
    await el.updateComplete;
    assert.equal(el.all, 15);
    assert.equal(el.updateCount, 6);
  });

  test('can mix property options via decorator and via getter', async () => {
    const hasChanged = (value: any, old: any) =>
        old === undefined || value > old;
    const fromAttribute = (value: any) => parseInt(value);
    const toAttribute = (value: any) => `${value}-attr`;
    class E extends LitElement {

      @property({hasChanged}) hasChanged = 10;
      @property({type : fromAttribute}) fromAttribute = 1;
      @property({reflect : true, type: {toAttribute}}) toAttribute = 1;
      @property({
        attribute : 'all-attr',
        hasChanged,
        type: {fromAttribute, toAttribute},
        reflect: true
      })
      all = 10;

      updateCount = 0;

      static get properties() {
        return {
          noAttr : {attribute : false},
          atTr : {attribute : true},
          customAttr : {attribute : 'custom', reflect : true},
        };
      }

      noAttr: string|undefined;
      atTr: string|undefined;
      customAttr: string|undefined;

      constructor() {
        super();
        this.noAttr = 'noAttr';
        this.atTr = 'attr';
        this.customAttr = 'customAttr';
      }

      update(changed: PropertyValues) {
        this.updateCount++;
        super.update(changed);
      }

      render() { return html``; }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    assert.equal(el.updateCount, 1);
    assert.equal(el.noAttr, 'noAttr');
    assert.equal(el.atTr, 'attr');
    assert.equal(el.customAttr, 'customAttr');
    assert.equal(el.hasChanged, 10);
    assert.equal(el.fromAttribute, 1);
    assert.equal(el.toAttribute, 1);
    assert.equal(el.getAttribute('toattribute'), '1-attr');
    assert.equal(el.all, 10);
    assert.equal(el.getAttribute('all-attr'), '10-attr');
    el.setAttribute('noattr', 'noAttr2');
    el.setAttribute('attr', 'attr2');
    el.setAttribute('custom', 'customAttr2');
    el.setAttribute('fromattribute', '2attr');
    el.toAttribute = 2;
    el.all = 5;
    await el.updateComplete;
    assert.equal(el.updateCount, 2);
    assert.equal(el.noAttr, 'noAttr');
    assert.equal(el.atTr, 'attr2');
    assert.equal(el.customAttr, 'customAttr2');
    assert.equal(el.fromAttribute, 2);
    assert.equal(el.toAttribute, 2);
    assert.equal(el.getAttribute('toattribute'), '2-attr');
    assert.equal(el.all, 5);
    el.all = 15;
    await el.updateComplete;
    assert.equal(el.updateCount, 3);
    assert.equal(el.all, 15);
    assert.equal(el.getAttribute('all-attr'), '15-attr');
    el.setAttribute('all-attr', '16-attr');
    await el.updateComplete;
    assert.equal(el.updateCount, 4);
    assert.equal(el.getAttribute('all-attr'), '16-attr');
    assert.equal(el.all, 16);
    el.hasChanged = 5;
    await el.updateComplete;
    assert.equal(el.hasChanged, 5);
    assert.equal(el.updateCount, 4);
    el.hasChanged = 15;
    await el.updateComplete;
    assert.equal(el.hasChanged, 15);
    assert.equal(el.updateCount, 5);
    el.setAttribute('all-attr', '5-attr');
    await el.updateComplete;
    assert.equal(el.all, 5);
    assert.equal(el.updateCount, 5);
    el.all = 15;
    await el.updateComplete;
    assert.equal(el.all, 15);
    assert.equal(el.updateCount, 6);
  });

  test('attributes deserialize from html', async () => {
    const fromAttribute = (value: any) => parseInt(value);
    const toAttributeOnly = (value: any) =>
        typeof value === 'string' && value.indexOf(`-attr`) > 0
            ? value
            : `${value}-attr`;
    const toAttribute = (value: any) => `${value}-attr`;
    class E extends LitElement {
      static get properties() {
        return {
          noAttr : {attribute : false},
          atTr : {attribute : true},
          customAttr : {attribute : 'custom', reflect : true},
          fromAttribute : {type : fromAttribute},
          toAttribute :
              {reflect : true, type : {toAttribute : toAttributeOnly}},
          all : {
            attribute : 'all-attr',
            type : {fromAttribute, toAttribute},
            reflect : true
          },
        };
      }

      noAttr = 'noAttr';
      atTr = 'attr';
      customAttr = 'customAttr';
      fromAttribute = 1;
      toAttribute: string|number = 1;
      all = 10;

      render() { return html``; }
    }
    const name = generateElementName();
    customElements.define(name, E);
    container.innerHTML = `<${name}
      noattr="1"
      attr="2"
      custom="3"
      fromAttribute="6-attr"
      toAttribute="7"
      all-attr="11-attr"></${name}>`;
    const el = container.firstChild as E;
    await el.updateComplete;
    assert.equal(el.noAttr, 'noAttr');
    assert.equal(el.getAttribute('noattr'), '1');
    assert.equal(el.atTr, '2');
    assert.equal(el.customAttr, '3');
    assert.equal(el.getAttribute('custom'), '3');
    assert.equal(el.fromAttribute, 6);
    assert.equal(el.toAttribute, '7');
    assert.equal(el.getAttribute('toattribute'), '7-attr');
    assert.equal(el.all, 11);
    assert.equal(el.getAttribute('all-attr'), '11-attr');
  });

  if (Object.getOwnPropertySymbols) {
    test('properties defined using symbols', async () => {
      const zug = Symbol();

      class E extends LitElement {

        static get properties() { return {foo : {}, [zug] : {}}; }
        updateCount = 0;
        foo = 5;
        [zug] = 6;

        render() { return html``; }

        update(changedProperties: PropertyValues) {
          this.updateCount++;
          super.update(changedProperties);
        }
      }
      customElements.define(generateElementName(), E);
      const el = new E();
      container.appendChild(el);
      await el.updateComplete;
      assert.equal(el.updateCount, 1);
      assert.equal(el.foo, 5);
      assert.equal(el[zug], 6);
      el.foo = 55;
      await el.updateComplete;
      assert.equal(el.updateCount, 2);
      assert.equal(el.foo, 55);
      assert.equal(el[zug], 6);
      el[zug] = 66;
      await el.updateComplete;
      assert.equal(el.updateCount, 3);
      assert.equal(el.foo, 55);
      assert.equal(el[zug], 66);
    });

    test('properties as symbols can set property options', async () => {
      const zug = Symbol();

      class E extends LitElement {

        static get properties() {
          return {
            [zug] : {
              attribute : 'zug',
              reflect : true,
              type : (value: string) => Number(value) + 100
            }
          };
        }

        constructor() {
          super();
          (this as any)[zug] = 5;
        }

        render() { return html``; }
      }
      customElements.define(generateElementName(), E);
      const el = new E() as any;
      container.appendChild(el);
      await el.updateComplete;
      assert.equal(el[zug], 5);
      assert.equal(el.getAttribute('zug'), '5');
      el[zug] = 6;
      await el.updateComplete;
      assert.equal(el[zug], 6);
      assert.equal(el.getAttribute('zug'), '6');
      el.setAttribute('zug', '7');
      await el.updateComplete;
      assert.equal(el.getAttribute('zug'), '107');
      assert.equal(el[zug], 107);
    });
  }

  test('property options compose when subclassing', async () => {
    const hasChanged = (value: any, old: any) =>
        old === undefined || value > old;
    const fromAttribute = (value: any) => parseInt(value);
    const toAttribute = (value: any) => `${value}-attr`;
    class E extends LitElement {
      static get properties(): PropertyDeclarations {
        return {
          noAttr : {attribute : false},
          atTr : {attribute : true},
          customAttr : {},
          hasChanged : {},
        };
      }

      noAttr = 'noAttr';
      atTr = 'attr';
      customAttr = 'customAttr';
      hasChanged = 10;

      updateCount = 0;

      update(changed: PropertyValues) {
        this.updateCount++;
        super.update(changed);
      }

      render() { return html``; }
    }
    customElements.define(generateElementName(), E);

    class F extends E {
      static get properties(): PropertyDeclarations {
        return {
          customAttr : {attribute : 'custom', reflect : true},
          hasChanged : {hasChanged},
          fromAttribute : {},
          toAttribute : {},
        };
      }

      fromAttribute = 1;
      toAttribute = 1;
      all = 10;
    }

    class G extends F {
      static get properties(): PropertyDeclarations {
        return {
          fromAttribute : {type : fromAttribute},
          toAttribute : {reflect : true, type : {toAttribute}},
          all : {
            attribute : 'all-attr',
            hasChanged,
            type : {fromAttribute, toAttribute},
            reflect : true
          },
        };
      }
    }

    customElements.define(generateElementName(), G);

    const el = new G();
    container.appendChild(el);
    await el.updateComplete;
    assert.equal(el.updateCount, 1);
    assert.equal(el.noAttr, 'noAttr');
    assert.equal(el.atTr, 'attr');
    assert.equal(el.customAttr, 'customAttr');
    assert.equal(el.hasChanged, 10);
    assert.equal(el.fromAttribute, 1);
    assert.equal(el.toAttribute, 1);
    assert.equal(el.getAttribute('toattribute'), '1-attr');
    assert.equal(el.all, 10);
    assert.equal(el.getAttribute('all-attr'), '10-attr');
    el.setAttribute('noattr', 'noAttr2');
    el.setAttribute('attr', 'attr2');
    el.setAttribute('custom', 'customAttr2');
    el.setAttribute('fromattribute', '2attr');
    el.toAttribute = 2;
    el.all = 5;
    await el.updateComplete;
    assert.equal(el.updateCount, 2);
    assert.equal(el.noAttr, 'noAttr');
    assert.equal(el.atTr, 'attr2');
    assert.equal(el.customAttr, 'customAttr2');
    assert.equal(el.fromAttribute, 2);
    assert.equal(el.toAttribute, 2);
    assert.equal(el.getAttribute('toattribute'), '2-attr');
    assert.equal(el.all, 5);
    el.all = 15;
    await el.updateComplete;
    assert.equal(el.updateCount, 3);
    assert.equal(el.all, 15);
    assert.equal(el.getAttribute('all-attr'), '15-attr');
    el.setAttribute('all-attr', '16-attr');
    await el.updateComplete;
    assert.equal(el.updateCount, 4);
    assert.equal(el.getAttribute('all-attr'), '16-attr');
    assert.equal(el.all, 16);
    el.hasChanged = 5;
    await el.updateComplete;
    assert.equal(el.hasChanged, 5);
    assert.equal(el.updateCount, 4);
    el.hasChanged = 15;
    await el.updateComplete;
    assert.equal(el.hasChanged, 15);
    assert.equal(el.updateCount, 5);
    el.setAttribute('all-attr', '5-attr');
    await el.updateComplete;
    assert.equal(el.all, 5);
    assert.equal(el.updateCount, 5);
    el.all = 15;
    await el.updateComplete;
    assert.equal(el.all, 15);
    assert.equal(el.updateCount, 6);
  });

  test('superclass properties not affected by subclass', async () => {
    class E extends LitElement {
      static get properties(): PropertyDeclarations {
        return {
          foo : {attribute : 'zug', reflect : true},
          bar : {reflect : true}
        };
      }

      foo = 5;
      bar = 'bar';

      render() { return html``; }
    }
    customElements.define(generateElementName(), E);

    class F extends E {
      static get properties(): PropertyDeclarations {
        return {foo : {attribute : false}, nug : {}};
      }

      foo = 6;
      bar = 'subbar';
      nug = 5;

      render() { return html``; }
    }
    customElements.define(generateElementName(), F);

    const el = new E();
    const sub = new F();
    container.appendChild(el);
    await el.updateComplete;
    container.appendChild(sub);
    await sub.updateComplete;

    assert.equal(el.foo, 5);
    assert.equal(el.getAttribute('zug'), '5');
    assert.isFalse(el.hasAttribute('foo'));
    assert.equal(el.bar, 'bar');
    assert.equal(el.getAttribute('bar'), 'bar');
    assert.isUndefined((el as any).nug);

    assert.equal(sub.foo, 6);
    assert.isFalse(sub.hasAttribute('zug'));
    assert.isFalse(sub.hasAttribute('foo'));
    assert.equal(sub.bar, 'subbar');
    assert.equal(sub.getAttribute('bar'), 'subbar');
    assert.equal(sub.nug, 5);
  });

  test('Attributes reflect', async () => {
    const suffix = '-reflected';
    class E extends LitElement {
      static get properties() {
        return {
          foo : {
            reflect : true,
            type : {toAttribute : (value: any) => `${value}${suffix}`}
          }
        };
      }

      foo = 0;

      render() { return html``; }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    assert.equal(el.getAttribute('foo'), `0${suffix}`);
    el.foo = 5;
    await el.updateComplete;
    assert.equal(el.getAttribute('foo'), `5${suffix}`);
  });

  test('Attributes reflect with type: Boolean', async () => {
    class E extends LitElement {
      static get properties() {
        return {bar : {type : Boolean, reflect : true}};
      }

      bar = true;

      render() { return html``; }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    assert.equal(el.getAttribute('bar'), '');
    el.bar = false;
    await el.updateComplete;
    assert.equal(el.hasAttribute('bar'), false);
    el.bar = true;
    await el.updateComplete;
    assert.equal(el.getAttribute('bar'), '');
  });

  test('updates/renders when properties change', async () => {
    class E extends LitElement {
      static get properties() { return {foo : {}}; }

      foo = 'one';

      render() { return html`${this.foo}`; }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    assert.ok(el.shadowRoot);
    await el.updateComplete;
    assert.equal(stripExpressionDelimeters(el.shadowRoot!.innerHTML), 'one');
    el.foo = 'changed';
    await el.updateComplete;
    assert.equal(stripExpressionDelimeters(el.shadowRoot!.innerHTML),
                 'changed');
  });

  test('updates/renders when properties and attributes change', async () => {
    class E extends LitElement {
      static get properties() { return {value : {}, attrValue : {}}; }

      value = '1';
      attrValue = 'attr';

      updateCountValue = '';
      updateCountAttrValue = '';

      render() { return html``; }

      update(props: PropertyValues) {
        super.update(props);
        this.updateCountValue = this.value;
        this.updateCountAttrValue = this.attrValue;
      }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    assert.ok(el.shadowRoot);
    await el.updateComplete;
    assert.equal(el.updateCountValue, '1');
    assert.equal(el.updateCountAttrValue, 'attr');
    el.value = '2';
    await el.updateComplete;
    assert.equal(el.updateCountValue, '2');
    assert.equal(el.updateCountAttrValue, 'attr');
    el.attrValue = 'attr2';
    await el.updateComplete;
    assert.equal(el.updateCountValue, '2');
    assert.equal(el.updateCountAttrValue, 'attr2');
    el.setAttribute('attrvalue', 'attr3');
    await el.updateComplete;
    assert.equal(el.updateCountValue, '2');
    assert.equal(el.updateCountAttrValue, 'attr3');
    el.value = '3';
    el.setAttribute('attrvalue', 'attr4');
    await el.updateComplete;
    assert.equal(el.updateCountValue, '3');
    assert.equal(el.updateCountAttrValue, 'attr4');
  });

  test('updates/renders changes when attributes change', async () => {
    class E extends LitElement {
      static get properties() { return {foo : {}}; }

      foo = 'one';

      render() { return html`${this.foo}`; }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    assert.ok(el.shadowRoot);
    assert.equal(stripExpressionDelimeters(el.shadowRoot!.innerHTML), 'one');
    el.setAttribute('foo', 'changed');
    await el.updateComplete;
    assert.equal(stripExpressionDelimeters(el.shadowRoot!.innerHTML),
                 'changed');
  });

  test('User defined accessor can trigger update/render', async () => {
    class E extends LitElement {
      __bar?: number;

      static get properties() { return {foo : {}, bar : {}}; }

      info: string[] = [];
      foo = 0;

      get bar() { return this.__bar; }

      set bar(value) {
        const old = this.bar;
        this.__bar = Number(value);
        this.requestUpdate('bar', old);
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

  test('User defined accessor can use property options via `requestUpdate`',
       async () => {
         const fromAttribute = (value: any) => parseInt(value);
         const toAttribute = (value: any) => `${value}-attr`;
         const hasChanged = (value: any, old: any) => isNaN(old) || value > old;
         class E extends LitElement {

           updateCount = 0;
           __bar: any;

           static get properties() {
             return {
               bar : {
                 attribute : 'attr-bar',
                 reflect : true,
                 type : {fromAttribute, toAttribute},
                 hasChanged
               }
             };
           }

           constructor() {
             super();
             this.bar = 5;
           }

           update(changed: PropertyValues) {
             super.update(changed);
             this.updateCount++;
           }

           get bar() { return this.__bar; }

           set bar(value) {
             const old = this.bar;
             this.__bar = Number(value);
             this.requestUpdate('bar', old);
           }

           render() { return html``; }
         }
         customElements.define(generateElementName(), E);
         const el = new E();
         container.appendChild(el);
         await el.updateComplete;
         assert.equal(el.updateCount, 1);
         assert.equal(el.bar, 5);
         assert.equal(el.getAttribute('attr-bar'), `5-attr`);
         el.setAttribute('attr-bar', '7');
         await el.updateComplete;
         assert.equal(el.updateCount, 2);
         assert.equal(el.bar, 7);
         assert.equal(el.getAttribute('attr-bar'), `7-attr`);
         el.bar = 4;
         await el.updateComplete;
         assert.equal(el.updateCount, 2);
         assert.equal(el.bar, 4);
         assert.equal(el.getAttribute('attr-bar'), `7-attr`);
         el.setAttribute('attr-bar', '3');
         await el.updateComplete;
         assert.equal(el.updateCount, 2);
         assert.equal(el.bar, 3);
         assert.equal(el.getAttribute('attr-bar'), `3`);
       });

  test(
      'updates/renders attributes, properties, and event listeners via `lit-html`',
      async () => {
        class E extends LitElement {
          _event?: Event;

          render() {
            const attr = 'attr';
            const prop = 'prop';
            const event = function(this: E, e: Event) { this._event = e; };
            return html
            `<div attr="${attr}" .prop="${prop}" @zug="${event}"></div>`;
          }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        await el.updateComplete;
        const d = el.shadowRoot!.querySelector('div')!;
        assert.equal(d.getAttribute('attr'), 'attr');
        assert.equal((d as any).prop, 'prop');
        const e = new Event('zug');
        d.dispatchEvent(e);
        assert.equal(el._event, e);
      });

  test('event listeners are invoked with the right `this` value', async () => {
    class E extends LitElement {
      event?: Event;

      render() { return html`<div @test=${this.onTest}></div>`; }

      onTest(e: Event) { this.event = e; }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    const div = el.shadowRoot!.querySelector('div')!;
    const event = new Event('test');
    div.dispatchEvent(event);
    assert.equal(el.event, event);
  });

  test('`firstUpdated` called when element first updates', async () => {
    class E extends LitElement {

      @property() foo = 1;

      wasUpdatedCount = 0;
      wasFirstUpdated = 0;
      changedProperties: PropertyValues|undefined;

      update(changedProperties: PropertyValues) {
        this.wasUpdatedCount++;
        super.update(changedProperties);
      }

      render() { return html``; }

      firstUpdated(changedProperties: PropertyValues) {
        this.changedProperties = changedProperties;
        this.wasFirstUpdated++;
      }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    const testMap = new Map();
    testMap.set('foo', undefined);
    assert.deepEqual(el.changedProperties, testMap);
    assert.equal(el.wasUpdatedCount, 1);
    assert.equal(el.wasFirstUpdated, 1);
    await el.requestUpdate();
    assert.equal(el.wasUpdatedCount, 2);
    assert.equal(el.wasFirstUpdated, 1);
    await el.requestUpdate();
    assert.equal(el.wasUpdatedCount, 3);
    assert.equal(el.wasFirstUpdated, 1);
  });

  test(
      '`firstUpdated` called when element first updates even if first `shouldUpdate` returned false',
      async () => {
        class E extends LitElement {

          @property() foo = 1;

          triedToUpdatedCount = 0;
          wasUpdatedCount = 0;
          wasFirstUpdated = 0;
          changedProperties: PropertyValues|undefined;

          shouldUpdate() {
            this.triedToUpdatedCount++;
            return this.triedToUpdatedCount > 1;
          }

          update(changedProperties: PropertyValues) {
            this.wasUpdatedCount++;
            super.update(changedProperties);
          }

          render() { return html``; }

          firstUpdated(changedProperties: PropertyValues) {
            this.changedProperties = changedProperties;
            this.wasFirstUpdated++;
          }
        }

        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        await el.updateComplete;
        assert.equal(el.triedToUpdatedCount, 1);
        assert.equal(el.wasUpdatedCount, 0);
        assert.equal(el.wasFirstUpdated, 0);
        await el.requestUpdate();
        const testMap = new Map();
        assert.deepEqual(el.changedProperties, testMap);
        assert.equal(el.triedToUpdatedCount, 2);
        assert.equal(el.wasUpdatedCount, 1);
        assert.equal(el.wasFirstUpdated, 1);
        await el.requestUpdate();
        assert.equal(el.triedToUpdatedCount, 3);
        assert.equal(el.wasUpdatedCount, 2);
        assert.equal(el.wasFirstUpdated, 1);
      });

  test('render lifecycle order', async () => {
    class E extends LitElement {
      static get properties() { return {foo : {type : Number}}; }

      info: Array<string> = [];

      shouldUpdate() {
        this.info.push('shouldUpdate');
        return true;
      }

      render() {
        this.info.push('render');
        return html`hi`;
      }

      update(props: PropertyValues) {
        this.info.push('before-update');
        super.update(props);
        this.info.push('after-update');
      }

      firstUpdated() { this.info.push('firstUpdated'); }

      updated() { this.info.push('updated'); }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    el.info.push('updateComplete');
    assert.deepEqual(el.info, [
      'shouldUpdate', 'before-update', 'render', 'after-update', 'firstUpdated',
      'updated', 'updateComplete'
    ]);
  });

  test('setting properties in update does not trigger update', async () => {
    class E extends LitElement {

      static get properties() { return {foo : {}}; }
      promiseFulfilled = false;
      foo = 0;
      updateCount = 0;

      update(props: PropertyValues) {
        this.updateCount++;
        this.foo++;
        super.update(props);
      }

      render() { return html`${this.foo}`; }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    await el.updateComplete;
    assert.equal(el.foo, 1);
    assert.equal(el.updateCount, 1);
    assert.equal(el.shadowRoot!.textContent, '1');
    el.foo = 5;
    await el.updateComplete;
    assert.equal(el.foo, 6);
    assert.equal(el.updateCount, 2);
    assert.equal(el.shadowRoot!.textContent, '6');
  });

  test(
      'setting properties in update reflects to attribute and is included in `changedProperties`',
      async () => {
        class E extends LitElement {

          static get properties() {
            return {foo : {}, bar : {}, zot : {reflect : true}};
          }

          changedProperties: PropertyValues|undefined = undefined;

          update(changedProperties: PropertyValues) {
            (this as any).zot = (this as any).foo + (this as any).bar;
            super.update(changedProperties);
            this.changedProperties = changedProperties;
          }

          render() { return html``; }
        }
        customElements.define(generateElementName(), E);
        const el = new E() as any;
        container.appendChild(el);
        await el.updateComplete;
        const testMap = new Map();
        testMap.set('zot', undefined);
        assert.deepEqual(el.changedProperties, testMap);
        assert.isNaN(el.zot);
        assert.equal(el.getAttribute('zot'), 'NaN');
        el.bar = 1;
        el.foo = 1;
        await el.updateComplete;
        assert.equal(el.foo, 1);
        assert.equal(el.bar, 1);
        assert.equal(el.zot, 2);
        testMap.clear();
        testMap.set('foo', undefined);
        testMap.set('bar', undefined);
        testMap.set('zot', NaN);
        assert.deepEqual(el.changedProperties, testMap);
        assert.equal(el.getAttribute('zot'), '2');
        el.bar = 2;
        await el.updateComplete;
        assert.equal(el.bar, 2);
        assert.equal(el.zot, 3);
        testMap.clear();
        testMap.set('bar', 1);
        testMap.set('zot', 2);
        assert.deepEqual(el.changedProperties, testMap);
        assert.equal(el.getAttribute('zot'), '3');
      });

  // Note, on older browsers (e.g. old Safari/Chrome), native properties
  // cannot have default values. These will be overwritten by instance values.
  test('can make properties for native accessors', async () => {
    class E extends LitElement {

      static get properties() {
        return {
          id : {reflect : true},
          name : {reflect : true},
          title : {reflect : true},
          foo : {}
        };
      }

      name: string|undefined;
      foo = '';

      changedProperties: PropertyValues|undefined = undefined;

      update(changedProperties: PropertyValues) {
        (this as any).zot = (this as any).foo + (this as any).bar;
        super.update(changedProperties);
        this.changedProperties = changedProperties;
      }

      render() {
        return html`${this.id}-${this.name}-${this.title}-${this.foo}`;
      }
    }
    customElements.define(generateElementName(), E);
    const el = new E() as any;
    container.appendChild(el);
    await el.updateComplete;
    el.foo = 'foo';
    el.id = 'id';
    el.name = 'name';
    el.title = 'title';
    await el.updateComplete;
    assert.equal(el.shadowRoot!.textContent, 'id-name-title-foo');
    assert.equal((window as any).id, el);
    el.id = 'id2';
    el.name = 'name2';
    await el.updateComplete;
    assert.equal(el.shadowRoot!.textContent, 'id2-name2-title-foo');
    assert.equal((window as any).id2, el);
  });

  test(
      'setting properties in `updated` does trigger update and does not block updateComplete',
      async () => {
        class E extends LitElement {

          static get properties() { return {foo : {}}; }
          foo = 0;
          updateCount = 0;
          fooMax = 2;

          update(changed: PropertyValues) {
            this.updateCount++;
            super.update(changed);
          }

          updated() {
            if (this.foo < this.fooMax) {
              this.foo++;
            }
          }

          render() { return html``; }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        let result = await el.updateComplete;
        assert.isFalse(result);
        assert.equal(el.foo, 1);
        assert.equal(el.updateCount, 1);
        result = await el.updateComplete;
        assert.isFalse(result);
        assert.equal(el.foo, 2);
        assert.equal(el.updateCount, 2);
        result = await el.updateComplete;
        assert.isTrue(result);
      });

  test(
      'setting properties in `updated` can await until updateComplete returns true',
      async () => {
        class E extends LitElement {

          static get properties() { return {foo : {}}; }
          foo = 0;
          updateCount = 0;

          update(changed: PropertyValues) {
            this.updateCount++;
            super.update(changed);
          }

          updated() {
            if (this.foo < 10) {
              this.foo++;
            }
          }

          render() { return html``; }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        while (!await el.updateComplete) {
        }
        assert.equal(el.foo, 10);
      });

  test('`updateComplete` can block properties set in `updated`', async () => {
    class E extends LitElement {

      static get properties() { return {foo : {}}; }
      foo = 1;
      updateCount = 0;
      fooMax = 10;

      update(changed: PropertyValues) {
        this.updateCount++;
        super.update(changed);
      }

      updated() {
        if (this.foo < this.fooMax) {
          this.foo++;
        }
      }

      render() { return html``; }

      get updateComplete(): Promise<any> {
        return super.updateComplete.then((v) => v || this.updateComplete);
      }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    const result = await el.updateComplete;
    assert.isTrue(result);
    assert.equal(el.foo, 10);
    assert.equal(el.updateCount, 10);
  });

  test('can await promise in `updateComplete`', async () => {
    class E extends LitElement {

      static get properties() { return {foo : {}}; }
      promiseFulfilled = false;
      foo = 0;

      render() { return html`${this.foo}`; }

      get updateComplete() {
        return (async () => {
          return await super.updateComplete && await new Promise((resolve) => {
                   setTimeout(() => {
                     this.promiseFulfilled = true;
                     resolve(true);
                   }, 1);
                 });
        })();
      }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    const result = await el.updateComplete;
    assert.isTrue(result);
    assert.isTrue(el.promiseFulfilled);
  });

  test('`requestUpdate` resolved at `updateComplete` time', async () => {
    class E extends LitElement {

      static get properties() { return {foo : {}}; }
      promiseFulfilled = false;
      foo = 0;

      render() { return html`${this.foo}`; }

      get updateComplete() {
        return (async () => {
          return await super.updateComplete && await new Promise((resolve) => {
                   setTimeout(() => {
                     this.promiseFulfilled = true;
                     resolve(true);
                   }, 1);
                 });
        })();
      }
    }
    customElements.define(generateElementName(), E);
    const el = new E();
    container.appendChild(el);
    let result = await el.updateComplete;
    assert.isTrue(result);
    assert.isTrue(el.promiseFulfilled);
    el.promiseFulfilled = false;
    result = await el.requestUpdate() as boolean;
    assert.isTrue(result);
    assert.isTrue(el.promiseFulfilled);
  });

  test('can await sub-element `updateComplete`', async () => {
    class E extends LitElement {

      static get properties() { return {foo : {}}; }
      promiseFulfilled = false;
      foo = 'hi';

      render() { return html`${this.foo}`; }

      get updateComplete() {
        return super.updateComplete.then(
            () => new Promise((resolve) => setTimeout(() => {
                                this.promiseFulfilled = true;
                                resolve(true);
                              }, 1)));
      }
    }
    customElements.define('x-1224', E);

    class F extends LitElement {

      inner: E|null = null;

      render() { return html`<x-1224></x-1224>`; }

      firstUpdated() { this.inner = this.shadowRoot!.querySelector('x-1224'); }

      get updateComplete() {
        return super.updateComplete.then(() => {
          this.inner!.foo = 'yo';
          return this.inner!.updateComplete;
        });
      }
    }
    customElements.define(generateElementName(), F);
    const el = new F();
    container.appendChild(el);
    const result = await el.updateComplete;
    assert.isTrue(result);
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
      static get properties() { return {foo : {}, bar : {}, zug : {}}; }

      foo = '';
      bar = true;
      zug = null;

      render() { return html`test`; }
    }
    customElements.define(name, E);
    await (el as LitElement).updateComplete;
    assert.equal((el as any).foo, 'hi');
    assert.equal((el as any).bar, false);
    assert.equal((el as any).zug, objectValue);
  });

  test('can set properties and attributes on sub-element', async () => {
    class E extends LitElement {

      static get properties() {
        return {foo : {}, attr : {}, bool : {type : Boolean}};
      }
      foo = 'hi';
      bool = false;

      render() { return html`${this.foo}`; }
    }
    customElements.define('x-2448', E);

    class F extends LitElement {

      inner: E|null = null;

      static get properties() { return {bar : {}, bool : {type : Boolean}}; }
      bar = 'outer';
      bool = false;

      render() {
        return html`<x-2448 .foo="${this.bar}" attr="${this.bar}" .bool="${
            this.bool}"></x-2448>`;
      }

      firstUpdated() { this.inner = this.shadowRoot!.querySelector('x-2448'); }

      get updateComplete() {
        return super.updateComplete.then(() => this.inner!.updateComplete);
      }
    }
    customElements.define(generateElementName(), F);
    const el = new F();
    container.appendChild(el);
    await el.updateComplete;
    assert.equal(el.inner!.shadowRoot!.textContent, 'outer');
    assert.equal((el.inner! as any).attr, 'outer');
    assert.equal(el.inner!.getAttribute('attr'), 'outer');
    assert.equal(el.inner!.bool, false);
    el.bar = 'test';
    el.bool = true;
    await el.updateComplete;
    assert.equal(el.inner!.shadowRoot!.textContent, 'test');
    assert.equal((el.inner! as any).attr, 'test');
    assert.equal(el.inner!.getAttribute('attr'), 'test');
    assert.equal(el.inner!.bool, true);
  });
});

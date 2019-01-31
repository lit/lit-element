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

import {eventOptions, property} from '../../lib/decorators.js';
import {
  customElement,
  html,
  LitElement,
  PropertyValues,
  query,
  queryAll
} from '../../lit-element.js';
import {generateElementName} from '../test-helpers.js';

let hasOptions;
const supportsOptions = (function() {
  if (hasOptions !== undefined) {
    return hasOptions;
  }
  const fn = () => {};
  const event = 'foo';
  hasOptions = false;
  const options = {
    get capture() {
      hasOptions = true;
      return true;
    }
  };
  document.body.addEventListener(event, fn, options);
  document.body.removeEventListener(event, fn, options);
  return hasOptions;
})();

let hasPassive;
const supportsPassive = (function() {
  if (hasPassive !== undefined) {
    return hasPassive;
  }
  // Use an iframe since ShadyDOM will pass this test but doesn't actually
  // enforce passive behavior.
  const f = document.createElement('iframe');
  document.body.appendChild(f);
  const fn = () => {};
  const event = 'foo';
  hasPassive = false;
  const options = {
    get passive() {
      hasPassive = true;
      return true;
    }
  };
  f.contentDocument!.addEventListener(event, fn, options);
  f.contentDocument!.removeEventListener(event, fn,
                                         options as AddEventListenerOptions);
  document.body.removeChild(f);
  return hasPassive;
})();

const assert = chai.assert;

suite('decorators', () => {
  let container: HTMLElement;

  setup(() => {
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
  });

  teardown(() => {
    if (container !== undefined) {
      container.parentElement!.removeChild(container);
      (container as any) = undefined;
    }
  });

  suite('@customElement', () => {
    test('defines an element', () => {
      const tagName = generateElementName();
      @customElement(tagName as keyof HTMLElementTagNameMap)
      class C0 extends HTMLElement {
      }
      const DefinedC = customElements.get(tagName);
      assert.strictEqual(DefinedC, C0);
    });
  });

  suite('@property', () => {
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
        @property({converter : fromAttribute}) fromAttribute = 1;
        @property({reflect : true, converter: {toAttribute}}) toAttribute = 1;
        @property({
          attribute : 'all-attr',
          hasChanged,
          converter: {fromAttribute, toAttribute},
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

    test('can decorate user accessor with @property', async () => {
      class E extends LitElement {

        _foo?: number;
        updatedContent?: number;

        @property({reflect : true, type: Number})
        get foo() {
          return this._foo as number;
        }

        set foo(v: number) {
          const old = this.foo;
          this._foo = v;
          this.requestUpdate('foo', old);
        }

        updated() { this.updatedContent = this.foo; }
      }
      customElements.define(generateElementName(), E);
      const el = new E();
      container.appendChild(el);
      await el.updateComplete;
      assert.equal(el._foo, undefined);
      assert.equal(el.updatedContent, undefined);
      assert.isFalse(el.hasAttribute('foo'));
      el.foo = 5;
      await el.updateComplete;
      assert.equal(el._foo, 5);
      assert.equal(el.updatedContent, 5);
      assert.equal(el.getAttribute('foo'), '5');
    });

    test('can mix property options via decorator and via getter', async () => {
      const hasChanged = (value: any, old: any) =>
          old === undefined || value > old;
      const fromAttribute = (value: any) => parseInt(value);
      const toAttribute = (value: any) => `${value}-attr`;
      class E extends LitElement {

        @property({hasChanged}) hasChanged = 10;
        @property({converter : fromAttribute}) fromAttribute = 1;
        @property({reflect : true, converter: {toAttribute}}) toAttribute = 1;
        @property({
          attribute : 'all-attr',
          hasChanged,
          converter: {fromAttribute, toAttribute},
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
  });

  suite('@query', () => {
    @customElement(generateElementName() as keyof HTMLElementTagNameMap)
    class C extends LitElement {

      @query('#blah') blah?: HTMLDivElement;

      @query('span') nope?: HTMLSpanElement;

      render() {
        return html`
          <div>Not this one</div>
          <div id="blah">This one</div>
        `;
      }
    }

    test('returns an element when it exists', async () => {
      const c = new C();
      container.appendChild(c);
      await c.updateComplete;
      const div = c.blah;
      assert.instanceOf(div, HTMLDivElement);
      assert.equal(div!.innerText, 'This one');
    });

    test('returns null when no match', async () => {
      const c = new C();
      container.appendChild(c);
      await c.updateComplete;
      const span = c.nope;
      assert.isNull(span);
    });
  });

  suite('@queryAll', () => {
    @customElement(generateElementName() as keyof HTMLElementTagNameMap)
    class C extends LitElement {

      @queryAll('div') divs!: NodeList;

      @queryAll('span') spans!: NodeList;

      render() {
        return html`
          <div>Not this one</div>
          <div id="blah">This one</div>
        `;
      }
    }

    test('returns elements when they exists', async () => {
      const c = new C();
      container.appendChild(c);
      await c.updateComplete;
      const divs = c.divs!;
      // This is not true in ShadyDOM:
      // assert.instanceOf(divs, NodeList);
      assert.lengthOf(divs, 2);
    });

    test('returns empty NodeList when no match', async () => {
      const c = new C();
      container.appendChild(c);
      await c.updateComplete;
      const spans = c.spans;
      // This is not true in ShadyDOM:
      // assert.instanceOf(divs, NodeList);
      assert.lengthOf(spans, 0);
    });
  });

  suite('@eventOptions', () => {
    test('allows capturing listeners', async function() {
      if (!supportsOptions) {
        this.skip();
      }
      @customElement(generateElementName() as keyof HTMLElementTagNameMap)
      class C extends LitElement {
        eventPhase?: number;

        render() {
          return html`
            <div @click=${this.onClick}><button></button></div>
          `;
        }

        @eventOptions({capture : true})
        onClick(e: Event) {
          this.eventPhase = e.eventPhase;
        }
      }

      const c = new C();
      container.appendChild(c);
      await c.updateComplete;
      const button = c.shadowRoot!.querySelector('button')!;
      button.click();
      assert.equal(c.eventPhase, Event.CAPTURING_PHASE);
    });

    test('allows once listeners', async function() {
      if (!supportsOptions) {
        this.skip();
      }
      @customElement(generateElementName() as keyof HTMLElementTagNameMap)
      class C extends LitElement {

        clicked = 0;

        render() {
          return html`
            <div @click=${this.onClick}><button></button></div>
          `;
        }

        @eventOptions({once : true})
        onClick() {
          this.clicked++;
        }
      }

      const c = new C();
      container.appendChild(c);
      await c.updateComplete;
      const button = c.shadowRoot!.querySelector('button')!;
      button.click();
      button.click();
      assert.equal(c.clicked, 1);
    });

    test('allows passive listeners', async function() {
      if (!supportsPassive) {
        this.skip();
      }
      @customElement(generateElementName() as keyof HTMLElementTagNameMap)
      class C extends LitElement {

        defaultPrevented?: boolean;

        render() {
          return html`
            <div @click=${this.onClick}><button></button></div>
          `;
        }

        @eventOptions({passive : true})
        onClick(e: Event) {
          try {
            e.preventDefault();
          } catch (error) {
            // no need to do anything
          }
          this.defaultPrevented = e.defaultPrevented;
        }
      }

      const c = new C();
      container.appendChild(c);
      await c.updateComplete;
      const button = c.shadowRoot!.querySelector('button')!;
      button.click();
      assert.isFalse(c.defaultPrevented);
    });
  });
});

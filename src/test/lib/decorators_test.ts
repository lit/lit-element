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

import {eventOptions} from '../../lib/decorators.js';
import {
  customElement,
  html,
  LitElement,
  query,
  queryAll
} from '../../lit-element.js';
import {generateElementName} from '../test-helpers.js';

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
    test('allows capturing listeners', async () => {
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
  });
});

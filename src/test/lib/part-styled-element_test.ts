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

import {customElement, property} from '../../lib/decorators.js';
import {classMap} from 'lit-html/directives/class-map.js';
import {PartStyledElement, css, html, part} from '../../lib/part-styled-element.js';
import {generateElementName, getComputedStyleValue} from '../test-helpers.js';

window.forcePartPolyfill = true;

// tslint:disable:no-any ok in tests

const assert = chai.assert;

suite('PartStyledElement', () => {
  let container: HTMLElement;

  @customElement('part-element')
  class PartElement extends PartStyledElement {
    styledEl?: Element;
    styledEl2?: Element;

    static styles = css`
      :host { display: block;}

      .s {
        border: 1px solid black;
      }
    `;
    render() {
      return html`
        <div class="s" part="part1 part2">one-two</div>
        <div class="s" part="part3">three</div>
        `;
    }

    firstUpdated() {
      this.styledEl = this.shadowRoot!.firstElementChild!;
      this.styledEl2 = this.styledEl!.nextElementSibling!;
    }
  }

  setup(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  teardown(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  test('static parts apply and override existing styles', async () => {
    @customElement(generateElementName())
    class E extends PartStyledElement {

      partEl?: PartElement;

      static styles = css`
        ${part('part-element::part(part1)', css`
          border: 2px solid red;
        `)}
      `;

      render() {
        return html`<part-element></part-element>`;
      }

      firstUpdated() {
        this.partEl = this.shadowRoot!.firstElementChild! as PartElement;
      }

      get updateComplete() {
        return (async () => {
          await super.updateComplete;
          await (this.partEl! as PartStyledElement).updateComplete;
        })();
      }
    }

    const el = new E() as E;
    container.appendChild(el);
    await el.updateComplete;
    assert.equal(getComputedStyleValue(el.partEl!.styledEl!, 'border-top-width').trim(), '2px');
  });

  test('dynamic parts', async () => {
    @customElement(generateElementName())
    class E extends PartStyledElement {

      partEl?: PartElement;
      partEl2?: PartElement;

      @property()
      special = false;

      static styles = css`
        ${part('.special::part(part1)', css`
          border: 4px solid red;
        `)}
      `;

      render() {
        const special = this.special;
        return html`
          <part-element class="${classMap({special})}"></part-element>
          <part-element class="${classMap({special: !special})}"></part-element>`;
      }

      firstUpdated() {
        this.partEl = this.shadowRoot!.firstElementChild! as PartElement;
        this.partEl2 = this.partEl!.nextElementSibling! as PartElement;
      }

      get updateComplete() {
        return (async () => {
          await super.updateComplete;
          await (this.partEl! as PartStyledElement).updateComplete;
          await (this.partEl2! as PartStyledElement).updateComplete;
        })();
      }
    }

    const el = new E() as E;
    container.appendChild(el);
    await el.updateComplete;
    await el.updateComplete;
    assert.equal(getComputedStyleValue(el.partEl!.styledEl!, 'border-top-width').trim(), '1px');
    assert.equal(getComputedStyleValue(el.partEl2!.styledEl!, 'border-top-width').trim(), '4px');
    el.special = true;
    await el.updateComplete;
    assert.equal(getComputedStyleValue(el.partEl!.styledEl!, 'border-top-width').trim(), '4px');
    assert.equal(getComputedStyleValue(el.partEl2!.styledEl!, 'border-top-width').trim(), '1px');
    el.special = false;
    await el.updateComplete;
    assert.equal(getComputedStyleValue(el.partEl!.styledEl!, 'border-top-width').trim(), '1px');
    assert.equal(getComputedStyleValue(el.partEl2!.styledEl!, 'border-top-width').trim(), '4px');
  });

  test('multiple parts targeting same element', async() => {
    @customElement(generateElementName())
    class E extends PartStyledElement {

      partEl?: PartElement;

      static styles = css`
        ${part('part-element::part(part1)', css`
          border: 4px solid red;
        `)}

        ${part('part-element::part(part2)', css`
          padding: 4px;
        `)}

        ${part('part-element::part(part3)', css`
          margin: 4px;
        `)}
      `;

      render() {
        return html`<part-element></part-element>`;
      }

      firstUpdated() {
        this.partEl = this.shadowRoot!.firstElementChild! as PartElement;
      }

      get updateComplete() {
        return (async () => {
          await super.updateComplete;
          await (this.partEl! as PartStyledElement).updateComplete;
        })();
      }
    }

    const el = new E() as E;
    container.appendChild(el);
    await el.updateComplete;
    assert.equal(getComputedStyleValue(el.partEl!.styledEl!, 'border-top-width').trim(), '4px');
    assert.equal(getComputedStyleValue(el.partEl!.styledEl!, 'padding-top').trim(), '4px');
    assert.equal(getComputedStyleValue(el.partEl!.styledEl2!, 'margin-top').trim(), '4px');
  });

  test('pseudos', async () => {
  });

  test('exportparts', async () => {
  });

  test('exportparts ordering', async () => {
  });

  test('document style parts', async () => {
  });

  test('element styles', async () => {
  });

});

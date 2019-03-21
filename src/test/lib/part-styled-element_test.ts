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
import {generateElementName, getComputedStyleValue, nextFrame} from '../test-helpers.js';
import {documentStyle} from '../../lib/document-style.js';
import {elementStyle} from '../../lib/element-style.js';

window.forcePartPolyfill = true;

// tslint:disable:no-any ok in tests

const assert = chai.assert;

suite('PartStyledElement', () => {
  let container: HTMLElement;

  @customElement('part-element')
  class PartElement extends PartStyledElement {
    styledEl?: HTMLElement;
    styledEl2?: HTMLElement;

    static styles = css`
      :host { display: block;}

      .s {
        border: 1px solid black;
      }
    `;
    render() {
      return html`
        <div class="s" tabindex="-1" part="part1 part2">one-two</div>
        <div class="s" part="part3">three</div>
        `;
    }

    firstUpdated() {
      this.tabIndex = -1;
      this.styledEl = this.shadowRoot!.firstElementChild! as HTMLElement;
      this.styledEl2 = this.styledEl!.nextElementSibling! as HTMLElement;
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
    @customElement(generateElementName())
    class E extends PartStyledElement {

      partEl?: PartElement;

      @property()
      special = false;

      static styles = css`
        ${part('.special:focus::part(part1)', css`
          border: 4px solid red;
        `)}

        ${part('.special::part(part1):focus', css`
          padding: 4px;
        `)}

        ${part('.special:focus::part(part1):after', css`
          margin: 4px;
        `)}
      `;

      render() {
        const special = this.special;
        return html`<part-element class=${classMap({special})}></part-element>`;
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
    el.special = true;
    await el.updateComplete;
    el.partEl!.focus();
    assert.equal(getComputedStyleValue(el.partEl!.styledEl!, 'border-top-width').trim(), '4px');
    assert.equal(getComputedStyleValue(el.partEl!.styledEl!, 'margin-top', ':after').trim(), '4px');
    el.partEl!.styledEl!.focus();
    assert.equal(getComputedStyleValue(el.partEl!.styledEl!, 'padding-top').trim(), '4px');
    el.special = false;
    await el.updateComplete;
    assert.equal(getComputedStyleValue(el.partEl!.styledEl!, 'padding-top').trim(), '0px');
  });

  test('exportparts apply and order correctly', async () => {
    @customElement('e-1')
    class E1 extends PartStyledElement {

      partEl?: PartElement;
      partEl2?: PartElement;

      @property()
      special = false;

      static styles = css`
        ${part('.special::part(part3)', css`
          border: 4px solid red;
        `)}
      `;

      render() {
        const special = this.special;
        return html`
          <part-element exportparts="part1, part3: e-part3" class=${classMap({special})}></part-element>
          <part-element exportparts="part2: e-part2"></part-element>
        `;
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

    @customElement('e-2')
    class E2 extends PartStyledElement {

      elE1?: E1;

      @property()
      special = false;

      static styles = css`

        ${part('e-1::part(part1)', css`
          padding: 8px;
        `)}

        ${part('e-1::part(e-part2)', css`
          border: 8px solid red;
        `)}

        ${part('.special::part(e-part2)', css`
          border: 20px solid orange;
        `)}
      `;

      render() {
        const special = this.special;
        return html`
          <e-1 class=${classMap({special})} exportparts="e-part2: e-e-part2, e-part3: e-e-part3"></e-1>
        `;
      }

      firstUpdated() {
        this.elE1 = this.shadowRoot!.firstElementChild! as E1;
      }

      get updateComplete() {
        return (async () => {
          await super.updateComplete;
          await (this.elE1! as PartStyledElement).updateComplete;
        })();
      }
    }

    @customElement('e-3')
    class E3 extends PartStyledElement {

      elE2?: E2;

      @property()
      special = false;

      static styles = css`
        ${part('e-2::part(part1)', css`
          margin: 100px;
        `)}

        ${part('e-2::part(e-part2)', css`
          border: 8px solid red;
        `)}

        ${part('e-2::part(e-e-part2)', css`
          border: 12px solid red;
        `)}

        ${part('.special::part(e-e-part3)', css`
          border: 16px solid red;
        `)}

        ${part('.special2::part(e-e-part3)', css`
          border: 20px solid red;
        `)}
      `;

      render() {
        const special = this.special;
        return html`
          <e-2 class=${classMap({special})}></e-2>
        `;
      }

      firstUpdated() {
        this.elE2 = this.shadowRoot!.firstElementChild! as E2;
      }

      get updateComplete() {
        return (async () => {
          await super.updateComplete;
          await (this.elE2! as PartStyledElement).updateComplete;
        })();
      }
    }

    const el = new E3() as E3;
    container.appendChild(el);
    await el.updateComplete;
    const elEl2 = el.elE2!;
    const elE1 = elEl2.elE1!;
    const s1 = elE1.partEl!.styledEl as HTMLElement;
    const s2 = elE1.partEl2!.styledEl as HTMLElement;
    const s3 = elE1.partEl!.styledEl2 as HTMLElement;
    assert.equal(getComputedStyleValue(s1, 'margin-top'), '0px', 'un-exported part applied');
    assert.equal(getComputedStyleValue(s1, 'padding-top'), '8px', 'part exported as same name did not apply');
    assert.equal(getComputedStyleValue(s2, 'border-top-width'), '12px', 'exported part did not apply');
    elE1.special = true;
    await elE1.updateComplete;
    assert.equal(getComputedStyleValue(s3, 'border-top-width'), '4px', 'dynamic export part did not apply');
    el.special = true;
    await nextFrame();
    assert.equal(getComputedStyleValue(s3, 'border-top-width'), '16px', 'inner part overrode outer part');
    elEl2.special = true;
    await nextFrame();
    assert.equal(getComputedStyleValue(s2, 'border-top-width'), '12px', 'inner part overrode outer part');
    el.special = false;
    elEl2.classList.add('special2');
    await nextFrame();
    assert.equal(getComputedStyleValue(s3, 'border-top-width'), '20px', 'dynamic part did not un-apply');
    el.special = true;
    await nextFrame();
    assert.equal(getComputedStyleValue(s3, 'border-top-width'), '20px', 'rules not ordered by cascade');
  });

  test('document style parts', async () => {
    documentStyle(css`
      part-element::part(part1) {
        border: 7px solid navy;
      }

      .special::part(part3) {
        padding: 20px;
      }
    `);
    const e1 = new PartElement();
    const e2 = new PartElement();
    container.appendChild(e1);
    container.appendChild(e2);
    await nextFrame();
    assert.equal(getComputedStyleValue(e1.styledEl!, 'border-top-width'), '7px');
    assert.equal(getComputedStyleValue(e2.styledEl!, 'border-top-width'), '7px');
    e2.classList.add('special');
    await nextFrame();
    assert.equal(getComputedStyleValue(e1.styledEl2!, 'padding-top'), '0px');
    assert.equal(getComputedStyleValue(e2.styledEl2!, 'padding-top'), '20px');

  });

  test('element styles', async () => {
    @customElement('part-element2')
    class PartElement2 extends PartElement {}
    @customElement('part-element3')
    class PartElement3 extends PartElement2 {}
    elementStyle('part-element2', css`
      :host(part-element2) [part~=part1] {
        border: 10px solid orange;
      }

      :host(.special) [part~=part2] {
        padding: 4px;
      }
    `);
    elementStyle('part-element3', css`
      :host(part-element3) [part~=part1] {
        border: 4px solid orange;
      }

      :host(.special) [part~=part2] {
        padding: 8px;
      }
    `);
    const el1 = new PartElement2();
    container.appendChild(el1);
    const el2 = new PartElement3();
    container.appendChild(el2);
    await nextFrame();
    assert.equal(getComputedStyleValue(el1.styledEl!, 'border-top-width'), '10px');
    assert.equal(getComputedStyleValue(el2.styledEl!, 'border-top-width'), '4px');
    el1.classList.add('special');
    await nextFrame();
    assert.equal(getComputedStyleValue(el1.styledEl!, 'padding-top'), '4px');
    assert.equal(getComputedStyleValue(el2.styledEl!, 'padding-top'), '0px');
    el1.classList.remove('special');
    el2.classList.add('special');
    await nextFrame();
    assert.equal(getComputedStyleValue(el1.styledEl!, 'padding-top'), '0px');
    assert.equal(getComputedStyleValue(el2.styledEl!, 'padding-top'), '8px');
  });

});

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

import '@webcomponents/shadycss/apply-shim.min.js';

import {
  css,
  unsafeCss,
  CSSResult,
  html as htmlWithStyles,
  LitElement,
} from '../lit-element.js';

import {
  generateElementName,
  getComputedStyleValue,
  nextFrame
} from './test-helpers.js';

const assert = chai.assert;

suite('Styling', () => {
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

  test('content shadowRoot is styled', async () => {
    const name = generateElementName();
    customElements.define(name, class extends LitElement {
      render() {
        return htmlWithStyles`
        <style>
          div {
            border: 2px solid blue;
          }
        </style>
        <div>Testing...</div>`;
      }
    });
    const el = document.createElement(name);
    container.appendChild(el);
    await (el as LitElement).updateComplete;
    const div = el.shadowRoot!.querySelector('div');
    assert.equal(getComputedStyleValue(div!, 'border-top-width').trim(), '2px');
  });

  test('shared styling rendered into shadowRoot is styled', async () => {
    const style = htmlWithStyles`<style>
      div {
        border: 4px solid blue;
      }
    </style>`;
    const name = generateElementName();
    customElements.define(name, class extends LitElement {
      render() {
        return htmlWithStyles`
        <style>
          div {
            border: 2px solid blue;
          }
        </style>
        ${style}
        <div>Testing...</div>`;
      }
    });
    const el = document.createElement(name);
    container.appendChild(el);
    await (el as LitElement).updateComplete;
    const div = el.shadowRoot!.querySelector('div');
    assert.equal(getComputedStyleValue(div!, 'border-top-width').trim(), '4px');
  });

  test('custom properties render', async () => {
    const name = generateElementName();
    customElements.define(name, class extends LitElement {
      render() {
        return htmlWithStyles`
        <style>
          :host {
            --border: 8px solid red;
          }
          div {
            border: var(--border);
          }
        </style>
        <div>Testing...</div>`;
      }
    });
    const el = document.createElement(name);
    container.appendChild(el);
    await (el as LitElement).updateComplete;
    const div = el.shadowRoot!.querySelector('div');
    assert.equal(getComputedStyleValue(div!, 'border-top-width').trim(), '8px');
  });

  test('custom properties flow to nested elements', async () => {
    customElements.define('x-inner', class extends LitElement {
      render() {
        return htmlWithStyles`
        <style>
          div {
            border: var(--border);
          }
        </style>
        <div>Testing...</div>`;
      }
    });
    const name = generateElementName();
    class E extends LitElement {
      inner: LitElement|null = null;

      render() {
        return htmlWithStyles`
        <style>
          x-inner {
            --border: 8px solid red;
          }
        </style>
        <x-inner></x-inner>`;
      }

      firstUpdated() {
        this.inner = this.shadowRoot!.querySelector('x-inner')! as LitElement;
      }
    }
    customElements.define(name, E);
    const el = document.createElement(name) as E;
    container.appendChild(el);

    // Workaround for Safari 9 Promise timing bugs.
    await el.updateComplete && await el.inner!.updateComplete;

    await nextFrame();
    const div = el.inner!.shadowRoot!.querySelector('div');
    assert.equal(getComputedStyleValue(div!, 'border-top-width').trim(), '8px');
  });

  test('elements with custom properties can move between elements',
       async () => {
         customElements.define('x-inner1', class extends LitElement {
           render() {
             return htmlWithStyles`
        <style>
          div {
            border: var(--border);
          }
        </style>
        <div>Testing...</div>`;
           }
         });
         const name1 = generateElementName();
         customElements.define(name1, class extends LitElement {
           inner: Element|null = null;

           render() {
             return htmlWithStyles`
        <style>
          x-inner1 {
            --border: 2px solid red;
          }
        </style>
        <x-inner1></x-inner1>`;
           }

           firstUpdated() {
             this.inner = this.shadowRoot!.querySelector('x-inner1');
           }
         });
         const name2 = generateElementName();
         customElements.define(name2, class extends LitElement {
           render() {
             return htmlWithStyles`
        <style>
          x-inner1 {
            --border: 8px solid red;
          }
        </style>`;
           }
         });
         const el = document.createElement(name1) as LitElement;
         const el2 = document.createElement(name2);
         container.appendChild(el);
         container.appendChild(el2);
         let div: Element|null;

         // Workaround for Safari 9 Promise timing bugs.
         await el.updateComplete;

         await nextFrame();
         const inner = el.shadowRoot!.querySelector('x-inner1');
         div = inner!.shadowRoot!.querySelector('div');
         assert.equal(getComputedStyleValue(div!, 'border-top-width').trim(),
                      '2px');
         el2!.shadowRoot!.appendChild(inner!);

         // Workaround for Safari 9 Promise timing bugs.
         await el.updateComplete;

         await nextFrame();
         assert.equal(getComputedStyleValue(div!, 'border-top-width').trim(),
                      '8px');
       });

  test('@apply renders in nested elements', async () => {
    customElements.define('x-inner2', class extends LitElement {
      render() {
        return htmlWithStyles`
        <style>
          div {
            @apply --bag;
          }
        </style>
        <div>Testing...</div>`;
      }
    });
    const name = generateElementName();
    class E extends LitElement {
      inner: LitElement|null = null;
      render() {
        return htmlWithStyles`
        <style>
          x-inner2 {
            --bag: {
              border: 10px solid red;
            }
          }
        </style>
        <x-inner2></x-inner2>`;
      }

      firstUpdated() {
        this.inner = this.shadowRoot!.querySelector('x-inner2') as LitElement;
      }
    }
    customElements.define(name, E);
    const el = document.createElement(name) as E;
    container.appendChild(el);

    // Workaround for Safari 9 Promise timing bugs.
    await el.updateComplete && await el.inner!.updateComplete;

    await nextFrame();
    const div = el.shadowRoot!.querySelector(
                                  'x-inner2')!.shadowRoot!.querySelector('div');
    assert.equal(getComputedStyleValue(div!, 'border-top-width').trim(),
                 '10px');
  });

  test(
      '@apply renders in nested elements when sub-element renders separately first',
      async () => {
        class I extends LitElement {
          render() {
            return htmlWithStyles`
        <style>
          :host {
            display: block;
            width: 100px;
            height: 100px;
            border: 2px solid black;
            margin-top: 10px;
            @apply --bag;
          }
        </style>Hi`;
          }
        }
        customElements.define('x-applied', I);

        const name = generateElementName();
        class E extends LitElement {
          applied: HTMLElement|undefined;

          render() {
            return htmlWithStyles`
        <style>
          :host {
            --bag: {
              border: 10px solid black;
              margin-top: 2px;
            }
          }
        </style>
        <x-applied></x-applied>`;
          }

          firstUpdated() {
            this.applied =
                this.shadowRoot!.querySelector('x-applied') as LitElement;
          }
        }
        customElements.define(name, E);

        const firstApplied = document.createElement('x-applied') as I;
        container.appendChild(firstApplied);
        const el = document.createElement(name) as E;
        container.appendChild(el);

        // Workaround for Safari 9 Promise timing bugs.
        await firstApplied.updateComplete && el.updateComplete &&
            await (el.applied as I)!.updateComplete;

        await nextFrame();
        assert.equal(
            getComputedStyleValue(firstApplied!, 'border-top-width').trim(),
            '2px');
        assert.equal(getComputedStyleValue(firstApplied!, 'margin-top').trim(),
                     '10px');
        assert.equal(
            getComputedStyleValue(el.applied!, 'border-top-width').trim(),
            '10px');
        assert.equal(getComputedStyleValue(el.applied!, 'margin-top').trim(),
                     '2px');
      });
});

suite('Static get styles', () => {
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

  test('content shadowRoot is styled via static get styles', async () => {
    const name = generateElementName();
    customElements.define(name, class extends LitElement {
      static get styles() {
        return [
          css`div {
            border: 2px solid blue;
          }`,
          css`span {
            display: block;
            border: 3px solid blue;
          }`
        ];
      }

      render() {
        return htmlWithStyles`
        <div>Testing1</div>
        <span>Testing2</span>`;
      }
    });
    const el = document.createElement(name);
    container.appendChild(el);
    await (el as LitElement).updateComplete;
    const div = el.shadowRoot!.querySelector('div');
    assert.equal(getComputedStyleValue(div!, 'border-top-width').trim(), '2px');
    const span = el.shadowRoot!.querySelector('span');
    assert.equal(getComputedStyleValue(span!, 'border-top-width').trim(),
                 '3px');
  });

  // Test this in Shadow DOM without `adoptedStyleSheets` only since it's easily detectable in that case.
  const testShadowDOMStyleCount = (!window.ShadyDOM || !window.ShadyDOM.inUse) && !('adoptedStyleSheets' in Document.prototype);
  (testShadowDOMStyleCount ? test : test.skip)('when an array is returned from `static get styles`, one style is generated per array item', async () => {
    const name = generateElementName();
    customElements.define(name, class extends LitElement {
      static get styles() {
        return [
          css`div {
            border: 2px solid blue;
          }`,
          css`span {
            display: block;
            border: 3px solid blue;
          }`
        ];
      }

      render() {
        return htmlWithStyles`
        <div>Testing1</div>
        <span>Testing2</span>`;
      }
    });
    const el = document.createElement(name);
    container.appendChild(el);
    await (el as LitElement).updateComplete;
    assert.equal(el.shadowRoot!.querySelectorAll('style').length, 2);
  });

  test('static get styles can be a single CSSResult', async () => {
    const name = generateElementName();
    customElements.define(name, class extends LitElement {
      static get styles() {
        return css`div {
          border: 2px solid blue;
        }`;
      }

      render() {
        return htmlWithStyles`
        <div>Testing</div>`;
      }
    });
    const el = document.createElement(name);
    container.appendChild(el);
    await (el as LitElement).updateComplete;
    const div = el.shadowRoot!.querySelector('div');
    assert.equal(getComputedStyleValue(div!, 'border-top-width').trim(), '2px');
  });

  test('static get styles allows composition via `css` values', async () => {
    const name = generateElementName();
    customElements.define(name, class extends LitElement {
      static get styles() {
        return [
          css`div {
            border: ${css`2px solid blue`};
          }`,
          css`span {
            display: block;
            border: ${css`3px solid blue`};
          }`
        ];
      }

      render() {
        return htmlWithStyles`
        <div>Testing1</div>
        <span>Testing2</span>`;
      }
    });
    const el = document.createElement(name);
    container.appendChild(el);
    await (el as LitElement).updateComplete;
    const div = el.shadowRoot!.querySelector('div');
    assert.equal(getComputedStyleValue(div!, 'border-top-width').trim(), '2px');
    const span = el.shadowRoot!.querySelector('span');
    assert.equal(getComputedStyleValue(span!, 'border-top-width').trim(),
                 '3px');
  });

  test('`css` get styles throws when unsafe values are used', async () => {
    assert.throws(() => { css`div { border: ${`2px solid blue;` as any}}`; });
  });

  test('`CSSResult` cannot be constructed', async () => {
    // Note, this is done for security, instead use `css` or `unsafeCss`
    assert.throws(() => { new CSSResult('throw', Symbol()); });
  });

  test('Any value can be used in `css` when included with `unsafeCss`', async () => {
    const name = generateElementName();
    const someVar = `2px solid blue`;
    customElements.define(name, class extends LitElement {
      static get styles() {
        return css`div {
          border: ${unsafeCss(someVar)};
        }`;
      }

      render() {
        return htmlWithStyles`
        <div>Testing</div>`;
      }
    });
    const el = document.createElement(name);
    container.appendChild(el);
    await (el as LitElement).updateComplete;
    const div = el.shadowRoot!.querySelector('div');
    assert.equal(getComputedStyleValue(div!, 'border-top-width').trim(), '2px');
  });

  test('styles in render compose with `static get styles`', async () => {
    const name = generateElementName();
    customElements.define(name, class extends LitElement {
      static get styles() {
        return [
          css`div {
            border: 2px solid blue;
          }`,
          css`span {
            display: block;
            border: 3px solid blue;
          }`
        ];
      }

      render() {
        return htmlWithStyles`
        <style>
          div {
            padding: 4px;
          }
          span {
            display: block;
            border: 4px solid blue;
          }
        </style>
        <div>Testing1</div>
        <span>Testing2</span>`;
      }
    });
    const el = document.createElement(name);
    container.appendChild(el);
    await (el as LitElement).updateComplete;
    const div = el.shadowRoot!.querySelector('div');
    assert.equal(getComputedStyleValue(div!, 'border-top-width').trim(), '2px');
    assert.equal(getComputedStyleValue(div!, 'padding-top').trim(), '4px');
    const span = el.shadowRoot!.querySelector('span');
    assert.equal(getComputedStyleValue(span!, 'border-top-width').trim(),
                 '3px');
  });

  test('`static get styles` applies last instance of style', async () => {
    const name = generateElementName();
    const s1 = css`div {
      border: 2px solid blue;
    }`;
    const s2 = css`div {
      border: 3px solid blue;
    }`;
    customElements.define(name, class extends LitElement {
      static get styles() { return [ s1, s2, s1 ]; }

      render() {
        return htmlWithStyles`
        <div>Testing1</div>`;
      }
    });
    const el = document.createElement(name);
    container.appendChild(el);
    await (el as LitElement).updateComplete;
    const div = el.shadowRoot!.querySelector('div');
    assert.equal(getComputedStyleValue(div!, 'border-top-width').trim(), '2px');
  });

  test('`static get styles` array is flattened', async () => {
    const name = generateElementName();
    const styles = [
      css`.level1 {
        border: 1px solid blue;
      }`,
      [
        css`.level2 {
          border: 2px solid blue;
        }`,
        [
          css`.level3 {
            border: 3px solid blue;
          }`,
          [
            css`.level4 {
              border: 4px solid blue;
            }`,
          ],
        ],
      ],
    ];
    customElements.define(name, class extends LitElement {
      static get styles() { return [ styles ]; }

      render() {
        return htmlWithStyles`
        <div class="level1">Testing1</div>
        <div class="level2">Testing2</div>
        <div class="level3">Testing3</div>
        <div class="level4">Testing4</div>`;
      }
    });
    const el = document.createElement(name);
    container.appendChild(el);
    await (el as LitElement).updateComplete;
    const level1 = el.shadowRoot!.querySelector('.level1');
    const level2 = el.shadowRoot!.querySelector('.level2');
    const level3 = el.shadowRoot!.querySelector('.level3');
    const level4 = el.shadowRoot!.querySelector('.level4');
    assert.equal(getComputedStyleValue(level1!, 'border-top-width').trim(), '1px');
    assert.equal(getComputedStyleValue(level2!, 'border-top-width').trim(), '2px');
    assert.equal(getComputedStyleValue(level3!, 'border-top-width').trim(), '3px');
    assert.equal(getComputedStyleValue(level4!, 'border-top-width').trim(), '4px');
  });

  test('`styles` can be a static field', async () => {
    const name = generateElementName();
    customElements.define(name, class extends LitElement {
      static styles = [
        css`div {
          border: 2px solid blue;
        }`,
        css`span {
          display: block;
          border: 3px solid blue;
        }`
      ];

      render() {
        return htmlWithStyles`
        <div>Testing1</div>
        <span>Testing2</span>`;
      }
    });
    const el = document.createElement(name);
    container.appendChild(el);
    await (el as LitElement).updateComplete;
    const div = el.shadowRoot!.querySelector('div');
    assert.equal(getComputedStyleValue(div!, 'border-top-width').trim(), '2px');
    const span = el.shadowRoot!.querySelector('span');
    assert.equal(getComputedStyleValue(span!, 'border-top-width').trim(),
                 '3px');
  });

  test('can extend and augment `styles`', async () => {
    const base = generateElementName();
    customElements.define(base, class extends LitElement {
      static get styles() { return css`div {
          border: 2px solid blue;
        }`;
      }

      render() {
        return htmlWithStyles`
        <div>Testing1</div>`;
      }
    });

    const sub = generateElementName();
    customElements.define(sub, class extends customElements.get(base) {
      static get styles() {
        return [
          super.styles,
          css`span {
            display: block;
            border: 3px solid blue;
          }`
        ];
      }

      render() {
        return htmlWithStyles`
        ${super.render()}
        <span>Testing2</span>`;
      }
    });

    const subsub = generateElementName();
    customElements.define(subsub, class extends customElements.get(sub) {
      static get styles() {
        return [
          super.styles,
          css`p {
            display: block;
            border: 4px solid blue;
          }`
        ];
      }

      render() {
        return htmlWithStyles`
        ${super.render()}
        <p>Testing3</p>`;
      }
    });
    let el = document.createElement(base);
    container.appendChild(el);
    await (el as LitElement).updateComplete;
    const div = el.shadowRoot!.querySelector('div');
    assert.equal(getComputedStyleValue(div!, 'border-top-width').trim(), '2px');
    el = document.createElement(sub);
    container.appendChild(el);
    await (el as LitElement).updateComplete;
    const span = el.shadowRoot!.querySelector('span');
    assert.equal(getComputedStyleValue(span!, 'border-top-width').trim(),
                 '3px');
    el = document.createElement(subsub);
    container.appendChild(el);
    await (el as LitElement).updateComplete;
    const p = el.shadowRoot!.querySelector('p');
    assert.equal(getComputedStyleValue(p!, 'border-top-width').trim(),
                 '4px');
  });

  test('can extend and override `styles`', async () => {
    const base = generateElementName();
    customElements.define(base, class extends LitElement {
      static get styles() { return css`div {
          border: 2px solid blue;
        }`;
      }

      render() {
        return htmlWithStyles`
        <div>Testing1</div>`;
      }
    });

    const sub = generateElementName();
    customElements.define(sub, class extends customElements.get(base) {
      static get styles() { return css`div {
          border: 3px solid blue;
        }`;
      }

    });

    const subsub = generateElementName();
    customElements.define(subsub, class extends customElements.get(sub) {
      static get styles() { return css`div {
          border: 4px solid blue;
        }`;
      }

    });
    let el = document.createElement(base);
    container.appendChild(el);
    await (el as LitElement).updateComplete;
    let div = el.shadowRoot!.querySelector('div');
    assert.equal(getComputedStyleValue(div!, 'border-top-width').trim(), '2px');
    el = document.createElement(sub);
    container.appendChild(el);
    await (el as LitElement).updateComplete;
    div = el.shadowRoot!.querySelector('div');
    assert.equal(getComputedStyleValue(div!, 'border-top-width').trim(),
                 '3px');
    el = document.createElement(subsub);
    container.appendChild(el);
    await (el as LitElement).updateComplete;
    div = el.shadowRoot!.querySelector('div');
    assert.equal(getComputedStyleValue(div!, 'border-top-width').trim(),
                 '4px');
  });

  test('elements should inherit `styles` by default', async () => {
    const base = generateElementName();
    customElements.define(base, class extends LitElement {
      static styles = css`div {border: 4px solid black;}`;
    });

    const sub = generateElementName();
    customElements.define(sub, class extends customElements.get(base) {
      render() {
        return htmlWithStyles`<div></div>`;
      }
    });

    const el = document.createElement(sub);
    container.appendChild(el);
    await (el as LitElement).updateComplete;
    const div = el.shadowRoot!.querySelector('div');
    assert.equal(getComputedStyle(div!).getPropertyValue('border-top-width').trim(), '4px');
  });
});

suite('ShadyDOM', () => {
  let container: HTMLElement;

  setup(function() {
    if (!window.ShadyDOM) {
      this.skip();
    } else {
      container = document.createElement('div');
      document.body.appendChild(container);
    }
  });

  teardown(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  test('properties in styles render with initial value and cannot be changed',
       async () => {
         let border = `6px solid blue`;
         const name = generateElementName();
         customElements.define(name, class extends LitElement {
           render() {
             return htmlWithStyles`
        <style>
          div {
            border: ${border};
          }
        </style>
        <div>Testing...</div>`;
           }
         });
         const el = document.createElement(name) as LitElement;
         container.appendChild(el);
         await el.updateComplete;
         const div = el.shadowRoot!.querySelector('div');
         assert.equal(getComputedStyleValue(div!, 'border-top-width').trim(),
                      '6px');
         border = `4px solid orange`;
         el.requestUpdate();
         await el.updateComplete;
         assert.equal(getComputedStyleValue(div!, 'border-top-width').trim(),
                      '6px');
       });
});

// @ts-check
import { LitElement, html } from '../../lit-element.js';
import { customElement, property } from '../../lit-element-decorators.js'

declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}

@customElement('my-element')
export class MyElement extends LitElement {
  @property(String) foo: string = 'foo';
  @property({ type: Number }) bar: number;
  @property(Number) whales: number = 0;
  @property({ type: Array }) friends: any;

  constructor() {
    super();
  }

  ready() {
    this.addEventListener('click', async () => {
      this.whales++;
      await this.nextRendered;
      this.dispatchEvent(new CustomEvent('whales', {detail: {whales: this.whales}}))
      console.log(this.shadowRoot.querySelector('.count').textContent);
    });
    super.ready();
  }

  // @ts-ignore
  render({foo, bar, whales}) {
    return html`
      <style>
        :host {
          display: block;
        }

        .count {
          color: green;
        }

        .content {
          border: 1px solid black;
          padding: 8px;
        }
      </style>
      <h4>Foo: ${foo}, Bar: ${bar}</h4>
      <div class="content">
        <slot></slot>
      </div>
      <div class="count">
        whales: ${'🐳'.repeat(whales)}
      </div>
    `;
  }
}
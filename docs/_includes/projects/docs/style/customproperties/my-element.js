import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  render() {
    return html`
      <style>
        :host[hidden] { display: none; }
        :host { display: block;
          background-color: var(--myBackground, yellow);
          color: var(--myColor, black);
          padding: var(--myPadding, 8px);
        }
      </style>
      <p>Hello world</p>
    `;
  }
}
customElements.define('my-element', MyElement);

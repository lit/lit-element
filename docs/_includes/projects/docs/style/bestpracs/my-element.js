import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  render() {
    return html`
      <style>
        :host[hidden] { display: none; }
        :host { display: block; }
      </style>
      <p>Hello world</p>
    `;
  }
}
customElements.define('my-element', MyElement);

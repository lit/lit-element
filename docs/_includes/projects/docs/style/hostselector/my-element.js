import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  render() {
    return html`
      <style>
        :host([hidden]) { display: none; }
        :host { display: block;
          border: 1px solid black;
        }
      </style>
      <p>Hello world</p>
    `;
  }
}
customElements.define('my-element', MyElement);

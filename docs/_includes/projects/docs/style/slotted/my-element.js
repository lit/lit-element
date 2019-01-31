import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  render() {
    return html`
      <style>
        :host([hidden]) { display: none; }
        :host { display: block; }
        ::slotted(*) { font-family: Roboto; }
        ::slotted(span) { color: blue; }
        div ::slotted(*) { color: red; }
      </style>
      <slot></slot>
      <div><slot name="hi"></slot></div>
    `;
  }
}
customElements.define('my-element', MyElement);

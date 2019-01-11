import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  render() {
    return html`
      <span>More inheritance</span>
    `;
  }
}
customElements.define('my-element', MyElement);

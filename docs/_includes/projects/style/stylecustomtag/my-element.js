import { LitElement, html, css } from 'lit-element';

class MyElement extends LitElement {
  render() {
    return html`<p>Hello world</p>`;
  }
}

customElements.define('my-element', MyElement);

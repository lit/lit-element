import { LitElement, html, css } from 'lit-element';

class MyElement extends LitElement {
  static get styles() {
    return css`
      div { font-family: Roboto; }
    `;
  }
  render() {
    return html`<div>Hello world</div>`;
  }
}

customElements.define('my-element', MyElement);

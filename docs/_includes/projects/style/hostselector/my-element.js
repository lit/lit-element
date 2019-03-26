import { LitElement, html, css } from 'lit-element';

class MyElement extends LitElement {
  static get styles() {
    return css`
      :host([hidden]) { display: none; }
      :host { display: block;
        border: 1px solid black;
      }
    `;
  }
  render() {
    return html`
      <p>Hello world</p>
    `;
  }
}
customElements.define('my-element', MyElement);

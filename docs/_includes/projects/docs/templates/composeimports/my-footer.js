import { LitElement, html } from '@polymer/lit-element';

class MyFooter extends LitElement {
  render() {
    return html`
      <footer>footer</footer>
    `;
  }
}
customElements.define('my-footer', MyFooter);

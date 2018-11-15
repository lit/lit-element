import { LitElement, html } from '@polymer/lit-element';

class MyHeader extends LitElement {
  render() {
    return html`
      <header>header</header>
    `;
  }
}
customElements.define('my-header', MyHeader);

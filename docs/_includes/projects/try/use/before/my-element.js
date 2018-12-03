import { LitElement, html } from '@polymer/lit-element'; 

class MyElement extends LitElement {
  render() {
    return html`
      <p>Hello world! From my-element</p>
    `;
  }
}
customElements.define('my-element', MyElement);

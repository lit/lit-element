import { LitElement, html } from '@polymer/lit-element'; 

class CustomElement extends LitElement {
  render(){
    return html`
      <style>
        p { color: blue }
      </style>
      <p>hello world from custom-element</p>
    `;
  }
}
customElements.define('custom-element', CustomElement);

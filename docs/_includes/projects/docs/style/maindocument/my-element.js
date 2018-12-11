import { LitElement, html } from '@polymer/lit-element'; 

class MyElement extends LitElement {
  render() {
    return html`
      <style>
        :host[hidden] { display: none; }
        :host { 
          display: block; 
        }
        div {
          color: red;
        }
      </style>
      <p>Paragraph</p>
      <div>Div</div>
    `;
  }
}
customElements.define('my-element', MyElement);

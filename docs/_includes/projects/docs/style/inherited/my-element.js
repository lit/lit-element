import { LitElement, html } from '@polymer/lit-element'; 

class MyElement extends LitElement {
  render() {
    return html`
      <style>
        :host[hidden] { display: none; }
        :host { 
          display: block; 
          font-family: Roboto;
          font-size: 20;
          color: blue;
        }
      </style>
      <p>Inherits font styles from host</p>
    `;
  }
}
customElements.define('my-element', MyElement);

import { LitElement, html } from 'lit-element';

class CustomElement extends LitElement {
  static get properties(){
    return {
      myString: String
    };
  }
  constructor(){
    super();
    this.myString='initial value';
  }
  _render({myString}){
    return html`
      <h1>${myString}</h1>
    `;
  }
}

customElements.define('custom-element', CustomElement);

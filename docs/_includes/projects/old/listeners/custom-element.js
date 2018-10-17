import { LitElement, html } from '@polymer/lit-element';

class CustomElement extends LitElement {  
  static get properties(){
    return {
      myStyle: String
    };
  }
  constructor(){
    super();
    this.myStyle = '';
  }
  _render({myStyle}){
    return html`
      <style>
        .red { color: red; }
        .blue { color: blue; }
      </style>
      
      <p>lit-element is <span class$="${myStyle}">rad</span> :)</p>
    `;
  }
}

customElements.define('custom-element', CustomElement);

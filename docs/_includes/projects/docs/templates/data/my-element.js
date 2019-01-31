import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  static get properties(){
    return {
      prop1: Number,
      prop2: Number
    };
  }
  constructor(){
    super();
    this.prop1=0;
    this.prop2=1;
  }
  render(){
    return html`
      <p>Attribute binding</p>
      <p>prop1: ${this.prop1}</p>
      <button @click="${() => this.changeMe('prop1')}">change prop1</button>
      <button @click="${() => this.changeMe('prop2')}">change prop2</button>
    `;
  }
}
customElements.define('my-element', MyElement);

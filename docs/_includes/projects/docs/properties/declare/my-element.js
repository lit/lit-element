import { LitElement, html } from '@polymer/lit-element';

class MyElement extends LitElement {  
  static get properties() { return { 
    prop1: { type: String },
    prop2: { type: Number },
    prop3: { type: Boolean } 
  };}

  constructor() {
    super();
    this.prop1 = 'Hello World';
    this.prop2 = 5;
    this.prop3 = false;
  }
  render() {
    return html`
      <p>prop1: ${this.prop1}</p>
      <p>prop2: ${this.prop2}</p>
      <p>prop3: ${this.prop3}</p>
    `;
  }
}
customElements.define('my-element', MyElement);

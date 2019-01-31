import { LitElement, html } from 'lit-element';

export class SuperElement extends LitElement {
  static get properties() { return {
    prop1: { type: Number }
  };}

  get prop1() {
    console.log('custom getter');
    return this._prop1;
  }

  set prop1(value) {
    console.log('custom setter');
    this._prop1 = Math.floor(value/10);
  }

  constructor() {
    super();
    this.prop1 = 0;
  }

  render() {
    return html`
      <p>prop1: ${this.prop1}</p>
      <button @click="${this.changeProperty}">change property</button>
    `;
  }

  changeProperty() {
    let randy = Math.floor(Math.random()*100);
    console.log('Setting to:', randy);
    this.prop1 = randy;
  }
}

customElements.define('super-element', SuperElement);

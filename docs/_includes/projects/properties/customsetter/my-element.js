import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  static get properties() { return {
    prop1: { type: Number, noAccessor: true },
    prop2: { type: Number },
    prop3: { type: Number, noAccessor: true },
  };}

  set prop1(newVal) { this._prop1 = Math.floor(newVal); }
  set prop2(newVal) { this._prop2 = Math.floor(newVal); }
  set prop3(newVal) {
    let oldVal = this._prop3;
    this._prop3 = Math.floor(newVal);
    this.requestUpdate('prop3', oldVal);
  }

  get prop1() { return this._prop1; }
  get prop2() { return this._prop2; }
  get prop3() { return this._prop3; }

  constructor() {
    super();
    this._prop1 = 0;
    this._prop2 = 0;
    this._prop3 = 0;
  }

  render() {
    return html`
      <p>prop1: ${this.prop1}</p>
      <p>prop2: ${this.prop2}</p>
      <p>prop3: ${this.prop3}</p>

      <button @click="${this.getNewVal}">change properties</button>
    `;
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      console.log(`${propName} changed. oldValue: ${oldValue}`);
    });
  }

  getNewVal() {
    let newVal = Math.random()*10;
    this.prop1 = newVal;
    this.prop2 = newVal;
    this.prop3 = newVal;
  }
}
customElements.define('my-element', MyElement);

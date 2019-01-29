import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  static get properties() { return {
    prop1: { type: Number },
  };}

  // Custom setter for prop1
  set prop1(newVal) {
    let oldVal = this._prop1;
    this._prop1 = Math.floor(newVal);
    // Property setter must call requestUpdate for
    // property changes to trigger an update cycle
    this.requestUpdate('prop1', oldVal);
  }


  get prop1() { return this._prop1; }

  constructor() {
    super();
    this._prop1 = 0;
  }

  render() {
    return html`
      <p>prop1: ${this.prop1}</p>

      <button @click="${this.getNewVal}">change</button>
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
  }
}
customElements.define('my-element', MyElement);

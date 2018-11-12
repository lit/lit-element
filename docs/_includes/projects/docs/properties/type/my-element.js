import { LitElement, html } from '@polymer/lit-element';

const JsonType = {
  fromAttribute: (attr) => { return JSON.parse(attr) },
  toAttribute:   (prop) => { return JSON.stringify(prop) }
}

class MyElement extends LitElement { 
  static get properties() { return { 
    myNumber: { type: Number },
    myBool: { type: Boolean },
    myObj: { type: JsonType },
    myArray: { type: JsonType },
  };}
  constructor() {
    super();
    this.myNumber = 0;
    this.myBool = false;
    this.myObj = {};
    this.myArray = [];
  }
  render() {
    return html`
      <p>${this.myNumber}</p>
      <p>${this.myBool}</p> 
      <p>${this.myObj.stuff}</p>
      <p>${this.myArray.map(item => html`<span>${item},</span>`)}</p>
    `;
  }
  firstUpdated(){
    console.log('this.myNumber', typeof(this.myNumber), this.myNumber);
    console.log('this.Bool', typeof(this.myBool), this.myBool);
    console.log('this.myObj', typeof(this.myObj), this.myObj);
    console.log('this.myArray', typeof(this.myArray), this.myArray);
  }
}
customElements.define('my-element', MyElement);

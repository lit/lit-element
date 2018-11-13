import { LitElement, html } from '@polymer/lit-element';

class MyElement extends LitElement { 
  static get properties() { return { 
    /**
     * Changes to attribute `my-prop` cause updates to property `myProp`
     * Changes to property `myProp` reflect to attribute `my-prop`
     */    
    myProp: { type: String, attribute: 'my-prop', reflect: true },

    /**
     * Changes to attribute `someprop` cause updates to property `someProp`
     * Changes to property `someProp` do not reflect to attribute `someprop`
     */
    someProp: { type: String },
  };}

  constructor() {
    super();
    this.myProp='myProp';
    this.someProp='someProp';
  }

  attributeChangedCallback(name, oldval, newval) {
    console.log('attribute change: ', newval);
    super.attributeChangedCallback(name, oldval, newval);
  }

  render() {
    return html`
      <p>${this.myProp}</p>
      <p>${this.someProp}</p>
      <button @click="${this.changeAttributes}">change attributes</button>
      <button @click="${this.changeProperties}">change properties</button>
    `;
  }

  changeAttributes() {
    let randomString = Math.floor(Math.random()*100).toString();
    this.setAttribute('my-prop', 'my-prop ' + randomString);
    this.setAttribute('someprop', 'someprop ' + randomString);
    this.requestUpdate();
  }

  changeProperties() {
    let randomString = Math.floor(Math.random()*100).toString();
    this.myProp='myProp ' + randomString;
    this.someProp='someProp ' + randomString;
  }
  
  updated() {
    console.log(this);
  }
}
customElements.define('my-element', MyElement);

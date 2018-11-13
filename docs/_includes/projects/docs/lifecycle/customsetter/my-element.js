import { LitElement, html } from '@polymer/lit-element';

class MyElement extends LitElement { 
  static get properties() { return { 
    foo: String 
  };}
  
  /**
   * Custom property setter for `foo`. 
   * 
   * Call `requestUpdate` when implementing a custom property setter
   * to ensure that changes to the property will trigger updates
   * when required.
   * 
   * Pass the old value of the property to `requestUpdate` so that 
   * any property options can be correctly applied.
   */
  set foo(newVal) { 
    let oldVal = this.foo;
    console.log('setting foo from', oldVal, 'to', newVal);
    this.setAttribute('foo', newVal);
    this.requestUpdate('foo', oldVal).then(
      result => console.log('updateComplete:', result)
    );
  }

  /**
   * Custom property getter for `foo`. 
   */ 
  get foo() {
    return this.getAttribute('foo'); 
  }

  render() { 
    return html`
      ${this.foo}
      <button @click="${this.getNewVal}">get new value</button>
    `;
  }
  
  getNewVal() {
    let newVal = Math.floor(Math.random()*10);
    this.foo = newVal;
  }
}
customElements.define('my-element', MyElement);

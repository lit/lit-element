import { LitElement, html } from '@polymer/lit-element';

class MyElement extends LitElement {  
  static get properties() {
    return {
      prop1: Number
    };
  }

  constructor() {
    super();
    this.prop1 = 0;
  }

  render() {
    return html`      
      <p>prop1: ${this.prop1}</p>
      <button @click="${this.changeProp}">prop1</button>
    `;
  }

  /**
   * Wait for additional state before completion of every update
   */
  get updateComplete() {
    console.log('Waiting for additional state...');
    return this.getMoreState().then(() => {
      console.log('Additional state.');
      return this._updatePromise;
    });
  }

  async getMoreState() {
    return;
  }

  async changeProp() {
    this.prop1 = Math.random();
    console.log('updateComplete resolved: ', await this.updateComplete);
  }
}

customElements.define('my-element', MyElement);

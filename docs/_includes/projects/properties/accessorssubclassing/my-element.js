import SuperElement from './super-element.js';

class MyElement extends SuperElement {  
  static get properties() { return {}; };
  
  get prop1() {
    return this._prop1;
  }

  set prop1(value) {
    console.log('MyElement custom setter');
    this._prop1 = Math.floor(value/10)*2;
  }
}

customElements.define('my-element', MyElement);

import { MyElement } from './my-element.js';

class SubElement extends MyElement {  
  static get properties() { return {
    prop1: { reflectToAttribute: true, noAccessor: true }
  }; }
}

customElements.define('sub-element', SubElement);

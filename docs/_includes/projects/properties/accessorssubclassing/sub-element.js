import { SuperElement } from './super-element.js';

class SubElement extends SuperElement {  
  static get properties() { 
    return { prop: { reflectToAttribute: true, noAccessor: true } };
  }
}

customElements.define('sub-element', SubElement);

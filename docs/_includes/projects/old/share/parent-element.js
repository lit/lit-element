import './child-1.js';
import './child-2.js';

import {html, LitElement} from '@polymer/lit-element';

class ParentElement extends LitElement {
  static get properties() { return {data : Object}; }
  constructor() {
    super();
    this.data = { prop1 : 'stuff', prop2 : 'more stuff' }
  }
  _render({data}) {
    return html`
      <h3>parent-element</h3>
      <p>data.prop1: ${data.prop1}</p>
      <p>data.prop2: ${data.prop2}</p>
      <h3>child-1</h3>
      <child-1 
        on-stuff-change="${(e) => {
      this.data = Object.assign({}, this.data, {prop1 : e.detail})
    }}" 
        stuff="${data.prop1}">
      </child-1>
      <h3>child-2</h3>
      <child-2 
        on-stuff-change="${(e) => {
      this.data = Object.assign({}, this.data, {prop2 : e.detail})
    }}" 
        stuff="${data.prop2}">
      </child-2>
    `;
  }
}

customElements.define('parent-element', ParentElement);

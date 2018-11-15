import { LitElement, html } from '@polymer/lit-element';

class CustomElement extends LitElement {  
  static get properties(){
    return {
      myArray: Array,
      myObject: Object
    };
  }
  constructor(){
    super();
    this.myArray = ['hello', 'we', 'are', 'test', 'data'];
    this.myObject = {
      prop1: 'prop 1',
      prop2: 'prop 2',
      prop3: 'prop 3'
    };
  }
  _render({myArray, myObject}){
    return html`
      <ul>
        ${myArray.map(i => html`<li>${i}</li>`)}
      </ul>
      
      <div>
        myObject.prop1: ${myObject.prop1}<br/>
        myObject.prop2: ${myObject.prop2}<br/>
        myObject.prop3: ${myObject.prop3}<br/>
      </ul>

      <p>lit-element is <span class$="${myStyle}">rad</span> :)</p>
    `;
  }
}

customElements.define('custom-element', CustomElement);

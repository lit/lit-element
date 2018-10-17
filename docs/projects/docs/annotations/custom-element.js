import { LitElement, html } from '@polymer/lit-element';

class CustomElement extends LitElement {  
  static get properties(){
    return {
      prop1: String,
      prop2: String,
      prop3: Boolean,
      prop4: String
    };
  }
  constructor(){
    super();
    this.prop1='text';
    this.prop2='attr';
    this.prop3=true;
    this.prop4='fries';
  }
  render(){
    return html`
      <div>Bind to a child element's text node. ${this.prop1}</div>

      <div id="${this.prop2}">Bind to a child element's attribute.</div>

      <p>Bind to a child element's boolean attribute. 
        <input type="checkbox" checked="${this.prop3}"/>
      </p>

      <p>Bind to a child element's property. 
        <input type="checkbox" .value="${this.prop4}"/>
      </p>
      
      <p><button id="pie" @click="${(e) => this.handlePls(e)}">
        Bind to a child element's event handler.
      </button></p>
    `;
  }
  handlePls(e){
    var id = e.target.id; 
    console.log(id + '.');
  }
}

customElements.define('custom-element', CustomElement);

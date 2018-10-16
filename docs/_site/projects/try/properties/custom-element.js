import { LitElement, html } from '@polymer/lit-element';

class CustomElement extends LitElement {  
  // Declare properties.
  static get properties(){
    return {
      headingtext: { type: String }
    };
  }
  constructor(){
    // Always call superconstructor when you override the constructor.
    super();

    // You can initialize properties in the element constructor.
    this.headingtext='Hello World!';
  }
  render(){
    return html`
      <!-- Add properties to a template with JavaScript expressions. -->
      <h1>${this.headingtext}</h1>
    `;
  }
}

customElements.define('custom-element', CustomElement);

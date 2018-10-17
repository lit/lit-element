import { LitElement, html } from '@polymer/lit-element'; 

class MyElement extends LitElement {
  static get properties(){
    return {
      message: { type: String },
      myArray: { type: Array },
      myBool: { type: Boolean }
    };
  }
  constructor(){
    super();
    this.message='Hello world! From my-element';
    
    // Initialize myArray and myBool here.
    
  }

  render(){
    return html`
      <p>${this.message}</p>

      <!-- Add a loop and a conditional here. -->
    `;
  }
}
customElements.define('my-element', MyElement);

import { LitElement, html } from '@polymer/lit-element'; 

class MyElement extends LitElement {
  static get properties(){
    return {
      // Declare property here.
      message: { type: String }
    };
  }
  constructor(){
    super();
    // Initialize property here.
    this.message='Hello world! From my-element';
  }

  render(){
    return html`
      <!-- Add property here. -->
      <p>${this.message}</p>
    `;
  }
}
customElements.define('my-element', MyElement);

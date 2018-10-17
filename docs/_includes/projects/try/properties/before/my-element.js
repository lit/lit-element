import { LitElement, html } from '@polymer/lit-element'; 

class MyElement extends LitElement {
  static get properties(){
    return {
      // Declare property here.
    };
  }
  constructor(){
    super();
    // Initialize property here.
  }
  render(){
    return html`
      <!-- Add property here. -->
      <p></p>
    `;
  }
}
customElements.define('my-element', MyElement);

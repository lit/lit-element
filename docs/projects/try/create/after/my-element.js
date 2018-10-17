// Import LitElement base class and html helper function
import { LitElement, html } from '@polymer/lit-element'; 

// Create your class here
class MyElement extends LitElement {
  render(){
    // Define your element template here
    return html`
      <p>Hello world! From my-element</p>
    `;
  }
}
// Register the element with the browser
customElements.define('my-element', MyElement);

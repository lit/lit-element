// Import and extend the LitElement base class.
import { LitElement, html } from '@polymer/lit-element'; 

class CustomElement extends LitElement {
  // Return your template from lit-element's `render` function.
  render(){
    return html`
      <!-- Write your element template in plain HTML. -->
      <p>hello world from custom-element</p>
    `;
  }
}
// Register the new element with the browser.
customElements.define('custom-element', CustomElement);

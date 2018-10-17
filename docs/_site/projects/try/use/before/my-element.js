// Import and extend the LitElement base class.
import {html, LitElement} from '@polymer/lit-element';

class MyElement extends LitElement {
  // Return your template from lit-element's `render` function.
  render() {
    return html`
      <!-- Write your element template in plain HTML. -->
      <p>Hello world! From my-element</p>
    `;
  }
}
// Register the new element with the browser.
customElements.define('my-element', MyElement);

/**
 * Try LitElement https://lit-element.polymer-project.org/guide/try
 * Completed code for 1. Create
 */

/**
 * DONE: Import the LitElement base class and html helper function.
 */
import { LitElement, html } from '@polymer/lit-element'; 

/**
 * DONE: Create a class for your element that extends the LitElement
 * base class.
 */
class MyElement extends LitElement {
  render() {
    return html`
      <p>Hello world! From my-element</p>
    `;
  }
}

/**
 * DONE: Register the new element with the browser.
 */
customElements.define('my-element', MyElement);

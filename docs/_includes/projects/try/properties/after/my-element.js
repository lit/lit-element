/**
 * Try LitElement https://lit-element.polymer-project.org/guide/try
 * Completed code for 3. Properties
 */

import { LitElement, html } from '@polymer/lit-element'; 

class MyElement extends LitElement {
  /**
   * DONE: Declare a property.
   */
  static get properties() {
    return { 
      // Property declaration
      message: { type: String }
    };
  }

  /**
   * DONE: Initialize the property.
   */
  constructor() {
    // Always call superconstructor first
    super(); 

    // Initialize property
    this.message='Hello world! From my-element';
  }

  /**
   * DONE: Add a property to your template with a JavaScript expression.
   */
  render() {
    return html`
      <p>${this.message}</p>
    `;
  }
}
customElements.define('my-element', MyElement);

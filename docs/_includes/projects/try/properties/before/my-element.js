/**
 * Try LitElement https://lit-element.polymer-project.org/try
 * Starting code for 3. Properties
 */

import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  /**
   * TODO: Declare a property.
   */
  static get properties() {
    return { };
  }

  /**
   * TODO: Initialize the property.
   */
  constructor() {
    // Always call superconstructor first
    super();
  }

  /**
   * TODO: Add a property to your template with a JavaScript expression.
   */
  render() {
    return html`
      <p></p>
    `;
  }
}
customElements.define('my-element', MyElement);

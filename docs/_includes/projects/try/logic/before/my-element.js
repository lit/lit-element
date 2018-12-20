/**
 * Try LitElement https://lit-element.polymer-project.org/try
 * Starting code for 4. Logic
 */

import { LitElement, html } from '@polymer/lit-element'; 

class MyElement extends LitElement {
  static get properties() {
    return {
      message: { type: String },
      myBool: { type: Boolean },
      myArray: { type: Array }
    };
  }
  constructor() {
    super();
    this.message='Hello world! From my-element';
    this.myBool = true;
    this.myArray = ['an','array','of','test','data'];
  }

  render() {
    return html`
      <p>${this.message}</p>

      <!-- TODO: Add a loop -->

      <!-- TODO: Add a conditional -->
    `;
  }
}
customElements.define('my-element', MyElement);

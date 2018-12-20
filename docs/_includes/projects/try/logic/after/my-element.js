/**
 * Try LitElement https://lit-element.polymer-project.org/guide/try
 * Completed code for 4. Logic
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

      <!-- DONE: Add a loop -->
      <ul>
        ${this.myArray.map(item => html`<li>${item}</li>`)}
      </ul>

      <!-- DONE: Add a conditional -->
      ${this.myBool?
        html`<p>Render some HTML if myBool is true</p>`:
        html`<p>Render some other HTML if myBool is false</p>`}
    `;
  }
}
customElements.define('my-element', MyElement);

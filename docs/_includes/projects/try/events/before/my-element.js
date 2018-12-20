/**
 * Try LitElement https://lit-element.polymer-project.org/guide/try
 * Starting code for 5. Events
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
    this.myArray = ['an','array','of','test','data'];
    this.myBool = true;
  }

  render() {
    return html`
      <p>${this.message}</p>
      <ul>
        ${this.myArray.map(item => html`<li>${item}</li>`)}
      </ul>
      ${this.myBool?
        html`<p>Render some HTML if myBool is true</p>`:
        html`<p>Render some other HTML if myBool is false</p>`}

      <!-- TODO: Add an event listener. -->
      <button>Click</button>
    `;
  }

  /**
   * TODO: Implement an event handler.
   */
}
customElements.define('my-element', MyElement);

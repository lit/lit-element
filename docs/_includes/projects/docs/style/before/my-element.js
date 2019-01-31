/**
 * Try LitElement https://lit-element.polymer-project.org/try
 * Starting code for 6. Style
 */

import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  static get properties() {
    return {
      message: { type: String },
      myArray: { type: Array },
      myBool: { type: Boolean }
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
      <!-- TODO: Add a style block. -->

      <!-- TODO: Add a styled paragraph. -->

      <p>${this.message}</p>
      <ul>
        ${this.myArray.map(i => html`<li>${i}</li>`)}
      </ul>
      ${this.myBool?
        html`<p>Render some HTML if myBool is true</p>`:
        html`<p>Render some other HTML if myBool is false</p>`}
      <button @click="${(event) => this.clickHandler(event)}">Click</button>
    `;
  }

  clickHandler(event) {
    console.log(event.target);
    this.myBool = !this.myBool;
  }
}
customElements.define('my-element', MyElement);

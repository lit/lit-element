/**
 * Try LitElement https://lit-element.polymer-project.org/try
 * Completed code for 6. Style
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
      <!-- DONE: Add a style block. -->
      <style>
        p {
          font-family: Roboto;
          font-size: 16px;
          font-weight: 500;
        }
        .red {
          color: red;
        }
        .blue {
          color: blue;
        }
      </style>

      <!-- DONE: Add a styled paragraph. -->
      <p class="${this.myBool?'red':'blue'}">styled paragraph</p>

      <p>${this.message}</p>
      <ul>
        ${this.myArray.map(item => html`<li>${item}</li>`)}
      </ul>
      ${this.myBool?
        html`<p>Render some HTML if myBool is true</p>`:
        html`<p>Render some other HTML if myBool is false</p>`}
      <button @click="${this.clickHandler}">Click</button>
    `;
  }

  clickHandler(event) {
    console.log(event.target);
    this.myBool = !this.myBool;
  }
}
customElements.define('my-element', MyElement);

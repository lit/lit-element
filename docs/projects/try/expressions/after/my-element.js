import { LitElement, html } from '@polymer/lit-element'; 

class MyElement extends LitElement {
  static get properties(){
    return {
      message: { type: String },
      myArray: { type: Array },
      myBool: { type: Boolean }
    };
  }
  constructor(){
    super();

    this.message='Hello world! From my-element';
    
    // Initialize myArray and myBool here.
    this.myArray = ['an','array','of','test','data'];
    this.myBool = true;
  }

  render(){
    return html`
      <p>${this.message}</p>

      <!-- Add a loop and a conditional here. -->
      <ul>
        ${this.myArray.map(i => html`<li>${i}</li>`)}
      </ul>
      ${this.myBool?
        html`<p>Render some HTML if myBool is true</p>`:
        html`<p>Render some other HTML if myBool is false</p>`}
    `;
  }
}
customElements.define('my-element', MyElement);

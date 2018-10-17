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
    
    this.myArray = ['an','array','of','test','data'];
    this.myBool = true;
  }

  render(){
    return html`
      <p>${this.message}</p>

      <ul>
        ${this.myArray.map(i => html`<li>${i}</li>`)}
      </ul>
      ${this.myBool?
        html`<p>Render some HTML if myBool is true</p>`:
        html`<p>Render some other HTML if myBool is false</p>`}

      <!-- Annotate the button to add an event listener. --> 
      <button>Click</button>
    `;
  }
  // Add an event handler here.
}
customElements.define('my-element', MyElement);

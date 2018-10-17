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
      <!-- Add a style block here -->
      <style>
        p {
          font-family: Roboto;
          font-size: 24px;
          font-weight: 500;
        }
        .red {
          color: red;
        }
        .blue {
          color: blue;
        }
      </style>

      <p>${this.message}</p>

      <ul>${this.myArray.map(i => html`<li>${i}</li>`)}</ul>

      <!-- Style this text --> 
      <p class="${this.myBool?'red':'blue'}">style me</p>
      
      <button @click="${(event) => this.clickHandler(event)}">Click</button>
    `;
  }
  clickHandler(event){
    console.log(event.target);
    this.myBool = !this.myBool;
  }
}
customElements.define('my-element', MyElement);

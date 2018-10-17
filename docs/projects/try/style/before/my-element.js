import {html, LitElement} from '@polymer/lit-element';

class MyElement extends LitElement {
  static get properties() {
    return {
      message : {type : String},
      myArray : {type : Array},
      myBool : {type : Boolean}
    };
  }
  constructor() {
    super();
    this.message = 'Hello world! From my-element';
    this.myArray = [ 'an', 'array', 'of', 'test', 'data' ];
    this.myBool = true;
  }

  render() {
    return html`
      <!-- Add a style block here -->

      <p>${this.message}</p>

      <ul>${this.myArray.map(i => html`<li>${i}</li>`)}</ul>

      <!-- Style this text --> 
      <p>style me</p>
      
      <button @click="${(event) => this.clickHandler(event)}">Click</button>
    `;
  }
  clickHandler(event) {
    console.log(event.target);
    this.myBool = !this.myBool;
  }
}
customElements.define('my-element', MyElement);

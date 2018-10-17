import { LitElement, html } from '@polymer/lit-element';

class CustomElement extends LitElement {  
  static get properties(){
    return {
      myArray: { type: Array },
      myBool: { type: Boolean }
    };
  }
  constructor(){
    super();
    this.myArray = ['an','array','of','test','data'];
    this.myBool = true;
  }
  render(){
    return html`
      <ul>
        ${this.myArray.map(i => html`<li>${i}</li>`)}
      </ul>
      ${this.myBool?
        html`<p>Render some HTML if myBool is true</p>`:
        html`<p>Render some other HTML if myBool is false</p>`}
    `;
  }
}

customElements.define('custom-element', CustomElement);

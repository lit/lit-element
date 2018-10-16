import { LitElement, html } from '@polymer/lit-element';

class CustomElement extends LitElement {  
  render(){
    return html`
      <p>check the console</p>
      <button id="mybutton" @click="${(event) => this.clickHandler(event)}">click</button>
    `;
  }
  clickHandler(event){
    console.log(event.target.id + ' was clicked.');
  }
}

customElements.define('custom-element', CustomElement);

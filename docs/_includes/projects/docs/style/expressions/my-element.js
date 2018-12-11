import { LitElement, html } from '@polymer/lit-element'; 

class MyElement extends LitElement {
  render() { 
    return html`
      <style>${this.myStyles}</style>
      <p>hi world</p>
    `; 
  }
  get myStyles() { 
    return html`p { color: red }`; 
  } 
}

customElements.define('my-element', MyElement);

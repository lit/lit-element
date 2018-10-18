import { LitElement, html } from '@polymer/lit-element';

class MyElement extends LitElement {  
  render(){
    return html`
      <textarea>Focus me on first update</textarea>
    `;
  }
  firstUpdated(changedProperties){
    console.log(changedProperties);
    this.focus();
  }
}
customElements.define('my-element', MyElement);

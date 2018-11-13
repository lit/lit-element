import { LitElement, html } from '@polymer/lit-element';

class MyElement extends LitElement {
  render(){
    return html`
      <div>
        <slot id="one"></slot>
      </div>
    `;
  }
}
customElements.define('my-element', MyElement);

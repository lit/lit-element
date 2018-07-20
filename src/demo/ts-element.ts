import { LitElement, html, property } from '../lit-element.js';

class TSElement extends LitElement {

  @property({attribute: true, fromAttribute: String})
  message = 'Hi';

  render() {
    const {message} = this;
    return html`
      <style>
        :host {
          display: block;
        }
      </style>TSElement says: ${message}
    `;
  }

}
customElements.define('ts-element', TSElement);
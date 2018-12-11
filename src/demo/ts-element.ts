import {html, LitElement, property} from '../lit-element.js';

class TSElement extends LitElement {

  @property() message = 'Hi';

  @property({
    attribute : 'more-info',
    serializer: (value: string) => `[${value}]`
  })
  extra = '';

  render() {
    const {message, extra} = this;
    return html`
      <style>
        :host {
          display: block;
        }
      </style>TSElement says: ${message} ${extra}
    `;
  }
}
customElements.define('ts-element', TSElement);

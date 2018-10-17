import {html, LitElement} from '@polymer/lit-element';

class Child2 extends LitElement {
  static get properties() { return {stuff : String}; }
  constructor() {
    super();
    this.stuff = '';
  }
  _render({stuff}) {
    return html`
      <p>${stuff}</p>
      <button on-click="${() => {
      this.stuff = 'foo';
      var event = new CustomEvent('stuff-change', {'detail' : this.stuff});
      this.dispatchEvent(event);
    }}">change child-2 prop</button>
    `;
  }
}

customElements.define('child-2', Child2);

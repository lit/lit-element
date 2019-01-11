import { LitElement, html } from 'lit-element';

class Child1 extends LitElement {
  static get properties(){
    return {
      stuff: String
    };
  }
  constructor(){
    super();
    this.stuff='';
  }
  _render({stuff}){
    return html`
      <p>${stuff}</p>
      <button on-click="${() => {
        this.stuff='meh';
        var event = new CustomEvent(
          'stuff-change',
          {'detail': this.stuff }
        );
        this.dispatchEvent(event);
      }}">change child-1 prop</button>
    `;
  }

}

customElements.define('child-1',  Child1);

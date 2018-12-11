import { LitElement, html } from '@polymer/lit-element'; 
import { navStyles } from './my-styles.js';

class MyElement extends LitElement {
  static get properties() {
    return { menuItems: { } };
  }
  constructor() {
    super();
    this.menuItems = [ 'Option1', 'Option2', 'Option3'];
  }
  render() {
    return html`
      <style>
        :host[hidden] { display: none; }
        :host { display: block; 
          color: var(--myColor);
          font-family: var(--myFont);
        }
        ${navStyles}
      </style>
      <ul class="navigation">
        ${this.menuItems.map(item => html`<li class="item">${item}</li>`)}
      </ul>
    `;
  }
}
customElements.define('my-element', MyElement);

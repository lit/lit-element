import { LitElement, html, property, customElement } from 'lit-element';

@customElement('custom-greeting')
export class CustomGreeting extends LitElement { 
  @property() name = 'World';
  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}

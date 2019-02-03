import { LitElement, html, css } from 'lit-element';

class MyElement extends LitElement {
  static styles = css`
    :host { 
      display: block;
      color: var(--my-element-text-color, 'black'); 
      background: var(--my-element-background-color, 'white');  
      font-family: var(--my-element-font-family, 'Times New Roman');
    }
    :host([hidden]) {
      display: none;
    }
  `;
  render() {
    return html`
      <div>Hello from my-element</div>
    `;
  }
}
customElements.define('my-element', MyElement);

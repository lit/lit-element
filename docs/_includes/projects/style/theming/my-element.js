import { LitElement, html, css } from 'lit-element';

class MyElement extends LitElement {
  static styles = css`
    :host { 
      display: block;
      color: var(--my-element-text-color); 
      background: var(--my-element-background-color);  
      font-family: var(--my-element-font-family);
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

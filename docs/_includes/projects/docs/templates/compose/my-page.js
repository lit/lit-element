import { LitElement, html } from 'lit-element';

class MyPage extends LitElement {
  render() {
    return html`
      ${this.headerTemplate}
      ${this.articleTemplate}
      ${this.footerTemplate}
    `;
  }
  static get headerTemplate() {
    return html`<header>header</header>`;
  }
  static get articleTemplate() {
    return html`<article>article</article>`;
  }
  static get footerTemplate() {
    return html`<footer>footer</footer>`;
  }
}
customElements.define('my-page', MyPage);

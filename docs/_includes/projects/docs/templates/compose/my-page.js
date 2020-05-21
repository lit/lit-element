import {LitElement, html} from 'lit-element';

class MyPage extends LitElement {
  static get properties() {
    return {
      article: {
        attribute: false,
      },
    };
  }

  constructor() {
    super();
    this.article = {
      title: 'My Nifty Article',
      text: 'Some witty text.',
    };
  }

  render() {
    return html`
      ${this.headerTemplate(this.article.title)}
      ${this.articleTemplate(this.article.text)} ${this.footerTemplate}
    `;
  }
  headerTemplate(title) {
    return html`<header>${title}</header>`;
  }
  articleTemplate(text) {
    return html`<article>${text}</article>`;
  }
  get footerTemplate() {
    return html`<footer>Your footer here.</footer>`;
  }
}
customElements.define('my-page', MyPage);

import {html, LitElement} from '@polymer/lit-element';

class MyApp extends LitElement {
  static get properties() {
    return {
      headerText : {type : String},
      menu : {type : Array},
      footerText : {type : String}
    };
  }
  constructor() {
    super();
    this.headerText = "My App";
    this.menu = [
      {'url' : '/design', title : 'Design'},
      {'url' : '/how', title : 'How-tos'}, {'url' : '/about', title : 'About'}
    ];
    this.footerText = "Copyright (c) Me, 2018";
    this.myBool = true;
  }

  static get headerTemplate() {
    return html`
      <header>${this.headerText}</header>
    `;
  }
  static get navTemplate() {
    return html`
      <nav>
        ${this.menu.map(i => {
      return html`
          <li><a href="${i.url}">${i.title}</a></li>
        `;
    })}
      </nav>
    `;
  }
  static get footerTemplate() {
    return html`
      <footer>${this.footerText}</footer>
    `;
  }

  render() {
    return html`
      ${this.headerTemplate()}
      ${this.navTemplate()}
      ${this.footerTemplate()}
    `;
  }
}
customElements.define('my-app', MyApp);

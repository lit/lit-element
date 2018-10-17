import { LitElement, html } from '@polymer/lit-element';

/**
 * Use this pattern instead.
 */
class UpdateProperties extends LitElement {
  static get properties(){
    return {
      message: String
    };
  }
  constructor(){
    super();
    this.message='Loading';
    this.addEventListener('stuff-loaded', this.doSomething.bind(this));
    this.loadStuff();
  }
  render(){
    return html`
      <p>${this.message}</p>
    `;
  }
  doSomething(){
    this.message='Loading complete.';
  }
  loadStuff(){
    setInterval(() => {
      var loaded = new CustomEvent('stuff-loaded', { detail: {}});
      this.dispatchEvent(loaded);
    }, 3000);
  }
}

customElements.define('update-properties', UpdateProperties);

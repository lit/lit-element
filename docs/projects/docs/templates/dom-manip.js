import {html, LitElement} from '@polymer/lit-element';

/**
 * Anti-pattern. Avoid manipulating DOM.
 */
class DomManip extends LitElement {
  constructor() {
    super();
    this.addEventListener('stuff-loaded', this.doSomething.bind(this));
    this.loadStuff();
  }
  render() {
    return html`
      <p id="message">Loading</p>
    `;
  }
  doSomething() {
    this.shadowRoot.getElementById('message').innerHTML = 'Loading complete.';
  }
  loadStuff() {
    setInterval(() => {
      var loaded = new CustomEvent('stuff-loaded', {detail : {}});
      this.dispatchEvent(loaded);
    }, 3000);
  }
}
customElements.define('dom-manip', DomManip);

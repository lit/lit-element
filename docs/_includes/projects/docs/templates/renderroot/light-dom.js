import { LitElement, html } from 'lit-element';

/**
 * This element renders its template as light DOM children.
 */
class LightDom extends LitElement {
  render(){
    return html`
      <p><b>Render root overridden.</b> Template renders in light DOM.</p>
    `;
  }
  /**
   * To customize an element's render root, implement createRenderRoot. Return
   * the node into which to render the element's template.
   *
   * This element renders child nodes into its light DOM.
   */
  createRenderRoot(){
    return this;
  }
}
customElements.define('light-dom', LightDom);

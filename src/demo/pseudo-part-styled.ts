import {PartStyledElement, html, customElement} from '../lib/part-styled-element.js';

@customElement('pseudo-part')
export class PseudoPart extends PartStyledElement {

  render() {
    return html`<button part="button">Hello World</button>`;
  }
}
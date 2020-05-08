import {UpdatingElement, PropertyValues} from '../lib/updating-element.js';
import {customElement} from '../lib/decorators/custom-element.js';
import {property} from '../lib/decorators/property.js';

import {LitElement, html} from '../lit-element.js';

@customElement('ts-element')
export class TSElement extends UpdatingElement {
  @property({reflect: true}) message = 'Hi';

  @property(
      {attribute: 'more-info', converter: (value: string|null) => `[${value}]`})
  extra = '';

  update(changedProperties: PropertyValues) {
    console.log(`base update, message: ${this.message}, extra: ${this.extra}`);
    super.update(changedProperties);
  }
}
property({reflect: true})(TSElement.prototype, 'foo');

@customElement('ts-lit-element')
export class TSLitElement extends LitElement {
  @property({reflect: true}) message = 'Hi';

  @property(
      {attribute: 'more-info', converter: (value: string|null) => `[${value}]`})
  extra = '';

  render() {
    return html`
      <hr>
      <div>message: ${this.message}</div>
      <div>extra: ${this.extra}</div>
      <div>foo: ${(this as any).foo}</div>
      <hr>
    `;
  }
}
property({reflect: true})(TSLitElement.prototype, 'foo');
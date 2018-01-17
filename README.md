# lit-element

## Base class for creating custom elements using Polymer and lit-html.

```javascript
import {LitElement, html} from 'node_modules/@polymer/lit-element/lit-element.js'

class MyElement extends LitElement {

  // Public property API that triggers re-render (synched with attributes)
  static get properties() {
    return {
      foo: String,
      whales: Number
    }
  }

  constructor() {
    super();
    this.foo = 'foo';
  }

  ready() {
    this.addEventListener('click', async (e) => {
      this.whales++;
      await this.nextRendered;
      this.dispatchEvent(new CustomEvent('whales', {detail: {whales: this.whales}}))
    });
    super.ready();
  }

  // Render method should return a `TemplateResult` using the provided lit-html `html` tag function
  render(props) {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h4>Foo: ${props.foo}</h4>
      <div>whales: ${'🐳'.repeat(props.whales)}</div>
      <slot></slot>
    `;
  }

}
customElements.define('my-element', MyElement);
```

```html
  <my-element whales="5">hi</my-element>
```

## Known Issues
* This element does not yet work with the ShadyCSS polyfill. Support is coming soon!

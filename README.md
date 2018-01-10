# polymer-lit-element

## Base class for creating custom elements using Polymer and lit-html.

```javascript
import {PolymerLitElement} from 'node_modules/@polymer/polymer-lit/polymer-lit-element.js'

class MyElement extends PolymerLitElement {

  static get properties() {
    return {
      foo: String,
      bar: Number
    }
  }

  constructor() {
    super();
    this.foo = 'foo';
  }

  ready() {
    this.addEventListener('click', (e) => {
      let count = this._getProperty('clickCount') || 0;
      this._setProperty('clickCount', ++count);
    });
    super.ready();
  }

  render(props, html) {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h4>Foo: ${props.foo}, Bar: ${props.bar}</h4>
      <div>clicked count: ${props.clickCount || 0}</div>
      <slot></slot>
    `;
  }

}
customElements.define('my-element', MyElement);
```

```html
  <my-element bar="5">hi</my-element>
```

## Known Issues
* This element does not yet work with the ShadyCSS polyfill.

# LitElement

## A simple base class for creating custom elements rendered with lit-html.

LitElement uses [lit-html](https://github.com/Polymer/lit-html) to render into the
element's Shadow DOM and [Polymer's](https://github.com/Polymer/polymer)
PropertiesMixin to help manage element properties and attributes.

LitElement uses a functional reactive pattern where any changes to element
properties are batched and then rendered asynchronously. Users describe
the entire rendering state declaratively, and lit-html ensures that updates
are fast by creating the static DOM once and smartly updating only the parts of
the DOM that change.

For basic usage:

  1. Create a class that extends `LitElement`.
  1. Implement a static `properties` getter that returns the element's properties
  (which automatically become observed attributes).
  1. Then implement a `_render(props)` method and use the element's
current properties (props) to return a `lit-html` template result to render
into the element.

See the [source](https://github.com/PolymerLabs/lit-element/blob/master/src/lit-element.ts#L90)
 for detailed API info, here are some highlights:

  * `_firstRendered()`: Called after the element DOM is rendered for the first time.

  * `_shouldRender(props, changed, old)`: Implement to control if rendering
  should occur when property values change or `invalidate` is called.
  By default, this method always returns true, but this can be customized as
  an optimization to avoid rendering work when changes occur which should not be rendered.

  * `_render(props)`: Implement to describe the element's DOM using `lit-html`. Ideally,
  the `_render` implementation is a pure function using only `props` to describe
  the element template.

  * `_didRender(props, changed, old)`: Called after element DOM has been rendered.
  Implement to directly control rendered DOM. Typically this is not needed as `lit-html`
  can be used in the `_render` method to set properties, attributes, and
  event listeners. This method can, however, be useful to call methods
  on rendered elements or to specifically react to the rendered
  state of the DOM.

  * `_createRoot()`: Implement to customize where the
  element's template is rendered by returning an element into which to
  render. By default this creates a shadowRoot for the element.
  To render into the element's childNodes, return `this`.

  * `invalidate`: Call to force the element to asynchronously re-render regardless
  of whether or not any property changes are pending.

  * `renderComplete`: Returns a promise which resolves after the element next renders.


Example:

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
    this.addEventListener('click', async (e) => {
      this.whales++;
      await this.renderComplete;
      this.dispatchEvent(new CustomEvent('whales', {detail: {whales: this.whales}}))
    });
  }

  // Render method should return a `TemplateResult` using the provided lit-html `html` tag function
  _render({foo, whales}) {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h4>Foo: ${foo}</h4>
      <div>whales: ${'🐳'.repeat(whales)}</div>
      <slot></slot>
    `;
  }

}
customElements.define('my-element', MyElement);
```

```html
  <my-element whales="5">hi</my-element>
```

Known Issues:
* When the Shady DOM polyfill and ShadyCSS shim are used, styles may be [out of order](https://github.com/PolymerLabs/lit-element/issues/34).
* Rendering is not supported in IE11 due to a lit-html [issue](https://github.com/Polymer/lit-html/issues/210).
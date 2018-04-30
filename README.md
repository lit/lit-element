# LitElement

## A simple base class for creating custom elements rendered with lit-html.

LitElement uses [lit-html](https://github.com/Polymer/lit-html) to render into the
element's [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
and [Polymer's](https://github.com/Polymer/polymer)
[PropertiesMixin](https://github.com/Polymer/polymer/blob/master/lib/mixins/properties-mixin.html)
to help manage element properties and attributes. LitElement reacts to changes in properties
and renders declaratively using `lit-html`.

  * **React to changes:** LitElement reacts to changes in properties and attributes by
  asynchronously rendering, ensuring changes are batched. This reduces overhead
  and maintains consistent state.

  * **Declarative rendering** LitElement uses `lit-html` to declaratively describe
  how an element should render. Then `lit-html` ensures that updates
  are fast by creating the static DOM once and smartly updating only the parts of
  the DOM that change. Pass a javascript string to the `html` tag function,
  describing dynamic parts with standard javascript template expressions:

    * static elements: ``` html`<div>Hi</div>` ```
    * expression: ``` html`<div>${disabled ? 'Off' : 'On'}</div>` ```
    * attribute: ``` html`<div class$="${color} special"></div>` ```
    * event handler: ``` html`<button on-click="${(e) => this._clickHandler(e)}"></button>` ```

## Minimal Example

  1. Create a class that extends `LitElement`.
  1. Implement a static `properties` getter that returns the element's properties
  (which automatically become observed attributes).
  1. Then implement a `_render(props)` method and use the element's
current properties (props) to return a `lit-html` template result to render
into the element. This is the only method that must be implemented by subclasses.

```javascript
import {LitElement, html} from '@polymer/lit-element';

class MyElement extends LitElement {

  static get properties() { return { mood: String }}

  _render({mood}) {
    return html`You are ${mood} today!`;
  }
}

customElements.define('my-element', MyElement);
```

```html
  <my-element mood="happy"></my-element>
```

## API Documentation

See the [source](https://github.com/PolymerLabs/lit-element/blob/master/src/lit-element.ts#L90)
 for detailed API info, here are some highlights. Note, the leading underscore
 is used to indicate that these methods are
 [protected](https://en.wikipedia.org/wiki/Class_(computer_programming)#Member_accessibility);
 they are not private and can and should be implemented by subclasses.
 These methods generally are called as part of the rendering lifecycle and should
 not be called in user code unless otherwise indicated.

  * `_createRoot()`: Implement to customize where the
  element's template is rendered by returning an element into which to
  render. By default this creates a shadowRoot for the element.
  To render into the element's childNodes, return `this`.

  * `_firstRendered()`: Called after the element DOM is rendered for the first time.

  * `_shouldRender(props, changedProps, prevProps)`: Implement to control if rendering
  should occur when property values change or `invalidate` is called.
  By default, this method always returns true, but this can be customized as
  an optimization to avoid rendering work when changes occur which should not be rendered.

  * `_render(props)`: Implement to describe the element's DOM using `lit-html`. Ideally,
  the `_render` implementation is a pure function using only `props` to describe
  the element template. This is the only method that must be implemented by subclasses.

  * `_didRender(props, changedProps, prevProps)`: Called after element DOM has been rendered.
  Implement to directly control rendered DOM. Typically this is not needed as `lit-html`
  can be used in the `_render` method to set properties, attributes, and
  event listeners. However, it is sometimes useful for calling methods on
  rendered elements, for example focusing an input:
  `this.shadowRoot.querySelector('input').focus()`.

  * `renderComplete`: Returns a promise which resolves after the element next renders.

  * `_requestRender`: Call to request the element to asynchronously re-render regardless
  of whether or not any property changes are pending.

## Bigger Example

```javascript
import {LitElement, html} from '@polymer/lit-element';

class MyElement extends LitElement {

  // Public property API that triggers re-render (synced with attributes)
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

## Known Issues
* When the Shady DOM polyfill and ShadyCSS shim are used, styles may be [out of order](https://github.com/PolymerLabs/lit-element/issues/34).
* Rendering is not supported in IE11 due to a lit-html [issue](https://github.com/Polymer/lit-html/issues/210).
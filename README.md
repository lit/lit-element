> ## 🛠 Status: In Development
> LitElement is currently in development. It's on the fast track to a 1.0 release, so we encourage you to use it and give us your feedback, but there are things that haven't been finalized yet and you can expect some changes.

# LitElement

[![Published on npm](https://img.shields.io/npm/v/@polymer/lit-element.svg)](https://www.npmjs.com/package/@polymer/lit-element)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/@polymer/lit-element)

## A simple base class for creating custom elements rendered with lit-html.

LitElement uses [lit-html](https://github.com/Polymer/lit-html) to render into the
element's [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
and adds API help manage element properties and attributes. LitElement reacts to changes in properties
and renders declaratively using `lit-html`.

  * **Setup properties:** LitElement supports observable properties which may trigger an
  update when set. These properties can be written in a few ways:

    * As class fields with the `@property()` [decorator](https://github.com/tc39/proposal-decorators#decorators),
    if you're using a compiler that supports them, like TypeScript or Babel.
    * With a static `properties` getter.
    * By manually writing getters and setters. This can be useful if tasks should
    be performed when a property is set, for example validation. Call `invalidateProperty(name, oldValue)`
    in the setter to trigger an update and use any configured property options.

    Properties can be given an options argument which is an object that describes how to
    process the property. This can be done either in the `@property({...})` decorator or in the
    object returned from the `properties` getter, e.g. `static get properties { return { foo: {...} }`.

    Property options include:

    * `attribute`: Describes how and if the property becomes an observed attribute.
    If the value is false, the property is not added to `observedAttributes`.
    If true or absent, the lowercased property name is observed (e.g. `fooBar` becomes `foobar`).
    If a string, the string value is observed (e.g `attribute: 'foo-bar'`).
    * `type`: Describes how to serialize and deserialize the attribute to/from a property.
    If this value is a function, it is used to deserialize the attribute value
    a the property value. If it's an object, it can have keys for `fromAttribute` and
    `toAttribute` where `fromAttribute` is the deserialize function and `toAttribute`
    is a serialize function used to set the property to an attribute. If no `toAttribute`
    function is provided and `reflect` is set to true, the property value is set
    directly to the attribute.
    * `reflect`: Describes if the property should reflect to an attribute.
    If true, when the property is set, the attribute is set using the
    attribute name determined according to the rules for the `attribute`
    propety option and the value of the property serialized using the rules from
    the `type` property option.
    * `shouldInvalidate`: Describes if setting a property should trigger
    invalidation and updating. This function takes the `newValue` and `oldValue` and
    returns true if invalidation should occur. If not present, a strict identity
    check is used. This is useful if a property should be considered dirty only
    if some condition is met, like if a key of an object value changes.

  * **React to changes:** LitElement reacts to changes in properties and attributes by
  asynchronously rendering, ensuring changes are batched. This reduces overhead
  and maintains consistent state.

  * **Declarative rendering** LitElement uses `lit-html` to declaratively describe
  how an element should render. Then `lit-html` ensures that updates
  are fast by creating the static DOM once and smartly updating only the parts of
  the DOM that change. Pass a JavaScript string to the `html` tag function,
  describing dynamic parts with standard JavaScript template expressions:

    * static elements: ``` html`<div>Hi</div>` ```
    * expression: ``` html`<div>${disabled ? 'Off' : 'On'}</div>` ```
    * attribute: ``` html`<div class$="${color} special"></div>` ```
    * event handler: ``` html`<button on-click="${(e) => this._clickHandler(e)}"></button>` ```

## Getting started

 * The easiest way to try out LitElement is to use one of these online tools:

    * Runs in all [supported](#supported-browsers) browsers: [StackBlitz](https://stackblitz.com/edit/lit-element-example?file=index.js), [Glitch](https://glitch.com/edit/#!/hello-lit-element?path=index.html)

    * Runs in browsers with [JavaScript Modules](https://caniuse.com/#search=modules): [JSFiddle](https://jsfiddle.net/j6mf6gpo/), [JSBin](http://jsbin.com/zezilad/edit?html,output),
 [CodePen](https://codepen.io/sorvell/pen/BxZgPN).

 * You can also copy [this HTML file](https://gist.githubusercontent.com/sorvell/48f4b7be35c8748e8f6db5c66d36ee29/raw/2427328cf1ebae5077902a6bff5ddd8db45e83e4/index.html) into a local file and run it in any browser that supports [JavaScript Modules]((https://caniuse.com/#search=modules)).

 * When you're ready to use LitElement in a project, install it via [npm](https://www.npmjs.com/). To run the project in the browser, a module-compatible toolctain is required. We recommend installing the [Polymer CLI](https://github.com/Polymer/polymer-cli) to and using its development server as follows.

    1. Add LitElement to your project:

        ```npm i @polymer/lit-element```

    1. Create an element by extending LitElement and calling `customElements.define` with your class (see the examples below).

    1. Install the Polymer CLI:

        ```npm i -g polymer-cli@next```

    1. Run the development server and open a browser pointing to its URL:

        ```polymer serve```

    > LitElement is published on [npm](https://www.npmjs.com/package/@polymer/lit-element) using JavaScript Modules.
    This means it can take advantage of the standard native JavaScript module loader available in all current major browsers.
    >
    > However, since LitElement uses npm convention to reference dependencies by name, a light transform to rewrite specifiers to URLs is required to get it to run in the browser. The polymer-cli's development server `polymer serve` automatically handles this transform.

    Tools like [WebPack](https://webpack.js.org/) and [Rollup](https://rollupjs.org/) can also be used to serve and/or bundle LitElement.


## Minimal Example

  1. Create a class that extends `LitElement`.
  1. Use a `@property` decorator to create a property (or implement a static `properties`
  getter that returns the element's properties). (which automatically become observed attributes).
  1. Then implement a `render()` method and use the element's
current properties to return a `lit-html` template result to render
into the element. This is the only method that must be implemented by subclasses.

```html
  <script src="node_modules/@webcomponents/webcomponents-bundle.js"></script>
  <script type="module">
    import {LitElement, html} from '@polymer/lit-element';

    class MyElement extends LitElement {

      @property({type: String})
      mood = 'happy';

      render() {
        return html`<style> .mood { color: green; } </style>
          Web Components are <span class="mood">${this.mood}</span>!`;
      }

    }

    customElements.define('my-element', MyElement);
  </script>

  <my-element mood="happy"></my-element>
```

## API Documentation

See the [source](https://github.com/PolymerLabs/lit-element/blob/master/src/lit-element.ts#L90)
 for detailed API info, here are some highlights.

  * `render()` (protected): Implement to describe the element's DOM using `lit-html`. Ideally,
  the `render` implementation is a pure function using only the element's current properties
  to describe the element template. This is the only method that must be implemented by subclasses.
  Note, since `render()` is called by `update()` setting properties does not trigger
  `invalidate()`, allowing property values to be computed and validated.

  * `shouldUpdate(changedProperties)` (protected): Implement to control if updating and rendering
  should occur when property values change or `invalidate` is called. The `changedProps`
  argument is an object with keys for the changed properties pointing to their previous values.
  By default, this method always returns true, but this can be customized as
  an optimization to avoid updating work when changes occur, which should not be rendered.

  * `update()` (protected): This method calls `render()` and then uses `lit-html` to
  render the template DOM. Override to customize how the element renders DOM. Note,
  during `update()` setting properties does not trigger `invalidate()`, allowing
  property values to be computed and validated.

  * `finishUpdate(changedProperties)`: (protected): Called after element DOM has been updated and
  before the `updateComplete` promise is resolved. Implement to directly control rendered DOM.
  Typically this is not needed as `lit-html` can be used in the `render` method
  to set properties, attributes, and event listeners. However, it is sometimes useful
  for calling methods on rendered elements, for example focusing an input:
  `this.shadowRoot.querySelector('input').focus()`. The `changedProps` argument is an object
  with keys for the changed properties pointing to their previous values.

  * `finishFirstUpdate()`: (protected) Called after element DOM has been
  updated the first time. This method can be useful for capturing references to rendered static
  nodes that must be directly acted upon, for example in `finishUpdate`.

  * `updateComplete`:  Returns a Promise that resolves when the element has finished updating
  to a boolean value that is true if the element finished the update
  without triggering another update. This can happen if a property
  is set in `finishUpdate` for example.
  This getter can be implemented to await additional state. For example, it
  is sometimes useful to await a rendered element before fulfilling this
  promise. To do this, first await `super.updateComplete` then any subsequent
  state.

  * `invalidate`: Call to request the element to asynchronously update regardless
  of whether or not any property changes are pending. This should only be called
  when an element should update based on some state not stored in properties,
  since setting properties automically calls `invalidate`.

  * `invalidateProperty(name, oldValue)` (protected): Triggers an invalidation for
  a specific property. This is useful when manually implementing a propert setter.
  Call `invalidateProperty` instead of `invalidate` to ensure that any configured
  property options are honored.

  * `createRenderRoot()` (protected): Implement to customize where the
  element's template is rendered by returning an element into which to
  render. By default this creates a shadowRoot for the element.
  To render into the element's childNodes, return `this`.

## Advanced: Update Lifecycle

* When the element is first connected or a property is set (e.g. `element.foo = 5`)
  and the property's `shouldInvalidate(value, oldValue)` returns true. Then
  * `invalidate()` tries to update the element after waiting a [microtask](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) (at the end
  of the event loop, before the next paint). Then
    * `shouldUpdate(changedProps)` is called and if this returns true which it
      does by default:
      * `update(changedProps)` is called to update the element.
        Note, setting properties inside `update()` will set their values but
        will *not* trigger `invalidate()`. This calls
        * `render()` which should return a `lit-html` TemplateResult
          (e.g. <code>html\`Hello ${world}\`</code>)
      * `finishFirstUpdate()` is then called to do post *first* update/render tasks.
        Note, setting properties here will trigger `invalidate()`.
      * `finishUpdate(changedProps)` is then called to do post update/render tasks.
        Note, setting properties here will trigger `invalidate()`.
    * `updateComplete` promise is resolved only if the element is
      not in an invalid state.
* Any code awaiting the element's `updateComplete` promise runs and observes
  the element in the updated state.

## Bigger Example

```JavaScript
import {LitElement, html} from '@polymer/lit-element';

class MyElement extends LitElement {

  // Public property API that triggers re-render (synced with attributes)
  @property()
  foo = 'foo';

  @property({type: Number})
  whales = 5;

  constructor() {
    super();
    this.addEventListener('click', async (e) => {
      this.whales++;
      await this.updateComplete;
      this.dispatchEvent(new CustomEvent('whales', {detail: {whales: this.whales}}))
    });
  }

  // Render method should return a `TemplateResult` using the provided lit-html `html` tag function
  render() {
    return html`
      <style>
        :host {
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
      </style>
      <h4>Foo: ${this.foo}</h4>
      <div>whales: ${'🐳'.repeat(this.whales)}</div>
      <slot></slot>
    `;
  }

}
customElements.define('my-element', MyElement);
```

```html
  <my-element whales="5">hi</my-element>
```

## Supported Browsers

The last 2 versions of all modern browsers are supported, including
Chrome, Safari, Opera, Firefox, Edge. In addition, Internet Explorer 11 is also supported.

## Known Issues


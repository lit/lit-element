> ## 🛠 Status: In Development
> LitElement is currently in development. It's on the fast track to a 1.0 release, so we encourage you to use it and give us your feedback, but there are things that haven't been finalized yet and you can expect some changes.

# LitElement

[![Published on npm](https://img.shields.io/npm/v/@polymer/lit-element.svg)](https://www.npmjs.com/package/@polymer/lit-element)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/@polymer/lit-element)
[![Mentioned in Awesome lit-html](https://awesome.re/mentioned-badge.svg)](https://github.com/web-padawan/awesome-lit-html)

## A simple base class for creating custom elements rendered with lit-html.

LitElement uses [lit-html](https://github.com/Polymer/lit-html) to render into the
element's [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
and adds API to help manage element properties and attributes. LitElement reacts to changes in properties
and renders declaratively using `lit-html`.

  * **Setup properties:** LitElement supports observable properties that cause the element to update.
  These properties can be declared in a few ways:

    * As class fields with the `@property()` [decorator](https://github.com/tc39/proposal-decorators#decorators),
    if you're using a compiler that supports them, like [TypeScript](https://www.typescriptlang.org/) or [Babel](https://babeljs.io/docs/en/babel-plugin-proposal-decorators).
    * With a static `properties` getter.
    * By manually writing getters and setters. This can be useful if tasks should
    be performed when a property is set, for example validation. Call `requestUpdate(name, oldValue)`
    in the setter to trigger an update and use any configured property options.

    Properties can be given an `options` argument which is an object that describes how to
    process the property. This can be done either in the `@property({...})` decorator or in the
    object returned from the `properties` getter, e.g. `static get properties { return { foo: {...} }`.

    Property options include:

    * `attribute`: Indicates how and whether the property becomes an observed attribute.
    If the value is `false`, the property is not added to the static `observedAttributes` getter.
    If `true` or absent, the lowercased property name is observed (e.g. `fooBar` becomes `foobar`).
    If a string, the string value is observed (e.g `attribute: 'foo-bar'`).
    * `type`: Indicates how to serialize and deserialize the attribute to/from a property.
    The value can be a function used for both serialization and deserialization, or it can
    be an object with individual functions via the optional keys, `fromAttribute` and `toAttribute`.
    `type` defaults to the `String` constructor, and so does the `toAttribute` and `fromAttribute`
    keys.
    * `reflect`: Indicates whether the property should reflect to its associated
    attribute (as determined by the attribute option).
    If `true`, when the property is set, the attribute which name is determined
    according to the rules for the `attribute` property option, will be set to the
    value of the property serialized using the rules from the `type` property option.
    Note, `type: Boolean` has special handling by default which means that truthy
    values result in the presense of the attribute, where as falsy values result
    in the absense of the attribute.
    * `hasChanged`: A function that indicates whether a property should be considered
    changed when it is set and thus result in an update. The function should take the
    `newValue` and `oldValue` and return `true` if an update should be requested.

  * **React to changes:** LitElement reacts to changes in properties and attributes by
  asynchronously rendering, ensuring changes are batched. This reduces overhead
  and maintains consistent state.

  * **Declarative rendering** LitElement uses `lit-html` to declaratively describe
  how an element should render. Then `lit-html` ensures that updates
  are fast by creating the static DOM once and smartly updating only the parts of
  the DOM that change. Pass a JavaScript string to the `html` tag function,
  describing dynamic parts with standard JavaScript template expressions:

    * static elements: ``` html`<div>Hi</div>` ```
    * expression: ``` html`<div>${this.disabled ? 'Off' : 'On'}</div>` ```
    * property: ``` html`<x-foo .bar="${this.bar}"></x-foo>` ```
    * attribute: ``` html`<div class="${this.color} special"></div>` ```
    * event handler: ``` html`<button @click="${this._clickHandler}"></button>` ```

## Getting started

 * The easiest way to try out LitElement is to use one of these online tools:

    * Runs in all [supported](#supported-browsers) browsers: [Glitch](https://glitch.com/edit/#!/hello-lit-element?path=index.html)

    * Runs in browsers with [JavaScript Modules](https://caniuse.com/#search=modules): [JSFiddle](https://jsfiddle.net/rzhofu81/), [JSBin](http://jsbin.com/vecuyan/edit?html,output),
 [CodePen](https://codepen.io/sorvell/pen/RYQyoe?editors=1000).

 * You can also copy [this HTML file](https://gist.githubusercontent.com/sorvell/48f4b7be35c8748e8f6db5c66d36ee29/raw/2427328cf1ebae5077902a6bff5ddd8db45e83e4/index.html) into a local file and run it in any browser that supports [JavaScript Modules]((https://caniuse.com/#search=modules)).

 * When you're ready to use LitElement in a project, install it via [npm](https://www.npmjs.com/). To run the project in the browser, a module-compatible toolchain is required. We recommend installing the [Polymer CLI](https://github.com/Polymer/polymer-cli) and using its development server as follows.

    1. Add LitElement to your project:

        ```npm i @polymer/lit-element```

    1. Install the webcomponents polyfill. If you're developing a reusable package, this should be a dev dependency which you load in your tests, demos, etc.

        ```npm i -D @webcomponents/webcomponentsjs```


    1. Create an element by extending LitElement and calling `customElements.define` with your class (see the examples below).

    1. Install the Polymer CLI:

        ```npm i -g polymer-cli```

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
into the element.

```html
  <script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js"></script>
  <script type="module">
    import {LitElement, html} from '@polymer/lit-element';

    class MyElement extends LitElement {

      static get properties() {
        return {
          mood: {type: String}
        };
      }

      constructor() {
        super();
        this.mood = 'happy';
      }

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

  * `render()` (protected): Implement to describe the element's DOM using `lit-html`. Ideally,
  the `render` implementation is a [pure function](https://en.wikipedia.org/wiki/Pure_function) using only the element's current properties to describe the element template. Note, since
  `render()` is called by `update()`, setting properties does not trigger an
  update, allowing property values to be computed and validated.

  * `shouldUpdate(changedProperties)` (protected): Implement to control if updating and rendering
  should occur when property values change or `requestUpdate()` is called. The `changedProperties`
  argument is a Map with keys for the changed properties pointing to their previous values.
  By default, this method always returns `true`, but this can be customized as
  an optimization to avoid updating work when changes occur, which should not be rendered.

  * `update(changedProperties)` (protected): This method calls `render()` and then uses `lit-html`
  in order to render the template DOM. It also updates any reflected attributes based on
  property values. Setting properties inside this method will *not* trigger another update.

  * `firstUpdated(changedProperties)`: (protected) Called after the element's DOM has been
  updated the first time, immediately before `updated()` is called.
  This method can be useful for capturing references to rendered static nodes that
  must be directly acted upon, for example in `updated()`.
  Setting properties inside this method will trigger the element to update.

  * `updated(changedProperties)`: (protected) Called whenever the element's DOM has been
  updated and rendered. Implement to perform post updating tasks via DOM APIs, for example,
  focusing an element. Setting properties inside this method will trigger the element to update.

  * `updateComplete`: Returns a Promise that resolves when the element has completed
  updating. The Promise value is a boolean that is `true` if the element completed the
  update without triggering another update. The Promise result is `false` if a
  property was set inside `updated()`. This getter can be implemented to await additional state.
  For example, it is sometimes useful to await a rendered element before fulfilling
  this Promise. To do this, first await `super.updateComplete` then any subsequent state.

  * `requestUpdate(name?, oldValue?)`: Call to request the element to asynchronously
  update regardless of whether or not any property changes are pending. This should
  be called when an element should update based on some state not triggered
  by setting a property. In this case, pass no arguments. It should also be called
  when manually implementing a property setter. In this case, pass the property
  `name` and `oldValue` to ensure that any configured property options are honored.
  Returns the `updateComplete` Promise which is resolved when the update completes.

  * `createRenderRoot()` (protected): Implement to customize where the
  element's template is rendered by returning an element into which to
  render. By default this creates a shadowRoot for the element.
  To render into the element's childNodes, return `this`.

## Advanced: Update Lifecycle

* A property is set (e.g. `element.foo = 5`).
* If the property's `hasChanged(value, oldValue)` returns `false`, the element does not
update. If it returns `true`, `requestUpdate()` is called to schedule an update.
* `requestUpdate()`: Updates the element after awaiting a [microtask](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) (at the end
of the event loop, before the next paint).
* `shouldUpdate(changedProperties)`: The update proceeds if this returns `true`, which
it does by default.
* `update(changedProperties)`: Updates the element. Setting properties inside this
method will *not* trigger another update.
  * `render()`: Returns a `lit-html` TemplateResult (e.g. <code>html\`Hello ${world}\`</code>)
  to render element DOM. Setting properties inside this method will *not* trigger
  the element to update.
* `firstUpdated(changedProperties)`: Called after the element is updated the first time,
immediately before `updated` is called. Setting properties inside this method will
trigger the element to update.
* `updated(changedProperties)`: Called whenever the element is updated.
Setting properties inside this method will trigger the element to update.
* `updateComplete` Promise is resolved with a boolean that is `true` if the
element is not pending another update, and any code awaiting the element's
`updateComplete` Promise runs and observes the element in the updated state.

## Bigger Example

Note, this example uses decorators to create properties. Decorators are a proposed
standard currently available in [TypeScript](https://www.typescriptlang.org/) or [Babel](https://babeljs.io/docs/en/babel-plugin-proposal-decorators).

```ts
import {LitElement, html, property} from '@polymer/lit-element';

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

* On very old versions of Safari (<=9) or Chrome (<=41), properties created for native
platform properties like (`id` or `name`) may not have default values set in the element constructor.
On these browsers native properties appear on instances and therefore their default value
will overwrite any element default (e.g. if the element sets this.id = 'id' in the constructor,
the 'id' will become '' since this is the native platform default).

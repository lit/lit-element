[![Build Status](https://travis-ci.org/webcomponents/webcomponentsjs.svg?branch=master)](https://travis-ci.org/webcomponents/webcomponentsjs)

webcomponents.js (v1 spec polyfills)
================

> **Note**. For polyfills that work with the older Custom Elements and Shadow DOM v0 specs,
see the [v0 branch](https://github.com/webcomponents/webcomponentsjs/tree/v0).

> **Note**. For polyfills that include HTML Imports,
see the [v1 branch](https://github.com/webcomponents/webcomponentsjs/tree/v1).

A suite of polyfills supporting the [Web Components](http://webcomponents.org) specs:

- **Custom Elements v1**: allows authors to define their own custom tags ([spec](https://w3c.github.io/webcomponents/spec/custom/), [tutorial](https://developers.google.com/web/fundamentals/getting-started/primers/customelements), [polyfill](https://github.com/webcomponents/custom-elements)).
- **Shadow DOM v1**: provides encapsulation by hiding DOM subtrees under shadow roots ([spec](https://w3c.github.io/webcomponents/spec/shadow/), [tutorial](https://developers.google.com/web/fundamentals/getting-started/primers/shadowdom),
[shadydom polyfill](https://github.com/webcomponents/shadydom), [shadycss polyfill](https://github.com/webcomponents/shadycss)).

For browsers that need it, there are also some minor polyfills included:
- [`HTMLTemplateElement`](https://github.com/webcomponents/template)
- [`Promise`](https://github.com/stefanpenner/es6-promise)
- `Event`, `CustomEvent`, `MouseEvent` constructors and `Object.assign`, `Array.from`
(see [webcomponents-platform](https://github.com/webcomponents/webcomponents-platform))
- [`URL constructor`](https://github.com/webcomponents/URL)

## How to use
### Install polyfills
```bash
npm install @webcomponents/webcomponentsjs
```

You can also load the code from a CDN such as unpkg: https://unpkg.com/@webcomponents/webcomponentsjs@2.0.0/

### Using `webcomponents-bundle.js`

The `webcomponents-bundle.js` contains all of the web components polyfills and is
suitable for use on any supported browser. All of the polyfill code will be loaded
but each polyfill will only be used based on feature detection.
The bundle includes Custom Elements, Shady DOM/CSS and generic platform polyfills
(such as ES6 Promise, Constructable events, etc.) (needed by Internet Explorer 11),
and Template (needed by IE 11 and Edge).

The `webcomponents-bundle.js` is very simple to use but it does load code
that is not needed on most modern browsers, slowing page load. For best performance,
use the `webcomponents-loader.js`.

Here's an example:

```html
<!-- load webcomponents bundle, which includes all the necessary polyfills -->
<script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js"></script>

<!-- load the element -->
<script type="module" src="my-element.js"></script>

<!-- use the element -->
<my-element></my-element>
```

### Using `webcomponents-loader.js`

The `webcomponents-loader.js` is a client-side loader that dynamically loads the
minimum polyfill bundle, using feature detection.

`webcomponents-loader.js` can be loaded synchronously, or asynchronously depending on your needs.

#### Inlining

If you have inlined the source of `webcomponent-loader.js`, then you should specify `window.WebComponents.root` as the root from which to load the polyfills.
For example:

```html
<script>
  window.WebComponents = window.WebComponents || {};
  window.WebComponents.root = 'node_modules/@webcomponents/webcomponentsjs/';
</script>
```

#### Synchronous
When loaded synchronously, `webcomponents-loader.js` behaves similarly to `webcomponents-bundle.js`.

The appropriate bundle will be loaded with `document.write()` to ensure that WebComponent polyfills are available for subsequent scripts and modules.

Here's an example:

```html
<!-- load the webcomponents loader, which injects the necessary polyfill bundle -->
<script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>

<!-- load the element -->
<script type="module" src="my-element.js"></script>

<!-- use the element -->
<my-element></my-element>
```

#### Asynchronous
When loaded asychronously with the `defer` attribute, polyfill bundles will be loaded asynchronously,
which means that scripts and modules that depend on webcomponents APIs *must* be loaded
using `WebComponents.waitFor` function.

The `WebComponents.waitFor` function takes a callback function as an argument, and will evaluate that callback after the polyfill bundle has been loaded.

The callback function should load scripts that need the polyfills (typically via `import('my-script.js')`) and
should return a promise that resolves when all scripts have loaded.

Here's an example:

```html
<!-- Load polyfills; note that "loader" will load these async -->
<script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js" defer></script>

<!-- Load a custom element definitions in `waitFor` and return a promise -->
<script type="module">
  WebComponents.waitFor(() => {
    // At this point we are guaranteed that all required polyfills have
    // loaded, and can use web components API's.
    // The standard pattern is to load element definitions that call
    // `customElements.define` here.
    // Note: returning the import's promise causes the custom elements
    // polyfill to wait until all definitions are loaded and then upgrade
    // the document in one batch, for better performance.
    return import('my-element.js');
  });
</script>

<!-- Use the custom element -->
<my-element></my-element>
```

The `WebComponents.waitFor` function may be called multiple times, and the callback functions will be processed in order.

Here's a more complicated example:

```html
<!-- Load polyfills; note that "loader" will load these async -->
<script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js" defer></script>

<script type="module">
  WebComponents.waitFor(async () => {
    if (!window.fetch) {
      await import('node_modules/fetch-polyfill/fetch.js');
    }
    return import('my-element.js');
  })
</script>

<script type="module">
</script>
```

### WebComponentsReady event

The `WebComponentsReady` event is fired when polyfills and user scripts have loaded and custom elements have been upgraded. This event is generally not needed; however, it may be useful in some cases like testing. If imperative code should wait until a specific custom element definition has loaded, it can use the platform `customElements.whenDefined` API.

### `custom-elements-es5-adapter.js`
According to the spec, only ES6 classes (https://html.spec.whatwg.org/multipage/scripting.html#custom-element-conformance) may be passed to the _native_ `customElements.define` API. For best performnace, ES6 should be served to browsers that support it, and ES5 code should be serve to those that don't. Since this may not always be possible, it may make sense to compile and serve ES5 to all browsers. However, if you do so, ES5-style custom element classes will now **not** work on browsers with native Custom Elements because ES5-style classes cannot properly extend ES6 classes, like `HTMLElement`.

As a workaround, if your project has been compiled to ES5, load `custom-elements-es5-adapter.js` before defining Custom Elements.  This adapter will automatically wrap ES5.

**The adapter must NOT be compiled.**

## Browser Support

The polyfills are intended to work in the latest versions of evergreen browsers. See below
for our complete browser support matrix:

| Polyfill   | Edge | IE11+ | Chrome* | Firefox* | Safari 9+* | Chrome Android* | Mobile Safari* |
| ---------- |:----:|:-----:|:-------:|:--------:|:----------:|:---------------:|:--------------:|
| Custom Elements | ✓ | ✓ | ✓ | ✓ | ✓ | ✓| ✓ |
| Shady CSS/DOM | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

\*Indicates the current version of the browser

The polyfills may work in older browsers, however require additional polyfills (such as classList, or other [platform](https://github.com/webcomponents/webcomponents-platform)
polyfills) to be used. We cannot guarantee support for browsers outside of our compatibility matrix.


### Manually Building

If you wish to build the bundles yourself, you'll need `node` and `npm` on your system:

 * install [node.js](http://nodejs.org/) using the instructions on their website
 * use `npm` to install [gulp.js](http://gulpjs.com/): `npm install -g gulp`
 * make sure you have Java installed per https://www.npmjs.com/package/google-closure-compiler#java-version

Now you are ready to build the polyfills with:

    # install dependencies
    npm install
    # build
    npm run build

The builds will be placed into the root directory.

## Contribute

See the [contributing guide](CONTRIBUTING.md)

## License

Everything in this repository is BSD style license unless otherwise specified.

Copyright (c) 2015 The Polymer Authors. All rights reserved.

## Changes in version 2.x

* The HTML Imports polyfill has been removed. Given that ES modules have shipped in
most browsers, the expectation is that web components code will be loaded via
ES modules.
* When using `webcomponents-loader.js` with the `defer` attribute, scripts that rely on the polyfills *must* be loaded using `WebComponents.waitFor(loadCallback)`.

## Known Issues

  * [ShadowDOM CSS is not encapsulated out of the box](#shadycss)
  * [Custom element's constructor property is unreliable](#constructor)
  * [Contenteditable elements do not trigger MutationObserver](#contentedit)
  * [ShadyCSS: :host(.zot:not(.bar:nth-child(2))) doesn't work](#nestedparens)

### ShadowDOM CSS is not encapsulated out of the box <a id="shadycss"></a>
The ShadowDOM polyfill is not able to encapsulate CSS in ShadowDOM out of the box. You need to use specific code from the ShadyCSS library, included with the polyfill. See [ShadyCSS instructions](https://github.com/webcomponents/shadycss).

### Custom element's constructor property is unreliable <a id="constructor"></a>
See [#215](https://github.com/webcomponents/webcomponentsjs/issues/215) for background.

In Edge and IE, instances of Custom Elements have a `constructor` property of `HTMLUnknownElementConstructor` and `HTMLUnknownElement`, respectively. It's unsafe to rely on this property for checking element types.

It's worth noting that `customElement.__proto__.__proto__.constructor` is `HTMLElementPrototype` and that the prototype chain isn't modified by the polyfills(onto `ElementPrototype`, etc.)

### Contenteditable elements do not trigger MutationObserver <a id="contentedit"></a>
Using the MutationObserver polyfill, it isn't possible to monitor mutations of an element marked `contenteditable`.
See [the mailing list](https://groups.google.com/forum/#!msg/polymer-dev/LHdtRVXXVsA/v1sGoiTYWUkJ)

### ShadyCSS: :host(.zot:not(.bar:nth-child(2))) doesn't work <a id="nestedparens"></a>
ShadyCSS `:host()` rules can only have (at most) 1-level of nested parentheses in its argument selector under ShadyCSS. For example, `:host(.zot)` and `:host(.zot:not(.bar))` both work, but `:host(.zot:not(.bar:nth-child(2)))` does not.

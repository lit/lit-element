# lit-element

A base class for creating Web Components using [Polymer 3.0](https://www.polymer-project.org/blog/2017-08-22-npm-modules) and [lit-html](https://polymer.github.io/lit-html/).

## Overview

lit-html is a library that let's you write dynamic HTML templates in JavaScript.
It's specifically designed to compliment vanilla Web Components, making it easy
to efficiently render and update DOM.

Polymer is a library of helpers for implementing many aspects of Web Components,
including detecting property and attribute changes and reacting to them.

LitElement is simple glue between Web Components, Polymer, and lit-html. It
uses Polymer's `PropertiesChangedMixin` to declare properties, detect attribute
and property changes, and then calls a `render()` method that you implement to
render your component using lit-html.

Writing a LitElement-based Web Component is easy, just:

1. Extend `LitElement`
2. Declare your observed properties.
3. Implement `render()` with lit-html templates.

## Example

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
  }

  ready() {
    this.addEventListener('click', async (e) => {
      this.whales++;
      await this.nextRendered;
      this.dispatchEvent(new CustomEvent('whales', {detail: {whales: this.whales}}))
    });
    super.ready();
  }

  // render() should return a `TemplateResult` using the provided lit-html
  // `html` tag function
  render({foo, whales}) {
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

Now, use your new element anywhere in HTML:

```html
  <my-element whales="5">hi</my-element>
```

## Developing with LitElement

LitElement, like Polymer 3.0 and lit-html, is distributed as standard JavaScript
modules. This is so that the modules load natively in browsers and are readable
by any tool that support standard JavaScript modules, and compilable to any
other module format like AMD or CommonJS.

The one caveat is that LitElement imports Polymer using Polymer's package name,
like so:

```js
import {PropertiesMixin} from '@polymer/polymer/lib/mixins/properties-mixin.js';
```

Browsers do not yet natively support such imports - they only import modules
by full URL or absolute or relative path. Yet many tools - like bundlers,
compilers, and IDEs - don't fully support the types of relative paths across
packages needed to reference modules from other packages. And most other native
modules published to npm import using package names as well.

This might leave us at a bit of an impasse, so our solution is to import modules
using package names, and use tooling that automatically rewrites imports into
browser compatible paths. This lets LitElement be compatible with common tools,
third-party modules, and browsers.

The next version of the Polymer tools support this transformation. Install the
preview of the CLI with npm:

```bash
$ npm i -g polymer-cli@next
```

Then serve your project with module specifier rewriting turned on:
```bash
$ polymer serve --npm --module-resolution=node
```

You can add `"npm": true` and `"moduleResolution": "node"` to your polymer.json
file so you can leave off the flags.

Other tools are starting to support this transformation too, like unpkg.com with
the `?module` query parameter:

```js
import {LitElement} from 'https://unpkg.com/@polymer/lit-element?module';
```

## Known Issues
* This element does not yet work with the ShadyCSS polyfill. Support is coming soon!
* API is subject to minor changes.

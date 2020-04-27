# LitElement API Documentation

## Install lit-element

```
npm install lit-element
```

## Modules

### [lit-element](/api/modules/_lit_element_.html)

The main LitElement module, which defines the `LitElement` base class and related APIs.

Users define a `render` method to provide an element template, which is called whenever an observed property changes.

Import `LitElement` and `html` from this module to create a component:

```js
import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  render() {
      return html`<p>your template here</p>`;
  }
}

customElements.define('my-element', MyElement);
```

`LitElement` extends [`UpdatingElement`](#lib-updating-element) and adds lit-html templating.

### [lib/updating-element](/api/modules/_lib_updating_element_.html)

```js
import { UpdatingElement } from 'lit-element/lib/updating-element.js';
```

Custom Element base class that supports declaring observable properties, reflecting attributes to properties, and the core update lifecycle methods.

If you want to build a custom element base class that includes these features but **not** lit-html
templating, extend `UpdatingElement`.

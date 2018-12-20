# LitElement

## Install

```
npm install --save @polymer/lit-element
```

## Modules

### lit-element

[lit-element](/api/modules/_lit_element_.html): Contains LitElement base class. Import `LitElement` and `html` from this module to create a component:

```js
import { LitElement, html } from '@polymer/lit-element';

class MyElement extends LitElement {
  render() {
      return html`<p>your template here</p>`;
  }
}

customElements.define('my-element', MyElement);
```

Inherits API functionality from [UpdatingElement](#UpdatingElement).

### UpdatingElement 

[UpdatingElement](/api/modules/_lib_updating_element_.html): Manages properties and attributes; Performs element updates. Inherited by UpdatingElement.

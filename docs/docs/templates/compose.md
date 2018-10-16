---
layout: post
title: Compose and nest lit-element templates
parent: /docs/
type: task
topic: /docs/templates
permalink: /docs/templates/compose
---

You can compose LitElement templates from other LitElement templates:

```js
class MyApp extends LitElement {
  render(){
    return html`
      ${this.headerTemplate()}
      ${this.navTemplate()}
      ${this.footerTemplate()}
    `;
  }
  static get headerTemplate(){
    return html`...`;
  }
  static get navTemplate(){
    return html`...`;
  }
  static get footerTemplate(){
    return html`...`;
  }
}
```

### Example

_my-app.js_

```js
{% include projects/docs/compose/my-app.js %}
```

{% include project.html folder="docs/compose" openFile="my-app.js" %}

You can also compose templates by importing other elements and using them in a template:

_my-app.js_

```js
import './header-element.js';
import './nav-element.js';
import './footer-element.js';

class MyApp extends LitElement {
  render(){
    return html`
      <header-element></header-element>
      <nav-element></nav-element>
      <footer-element></footer-element>
    `;
  }
}
```

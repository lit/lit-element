---
layout: post
section: docs
topic: templates
subtopic: compose
---

You can compose LitElement templates from other LitElement templates. In the following example, we compose a template for an element called `<my-page>` from smaller templates for the standard HTML elements `<header>`, `<article>`, and `<footer>`:

```js
class MyPage extends LitElement {
  render() {
    return html`
      ${this.headerTemplate}
      ${this.articleTemplate}
      ${this.footerTemplate}
    `;
  }
  static get headerTemplate() {
    return html`<header>header</header>`;
  }
  static get articleTemplate() {
    return html`<article>article</article>`;
  }
  static get footerTemplate() {
    return html`<footer>footer</footer>`;
  }
}
```

{% include project.html folder="docs/templates/compose" openFile="my-page.js" %}

You can also compose templates by importing other elements and using them in your template:

```js
import './my-header.js';
import './my-article.js';
import './my-footer.js';

class MyPage extends LitElement {
  render() {
    return html`
      <my-header></my-header>
      <my-article></my-article>
      <my-footer></my-footer>
    `;
  }
}
```

{% include project.html folder="docs/templates/composeimports" openFile="my-page.js" %}

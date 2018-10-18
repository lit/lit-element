---
layout: post
type: task concept
section: docs
topic: create
subtopic: renderroot
status: reviewing
---

* [About the render root](#about)
* [Customize the render root](#customize)

<a name="about">

### About the render root

The render root is the node into which an element's template is rendered. By default, LitElement creates an open `shadowRoot` and renders an element's children inside it, producing a DOM structure looking something like this:

```text
<my-element>
  #shadow-root
    <p>child 1</p>
    <p>child 2</p>
```

You can customize the render root by implementing `createRenderRoot`.

<a name="customize">

### Customize the render root

To customize the render root, implement `createRenderRoot` and return an element into which to render the template.

For example, to render into the element's light DOM, return `this`:

```js
class LightDom extends LitElement {
  render(){
    return html`
      <p><b>Render root overridden.</b> Template renders in light DOM.</p>
    `;
  }
  createRenderRoot(){
    return this;
  }
}
```

### Example

_default-root.js_

```js
{% include projects/docs/renderroot/default-root.js %}
```

_light_dom.js_

```js
{% include projects/docs/renderroot/light-dom.js %}
```

{% include project.html folder="docs/renderroot" openFile="index.html" forceEmbedLayout="true" view="editor" %}

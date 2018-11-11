---
layout: post
section: docs
topic: templates
subtopic: slots
---

**On this page:**

* [Shadow DOM vs light DOM](#intro)
* [Render light DOM children with the `slot` element](#slot)
* [Assign a light DOM child to a specific slot](#named)

<a id="intro">

### [Shadow DOM vs light DOM](#intro)

Since the introduction of shadow DOM, we use the term "light DOM" to refer to nodes that appear in the main DOM tree.

By default, if a custom element has light DOM children in HTML, they do not render at all:

```html
<my-element>
  <p>I won't render</p>
</my-element>
```

You can make them render using the [`<slot>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot). 

<a id="slot">

### [Render light DOM children with the `slot` element](#slot)

To render an element's light DOM children, create a `<slot>` for them in the element's template. For example:

```js
render(){
  return html`
    <div>
      <slot></slot>
    </div>
  `;
}
```

Light DOM children will now render in the `<slot>`:

```html
<my-element>
  <p>Render me</p>
</my-element>
```

Arbitrarily many light DOM children can populate a single slot:

```html
<my-element>
  <p>Render me</p>
  <p>Me too</p>
  <p>Me three</p>
</my-element>
```

{% include project.html folder="docs/templates/slots" openFile="my-element.js" %}

<a id="named">

### [Assign a light DOM child to a specific slot](#named)

To assign a light DOM child to a specific slot, ensure that the child's `slot` attribute matches the slot's `name` attribute:

```js
render(){
  return html`
    <div>
      <slot name="one"></slot>
    </div>
  `;
}
```

_index.html_

```html
<my-element>
  <p slot="one">Include me in slot "one".</p>
</my-element>
```

* **Named slots only accept light DOM children with a matching `slot` attribute.**

  For example, `<slot name="one"></slot>` only accepts children with the attribute `slot="one"`.

* **Light DOM children with a `slot` attribute will only be placed in a slot with a matching `name` attribute.**

  For example, `<p slot="one">...</p>` will only be placed in `<slot name="one"></slot>`.

**Examples**

_my-element.js_

```js
{% include project.html folder="projects/docs/templates/namedslots/my-element.js" %}
```

_index.html_

```html
{% include project.html folder="projects/docs/templates/namedslots/index.html" %}
```

{% include project.html folder="docs/templates/namedslots" openFile="my-element.js" %}

**Use `name`, not `id`, to select slots.**

Note that a `slot`'s `id` attribute has no effect!

_my-element.js_

```js
render(){
  return html`
    <div>
      <slot id="one"></slot>
    </div>
  `;
}
```

_index.html_

```html
<my-element>
  <p slot="one">nope.</p>
  <p>ohai..</p>
</my-element>
```

{% include project.html folder="docs/templates/slotid" openFile="my-element.js" %}

</aside>

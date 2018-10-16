---
layout: post
title: Render light DOM children in a template
parent: /docs/
type: task
topic: /docs/templates
permalink: /docs/templates/slots
---

On this page:

* [Render light DOM children with the `slot` element](#slot)
* [Named slots](#named)
* [Use `name`, not `id`, to select slots](#namenotid)

<a id="slot">

### Render light DOM children with the `slot` element

To render an element's light DOM children in shadow DOM, use the [`<slot>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot):

_my-element.js_

```js
render(){
  return html`
    <div>
      <slot></slot>
    </div>
  `;
}
```

_index.html_

```html
<my-element>
  <p>Pls include me</p>
</my-element>
```

<a id="named">

### Named slots

You can render light DOM children in a specific slot by ensuring that the slot's `name` attribute matches the light DOM child's `slot` attribute:

_my-element.js_

```js
render(){
  return html`
    <div>
      <slot></slot>
      <slot name="one"></slot>
    </div>
  `;
}
```

_index.html_

```html
<my-element>
  <p slot="one">Pls include me in slot "one"</p>
</my-element>
```

* Named slots will only match light DOM children whose `slot` attribute matches their `name` attribute.

* Light DOM children with a specified `slot` attribute will only match slots with a matching `name` attribute.

* An un-named slot is called the "default" slot. Any number of light DOM children without a `slot` attribute may populate it. 

_my-element.js_

```js
render(){
  return html`
    <div>
      <slot name="one"></slot>
      <slot name="two"></slot>
      <slot></slot>
    </div>
  `;
}
```

_index.html_

```html
<my-element>
  <p slot="one">Pls include me in slot "one"</p>
  <p slot="three">I will not be in any slot.</p>
  <p>I will be in the default slot.</p>
  <p>So will I.</p>
</my-element>
```

<a id="namenotid">

### Use `name`, not `id`, to select slots

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
  <p slot="one">nope</p>
</my-element>
```


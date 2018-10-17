---
layout: post
section: docs
topic: templates
subtopic: design
---

<div class="summary">

### Summary

LitElement-based elements render and re-render asynchronously, updating in response to batched property changes. To maximize performance, design your element templates as a function of element properties.

</div>

### Efficient rendering

LitElement templates react to property changes. By default, all of an element's properties are observed, and a change to any one of them will trigger an update. 

Updates are processed asynchronously, so that an element re-renders in response to a batch of property changes. Using lit-html to render and re-render templates, only the DOM nodes that change are re-drawn. 

This improves performance and ensures consistent state between and during property changes.

The element below updates whenever either of its properties changes. Only the parts of the DOM that change are re-rendered.

_my-element.js_

```js
{% include projects/docs/templates1/my-element.js %}
```

{% include project.html folder="docs/templates1" openFile="my-element.js" %}

### Design templates as a function of properties

To maximize the benefits of using the LitElement library, we recommend that you design your element's template as a pure function of its properties.

This means that an element's `render` function

* should not change the element's state.
* should not have side effects.
* should not depend on anything except the element's properties. 
* should return the same result when given the same inputs; that is, with the same set of property values, you should get the same template.

We also recommend that you avoid manipulating DOM. Instead, express the element's template as a function of its state, and capture element state in properties.

### Example

The following element uses inefficient DOM manipulation:

_dom-manip.js_

```text
{% include projects/docs/templates/dom-manip.js %}
```

Rewrite the element's template as a function of its properties by capturing the load message as a property, and setting the property in response to the event:

_update-properties.js_

```js
{% include projects/docs/templates/update-properties.js %}
```

{% include project.html folder="docs/templates" openFile="index.html" %}

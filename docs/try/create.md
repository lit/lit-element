---
layout: post
title: Create your first custom element
parent: /try/
next: /try/properties
nexttitle: Add a property value to your template
type: task
---

To create a new custom element with lit-element:

* Import and extend the `LitElement` base class. 
* Define your element template inside lit-element's `render` function.
* Register the new element with the browser.

You can now import your element as a JavaScript module, and use it in markup.

_custom-element.js_

```js
{% include projects/try/create/custom-element.js %}
```

_index.html_

```html
{% include projects/try/create/index.html %}
```

{% include project.html folder="try/create" %}

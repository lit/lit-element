---
layout: post
title: Create an element
parent: /docs/
type: task
topic: /docs/create
permalink: /docs/create/index
---

To add LitElement to your project:

```
npm install @polymer/lit-element --save
```

To create a new element:

* Import the `LitElement` base class and the `html` helper function.
* Extend the `LitElement` base class.
* Implement `render` to define a template for your element.
* Register the new element with the browser.

### Example

_my-element.js_

```js
{% include projects/docs/create/my-element.js %}
```

_index.html_

```html
{% include projects/docs/create/index.html %}
```

{% include project.html folder="docs/create" openFile="my-element.js" forceEmbedLayout="true" view="editor" %}

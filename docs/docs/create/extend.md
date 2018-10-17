---
layout: post
section: docs
topic: create
subtopic: extend
---

To add LitElement to your project, install it with npm:

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

{% include project.html folder="docs/create" openFile="my-element.js" forceEmbedLayout="true" view="editor" %}

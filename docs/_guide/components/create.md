---
layout: post
section: create
topic: create
---

To create a new class based on LitElement: 

* Import the `LitElement` base class and the `html` helper function.
* Create a new class that extends the `LitElement` base class.
* Implement `render` to define a template for your web component.
* Register your component's HTML tag with the browser.

For example:

_my-element.js_

```js
{% include projects/docs/create/my-element.js %}
```

{% include project.html folder="docs/create" openFile="my-element.js" %}

### [Use TypeScript to create a component](#typescript)

You can use the `@customElement` TypeScript decorator to define your class as a custom element:

```ts
{% include projects/docs/typescript/my-element.ts %}
```

{% include project.html folder="docs/typescript" openFile="my-element.ts" %}

<a name="import">

## [Import a component](#import)

---
layout: post
section: docs
topic: create
---

**On this page:**

* [Install LitElement](#install)
* [Create a new component based on LitElement](#class)
* [Use TypeScript decorators to create a component](#typescript)
* [Import a LitElement-based component](#import)

<a id="install">

### [Install LitElement](#install)

To add LitElement to your project, install the `@polymer/lit-element` package with npm:

```
npm install @polymer/lit-element --save
```

<a id="class">

### [Create a new component based on LitElement](#class)

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

<a id="typescript">

## [Use TypeScript decorators to create a component](#typescript)

You can use the `@customElement` TypeScript decorator to define your class as a custom element:

```ts
{% include projects/docs/typescript/my-element.ts %}
```

{% include project.html folder="docs/typescript" openFile="my-element.ts" %}

<a name="import">

## [Import a LitElement-based component](#import)

### Import your own component

In an HTML document:

```html
<head>
  <script type="module" src="/path/to/my-element.js"></script>
</head>
<body>
  <my-element></my-element>
</body>
```

In another JavaScript module:

```js
// Use relative paths for peer dependencies
import './my-element.js';

class MyOtherElement extends LitElement{
  render(){
    return html`
      <my-element></my-element>
    `;
  }
}
customElements.define('my-other-element', MyOtherElement);
```

### Import a third-party component

**Refer to third-party component documentation first.** To work with any existing component made by a third party, see its documentation. This guide should work for most LitElement-based components if they are published on npm.

Many components are published on npm and can be installed from the command line:

```bash
cd my-project-folder
npm install package-name --save
```

In an HTML document, a component published on npm can be imported from the `node_modules` folder:

```html
<head>
  <script type="module" src="node_modules/package-name/existing-element.js"></script>
</head>
<body>
  <existing-element></existing-element>
</body>
```

To import into another JavaScript module, use the component's package name:

```js
import 'package-name/existing-element.js';

class MyElement extends LitElement{
  render(){
    return html`
      <existing-element></existing-element>
    `;
  }
}
customElements.define('my-element', MyElement);
```

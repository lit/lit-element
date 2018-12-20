---
layout: guide
title: Getting Started
slug: start
---

{::options toc_levels="1..3" /}
* ToC
{:toc}

## Setup

You need npm and Node.js to work with LitElement. To install npm and Node.js, see the [instructions on NodeJS.org](https://nodejs.org/en/).

LitElement uses JavaScript modules to import dependencies by their npm package names. Since web browsers need to know a file's full URL to import it, your local development server needs to serve full, transformed URL paths to your web browser.

To deploy an optimized build that works on your target browsers, you'll also need a build toolset that can handle this transform, along with any bundling.

One option is Polymer CLI, which includes a development server that converts module names to paths on the fly; and a configurable build tool that packages your code for deployment.

To install Polymer CLI with npm:

```bash
npm install -g polymer-cli
```

To serve a LitElement project locally:

```bash
polymer-serve
```

See the [Polymer CLI documentation](https://polymer-library.polymer-project.org/3.0/docs/tools/polymer-cli) for more information on configuring these tools. 

Read on to create a component, or [download a sample LitElement project](https://github.com/PolymerLabs/start-lit-element).

## Create a LitElement component

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

### Use LitElement TypeScript decorators

You can use the `@customElement` TypeScript decorator to define your class as a custom element:

```ts
{% include projects/docs/typescript/my-element.ts %}
```

{% include project.html folder="docs/typescript" openFile="my-element.ts" %}

## Import a component

### Import your own LitElement component

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

### Import a third-party LitElement component

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

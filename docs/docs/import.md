---
layout: post
section: docs
topic: import
---

Import and use a LitElement-based element in an HTML document, or in another element.

**On this page:**

* [Import and use your own element](#own)
* [Import and use a third-party element](#thirdparty)

### Import and use your own element

In an HTML document:

```html
<head>
  <script type="module" src="/path/to/my-element.js"></script>
</head>
<body>
  <my-element></my-element>
</body>
```

In another LitElement-based element:

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

<a name="thirdparty">

### Import and use a third-party element

To work with an existing LitElement-based element made by a third party, refer to the third party documentation for instructions on how to install the element and use it in your project.

Many elements are published on npm and can be installed from the command line:

```bash
cd my-project-folder
npm install package-name --save
```

In an HTML document, an element published on npm can be imported from the `node_modules` folder:

```html
<head>
  <script type="module" src="node_modules/package-name/existing-element.js"></script>
</head>
<body>
  <existing-element></existing-element>
</body>
```

To import an existing element and use it in your own LitElement-based project:

```js
import 'package-name/existing-element.js';

class MyElement extends LitElement{
  render(){
    return html`
      <existing-element></existing-element>
    `;
  }
}
customElements.define('existing-element', MyElement);
```

<div class="note">

**Package names must be transformed into URLs for a browser to load them.** If you're working with Polymer CLI, `polymer serve` and `polymer build` take care of this for you. See the [Develop and deploy](/tools/) documentation for more info.

</div>

<a name="own">

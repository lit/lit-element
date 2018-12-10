---
layout: post
section: components
topic: import
---

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

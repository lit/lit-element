---
layout: post
title: Style an element template
parent: /try/
prev: /try/events
prevtitle: Use event handlers
type: task
---

Style an element by including a `style` block in its template:

_custom-element.js_

```js
render(){
  return html`
    <style>
      p { color: blue }
    </style>
    <p>hello world from custom-element</p>
  `;
}
```

Styles inside custom element templates are encapsulated. These styles will only affect elements inside the template-not the main document.

_index.html_

```html
<html>
  <head>
    <script type="module" src="./custom-element.js"></script>
  </head>
  <body>
    <custom-element></custom-element>  
    <p>A paragraph in the main document</p>      
  </body>
</html>
```

{% include project.html folder="try/style" openFile="custom-element.js" %}

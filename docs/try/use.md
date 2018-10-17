---
layout: post
section: try
topic: use
next: properties
---

You can now import your new element as a JavaScript module, and use it in markup. 

* [Starting code](#start)
* [Editing steps](#edit)
* [Completed code](#completed)

<a name="start">

### Starting code

_my-element.js_

```js
{% include projects/try/use/before/index.html %}
```

{% include project.html folder="try/use/before" openFile="index.html" %}

<a name="edit">

### Editing steps

If you're working locally, here's the syntax you'll need to use:

```html
<head>
  <script type="module" src="./my-element.js"></script>
</head>
<body>
  <my-element></my-element>
</body>
```

**In StackBlitz, scripts are managed slightly differently.** In our live-editable code samples, a main script runs automatically and loads the module containing the custom element, so you won't need a `<script>` tag for it in `index.html`.

Add `<my-element>` tags to _index.html_:

```html
  <body>
    <!-- Add your element tags here -->
    <my-element></my-element>
  </body>
```

<a name="completed">

### Completed code

_index.html_

```js
{% include projects/try/use/after/index.html %}
```

{% include project.html folder="try/use/after" openFile="index.html" %}

{% include prevnext.html prevurl="create" prevtitle="Create an element" nexturl="properties" nexttitle="Declare properties" %}

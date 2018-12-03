---
layout: post
section: try
topic: use
---

Import your new component as a JavaScript module and use it in a web page.

* [Starting code](#start)
* [Editing steps](#edit)

<a name="start">

### Starting code

_index.html_

```html
{% include projects/try/use/before/index.html %}
```

{% include project.html folder="try/use/before" openFile="index.html" %}

<a name="edit">

### Steps

1. **Import your component module.** 

    LitElement components are imported as JavaScript modules. **You don't need to change anything in this step if you're following the tutorial in StackBlitz**. In StackBlitz, index.ts runs automatically.

    _index.ts_

    ```js
    {% include projects/try/use/after/index.ts %}
    ```

    If you're working locally, see [Import a LitElement component](/docs/create/#import).

2. **Add your new component to the page.** 

    In index.html, replace the existing `body` block with the following code:

    ```html
      <body>
        <my-element></my-element>
      </body>
    ```

If you're stuck, click **Launch Code Editor** below to see the completed code at work. 

{% include project.html folder="try/use/after" openFile="index.html" %}

{% include prevnext.html prevurl="create" prevtitle="Create an element" nexturl="properties" nexttitle="Declare properties" %}

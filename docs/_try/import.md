---
layout: try
slug: import
title: Import your component
---

Import your new component as a JavaScript module and use it in a web page.

**Starting code**

_index.html_

```html
{% include projects/try/import/before/index.html %}
```

{% include project.html folder="try/import/before" openFile="index.html" %}

1. **Import your component module.** 

    LitElement components are imported as JavaScript modules. **You don't need to change anything in this step if you're following the tutorial in StackBlitz**. In StackBlitz, index.ts runs automatically.

    _index.ts_

    ```js
    {% include projects/try/import/after/index.ts %}
    ```

2. **Add your new component to the page.** 

    In index.html, replace the existing `body` block with the following code:

    ```html
      <body>
        <my-element></my-element>
      </body>
    ```

If you're stuck, click **Launch Code Editor** below to see the completed code for Step 2. 

{% include project.html folder="try/import/after" openFile="index.html" %}

[Next: 3. Properties](properties)

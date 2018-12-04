---
layout: post
section: try
topic: style
---

Style your element with CSS by including a `style` block in its template. These styles are encapsulated, meaning they will only apply to your component's template. 

**Starting code**

_my-element.js_

```js
{% include projects/try/style/before/my-element.js %}
```

{% include project.html folder="try/style/before" openFile="my-element.js" %}

1.  **Define your styles.**

    To define your styles, add the following code to your template:

    ```html
    <style>
      p {
        font-family: Roboto;
        font-size: 16px;
        font-weight: 500;
      }
      .red {
        color: red;
      }
      .blue {
        color: blue;
      }
    </style>
    ```

2. **Apply your styles.**

    Use `myBool` to apply the styles conditionally. Add the following paragraph to your template:

    ```html
    <p class="${this.myBool?'red':'blue'}">styled paragraph</p>
    ```

If you're stuck, click **Launch Code Editor** below to see the completed code at work.

{% include project.html folder="try/style/after" openFile="my-element.js" %}

Congratulations - you've made your first element with LitElement.

Next steps

* [Set up LitElement locally](/tools/setup)
* [View API documentation](/docs/index)

{% include prevnext.html prevurl="events" prevtitle="5. Events" %}

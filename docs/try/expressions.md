---
layout: post
section: try
topic: expressions
---

Handling conditionals and loops in your LitElement templates is easy. No special annotations, just plain JavaScript expressions. 

Modify your template to add a loop and a conditional.

**Starting code**

_my-element.js_

```js
{% include projects/try/expressions/before/my-element.js %}
```

{% include project.html folder="try/expressions/before" openFile="my-element.js" %}

1. **Add a loop to your template.**

    We've added an array property, `myArray`, to my-element.js. To loop over `myArray`, add the following code to your template:

    ```html
    <ul>
      ${this.myArray.map(i => html`<li>${i}</li>`)}
    </ul>
    ```

2. **Add a conditional to your template.**

    We've added a boolean property, `myBool`, to my-element.js. To render conditionally on `myBool`, add the following code to your template:

    ```html
    ${this.myBool?
      html`<p>Render some HTML if myBool is true</p>`:
      html`<p>Render some other HTML if myBool is false</p>`}
    ```

If you're stuck, click **Launch Code Editor** below to see the completed code at work.

{% include project.html folder="try/expressions/after" openFile="my-element.js" %}

{% include prevnext.html prevurl="properties" prevtitle="3. Declare and use properties" nexturl="events" nexttitle="5. Add an event handler" %}

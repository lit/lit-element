---
layout: try
slug: logic
title: Logic in templates
---

In this step, you'll add a loop and a conditional to your LitElement template.

**Starting code**

_my-element.js_

```js
{% include projects/try/logic/before/my-element.js %}
```

{% include project.html folder="try/logic/before" openFile="my-element.js" %}

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

If you're stuck, click **Launch Code Editor** below to see the completed code for Step 4.

{% include project.html folder="try/logic/after" openFile="my-element.js" %}

[Next: 5. Events](events)

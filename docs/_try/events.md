---
layout: try
slug: events
title: Events
---

In this step, you'll use lit-html's `@event` annotation to add an event listener to an element inside your template. 

**Starting code**

_my-element.js_

```js
{% include projects/try/events/before/my-element.js %}
```

{% include project.html folder="try/events/before" openFile="my-element.js" %}

1. **Add an event listener.**

    In my-element.js, in your template, replace the existing HTML `button` element with the following code:

    ```html
    <button @click="${this.clickHandler}">Click</button>
    ```

    The annotation above adds a listener for the `click` event.

2. **Implement an event handler.** 

    To handle the `click` event, define the following method on your `MyElement` class:

    ```js
    clickHandler(event) {
      console.log(event.target);
      this.myBool = !this.myBool;
    }
    ```

If you're stuck, click **Launch Code Editor** below to see the completed code for Step 5.

{% include project.html folder="try/events/after" openFile="my-element.js" %}

[Next: 6. Style](style)

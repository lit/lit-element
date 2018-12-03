---
layout: post
section: try
topic: events
---

Use lit-html's `@event` annotation to add an event listener to an element inside a template. 

**Starting code**

_my-element.js_

```js
{% include projects/try/events/before/my-element.js %}
```

{% include project.html folder="try/events/before" openFile="my-element.js" %}

1. **Add an event listener.**

    In my-element.js, in your template, replace the existing HTML `button` element with the following code:

    ```html
    <button @click="${(event) => this.clickHandler(event)}">Click</button>
    ```

    The annotation above adds a listener for the `click` event.

2. **Implement an event handler.** 

    To handle the `click` event, define the following method on your `MyElement` class:

    ```js
    clickHandler(event){
      console.log(event.target);
      this.myBool = !this.myBool;
    }
    ```

If you're stuck, click **Launch Code Editor** below to see the completed code at work.

{% include project.html folder="try/events/after" openFile="my-element.js" %}

{% include prevnext.html prevurl="expressions" prevtitle="Loops and conditionals" nexturl="style" nexttitle="Style your element" %}

---
layout: post
section: try
topic: create
---

In this step, you'll fill in the gaps in the starting code to create an element class with a basic HTML template.

* [Starting code](#start)
* [Editing steps](#edit)

<a name="start">

### Starting code

_my-element.js_

```js
{% include projects/try/create/before/my-element.js %}
```

Click **Launch Code Editor** to edit the starting code. When you're ready to see your code in action, click **Preview**.

{% include project.html folder="try/create/before" openFile="my-element.js" %}

<a name="edit">

### Editing steps

1.  **Import the `LitElement` base class and `html` helper function.**

    In my-element.js, replace the existing `import` statement with the following code:

    ```js
    import { LitElement, html } from '@polymer/lit-element'; 
    ```
    
2.  **Create a class for your element that extends the LitElement base class.**

    In my-element.js, replace the existing class definition with the following code:

    ```js
    class MyElement extends LitElement {
      render() {
        return html`
          <p>Hello world! From my-element</p>
        `;
      }
    }    
    ```

3.  **Register the new element with the browser.**

    In my-element.js, replace the existing call to `customElements.define()` with the following code:

    ```js
    customElements.define('my-element', MyElement);
    ```

If you're stuck, click **Launch Code Editor** to see the completed code at work.

{% include project.html folder="try/create/after" openFile="my-element.js" %}

{% include prevnext.html prevurl="index" prevtitle="Try LitElement" nexturl="use" nexttitle="Use your element in a web page" %}

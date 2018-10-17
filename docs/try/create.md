---
layout: post
section: try
topic: create
---

In this step, you'll fill in the gaps in the starting code to create an element class with a basic HTML template.

* [Starting code](#start)
* [Editing steps](#edit)
* [Completed code](#completed)

<a name="start">

### Starting code

_my-element.js_

```js
{% include projects/try/create/before/my-element.js %}
```

Click inside the following live sample to start editing. When you're ready to see your code in action, click the **Preview** button.

{% include project.html folder="try/create/before" openFile="my-element.js" %}

<a name="edit">

### Editing steps

1.  Import the `LitElement` base class and `html` helper function. 

    _my-element.js_

    ```js
    // Import LitElement base class and html helper function
    import { } from ''; 
    ```

    _Import statements_

    ```js
    import { LitElement, html } from '@polymer/lit-element'; 
    ```
    
2.  Create a class for your element that extends the LitElement base class, and define an element template inside the `render` function.

    _my-element.js_

    ```js
    // Create your class here
    class MyElement {
      render(){
        // Define your element template here
      }
    }
    ```

    _MyElement class_

    ```js
    class MyElement extends LitElement {
      render(){
        return html`
          <p>Hello world! From my-element</p>
        `;
      }
    }    
    ```

3.  Register the new element with the browser.

    _my-element.js_

    ```js
    // Register the element with the browser
    customElements.define();
    ```

    _Register element with the browser_

    ```js
    // Register the element with the browser
    customElements.define('my-element', MyElement);
    ```

<a name="completed">

### Completed code

_my-element.js_

```js
{% include projects/try/create/after/my-element.js %}
```

{% include project.html folder="try/create/after" openFile="my-element.js" %}

{% include prevnext.html prevurl="index" prevtitle="Try LitElement" nexturl="use" nexttitle="Use your element in a web page" %}

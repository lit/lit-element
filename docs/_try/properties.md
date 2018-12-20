---
layout: try
slug: properties
title: Use properties
---

In this step, you'll declare a property for your component, and use the value in the component's template. LitElement components update automatically when their properties change.

**Starting code**

_my-element.js_

```js
{% include projects/try/properties/before/my-element.js %}
```

{% include project.html folder="try/properties/before" openFile="my-element.js" %}

1. **Declare a property.**

    In my-element.js, replace the existing `properties` getter with the following code: 
    
    ```js
    static get properties() {
      return {
        // Property declaration
        message: { type: String }
      };
    }
    ```

2. **Initialize the property.**

    You should initialize property values in a component's constructor. 
    
    In my-element.js, replace the existing constructor with the following code:
    
    ```js
    constructor() {
      // Always call superconstructor first
      super();

      // Initialize property
      this.message='Hello world! From my-element';
    }
    ```

3. **Add the property to your template with a JavaScript expression.**

    In my-element.js, replace the existing `render` function with the following code:

    ```js
    render() {
      return html`
        <p>${this.message}</p>
      `;
    }
    ``` 

If you're stuck, click **Launch Code Editor** below to see the completed code for Step 3.

{% include project.html folder="try/properties/after" openFile="my-element.js" %}

[Next: 4. Logic](logic)

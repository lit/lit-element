---
layout: post
title: Use properties in templates
parent: /try/
next: /try/expressions
nexttitle: Write loops and conditionals
prev: /try/create
prevtitle: Create an element
type: task
---

To render property values in your element templates: 

* Declare your properties, for example, in a static getter. 
* Add properties to your template with JavaScript expressions.
* You can initialize properties in the element constructor.

**custom-element.js**
```js
class CustomElement extends LitElement {  
  // Declare properties.
  static get properties(){
    return {
      headingtext: { type: String }
    };
  }
  constructor(){
    // Always call superconstructor when you override the constructor.
    super();

    // You can initialize properties in the element constructor.
    this.headingtext='Hello World!';
  }
  render(){
    return html`
      <!-- Add properties to a template with JavaScript expressions. -->
      <h1>${this.headingtext}</h1>
    `;
  }
}
```

lit-element automatically observes and renders property changes.

{% include project.html folder="try/properties" openFile="custom-element.js" %}

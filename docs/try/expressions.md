---
layout: post
section: try
topic: expressions
status: reviewing
---

Handling conditionals and loops in your LitElement templates is easy. No special annotations, just plain JavaScript expressions. 

* [Starting code](#start)
* [Editing steps](#edit)
* [Completed code](#completed)

<a name="start">

### Starting code

_my-element.js_

```js
{% include projects/try/expressions/before/my-element.js %}
```

{% include project.html folder="try/expressions/before" openFile="my-element.js" %}

<a name="edit">

### Editing steps

In this step, you'll modify the element template to add:

* A loop using an array property.
* An "if" statement using a boolean property.

We've decleared the properties; all you need to do is initialize them and use them in markup.

In _my-element.js_, add the initialization code to the constructor.

_my-element.js_

```js
constructor(){
  super();
  this.message='Hello world! From my-element';
  
  // Initialize myArray and myBool here.

}
```

_Initialization code_

```js
this.myArray = ['an','array','of','test','data'];
this.myBool = true;
```

In _my-element.js_, add a loop and a conditional to the element template in `render`.

_my-element.js_

```js
render(){
  return html`
    <p>${this.message}</p>

    <!-- Add a loop and a conditional here. -->
  `;
}
```

_Code for loop_

```js
<ul>
  ${this.myArray.map(i => html`<li>${i}</li>`)}
</ul>
```

_Code for conditional_

```js
${this.myBool?
  html`<p>Render some HTML if myBool is true</p>`:
  html`<p>Render some other HTML if myBool is false</p>`}
```

<a name="completed">

### Completed code

_my-element.js_

```js
{% include projects/try/expressions/after/my-element.js %}
```

{% include project.html folder="try/expressions/after" openFile="my-element.js" %}

{% include prevnext.html prevurl="properties" prevtitle="Declare properties" nexturl="events" nexttitle="Add an event handler" %}

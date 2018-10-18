---
layout: post
section: try
topic: events
status: reviewing
---

Use lit-html's `@event` annotation to add an event listener to an element inside a template. 

* [Starting code](#start)
* [Editing steps](#edit)
* [Completed code](#completed)

<a name="start">

### Starting code

_my-element.js_

```js
{% include projects/try/events/before/my-element.js %}
```

{% include project.html folder="try/events/before" openFile="my-element.js" %}

<a name="edit">

### Editing steps

In the element template in `render`, annotate a `<button>` to add an event listener:

_my-element.js_

```js
render(){
  return html`
    ...
    
    <!-- Annotate the button to add an event listener. --> 
    <button></button>
  `;
}
```

_Annotated button_

```html
<button @click="${(event) => this.clickHandler(event)}">Click</button>
```

To handle the event, add an event handler method to the MyElement class.

_my-element.js_

```js
class MyElement extend LitElement { 
  ...
  render(){
    ...
  }
  // Add an event handler here.
}
```

_Event handler code_

```js
clickHandler(event){
  console.log(event.target);
  this.myBool = !this.myBool;
}
```

<a name="completed">

### Completed code

_my-element.js_

```js
{% include projects/try/events/after/my-element.js %}
```

{% include project.html folder="try/events/after" openFile="my-element.js" %}

{% include prevnext.html prevurl="expressions" prevtitle="Loops and conditionals" nexturl="style" nexttitle="Style your element" %}

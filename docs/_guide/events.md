---
layout: guide
title: Events
slug: events
---

TODO: Tidy up this page

{::options toc_levels="1..3" /}
* ToC
{:toc}

## Overview

* Default event context is `this` - no need for `this.handlerMethod.bind(this)`
* You can use `this` referring to the host inside an event handler
* Add event listeners in a method that is guaranteed to fire before the event occurs
* For optimal loading performance, add your event listener as late as possible

## Add an event listener to a LitElement host

You can use the `firstUpdated` callback to add an event listener after the element has first been rendered:

```js
class MyElement extends LitElement {
  firstUpdated(changedProperties) {
    this.addEventListener('click', (e) => { ... });
})
```

```js
class MyElement extends LitElement {
  firstUpdated(changedProperties) {
    this.addEventListener('click', this.clickHandler);
  }
  clickHandler(e) { ... }
)
```

If your event might occur before the element has finished rendering, you can add the listener from the constructor:

```js
class MyElement extends LitElement {
  constructor() {
    super.constructor();
    this.addEventListener('some-event', (e) => { ... });
})
```

```js
class MyElement extends LitElement {
 constructor() {
    super.constructor();
    this.addEventListener('some-event', this.someEventHandler);
  }
  someEventHandler(e) { ... }
)
```

## Add an event listener to the child element of a LitElement host

**Option 1: Use lit-html template syntax**

You can add an event listener to an element's DOM child using lit-html data binding syntax:

```js
render() {
  return html`<button @click="${this.handleClick}"></button>`;
}
handleClick(e) {
  // ...
}
```

See the documentation on [Templates](templates) for more information on lit-html template syntax.

**Option 2: Add the listener imperatively**

To add an event listener to a child element imperatively, you must do so in or after `firstUpdated` to ensure that the child element exists. For example:

```js
render() {
  return html`<button id="mybutton"></button>`;
}

firstUpdated(changedProperties) {
  let el = this.shadowRoot.getElementById('mybutton');
  el.addEventListener('click', this.handleClick);
}
...
handleClick(e) {
  ...
}
```

### Bubbling, custom events, composed path, etc

**Event bubbling**

```js
//?????
constructor() {
  this.super();  
  this.addEventListener('click', (e) => { console.log(e.target)});
}
render() {
  return html`<button id="mybutton" @click="${this.handleClick}"></button>`;
}
handleClick(e) {
  console.log(e.target.id);
}
```

**Event retargeting**

```js
render() {
  return html`<button id="mybutton" @click="${this.handleClick}"></button>`;
}
handleClick(e) {
  console.log(e.target.id);
}
```

**Composed path**

```js
render() {
  return html`<button id="mybutton" @click="${this.handleClick}"></button>`;
}
handleClick(e) {
  let origin = e.composedPath()[0];
  console.log(origin.id);
}
```

By default, custom events stop at shadow DOM boundaries. To make a custom event pass through shadow DOM boundaries, set the composed flag to true when you create the event:


**Composed path**

```js
constructor() {
  this.super();  
  this.addEventListener('my-event', (e) => { console.log(e.composedPath())});
}
render() {
  return html`<button id="mybutton" @click="${this.doThing}"></button>`;
}
doThing() {
  let myEvent = new CustomEvent('my-event', { bubbles: true, composed: true });
  this.dispatchEvent(myEvent);
}
```

## Add an event listener to anything else

When you're adding an event listener to the host element or its children, you don't need to worry about memory leaks. The memory allocated to the event listener will be destroyed when the host element is destroyed.

However, when adding an event listener to something other than the host element or its children, you should add the listener in `connectedCallback` and remove it in `disconnectedCallback`:

```js
connectedCallback() {
  super.connectedCallback();
  window.addEventListener('hashchange', this.hashChangeListener);
}

disconnectedCallback() {
  super.disconnectedCallback();
  window.removeEventListener('hashchange', this.hashChangeListener);
}
```

### 

Scenario 1

MyElement constructor is called; ChildThing constructor is called; event listener is added to ChildThing
Stuff happens, event listener fires, memory is allocated in its scope
MyElement is destroyed; ChildThing is destroyed, and with it, the scope of the event listener; memory is freed up, all is well
Scenario 2

MyElement constructor is called; event listener is added to Window
Stuff happens, event listener fires, memory is allocated in its scope
MyElement is destroyed
In Scenario 2, I am not sure when or how the memory in the scope created by the event listener on Window would get released. My understanding is that garbage collection works differently in different browsers and this scenario might not be good for memory management.

Scenario 2.A

MyElement's connectedCallback fires, event listener is added to Window
Stuff happens, event listener fires, memory is allocated in its scope
disconnectedCallback fires, event listener is removed from Window, memory is freed up and all is well
The recommendation to use disconnectedCallback to remove event listeners added to things that aren't MyElement or its children seems clear in this scenario. As for why you would add it in connectedCallback instead of the constructor in this scenario, I can't say for sure, but it does seem nice and clean to do stuff in connectedCallback if you're going to undo it in disconnectedCallback. Maybe a scenario like the following would make it more relevant:

Scenario 3

MyElement is appended to ParentThing, MyElement's connectedCallback fires, event listener is added to ParentThing
Stuff happens, event listener fires, memory is allocated in its scope
MyElement is moved to a new position in DOM, disconnectedCallback fires, event listener is removed from ParentThing
MyElement is appended to OtherThing, connectedCallback fires again, etc


### A heading3

```js
some code
```

Something:

* A list item
* A list item

## Heading 2

```js
code
```

```js
code
```


**Example: Add an event listener to a child element** 

```js
{% include projects/events/events/my-element.js %}
```

{% include project.html folder="events/events" openFile="my-element.js" %}

## Add an event listener to some other DOM element




## Best practices

From which method should you add an event listener?

* Add your event listener before the event can occur.
* You can 
* You must add your 

### How can I ensure that the memory allocated to the event listener is cleaned up?


A custom element can add an event listener to itself or its own children from its constructor without any issues

Adding the listener in the constructor ensures that you will catch events that could possibly occur before the custom element has been added to DOM
If the custom element adds an event listener to anything except itself or its children (e.g. window), you should add the listener in connectedCallback and remove it in disconnectedCallback






{:.alert .alert-warning}
<div>

**Something.** Something something.

```js
code.
```

Something. 

</div>





{:.alert .alert-warning}
<div>

**Remember to something.** Something something.

</div>
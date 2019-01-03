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
{% include projects/events/host/my-element.js %}
```

{% include project.html folder="events/host" openFile="my-element.js" %}

If your event might occur before the element has finished rendering, you can add the listener from the constructor.

## Add an event listener to the child element of a LitElement host

**Option 1: Use lit-html template syntax**

You can add an event listener to an element's DOM child using lit-html data binding syntax:

```js
{% include projects/events/child/my-element.js %}
```

{% include project.html folder="events/child" openFile="my-element.js" %}

See the documentation on [Templates](templates) for more information on lit-html template syntax.

**Option 2: Add the listener imperatively**

To add an event listener to a child element imperatively, you must do so in or after `firstUpdated` to ensure that the child element exists. For example:

```js
{% include projects/events/childimperative/my-element.js %}
```

{% include project.html folder="events/childimperative" openFile="my-element.js" %}

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

### Why

Because garbage collection.

**Bad**

1. MyElement creates an event listener on Window
2. Event listener fires, memory is allocated in its scope
3. MyElement is destroyed

However, the memory allocated to the event listener is still in use. To avoid this:

**Good**

1. MyElement adds event listener to Window
2. Event listener fires, memory is allocated in its scope
3. MyElement's disconnectedCallback fires, event listener is removed from Window

Memory is freed up and all is well.

**Also Good**

If the element can move around the DOM during its lifecycle, you may need to add the event listener in `connectedCallback`: 

1. MyElement is appended to ParentElement, MyElement's connectedCallback fires, event listener is added to ParentElement
2. Event listener fires, memory is allocated in its scope
3. MyElement is moved to a new position in DOM, disconnectedCallback fires, event listener is removed from ParentElement, memory is freed 
4. MyElement is appended to OtherElement, connectedCallback fires again, etc

## Bubbling, custom events, composed path, etc

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


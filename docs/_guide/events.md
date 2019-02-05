---
layout: guide
title: Events
slug: events
---

{::options toc_levels="1..3" /}
* ToC
{:toc}

## Overview

### Where to add your event listeners

You need to add event listeners in a method that is guaranteed to fire before the event occurs. However, for optimal loading performance, you should add your event listener as late as possible.  

You can add event listeners:

*   **Via your component's template.**

    You can use lit-html `@event` bindings in your template inside the `render` function to add event listeners to your component. 

    **Example**

    ```js
    render() {
      return html`<button @click="${this.handleClick}">`;
    }
    ```

*   **In the component constructor.**

    If you need to listen for an event that might occur before your component has been added to DOM, you might need to add the event listener in your component's constructor. 

    **Example**

    ```js
    constructor() {
      super();
      this.addEventListener('DOMContentLoaded', this.handleLoaded);
    }
    ```

*   **In `firstUpdated`**.

    `firstUpdated` is a LitElement lifecycle callback. `firstUpdated` fires after the first time your component has been updated and rendered. See [firstUpdated](/guide/lifecycle#firstupdated) in the Lifecycle documentation for more information.

    If the event you're handling can't occur before your component has been updated and rendered for the first time, it's safe and efficient to add a listener for it in `firstUpdated`. 

    **Example**

    ```js
    firstUpdated(changedProperties) {
      this.addEventListener('click', this.handleClick);
    }
    ```

*   **In `connectedCallback`**. 

    `connectedCallback` is a lifecycle callback in the custom elements API. `connectedCallback` fires each time a custom element is appended into a document-connected element. See [the MDN documentation on using custom elements lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks) for more information.

    If your component adds an event listener to anything except itself or its children–for example, to `Window`, `Document`, or some element in the main DOM–you should add the listener in `connectedCallback` and remove it in `disconnectedCallback`.
    
    *   Removing the event listener in `disconnectedCallback` ensures that any memory allocated by your component will be cleaned up when your component is destroyed or disconnected from the page. 

    *   Adding the event listener in `connectedCallback` (instead of, for example, the constructor or `firstRendered`) ensures that your component will re-create its event listener if it is disconnected and subsequently reconnected to DOM.
    
    **Example**
    
    ```js
    connectedCallback() {
      super.connectedCallback();
      document.addEventListener('readystatechange', this.handleChange);
    }
    disconnectedCallback() {
      document.removeEventListener('readystatechange', this.handleChange);
      super.disconnectedCallback();
    }
    ```

### Using `this` in event handlers

The default JavaScript context object (`this`) inside an event handler belonging to a LitElement-based component is the component itself. 

Therefore, you can use `this` to refer to your element instance inside any event handler:

```js
class MyElement extends LitElement {
  render() {
    return html`<button @click="${this.handleClick}">click</button>`;
  }
  handleClick(e) {
    console.log(this.prop);
  }
}
```

See the [documentation for `this` on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) for more information.

### Use cases

* [Fire a custom event from a LitElement-based component](#fire-custom-event).
* [Handle a custom event fired by a LitElement-based component](#handle-custom-event).
* [Handle an event fired by a shadow DOM child of your component](#handle-shadow-dom-event).
* [Add event listeners imperatively](#imperative).

### Fire an event from a LitElement-based component {#fire-event}

Fire a custom event:

```js
class MyElement extends LitElement {
  render() {
    return html`<div>Hello World</div>`;
  }
  firstUpdated(changedProperties) {
    let event = new CustomEvent('my-event', {
      detail: {
        message: 'Something important happened'
      }
    });
    this.dispatchEvent(event);
  }
}
```

Fire a standard event:

```js
class MyElement extends LitElement {
  render() {
    return html`<div>Hello World</div>`;
  }
  updated(changedProperties) {
    let click = new Event('click');
    this.dispatchEvent(click);
  }
}
```

### Handle an event fired by a LitElement-based component {#handle-fired-event}

Handle events fired by a LitElement-based component the same way you would handle any event fired from a standard DOM element.

To handle an event fired by a LitElement-based component that you're using on any HTML page:

```html
<my-element onMyEvent="(e) => {console.log(e)}"></my-element>
<my-element onClick="(e) => {console.log(e)}"></my-element>
```

To handle a custom event fired by a LitElement-based component from inside another LitElement template:

```html
<my-element @my-event="${() => { console.log(event.detail.message) }}"></my-element>
```

## Working with events and shadow DOM

When working with events and shadow DOM, there are a few things you need to know about. 

### Event bubbling

Some events bubble up through the DOM tree, so that they are detectable by any element on the page. 

Whether or not an event bubbles depends on the value of its `bubbles` property. To check if a particular event bubbles:

```js
handleEvent(e){
  console.log(e.bubbles);
}
```

See the MDN documentation on the [Event interface](https://developer.mozilla.org/en-US/docs/Web/API/Event) for more information.

### Event retargeting

Bubbling events fired from within shadow DOM are retargeted so that, to any listener external to your component, they appear to come from your component itself. 

**Example**

```html
<my-element onClick="(e) => console.log(e.target)"></my-element>
```

```js
render() {
  return html`
    <button id="mybutton" @click="${(e) => console.log(e.target)}">
      click me
    </button>`;
}
```

When handling such an event, you can find where it originated from with `composedPath`:

```js
handleMyEvent(event) {
  console.log('Origin: ', event.composedPath()[0]);
}
```

### Custom events

By default, a bubbling custom event fired inside shadow DOM will stop bubbling when it reaches the shadow root. 

To make a custom event pass through shadow DOM boundaries, you must set both the `composed` and `bubbles` flags to `true`:

```js
firstUpdated(changedProperties) {
  let myEvent = new CustomEvent('my-event', { 
    detail: { message: 'my-event happened.' },
    bubbles: true, 
    composed: true });
  this.dispatchEvent(myEvent);
}
```

See the [MDN documentation on custom events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) for more information.

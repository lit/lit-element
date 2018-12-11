---
layout: post
title: Lifecycle
slug: lifecycle
---

{::options toc_levels="1..3" /}
* ToC
{:toc}

## Overview

LitElement-based components update asynchronously in response to observed property changes. Property changes are batched--if more properties change after an update is requested, but before the update starts, all of the changes are captured in the same update.

At a high level, the update lifecycle is:

1.  A property is set. 
2.  The property's `hasChanged` function evaluates whether the property has changed.
3.  If the property has changed, `requestUpdate` fires, scheduling an update.
4.  `shouldUpdate` checks whether the update should proceed.
5.  If the update should proceed, the `update` function reflects the element's properties to its attributes.
6.  The lit-html `render` function renders DOM changes.
7.  The `updated` function is called, exposing the properties that changed.
8.  The `updateComplete` Promise resolves. Any code waiting for it can now run.

####  LitElement and the browser event loop

The browser executes JavaScript code by processing a queue of tasks in the [event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop). In each iteration of the event loop, the browser takes a task from the queue and runs it to completion. 

When the task completes, before taking the next task from the queue, the browser allocates time to perform work from other sources--including DOM updates, user interactions, and the microtask queue. 

LitElement updates are requested asynchronously as Promises, and are queued as microtasks. This means that updates are processed at the end of every iteration of the event loop, making updates fast and responsive.

For a more detailed explanation of the browser event loop, see [Jake Archibald's article](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/).

#### Promises and asynchronous functions

LitElement uses [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) objects to schedule and respond to element updates. 

Using `async` and `await` makes it easy to work with Promises. For example, you can await the `updateComplete` Promise:

```js
// `async` makes the function return a Promise & lets you use `await` 
async myFunc(data) {
  // Set a property, triggering an update
  this.myProp = data;

  // Wait for the updateComplete promise to resolve
  await this.updateComplete;
  // ...do stuff...
  return 'done';
}
```

Because `async` functions return a Promise, you can await them, too:

```js
let result = await myFunc('stuff');
// `result` is resolved! You can do something with it
```

See the [Web Fundamentals primer on Promises](https://developers.google.com/web/fundamentals/primers/promises) for a more in-depth tutorial.

## Methods and properties

In call order, the methods and properties in the update lifecycle are: 

1.  [someProperty.hasChanged](#haschanged)
1.  [requestUpdate](#requestupdate) 
1.  [shouldUpdate](#shouldupdate)
1.  [update](#update)
1.  [render](#render)
1.  [firstUpdated](#firstupdated)
1.  [updated](#updated)
1.  [updateComplete](#updatecomplete)

### someProperty.hasChanged

All declared properties have a function, `hasChanged`, which is called whenever the property is set; if `hasChanged` returns true, an update is scheduled.

See the Properties documentation for information on [configuring `hasChanged` to customize what constitutes a property change](/properties#haschanged).

### requestUpdate

```js
// Manually start an update
this.requestUpdate();

// Call from within a custom property setter
this.requestUpdate(propertyName, oldValue);
```

| **Params**<br/><br/>&nbsp; | `propertyName`<br/><br/>`oldValue`| Name of property to be updated. <br/><br/> Previous property value. |
| **Returns**  | `Promise` | Returns the [`updateComplete` Promise](#updatecomplete), which resolves on completion of the update. |
| **Updates?** | No | Property changes inside this method will not trigger an element update. |

If [`hasChanged`](#haschanged) returned `true`, `requestUpdate` fires, and the update proceeds.

To manually start an element update, call `requestUpdate` with no parameters.

To implement a custom property setter that supports property options, pass the property name and its previous value as parameters.

**Example: Manually start an element update**

```js
{% include projects/docs/lifecycle/requestupdate/my-element.js %}
```

{% include project.html folder="docs/lifecycle/requestupdate" %}

**Example: Call `requestUpdate` from a custom property setter**

```js
{% include projects/docs/lifecycle/customsetter/my-element.js %}
```

{% include project.html folder="docs/lifecycle/customsetter" %}

### shouldUpdate

```js
/** 
 * Implement to override default behavior.
 */
shouldUpdate(changedProperties) { ... }
```

| **Params** | `changedProperties`| `Map`. Keys are the names of changed properties; Values are the corresponding previous values. |
| **Returns**  | `Boolean` | If `true`, update proceeds. Default return value is `true`. |
| **Updates?** | Yes | Property changes inside this method will trigger an element update. |

Controls whether an update should proceed. Implement `shouldUpdate` to specify which property changes should cause updates. By default, this method always returns true.

**Example: Customize which property changes should cause updates**

```js
{% include projects/docs/lifecycle/shouldupdate/my-element.js %}
```

{% include project.html folder="docs/lifecycle/shouldupdate" %}

### update

| **Params** | `changedProperties`| `Map`. Keys are the names of changed properties; Values are the corresponding previous values. |
| **Updates?** | No | Property changes inside this method do not trigger an element update. |

Reflects property values to attributes and calls `render` to render DOM via lit-html. Provided here for reference. You don't need to override or call this method. 

### render

```js
/** 
 * Implement to override default behavior.
 */
render() { ... }
```

| **Returns** | `TemplateResult` | Must return a lit-html `TemplateResult`. |
| **Updates?** | No | Property changes inside this method will not trigger an element update. |

Uses lit-html to render the element template. You must implement `render` for any component that extends the LitElement base class.

See the documentation on [Templates](/templates) for more information.

### firstUpdated

```js
/** 
 * Implement to override default behavior.
 */
firstUpdated(changedProperties) { ... }
```

| **Params** | `changedProperties`| `Map`. Keys are the names of changed properties; Values are the corresponding previous values. |
| **Updates?** | Yes | Property changes inside this method will trigger an element update. |

Called after the element's DOM has been updated the first time, immediately before [`updated`](#updated) is called. 

Implement `firstUpdated` to perform one-time work after the element's template has been created.

**Example: Focus an input element**

```js
{% include projects/docs/lifecycle/firstupdated/my-element.js %}
```

{% include project.html folder="docs/lifecycle/firstupdated" %}

### updated

```js
/** 
 * Implement to override default behavior.
 */
updated(changedProperties) { ... }
```

| **Params** | `changedProperties`| `Map`. Keys are the names of changed properties; Values are the corresponding previous values. |
| **Updates?** | Yes | Property changes inside this method will trigger an element update. |

Called when the element's DOM has been updated and rendered. Implement to perform some task after an update.

**Example: Focus an element after update**

```js
{% include projects/docs/lifecycle/updated/my-element.js %}
```

{% include project.html folder="docs/lifecycle/updated" %}

### updateComplete

```js
// Await Promise property.
await this.updateComplete;
```

| **Type** | `Promise` | Resolves with a `Boolean` when the element has finished updating. |
| **Resolves** <br/><br/>| `true` if there are no more pending updates.<br/><br/> `false` if this update cycle triggered another update. |

The `updateComplete` Promise resolves when the element has finished updating. Use `updateComplete` to to wait for an update:

  ```js
  await this.updateComplete;
  // do stuff
  ```

  ```js
  this.updateComplete.then(() => { /* do stuff */ });
  ```

To have `updateComplete` await additional state before it resolves, implement the `updateComplete` getter:

  ```js
  get updateComplete() {
    return this.getMoreState().then(() => {
      return this._updatePromise;
    });
  }
  ```

**Example**

```js
{% include projects/docs/lifecycle/updatecomplete/my-element.js %}
```

{% include project.html folder="docs/lifecycle/updatecomplete" %}

## Examples

#### Customize which property changes should cause an update

[Implement `shouldUpdate`](#shouldupdate):

```js
shouldUpdate(changedProps) {
  return changedProps.has('prop1');
}
```

{% include project.html folder="docs/lifecycle/shouldupdate" %}

#### Customize what constitutes a property change

Specify [`hasChanged`](#haschanged) for the property:

```js
static get properties(){ return {
  myProp: {
    type: Number,
    /* Only consider myProp to have changed if newVal > oldVal */
    hasChanged(newVal, oldVal) {
      return newVal > oldVal;
    }
  }
}
```

{% include project.html folder="docs/lifecycle/haschanged" %}

#### Manage property changes and updates for object subproperties

Mutations (changes to object subproperties and array items) are not observable. Instead, either rewrite the whole object, or call [`requestUpdate`](#requestupdate) after a mutation.

```js
// Option 1: Rewrite whole object, triggering an update
this.prop1 = Object.assign({}, this.prop1, { subProp: 'data' });

// Option 2: Mutate a subproperty, then call requestUpdate
this.prop1.subProp = 'data';
this.requestUpdate();
```

{% include project.html folder="docs/lifecycle/subproperties" %}

#### Update in response to something that isn't a property change

Call [`requestUpdate`](#requestupdate):

```js
// Request an update in response to an event
this.addEventListener('load-complete', async (e) => {
  console.log(e.detail.message);
  console.log(await this.requestUpdate());
});
```

{% include project.html folder="docs/lifecycle/shouldupdate" %}

#### Request an update regardless of property changes

Call [`requestUpdate()`](#requestupdate):

```js
this.requestUpdate();
```

#### Request an update for a specific property

Call [`requestUpdate(propName, oldValue)`](#requestupdate):

```js
let oldValue = this.prop1;
this.prop1 = 'new value';
this.requestUpdate('prop1', oldValue);
```

{% include project.html folder="docs/lifecycle/requestupdate" %}

#### Do something after the first update

Implement [`firstUpdated`](#firstupdated): 

```js
firstUpdated(changedProps) {
  console.log(changedProps.get('prop1'));
}
```

{% include project.html folder="docs/lifecycle/firstupdated" %}

#### Do something after every update

Implement [`updated`](#updated):

```js
updated(changedProps) {
  console.log(changedProps.get('prop1'));
}
```

{% include project.html folder="docs/lifecycle/updated" %}

#### Do something when the element next updates

Await the [`updateComplete`](#updatecomplete) promise:

```js
await updateComplete;
// do stuff
```

```js
updateComplete.then(() => {
  // do stuff
});
```

#### Wait for an element to finish updating

Await the [`updateComplete`](#updatecomplete) promise:

```js
let done = await updateComplete;
```

```js
updateComplete.then(() => {
  // finished updating
});
```

{% include project.html folder="docs/lifecycle/updatecomplete" %}

---
layout: post
section: docs
topic: lifecycle
subtopic: index
---

**On this page:**

* [Overview](#overview)
* [LitElement and the browser event loop](#eventloop)
* [Promises and asynchronous functions](#promises)

<a id="overview">

### [Overview](#overview)

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

See the documentation on [Customizing lifecycle behavior](customize) for a guide to working with the LitElement update lifecycle. 

For details on the lifecycle methods' parameters, return values, and how to call them, see the [Lifecycle methods reference](methods).

<a id="eventloop">

### [LitElement and the browser event loop](#eventloop)

For a more detailed explanation of these concepts, see [Jake Archibald's article](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/).

The browser executes JavaScript code by processing a queue of tasks in the [event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop). In each iteration of the event loop, the browser takes a task from the queue and runs it to completion. 

When the task completes, before taking the next task from the queue, the browser allocates time to perform work from other sources--including DOM updates, user interactions, and the microtask queue. 

LitElement updates are requested asynchronously as Promises, and are queued as microtasks. This means that element updates are processed at the end of every iteration of the event loop--making updates super fast and responsive.

<a id="promises">

### [Promises and asynchronous functions](#promises)

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

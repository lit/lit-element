---
layout: post
section: lifecycle
topic: customize
---

**On this page:**

* [Customize when updates happen](#customize)
* [Request an update at a specific time](#request)
* [Respond to or wait for an update](#respond)

<a id="customize">

### [Customize when updates should happen](#customize)

**Customize which property changes should cause an update**

[Implement `shouldUpdate`](methods#shouldupdate):

```js
shouldUpdate(changedProps) {
  return changedProps.has('prop1');
}
```

{% include project.html folder="docs/lifecycle/shouldupdate" %}

**Customize what constitutes a property change**

Specify [`hasChanged`](methods#haschanged) for the property:

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

**Manage property changes and updates for object subproperties**

Mutations (changes to object subproperties and array items) are not observable. Instead, either rewrite the whole object, or call [`requestUpdate`](methods#requestupdate) after a mutation.

```js
// Option 1: Rewrite whole object, triggering an update
this.prop1 = Object.assign({}, this.prop1, { subProp: 'data' });

// Option 2: Mutate a subproperty, then call requestUpdate
this.prop1.subProp = 'data';
this.requestUpdate();
```

{% include project.html folder="docs/lifecycle/subproperties" %}

**Update in response to something that isn't a property change**

Call [`requestUpdate`](methods#requestupdate):

```js
// Request an update in response to an event
this.addEventListener('load-complete', async (e) => {
  console.log(e.detail.message);
  console.log(await this.requestUpdate());
});
```

{% include project.html folder="docs/lifecycle/shouldupdate" %}

<a id="request">

### [Request an update](#request)

**Request an update regardless of property changes**

Call [`requestUpdate()`](methods#requestupdate):

```js
this.requestUpdate();
```

**Request an update for a specific property**

Call [`requestUpdate(propName, oldValue)`](methods#requestupdate):

```js
let oldValue = this.prop1;
this.prop1 = 'new value';
this.requestUpdate('prop1', oldValue);
```

{% include project.html folder="docs/lifecycle/requestupdate" %}

<a id="respond">

### [Respond to an update](#respond)

**Do something after the first update**

Implement [`firstUpdated`](methods#firstupdated): 

```js
firstUpdated(changedProps) {
  console.log(changedProps.get('prop1'));
}
```

{% include project.html folder="docs/lifecycle/firstupdated" %}

**Do something after every update**

Implement [`updated`](methods#updated):

```js
updated(changedProps) {
  console.log(changedProps.get('prop1'));
}
```

{% include project.html folder="docs/lifecycle/updated" %}

**Do something when the element next updates**

Await the [`updateComplete`](methods#updatecomplete) promise:

```js
await updateComplete;
// do stuff
```

```js
updateComplete.then(() => {
  // do stuff
});
```

**Wait for an element to finish updating**

Await the [`updateComplete`](methods#updatecomplete) promise:

```js
let done = await updateComplete;
```

```js
updateComplete.then(() => {
  // finished updating
});
```

{% include project.html folder="docs/lifecycle/updatecomplete" %}


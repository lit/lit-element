---
layout: post
section: docs
topic: templates
subtopic: databinding
---

**On this page:**

* [Bind to text content](#text)
* [Bind to an attribute](#attribute)
* [Bind to a Boolean attribute](#boolean)
* [Bind to a property](#property)
* [Bind to an event handler](#eventhandler)

You can insert JavaScript expressions as placeholders for HTML text content, attributes, Boolean attributes, properties, and event handlers.

* Text content: `<p>${...}</p>`
* Attribute: `<p id="${...}"></p>`
* Boolean attribute: `?checked="${...}"`
* Property: `.value="${...}"`
* Event handler: `@event="${...}"`

JavaScript expressions can include your element's properties. LitElement observes and reacts to property changes, so your templates update automatically.

Data bindings are always one-way (parent to child). To share data from a child element to its parent, use events.

<a id="text">

### [Bind to text content](#text)

Bind `prop1` to text content:

```js
html`<div>${this.prop1}</div>`
```

<a id="attribute">

### [Bind to an attribute](#attribute)

Bind `prop2` to an attribute:

```js
html`<div id="${this.prop2}"></div>`
```

Attribute values are always strings, so an attribute binding should return a value that can be converted into a string.

<a id="boolean">

### [Bind to a boolean attribute](#boolean)

Bind `prop3` to a boolean attribute: 

```js
html`<input type="checkbox" ?checked="${this.prop3}">i like pie</input>`
```

Boolean attributes are added if the expression evaluates to a truthy value, and removed if it evaluates to a falsy value.

<a id="property">

### [Bind to a property](#property)

Bind `prop4` to a property:

```js
html`<input type="checkbox" .value="${this.prop4}"/>`
```

### [Bind to an event handler](#eventhandler)

Bind `clickHandler` to a `click` event:

```js
html`<button @click="${this.clickHandler}">pie?</button>`
```

The default event context for `@event` expressions is `this`, so there is no need to bind the handler function.

### Examples

_my-element.js_

```js
{% include projects/docs/templates/databinding/my-element.js %}
```

{% include project.html folder="docs/templates/databinding" openFile="my-element.js" %}

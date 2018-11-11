---
layout: post
section: docs
topic: templates
subtopic: expressions
---

**On this page:**

* [Add properties to a template](#properties)
* [Use loops in a template](#loops)
* [Use conditionals in a template](#conditionals)
* [Examples](#examples)

<a id="properties">

### [Add properties to a template](#properties)

To add a property value to a template, insert it with `${this.propName}`:

```js
static get properties() {
  return { myProp: String };
}
...
render() { 
  return html`<p>${this.myProp}</p>`; 
}
```

See also: 

* [Bind data to child element properties and attributes](databinding)
* [Work with properties](../properties)

<a id="loops">

### [Use loops in a template](#loops)

Iterate over an array:

```js
html`<ul>
  ${this.myArray.map(i => html`<li>${i}</li>`)}
</ul>`;
```

See also: 

* [Compose templates from other templates](compose)
* [Bind data to child element properties and attributes](databinding)

<a id="conditionals">

### [Use conditionals in a template](#conditionals)

Render based on a Boolean condition:

```js
html`
  ${this.myBool?
    html`<p>Render some HTML if myBool is true</p>`:
    html`<p>Render some other HTML if myBool is false</p>`}
`;
```

### [Examples](#examples)

```js
{% include projects/docs/templates/expressions/my-element.js %}
```

{% include project.html folder="docs/templates/expressions" openFile="my-element.js" %}

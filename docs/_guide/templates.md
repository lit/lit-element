---
layout: post
title: Templates
slug: templates
---

{::options toc_levels="1..3" /}
* ToC
{:toc}

## Define and render a template

To define a template for a LitElement component, write a `render` function for your element class:

```js
class MyElement extends LitElement {
  render() {
    return html`<p>template content</p>`;
  }
}
```

* Write your template in HTML inside a JavaScript template literal by enclosing the raw HTML in back-ticks (<code>``</code>). 

* Tag your template literal with the `html` helper function, so that `render` returns a lit-html `TemplateResult`.

Example

```js
{% include projects/docs/templates/define/my-element.js %}
```

{% include project.html folder="docs/templates/define" openFile="my-element.js" %}

### Design a performant template

LitElement renders and re-renders asynchronously, updating in response to batched property changes (see [Element update lifecycle](#lifecycle) for more information).

During an update, only the parts of the DOM that change are re-rendered. To get the performance benefits of this model, you should **design your element's template as a pure function of its properties**.

To do this, make sure the `render` function:

* Does not change the element's state.
* Does not have any side effects.
* Only depends on the element's properties.
* Returns the same result when given the same property values.

Also, avoid making DOM updates outside of `render`. Instead, express the element's template as a function of its state, and capture its state in properties. 

The following code uses inefficient DOM manipulation:

_dom-manip.js_

```text
// Anti-pattern. Avoid!

constructor() {
  super();
  this.addEventListener('stuff-loaded', (e) => {
    this.shadowRoot.getElementById('message').innerHTML=e.detail;
  });
  this.loadStuff();
}
render() {
  return html`
    <p id="message">Loading</p>
  `;
}
```

We can improve the template by capturing the load message as a property, and setting the property in response to the event:

_update-properties.js_

```js
constructor() {
  super();
  this.message = 'Loading';
  this.addEventListener('stuff-loaded', (e) => { this.message = e.detail } );
  this.loadStuff();
}
render() {
  return html`
    <p>${this.message}</p>
  `;
}
```

{% include project.html folder="docs/templates/design" openFile="update-properties.js" %}

### Use properties, loops, and conditionals in a template

#### Properties

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

#### Loops

Iterate over an array:

```js
html`<ul>
  ${this.myArray.map(i => html`<li>${i}</li>`)}
</ul>`;
```

#### Conditionals

Render based on a Boolean condition:

```js
html`
  ${this.myBool?
    html`<p>Render some HTML if myBool is true</p>`:
    html`<p>Render some other HTML if myBool is false</p>`}
`;
```

#### Examples

```js
{% include projects/docs/templates/expressions/my-element.js %}
```

{% include project.html folder="docs/templates/expressions" openFile="my-element.js" %}

### Bind properties to child elements

You can insert JavaScript expressions as placeholders for HTML text content, attributes, Boolean attributes, properties, and event handlers.

* Text content: `<p>${...}</p>`
* Attribute: `<p id="${...}"></p>`
* Boolean attribute: `?checked="${...}"`
* Property: `.value="${...}"`
* Event handler: `@event="${...}"`

JavaScript expressions can include your element's properties. LitElement observes and reacts to property changes, so your templates update automatically.

Data bindings are always one-way (parent to child). To share data from a child element to its parent, fire an event and capture the relevant data in the `detail` property.

#### Bind to text content

Bind `prop1` to text content:

```js
html`<div>${this.prop1}</div>`
```

#### Bind to an attribute

Bind `prop2` to an attribute:

```js
html`<div id="${this.prop2}"></div>`
```

Attribute values are always strings, so an attribute binding should return a value that can be converted into a string.

#### Bind to a boolean attribute

Bind `prop3` to a boolean attribute: 

```js
html`<input type="checkbox" ?checked="${this.prop3}">i like pie</input>`
```

Boolean attributes are added if the expression evaluates to a truthy value, and removed if it evaluates to a falsy value.

#### Bind to a property

Bind `prop4` to a property:

```js
html`<input type="checkbox" .value="${this.prop4}"/>`
```

#### Bind to an event handler

Bind `clickHandler` to a `click` event:

```js
html`<button @click="${this.clickHandler}">pie?</button>`
```

The default event context for `@event` expressions is `this`, so there is no need to bind the handler function.

#### Examples

_my-element.js_

```js
{% include projects/docs/templates/databinding/my-element.js %}
```

{% include project.html folder="docs/templates/databinding" openFile="my-element.js" %}

### Render light DOM children with the slot element

#### Shadow DOM vs light DOM

Since the introduction of shadow DOM, we use the term "light DOM" to refer to nodes that appear in the main DOM tree.

By default, if a custom element has light DOM children in HTML, they do not render at all:

```html
<my-element>
  <p>I won't render</p>
</my-element>
```

You can make them render using the [`<slot>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot). 

#### Use the `slot` element

To render an element's light DOM children, create a `<slot>` for them in the element's template. For example:

```js
render(){
  return html`
    <div>
      <slot></slot>
    </div>
  `;
}
```

Light DOM children will now render in the `<slot>`:

```html
<my-element>
  <p>Render me</p>
</my-element>
```

Arbitrarily many light DOM children can populate a single slot:

```html
<my-element>
  <p>Render me</p>
  <p>Me too</p>
  <p>Me three</p>
</my-element>
```

{% include project.html folder="docs/templates/slots" openFile="my-element.js" %}

#### Use named slots

To assign a light DOM child to a specific slot, ensure that the child's `slot` attribute matches the slot's `name` attribute:

```js
render(){
  return html`
    <div>
      <slot name="one"></slot>
    </div>
  `;
}
```

_index.html_

```html
<my-element>
  <p slot="one">Include me in slot "one".</p>
</my-element>
```

* **Named slots only accept light DOM children with a matching `slot` attribute.**

  For example, `<slot name="one"></slot>` only accepts children with the attribute `slot="one"`.

* **Light DOM children with a `slot` attribute will only be placed in a slot with a matching `name` attribute.**

  For example, `<p slot="one">...</p>` will only be placed in `<slot name="one"></slot>`.

**Examples**

_my-element.js_

```js
{% include project.html folder="projects/docs/templates/namedslots/my-element.js" %}
```

_index.html_

```html
{% include project.html folder="projects/docs/templates/namedslots/index.html" %}
```

{% include project.html folder="docs/templates/namedslots" openFile="my-element.js" %}

**Use `name`, not `id`, to select slots.**

Note that a `slot`'s `id` attribute has no effect!

_my-element.js_

```js
render(){
  return html`
    <div>
      <slot id="one"></slot>
    </div>
  `;
}
```

_index.html_

```html
<my-element>
  <p slot="one">nope.</p>
  <p>ohai..</p>
</my-element>
```

{% include project.html folder="docs/templates/slotid" openFile="my-element.js" %}

## Compose a template from other templates

You can compose LitElement templates from other LitElement templates. In the following example, we compose a template for an element called `<my-page>` from smaller templates for the standard HTML elements `<header>`, `<article>`, and `<footer>`:

```js
class MyPage extends LitElement {
  render() {
    return html`
      ${this.headerTemplate}
      ${this.articleTemplate}
      ${this.footerTemplate}
    `;
  }
  static get headerTemplate() {
    return html`<header>header</header>`;
  }
  static get articleTemplate() {
    return html`<article>article</article>`;
  }
  static get footerTemplate() {
    return html`<footer>footer</footer>`;
  }
}
```

{% include project.html folder="docs/templates/compose" openFile="my-page.js" %}

You can also compose templates by importing other elements and using them in your template:

```js
import './my-header.js';
import './my-article.js';
import './my-footer.js';

class MyPage extends LitElement {
  render() {
    return html`
      <my-header></my-header>
      <my-article></my-article>
      <my-footer></my-footer>
    `;
  }
}
```

{% include project.html folder="docs/templates/composeimports" openFile="my-page.js" %}

## Specify the render root

The node into which your component's template will render is called its **render root**.

By default, LitElement creates an open `shadowRoot` and renders inside it, producing the following DOM structure:

```text
<my-element>
  #shadow-root
    <p>child 1</p>
    <p>child 2</p>
```

To customize a component's render root, implement `createRenderRoot` and return the node you want the template to render into. 

For example, to render the template into the main DOM tree as your element's light DOM:

```text
<my-element>
  <p>child 1</p>
  <p>child 2</p>
```

Implement `createRenderRoot` and return `this`:

```js
class LightDom extends LitElement {
  render() {
    return html`
      <p>This template renders in light DOM.</p>
    `;
  }
  createRenderRoot() {
  /**
   * Render template in light DOM. Note that shadow DOM features like 
   * encapsulated CSS are unavailable.
   */
    return this;
  }
}
```

{% include project.html folder="docs/templates/renderroot" openFile="my-element.js" %}

## Template syntax cheat sheet

#### Render

```js
render() { return html`<p>template</p>`; }
```

#### Properties, loops, conditionals

```js
// Property
html`<p>${this.myProp}</p>`;

// Loop 
html`${this.myArray.map(i => html`<li>${i}</li>`;)}`;

// Conditional
html`${this.myBool?html`<p>foo</p>`:html`<p>bar</p>`}`;
```

#### Data bindings

```js
// Attribute
html`<p id="${...}">`;

// Boolean attribute
html`<input type="checkbox" ?checked="${...}">`;

// Property
html`<input .value="${...}">`;

// Event handler 
html`<button @click="${this.doStuff}"></button>`;
```

#### Composition

```js
// From multiple templates on same class

render() {
  return html`
    ${this.headerTemplate}
    <article>article</article>
  `;
}
static get headerTemplate() {
  return html`<header>header</header>`;
}
```

```js
// By importing elements
import './my-header.js';

class MyPage extends LitElement{
  render() {
    return html`
      <my-header></my-header>
      <article>article</article>
    `;
  }
}
```

#### Slots

```js
render() { return html`<slot name="thing"></slot>`; }
```

```html
<my-element>
  <p slot="thing">stuff</p>
</my-element>
```

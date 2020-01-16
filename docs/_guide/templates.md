---
layout: guide
title: Templates
slug: templates
---

{::options toc_levels="1..3" /}
* ToC
{:toc}

Add a template to your component to define internal DOM to implement your component. 

To encapsulate the templated DOM LitElement uses
[shadow DOM](https://developers.google.com/web/fundamentals/web-components/shadowdom). 
Shadow DOM provides three benefits:

* DOM scoping. DOM APIs like `document.querySelector` won't find elements in the 
  component's shadow DOM, so it's harder for global scripts to accidentally break your component.
* Style scoping. You can write encapsulated styles for your shadow DOM that don't 
  affect the rest of the DOM tree.
* Composition. The component's shadow DOM (managed by the component) is separate from the component's children. You can choose how children are rendered in your templated DOM. Component users can add and remove children using standard DOM APIs without accidentally breaking anything in your shadow DOM.

Where native shadow DOM isn't available, LitElement 
uses the [Shady CSS](https://github.com/webcomponents/polyfills/tree/master/packages/shadycss) polyfill.


## Define and render a template

To define a template for a LitElement component, write a `render` function for your element class:

```js
import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  render() {
    return html`<p>template content</p>`;
  }
}
```

*   Write your template in HTML inside a JavaScript [template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) by enclosing the raw HTML in back-ticks 
    (<code>``</code>). 


*   Tag your template literal with the [`html`](https://lit-html.polymer-project.org/api/modules/lit_html.html#html) 
    tag function. 

*   The component's `render` method can return anything that lit-html can render. Typically, it 
    returns a single `TemplateResult` object (the same type returned by the `html` tag function).

Example

```js
{% include projects/docs/templates/define/my-element.js %}
```

{% include project.html folder="docs/templates/define" openFile="my-element.js" %}

LitElement uses lit-html templates; this page summarizes the features of lit-html templates,
for more details, see [Writing templates](https://lit-html.polymer-project.org/guide/writing-templates)
and the [Template syntax reference](https://lit-html.polymer-project.org/guide/template-reference) 
in the lit-html documentation.

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

When defining your element's template, you can bind the element's properties to the 
template; the template is re-rendered whenever the properties change.

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

### Bind properties to templated elements

You can insert JavaScript expressions as placeholders for HTML text content, attributes, Boolean attributes, properties, and event handlers.

* Text content: `<p>${...}</p>`
* Attribute: `<p id="${...}"></p>`
* Boolean attribute: `?disabled="${...}"`
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
html`<input type="text" ?disabled="${this.prop3}">`
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

### Render children with the slot element {#slots}

Your component may accept children (like a `<ul>` element can have `<li>` children). 

```html
<my-element>
  <p>A child</p>
</my-element>
```
By default, if an element has a shadow tree, its children don't render at all. 

To render children, your template needs to include one or more [`<slot>` elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot), which act as placeholders for child nodes. 

#### Use the `slot` element

To render an element's children, create a `<slot>` for them in the element's template. For example:

```js
render(){
  return html`
    <div>
      <slot></slot>
    </div>
  `;
}
```

Children will now render in the `<slot>`:

```html
<my-element>
  <p>Render me</p>
</my-element>
```

The children aren't _moved_ in the DOM tree, but they're rendered _as if_ they were children of the `<slot>`.

Arbitrarily many children can populate a single slot:

```html
<my-element>
  <p>Render me</p>
  <p>Me too</p>
  <p>Me three</p>
</my-element>
```

{% include project.html folder="docs/templates/slots" openFile="my-element.js" %}

#### Use named slots

To assign a child to a specific slot, ensure that the child's `slot` attribute matches the slot's `name` attribute:

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

* **Named slots only accept children with a matching `slot` attribute.**

  For example, `<slot name="one"></slot>` only accepts children with the attribute `slot="one"`.

* **Children with a `slot` attribute will only be rendered in a slot with a matching `name` attribute.**

  For example, `<p slot="one">...</p>` will only be placed in `<slot name="one"></slot>`.

**Examples**

_my-element.js_

```js
{% include projects/docs/templates/namedslots/my-element.js %}
```

_index.html_

```html
{% include projects/docs/templates/namedslots/index.html %}
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
  get headerTemplate() {
    return html`<header>header</header>`;
  }
  get articleTemplate() {
    return html`<article>article</article>`;
  }
  get footerTemplate() {
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

## Specify the render root {#renderroot}

The node into which your component's template will render is called its **render root**.

By default, LitElement creates an open `shadowRoot` and renders inside it, producing the following DOM structure:

```text
<my-element>
  #shadow-root
    <p>child 1</p>
    <p>child 2</p>
```

To customize a component's render root, implement `createRenderRoot` and return the node you want the template to render into.

For example, to render the template into the main DOM tree as your element's children:

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
      <p>This template renders without shadow DOM.</p>
    `;
  }
  createRenderRoot() {
  /**
   * Render template without shadow DOM. Note that shadow DOM features like 
   * encapsulated CSS and slots are unavailable.
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
html`${this.myArray.map(i => html`<li>${i}</li>`)}`;

// Conditional
html`${this.myBool?html`<p>foo</p>`:html`<p>bar</p>`}`;
```

#### Data bindings

```js
// Attribute
html`<p id="${...}">`;

// Boolean attribute
html`<input type="text" ?disabled="${...}">`;

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
get headerTemplate() {
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

## Using other lit-html features

Since LitElement uses the lit-html `html` tag function to define templates you can take advantage
of the entire lit-html feature set for writing your templates. This includes lit-html _directives_, 
special functions that customize the way lit-html renders a binding.

To import features directly from lit-html, your project should add lit-html as a direct dependency.
We recommend using the widest practical version range for lit-html, to minimize the chance of npm
installing two different versions of lit-html:

```bash
npm i lit-element@^2.0.0
npm i lit-html@^1.0.0
```

### Import and use a lit-html directive

You can import and use a lit-html directive and use it as shown in the [lit-html documentation](https://lit-html.polymer-project.org/guide/template-reference#built-in-directives).

```js
import { LitElement, html } from 'lit-element';
import { until } from 'lit-html/directives/until.js';

const content = fetch('./content.txt').then(r => r.text());

html`${until(content, html`<span>Loading...</span>`)}`
```

For a list of directives supplied with lit-html, see [Built-in directives](https://lit-html.polymer-project.org/guide/template-reference#built-in-directives) in the Template syntax reference.


## Resources

For more information on shadow DOM:

* [Shadow DOM v1: Self-Contained Web Components](https://developers.google.com/web/fundamentals/web-components/shadowdom) on Web Fundamentals.
* [Using shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) on MDN.

For more information on lit-html templates:

* [Writing templates](https://lit-html.polymer-project.org/guide/writing-templates)
* [Template syntax reference](https://lit-html.polymer-project.org/guide/template-reference)


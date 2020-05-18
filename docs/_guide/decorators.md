---
layout: guide
title: Using decorators
slug: decorators
---

Decorators are special declarations that you can use when defining classes, class methods, and class fields. LitElement supplies a set of decorators that reduce the amount of boilerplate code you need to write when defining a component. 

For example, the `customElement` and `property` decorators make a basic element definition more compact:

```js
import {LitElement, html, customElement, property} from 'lit-element';

@customElement('my-element')
class MyElement extends LitElement {

 // Declare observed properties
 @property()
 adjective = 'awesome';

 // Define the element's template
 render() {
   return html`<p>your ${this.adjective} template here</p>`;
 }
}
```

## Enabling decorators

To use decorators, you need to use a compiler such as Babel or the TypeScript compiler.

<div class="alert alert-info">

**The decorators proposal**. Decorators are a stage 2 proposal for addition to the ECMAScript standard, which means they're not implemented in browsers yet. Compilers like Babel provide support for proposed features like decorators by compiling them into JavaScript a browser can run.

</div>

### To use decorators with TypeScript

To use decorators with TypeScript, enable the `experimentalDecorators` compiler option.

```json
"experimentalDecorators": true,
```

Enabling `emitDecoratorMetadata` is not required and not recommended.

### To use decorators with JavaScript

If you're  JavaScript with Babel, you can enable decorators by adding  the following plugins:

*   [`@babel/plugin-proposal-decorators`](https://babeljs.io/docs/en/babel-plugin-proposal-decorators). 
*   [`@babel/plugin-proposal-class-properties`](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties)

To enable the plugins, you'd add code like this to your Babel configuration:

```js
plugins = [
  '@babel/plugin-proposal-class-properties',
  ['@babel/proposal-decorators', {decoratorsBeforeExport: true}],
];
```

## LitElement decorators

LitElement provides the following decorators:

*   <code>[customElement](https://lit-element.polymer-project.org/api/modules/_lit_element_.html#customelement)</code>. Define a custom element.
*   <code>[eventOptions](https://lit-element.polymer-project.org/api/modules/_lit_element_.html#eventoptions)</code>. Add event listener options to a listener added in your template.
*   <code>[property](https://lit-element.polymer-project.org/api/modules/_lit_element_.html#property)</code> and <code>[internalProperty](https://lit-element.polymer-project.org/api/modules/_lit_element_.html#internalproperty)</code>. Define properties.
*   <code>[query](https://lit-element.polymer-project.org/api/modules/_lit_element_.html#query)</code>, <code>[queryAll](https://lit-element.polymer-project.org/api/modules/_lit_element_.html#queryAll)</code>, and <code>[queryAsync](https://lit-element.polymer-project.org/api/modules/_lit_element_.html#queryAsync). </code>Create a property getter that returns specific elements from your component's render root.
*   <code>[queryAssignedNodes](https://lit-element.polymer-project.org/api/modules/_lit_element_.html#queryAssignedNodes)</code>. Create a property getter that returns the children assigned to a specific slot. 


All of the decorators can be imported directly from the <code>lit-element</code> module.

```js
import {eventOptions} from 'lit-element';
```



## Other document updates

<<<The following sections belong  in the individual chapters.>>>


### customElement

<<<Maybe add this to the to-be-written Writing Components Overview>>>

Use the `customElement` decorator on your component class to define a custom element:

```js
@customElement('my-element)
export class MyElement extends LitElement { ... }
```

The `customElement` decorator takes the place of calling `customElements.define`.


### Setting event listener options

<<<add this to the events chapter, probably a new H2 section after "Where to add your event listeners.">>>

When you add an event listener imperatively, using `addEventListener`, you can specify various event listener options. For example, to use a capture phase event listener in plain JavaScript you'd do something like this:

```js
someElement.addEventListener('click', this._clickHandler, {capture: true});
```

The `eventOptions` decorator allows you to add event listener options to a listener that's added declaratively in your template.

```js
@eventOptions({capture: true})
_clickHandler() { ... }

render() { 
  return html`
    <button @click=${this._clickHandler}>Click me!</button>
  `;
}
```

The object passed to `eventOptions` is used as the `options` parameter to `addEventListener`.

More information:

*   [EventTarget.addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) on MDN for a description of the event listener options.


### property and internalProperty

<<<The properties chapter already includes property, need to integrate the description of `internalProperty` there ... Unless this is a sufficiently rare use case that it doesn't need to be in the main Properties guide? >>>

Use the `property` and `internalProperty` decorators to declare properties (instead of the static `properties` property).

Use the `property` decorator to declare properties:

```js
@property({type: String})
mode = 'auto';

@property({attribute: false})
data = {};
```

Use `internalProperty` for private or protected properties that should trigger an update cycle. Properties declared with `internalProperty` shouldn't be referenced from outside the component.

```
@internalProperty()
_active = false;
```

The `internalProperty` decorator sets `attribute` to false; the only option you can specify for an
internal property is the `hasChanged` function.

The `internalProperty` decorator can serve as a hint to a code minifier that the property name can be changed during minification.

### query, queryAll, and queryAsync

<<<Maybe add this section to the Templates chapter, as part of a new section on retrieving nodes from the templated DOM (https://github.com/Polymer/lit-element/issues/886). >>>

The `query`, `queryAll`, and `queryAsync` decorators all provide a convenient way to access nodes in the component's render root.

The `query` decorator modifies a class property, turning it into a getter that returns a node from the render root.

```js
class MyElement {
  @query('#first')
  first;

  render() {
    return html`
      <div id="first"></div>
      <div id="second"></div>
    `;
  }
}
```


This decorator is equivalent to:
 
```js
get first() {
  return this.renderRoot.querySelector('#first');
}
```

The `queryAll` decorator is identical to `query` except that it returns all matching nodes, instead of a single node. It's the equivalent of calling `querySelectorAll`.


```js
class MyElement {
  @queryAll('div')
  divs;

  render() {
    return html`
      <div id="first"></div>
      <div id="second"></div>
    `;
  }
}
```


Here, `divs` would return both `<div>` elements in the template. For TypeScript, the typing of a `queryAll` property is `NodeListOf<HTMLElement>`. If you know exactly what kind of nodes you'll retrieve, the typing can be more specific:


```
@queryAll('button')
buttons!: NodeListOf<HTMLButtonElement>
```


The exclamation point (`!`) after `buttons` is TypeScript's [non-null assertion operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator). It tells the compiler to treat `buttons` as always being defined, never `null` or `undefined`.

Finally, `queryAsync` works like `query`, except that instead of returning a node directly, it returns a `Promise` that resolves to that node. External code can use this instead of waiting for the `updateComplete `promise. 

This is useful, for example, if the node returned by `queryAsync` can change as a result of another property change. 

More information:

*   [Element.querySelector()](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector) on MDN.
*   [Element.querySelectorAll()](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll) on MDN.


### queryAssignedNodes

<<<Probably also belongs in the Template chapter.>>>

The `queryAssignedNodes` decorator converts a class property into a getter that returns all of the assigned nodes for a given slot in the component's shadow tree. 

```js
// First argument is the slot name
// Second argument is `true` to flatten the assigned nodes.
@queryAssignedNodes('header', true)
headerNodes;

// If the first argument is absent or an empty string, lists nodes for the default slot.
@queryAssignedNodes()
defaultSlotNodes;
```

The first example above is equivalent to the following code:

```js
get headerNodes() {
  const slot = this.shadowRoot.querySelector('slot[name=header]');
  return slot.assignedNodes({flatten: true});
}
```

For TypeScript, the typing of a `queryAssignedNodes` property is `NodeListOf<HTMLElement>`.

For more information:

*   [HTMLSlotElement.assignedNodes()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/assignedNodes) on MDN.

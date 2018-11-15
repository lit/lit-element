---
layout: post
section: docs
topic: templates
subtopic: syntax
---

**Render**

```js
render() { return html`<p>template</p>`; }
```

**Properties, loops, conditionals**  

```js
// Property
html`<p>${this.myProp}</p>`;

// Loop 
html`${this.myArray.map(i => html`<li>${i}</li>`;)}`;

// Conditional
html`${this.myBool?html`<p>foo</p>`:html`<p>bar</p>`}`;
```

**Data bindings**

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

**Composition**

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

**Slots**

```js
render() { return html`<slot name="thing"></slot>`; }
```

```html
<my-element>
  <p slot="thing">stuff</p>
</my-element>
```

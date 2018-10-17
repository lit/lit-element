---
layout: post
---

DONE: Create skeleton

TODO: Needs product manager input

lit-element is a lightweight library for creating custom elements. 

**Create fast, lightweight, reusable web components that work in any web page:**

```js
class MyElement extends LitElement{
  // implemnt MyElement
}
```

```html
<my-element></my-element>
```

**Write templates in plain HTML:**

```js
render(){ 
  return html`<p>My element</p>`;
}
```

**Use simple JavaScript expressions to include properties, logic, and event handlers:**

```js
render(){ 
  return html`
    <!-- element property -->
    <p>${this.myProp}</p>

    <!-- loop -->
    <ul>${myArray.map(i => html`<li>${i}</li>`)}</ul>

    <!-- conditional -->
    <div>${myBool?html`<p>true</p>`:html`<p>false</p>`}</div>

    <!-- event handler -->
    <button @click="${(e) => this.doStuff(e)}"></button>
  `;
}
```

Learn more:

* [Try lit-element](/try/) without intalling anything.
* [Install lit-element locally](/tools/setup).
* [See the API documentation.](/api/).

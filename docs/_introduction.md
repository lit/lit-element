---
layout: post
title: Introducing lit-element
---

lit-element is a light-weight library for creating custom elements with lit-html.

Making custom elements is easy with lit-element:

* [Write element templates in plain HTML.](introduction/)
* [React to property changes.](changes)
* [Use simple JavaScript expressions for loops and conditionals.](expressions)
* [Add event listeners in plain HTML.](listeners)

<a id="plain"></a>

## Write element templates in plain HTML

Write your element templates in plain HTML. Use JavaScript expressions to insert data:

```js
//custom-element.js 

render(){
  return html`
    <h1>${this.headingText}</h1>
  `;
}
```

<a id="changes"></a>

## React to property changes

Create custom elements that update on property changes. lit-element creates DOM once, then re-renders only the stuff that changed - making DOM updates lightning-fast.

```js
static get properties(){
  return {
    myProp: String
  }  
}
constructor(){
  super();
  this.myProp='there';
  this.setTimeout(() => {
    this.myProp='world';
  }, 3000);
}
render(){
  return html`
    <p>hello ${this.myProp}</p>
  `;
}
```

<a id="expressions"></a>

## Use simple JavaScript expressions for loops and conditionals

Handling conditionals and loops in your lit-element templates is easy. No special annotations, just plain JavaScript expressions:

```js
render(){
  return html`
    <ul>
      ${myArray.map(i => html`<li>${i}</li>`)}
    </ul>
    ${myBool?
      html`<p>Render some HTML if myBool is true</p>`:
      html`<p>Render some other HTML if myBool is false</p>`}
  `;
}
```


<a id="listeners"></a>

## Add event listeners in plain HTML

Use JavaScript expressions to add event listeners in plain HTML:

```js
render({}){
  return html`
    <button on-click="${(e) => this._clickHandler(e)}"></button>
  `;
}
_clickHander(e){
  console.log(e.detail);
}
```


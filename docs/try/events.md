---
layout: post
title: Use event handlers in templates
parent: /try/
next: /try/style
nexttitle: Style
prev: /try/expressions
prevtitle: Write loops and conditionals
type: task
---

Use lit-html's `@event` notation to add an event handler to an element inside a template. For example:

Print `click` events for a button to the console:

```js
render(){
  return html`
    <button @click="${(e) => console.log(e)}">click me</button>
  `;
}
```

Send `click` events for a button to a method on your element:

```js
doStuff(e){
  console.log(e);
  console.log(e.detail);
  console.log(e.target.id);
}
render(){
  return html`
    <button @click="${(e) => this.doStuff(e)}">click me</button>
  `;
}
```

_custom-element.js_
```js
import { LitElement, html } from '@polymer/lit-element';

class CustomElement extends LitElement {  
  render(){
    return html`
      <p>check the console</p>
      <button 
        id="mybutton" 
        @click="${(event) => this.clickHandler(event)}">click</button>
    `;
  }
  clickHandler(event){
    console.log(event.target.id + ' was clicked.');
  }
}

customElements.define('custom-element', CustomElement);
```

{% include project.html folder="try/events" openFile="custom-element.js" %}

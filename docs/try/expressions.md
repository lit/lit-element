---
layout: post
title: Write loops and conditionals with simple JavaScript expressions
parent: /try/
next: /try/events
nexttitle: Use event handlers
prev: /try/props
prevtitle: Use properties
type: task
---

Handling conditionals and loops in your lit-element templates is easy. No special annotations, just plain JavaScript expressions:

```js
render(){
  return html`
    <ul>
      ${this.myArray.map(i => html`<li>${i}</li>`)}
    </ul>
    ${this.myBool?
      html`<p>Render some HTML if myBool is true</p>`:
      html`<p>Render some other HTML if myBool is false</p>`}
  `;
}
```

{% include project.html folder="try/expressions" openFile="custom-element.js" %}

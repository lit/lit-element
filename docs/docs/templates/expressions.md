---
layout: post
section: docs
topic: templates
subtopic: expressions
---

Use plain JavaScript expressions in a LitElement template to handle loops, conditionals, data binding, and composition.

## Loops

Iterate over an array:

```js
html`<ul>
  ${myArray.map(i => html`<li><a href="${i.url}">${i.title}</a></li>`)}
</ul>`;
```


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

## Conditionals

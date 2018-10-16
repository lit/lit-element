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

## Add event listeners in plain HTML

Use JavaScript expressions to add event listeners in plain HTML:

```js
render(){
  return html`
    <button on-click="${(event) => this.clickHandler(event)}"></button>
  `;
}
clickHander(event){
  console.log(event.detail);
}
```

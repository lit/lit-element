To declare custom element properties with lit-element, add a static `properties` getter to your custom element class:

```js
static get properties(){
  return {
    myString: String,
    myObject: Object
  };
}
```

You can supply any of the properties declared in the static `properties` getter to the element's `_render` function. Use JavaScript expressions to insert property values into an HTML template:

```js
_render({myString, myObject}){
  return html`
    <h1>${myString}</h1>
    <p>myObject.prop1: ${myObject.prop1}</p>
    <p>myObject.prop2: ${myObject.prop2}</p>
  `;
}
```

<div class="note">

**You must declare a property in the `properties` getter AND supply the property name to `_render` in order to use the property value in template markup.**

If you forget to supply the property name to `_render`, you may see something like the following error message: 

```text
ReferenceError: myString is not defined at HTMLElement.CustomElement._render
```

</div>

lit-element automatically observes all of the properties you declare in the static `properties` getter, and efficiently renders the changes in DOM.

You can initialize property values for a lit-element:

* From the element's constructor
* From markup in an HTML document that imports the element
* From a data binding inside another lit-element
* From a script that accesses the lit-element in DOM

## Initialize a property from a lit-element constructor

To initialize a property from a lit-element constructor:

<div class="caption">my-element.js</div>

```js
constructor(){
  super();
  this.myString='initial value';
  this.myObject= { prop1: 'stuff', prop2: 'blah' }
}
```

<div class="note">

**Always initialize object and array properties in the constructor if their subproperties or items are used in an HTML template.** It's fine to initialize objects to the empty object (`{}`), and arrays to the empty array (`[]`); but they must be initialized. For example, if `myObject.prop1` and `anotherObject.myArray[x]` are used in an element template, initialize them as follows:

```js
static get properties(){
  return {
    myObject: Object;
    anotherObject: Object;
  }
}
constructor(){
  // myObject.prop1 is used in this template, 
  // so initialize myObject
  this.myObject={};

  // anotherObject.myArray[0-n] are used in this template, 
  // so initialize anotherObject.myArray
  this.anotherObject={
    myArray: []
  };
}
_render({myObject, anotherObject}){
  return html`
    <p>${myObject.prop1}</p>
    <ul>
      ${anotherObject.myArray.map(i=>`<li>${i}</li>`)}
    </ul>
  `;
}
```
</div>

## Initialize a property from markup in an HTML document

To provide a value for an element's declared `String` or `Number` property when the element is used in an HTML document, include the value as a string:

<div class="caption">index.html</div>

```html
<script type="module" src="/my-element.js"></script>

<my-element myString="stuff"></my-element>
<my-element myNumber="8"></my-element>
```

To provide a value for an element's declared `Boolean` property when the element is used in an HTML document:

<div class="caption">index.html</div>

```html
<script type="module" src="/my-element.js"></script>

<!-- Initialize myBool to true -->
<my-element myBool></my-element>

<!-- Initialize myBool to false -->
<my-element></my-element>
```

<div class="note">

**Only `String`, `Number` and `Boolean` properties can be initialized by supplying strings in HTML.** For performance reasons, lit-element does not support supplying Object or Array property values via strings in HTML markup. See [] for alternatives.

</div>

## Initialize a property from a data binding in another lit-element template

From inside another lit-element template, you can provide values to a lit-element with data bindings using JavaScript expressions:

```js
import {LitElement, html} from '@polymer/lit-element';
import './my-element.js';

class SomeElement extends LitElement {
  ...
  _render({prop1, prop2}){
    return html`
      <my-element myprop="${prop1}"></my-element>
    `;
  }
}
customElement.define('some-element', SomeElement);
```

<div class="note">

**Supplying object and array property values with JavaScript expressions is...???**

```js
import {LitElement, html} from '@polymer/lit-element';
import './my-element.js';

class SomeElement extends LitElement {
  /*
   * Is this okay?
  */
  _render({myObject}){
    return html`
      <my-element prop="${myObject}"></my-element>
    `;
  }
}
customElement.define('some-element', SomeElement);
```

</div>

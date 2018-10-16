For performance reasons, lit-element does not support deserializing object and array properties via attributes in markup. 

Here's how we recommend you initialize array and object properties:

## Set object properties directly instead of passing them via attributes

Instead of passing stringified object and array properties via attributes in markup, set object and array properties directly:

**main-app.js**

```js
_render({}){
  return html`
    <student-rec></student-rec>
  `;
}
_firstRendered(){
  const studentRec = this.shadowDom.querySelector('student-rec');
  studentRec.student={
    id: '12345',
    name: 'Yasmeen'
  };
}
```

**student-rec.js**

```js
properties(){
  return { 
    student: Object
  }
}
constructor(){
  super();
  this.student = {};
}
_render({student}){
  return html`
    <div>
      ${student.id}<br/>
      ${student.name}<br/>
    </div>
  `;
}
```

## Use the html helper function with JavaScript expressions to initialize object properties

You can import and use the `html` helper function to initialize array and object properties. For example:

**main-app.js**

```js
_getStudent(){
  return {
    id: '12345',
    name: 'Yasmeen'
  };
}
_render({}){
  return html`
    <student-rec student="${getStudent()}"></student-rec>
  `;
}
```

**student-rec.js**

```js
properties(){
  return { 
    student: Object
  }
}
constructor(){
  super();
  this.student = {};
}
_render({student}){
  return html`
    <div>
      ${student.id}<br/>
      ${student.name}<br/>
    </div>
  `;
}
```

## Implement _deserializeValue

If you need to deserialize properties from a string, [implement the `_deserializeValue` method](https://github.com/Polymer/lit-element/blob/2433ce376521aa8ab5272aa9c12a49ee74ac8c4e/custom_typings/polymer.d.ts#L304).

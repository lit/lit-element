To make sure object subproperty changes are rendered, use `Object.assign()` to rewrite the whole object when any of its subproperties change.

```js
static get properties(){
  return {
    student: Object
  };
}
constructor(){
  super();
  this.student={ id: '1234' name: 'Kazi' };
}
_render({student}){
  return html`
    <div>
      ${student.id}
      ${student.name}
    </div>
  `;
}
changeStudent(){
  // Don't do this: 
  // this.student.name='Lee';

  // Do this instead:
  this.student = Object.assign({}, this.student, {
    name: 'Lee'
  });
}
```

## Background: JavaScript objects and arrays

Changing an object subproperty or array item without reassigning the object itself is known as **mutation**. lit-element observes changes to the object itself, not its subproperties; so when you mutate an array or object, lit-element can't detect the change, and won't re-render the template.

For this reason, when a subproperty changes, you should implement the change by cloning the object and merging it with its updated subproperties. Use [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) to do this.

### Use Object.assign to make sure you create true clones 

JavaScript objects are references to locations in memory. If you create a naive copy of a JavaScript object, it will point to the same memory space as the original:

```js
var thing = { 
  greeting: 'hello',
  entity: 'world'
};
// naive copy 
var thing1 = thing;

// also a naive copy
var thing2 = new Object(thing);
thing2.greeting='hi';

// all 3 point to the same memory space
if(thing===thing1===thing2){
  console.log('literally the same');
  console.log(thing.greeting, thing1.greeting, thing2.greeting);
}
```

Arrays are JavaScript `Object`s, and behave the same way:

```js
var myArray=['some','boring','test','data'];
var otherArray=myArray;
otherArray[1]='nice';
console.log(myArray[1]);
```

If you perform an update by creating a naive copy of an object (for example, with `var newObject = existingObject` or `var newObject = new Object('existingObject')`) instead of a true clone, you won't rewrite the object, and `_render` will not fire.

## Object.assign

To clone a new object, use `Object.assign()`:

```js
var thing = { 
  greeting: 'hello',
  entity: 'world'
};
var newThing = Object.assign({}, thing);
newThing.greeting='hi';
console.log(thing.greeting);
```

To clone a new array, you can also use `Object.assign()`:

```js
var myArray=['some','boring','test','data'];
var newArray = Object.assign([], ...myArray);
newArray[1]='nice';
console.log(myArray[1]);
```

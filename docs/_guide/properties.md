---
layout: guide
title: Properties
slug: properties
---

{::options toc_levels="1..3" /}
* ToC
{:toc}

## Overview {#overview}

LitElement manages your declared properties and their corresponding attributes. By default, LitElement will: 

* Ensure that an element update is scheduled when any declared property changes.
* Capture instance values for declared properties. Apply any property values that are set before the browser registers a custom element definition.
* Set up an observed (not reflected) attribute with the lowercased name of each property.
* Handle attribute conversion for properties declared as type `String`, `Number`, `Boolean`, `Array`, and `Object`.
* Use direct comparison (`oldValue !== newValue`) to test for property changes.
* Apply any property options and accessors declared by a superclass. 

{:.alert .alert-warning}
<div>

**Remember to declare all of the properties that you want LitElement to manage.** For the property features above to be applied, you must [declare the property](#declare). 

</div>

### Property options

A property declaration is an object in the following format:

```
{ optionName1: optionValue1, optionName2: optionValue2, ... }
```

The following options are available:

* `converter`: [Convert between properties and attributes](#conversion).
* `type`: [Use LitElement's default attribute converter](#conversion-type).
* `attribute`: [Configure observed attributes](#observed-attributes).
* `reflect`: [Configure reflected attributes](#reflected-attributes).
* `noAccessor`: Whether to set up a default [property accessor](#accessors).
* `hasChanged`: Specify what constitutes a [property change](#haschanged).

All property declaration options can be specified in a static properties getter, or with TypeScript decorators.

## Declare properties {#declare}

Declare your element's properties by implementing a static `properties` getter, or by using decorators:

```js
// properties getter
static get properties() {
  return { 
    prop1: { type: String }
  };
}
```

```js
// Decorators (requires TypeScript or Babel)
export class MyElement extends LitElement {
  @property( { type : String }  ) prop1 = '';
```

### Declare properties in a static properties getter

To declare properties in a static `properties` getter:

```js
static get properties() { 
  return { 
    prop1: { type: String },
    prop2: { type: Number },
    prop3: { type: Boolean }
  };
}
```

{:.alert .alert-warning}
<div>

**If you implement a static properties getter, initialize your property values in the element constructor.**

```js
constructor() {
  // Always call super() first
  super();
  this.prop1 = 'Hello World';
  ...
}
```

Remember to call `super()` first in your constructor, or your element won't render at all.

</div>

**Example: Declare properties with a static `properties` getter** 

```js
{% include projects/properties/declare/my-element.js %}
```

{% include project.html folder="properties/declare" openFile="my-element.js" %}

### Declare properties with decorators {#declare-with-decorators}

You can also declare properties with decorators:

```js
@property({type : String})  prop1 = 'Hello World';
```

Decorators are a proposed JavaScript feature, so you'll need to use a transpiler like Babel or the TypeScript compiler to use decorators.

If you're using Babel, you'll need to use the `@babel/plugin-proposal-decorators` plugin. 

If you're using TypeScript, you'll need to enable the `experimentalDecorators` compiler option (for example, by setting `"experimentalDecorators": true` in `tsconfig.json`). Enabling `emitDecoratorMetadata` is not required and not recommended.

**Example: Declare properties with decorators** 

```js
{% include projects/properties/declaretypescript/my-element.ts %}
```

{% include project.html folder="properties/declaretypescript" openFile="my-element.ts" %}

## Initialize property values {#initialize}

### Initialize property values in the element constructor 

If you implement a static properties getter, initialize your property values in the element constructor:

```js
static get properties() { return { /* Property declarations */ }; } 

constructor() {
  // Always call super() first
  super();

  // Initialize properties 
  this.prop1 = 'Hello World';
}
```

{:.alert .alert-warning}
<div> 

Remember to call `super()` first in your constructor, or your element won't render at all.

</div>

**Example: Initialize property values in the element constructor** 

```js
{% include projects/properties/init/my-element.js %}
```

{% include project.html folder="properties/init" openFile="my-element.js" %}

### Initialize property values when using TypeScript decorators

TypeScript users can initialize property values when they are declared with the `@property` decorator:

```ts
@property({ type : String }) prop1 = 'Hello World';
```

**Example: Initialize property values when using TypeScript decorators** 

```js
{% include projects/properties/inittypescript/my-element.ts %}
```

{% include project.html folder="properties/inittypescript" openFile="my-element.ts" %}

### Initialize property values from attributes in markup 

You can also initialize property values from observed attributes in markup:

_index.html_ 

```html
<my-element 
  mystring="hello world"
  mynumber="5"
  mybool
  myobj='{"stuff":"hi"}'
  myarray='[1,2,3,4]'></my-element>
```

{% include project.html folder="properties/initmarkup" openFile="index.html" %}

See [observed attributes](#observed-attributes) and [converting between properties and attributes](#conversion) for more information on setting up initialization from attributes.

## Configure attributes {#attributes}

### Convert between properties and attributes {#conversion}

While element properties can be of any type, attributes are always strings. This impacts the [observed attributes](#observed-attributes) and [reflected attributes](#reflected-attributes) of non-string properties:

  * To **observe** an attribute (set a property from an attribute), the attribute value must be converted from a string to match the property type. 

  * To **reflect** an attribute (set an attribute from a property), the property value must be converted to a string.

#### Use the default converter {#conversion-type}

LitElement has a default converter which handles `String`, `Number`, `Boolean`, `Array`, and `Object` property types.

To use the default converter, specify the `type` option in your property declaration:

```js
// Use LitElement's default converter 
prop1: { type: String },
prop2: { type: Number },
prop3: { type: Boolean },
prop4: { type: Array },
prop5: { type: Object }
```

The information below shows how the default converter handles conversion for each type.

**Convert from attribute to property**

* For **Strings**, when the attribute is defined, set the property to the attribute value.
* For **Numbers**, when the attribute is defined, set the property to `Number(attributeValue)`.
* For **Booleans**, when the attribute is:
  * non-`null`, set the property to `true`.
  * `null` or `undefined`, set the property to `false`.
* For **Objects and Arrays**, when the attribute is:
  * Defined, set the property value to `JSON.parse(attributeValue)`.

**Convert from property to attribute** 

* For **Strings**, when the property is:
  * `null`, remove the attribute.
  * `undefined`, don't change the attribute.
  * Defined and not `null`, set the attribute to the property value.
* For **Numbers**, when the property is:
  * `null`, remove the attribute.
  * `undefined`, don't change the attribute.
  * Defined and not `null`, set the attribute to the property value.
* For **Booleans**, when the property is:
  * truthy, create the attribute.
  * falsy, remove the attribute.
* For **Objects and Arrays**, when the property is:
  * `null` or `undefined`, remove the attribute.
  * Defined and not `null`, set the attribute value to `JSON.stringify(propertyValue)`.

**Example: Use the default converter** 

```js
{% include projects/properties/defaultconverter/my-element.js %}
```

{% include project.html folder="properties/defaultconverter" openFile="my-element.js" %}

#### Configure a custom converter {#conversion-converter}

You can specify a custom property converter in your property declaration with the `converter` option:

```js
myProp: { 
  converter: // Custom property converter
} 
```

`converter` can be an object or a function. If it is an object, it can have keys for `fromAttribute` and `toAttribute`: 

```js
prop1: { 
  converter: { 
    fromAttribute: (value, type) => { 
      // `value` is a string
      // Convert it to a value of type `type` and return it
    },
    toAttribute: (value, type) => { 
      // `value` is of type `type` 
      // Convert it to a string and return it
    }
  }
}
```

If `converter` is a function, it is used in place of `fromAttribute`:

```js
myProp: { 
  converter: (value, type) => { 
    // `value` is a string
    // Convert it to a value of type `type` and return it
  }
} 
```

If no `toAttribute` function is supplied for a reflected attribute, the attribute is set to the property value without conversion.

During an update: 

  * If `toAttribute` returns `null`, the attribute is removed. 

  * If `toAttribute` returns `undefined`, the attribute is not changed.

**Example: Configure a custom converter** 

```js
{% include projects/properties/attributeconverter/my-element.js %}
```

{% include project.html folder="properties/attributeconverter" openFile="my-element.js" %}

### Configure observed attributes {#observed-attributes}

An **observed attribute** fires the custom elements API callback `attributeChangedCallback` whenever it changes. By default, whenever an attribute fires this callback, LitElement sets the property value from the attribute using the property's `fromAttribute` function. See [Convert between properties and attributes](#conversion) for more information.

By default, LitElement creates a corresponding observed attribute for all declared properties. The name of the observed attribute is the property name, lowercased:

```js
// observed attribute name is "myprop"
myProp: { type: Number }
```

To create an observed attribute with a different name, set `attribute` to a string: 

```js
// Observed attribute will be called my-prop
myProp: { attribute: 'my-prop' }
```

To prevent an observed attribute from being created for a property, set `attribute` to `false`. The property will not be initialized from attributes in markup, and attribute changes won't affect it.

```js
// No observed attribute for this property
myProp: { attribute: false }
```

An observed attribute can be used to provide an initial value for a property via markup. See [Initialize properties with attributes in markup](#initialize-markup).

**Example: Configure observed attributes**

```js
{% include projects/properties/attributeobserve/my-element.js %}
```

{% include project.html folder="properties/attributeobserve" openFile="my-element.js" %}

### Configure reflected attributes {#reflected-attributes}

You can configure a property so that whenever it changes, its value is reflected to its [observed attribute](#observed-attributes). For example:

```js
// Value of property "myProp" will reflect to attribute "myprop"
myProp: { reflect: true }
```

When the property changes, LitElement uses the `toAttribute` function in the property's converter to set the attribute value from the new property value. 

* If `toAttribute` returns `null`, the attribute is removed.

* If `toAttribute` returns `undefined`, the attribute is not changed.

* If `toAttribute` itself is undefined, the property value is set to the attribute value without conversion.

{:.alert .alert-info}
<div>

**LitElement tracks reflection state during updates.** LitElement keeps track of  state information to avoid creating an infinite loop of changes between a property and an observed, reflected attribute.

</div>

**Example: Configure reflected attributes**

```js
{% include projects/properties/attributereflect/my-element.js %}
```

{% include project.html folder="properties/attributereflect" openFile="my-element.js" %}

## Configure property accessors {#accessors}

By default, LitElement generates a property accessor for all declared properties. The accessor is invoked whenever you set the property:

```js
// Declare a property
static get properties() { return { myProp: { type: String } }; }
...
// Later, set the property
this.myProp = 'hi'; // invokes myProp's generated property accessor
```

Generated accessors automatically call `requestUpdate`, initiating an update if one has not already begun.

### Create your own property accessors {#accessors-custom}

To specify how getting and setting works for a property, you can define your own property accessors. For example:

```js
static get properties() { return { myProp: { type: String } }; }

set myProp(value) {
  const oldValue = this.myProp;
  // Implement setter logic here... 
  this.requestUpdate('myProp', oldValue);
} 
get myProp() { ... }

...

// Later, set the property
this.myProp = 'hi'; // Invokes your accessor
```

If your class defines its own accessors for a property, LitElement will not overwrite them with generated accessors. If your class does not define accessors for a property, LitElement will generate them, even if a superclass has defined the property or accessors.

The setters that LitElement generates automatically call `requestUpdate`. If you write your own setter you must call `requestUpdate` manually, supplying the property name and its old value.

**Example** 

```js
{% include projects/properties/customsetter/my-element.js %}
```

If you want to use your own property accessor with the `@property` decorator, you can achieve this by putting the decorator on the getter:
```ts
   _myProp: string = '';

  @property({ type: String })
  public get myProp(): string {
    return this._myProp;
  }
  public set myProp(value: string) {
    const oldValue = this.myProp;
    this._myProp = value;
    this.requestUpdate('myProp', oldValue);
  }
```

### Prevent LitElement from generating a property accessor {#accessors-noaccessor}

In rare cases, a subclass may need to change or add property options for a property that exists on its superclass.

To prevent LitElement from generating a property accessor that overwrites the superclass's defined accessor, set `noAccessor` to `true` in the property declaration:

```js
static get properties() { 
  return { myProp: { type: Number, noAccessor: true } }; 
}
```

You don't need to set `noAccessor` when defining your own accessors. 

**Example** 

**Subclass element**

```js
{% include projects/properties/accessorssubclassing/sub-element.js %}
```

{% include project.html folder="properties/accessorssubclassing" openFile="sub-element.js" %}

## Configure property changes {#haschanged}

All declared properties have a function, `hasChanged`, which is called whenever the property is set. 

`hasChanged` compares the property's old and new values, and evaluates whether or not the property has changed. If `hasChanged` returns true, LitElement starts an element update if one is not already scheduled. See the [Element update lifecycle documentation](lifecycle) for more information on how updates work.

By default:

* `hasChanged` returns `true` if `newVal !== oldVal`.
* `hasChanged` returns `false` if both the new and old values are `NaN`.

To customize `hasChanged` for a property, specify it as a property option:

```js
myProp: { hasChanged(newVal, oldVal) {
  // compare newVal and oldVal
  // return `true` if an update should proceed
}}
```

**Example: Configure property changes** 

```js
{% include projects/properties/haschanged/my-element.js %}
```

{% include project.html folder="properties/haschanged" openFile="my-element.js" %}

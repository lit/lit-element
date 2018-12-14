---
layout: post
title: Properties
slug: properties
---

{::options toc_levels="1..3" /}
* ToC
{:toc}

## Declare properties

Declare your element's properties by implementing the `properties` getter, or with TypeScript decorators.

LitElement automatically observes declared properties. When a property changes, LitElement updates your element in the [element update lifecycle](lifecycle).

### Implement a properties getter

To declare properties in the `properties` getter:

```js
static get properties() { 
  return { 
    prop1: { type: String },
    prop2: { type: Number },
    prop3: { type: Boolean }
  };
}
```

{% include project.html folder="docs/properties/declare" openFile="my-element.js" %}

### Use TypeScript decorators

You can also declare properties with TypeScript decorators:

```js
import { LitElement, html, customElement, property } from '@polymer/lit-element';

@customElement('my-element')
export class MyElement extends LitElement {
  @property({type : String})  prop1 = 'Hello World';
  @property({type : Number})  prop2 = 5;
  @property({type : Boolean}) prop3 = true;
  ...
}
```

### Configure property options

When you set up your properties, you can specify a property declaration for each one. Within a property declaration, you can configure options for the property.

* Configure corresponding attributes and their behavior with the `type`, `attribute` and `reflect` options.
* Specify the `hasChanged` function to control what constitutes a change for this property.

Property declarations can be specified in the `properties` getter or with TypeScript decorators.

```js
/**
 * An example property declaration
 */
{ 
  // Specifies how to convert between property and attribute.
  type: String,

  // Specifies corresponding observed attribute.
  attribute: 'my-prop', 

  // Specifies whether to reflect property to attribute on changes.
  reflect: true,

  // Specifies how to evaluate whether the property has changed.
  hasChanged(newValue, oldValue) { ... },
}
```

{% include project.html folder="docs/properties/declaretypescript" openFile="my-element.js" %}

## Initialize property values

Initialize default property values in the element constructor:

```js
constructor() {
  // Always call super() first
  super();
  this.prop1 = 'Hello World';
  this.prop2 = 5;
  this.prop3 = true;
}
```

Remember to call `super()` first in your constructor, or your element won't render at all.

You can also initialize a property from an attribute in markup:

```html
<my-element prop1="Hi" prop2="7"></my-element>
```

Values supplied in markup will override the default values in your constructor.

LitElement deserializes a property from an attribute in markup according to its type, so make sure you configure your property type correctly.

## Configure corresponding attributes

Configure a property's corresponding attributes and attribute behavior with the `type`, `attribute` and `reflect` options.

### Configure a property type

While element properties can be of any type, attributes are always strings. A property must be serialized and deserialized to and from its corresponding observed attribute. This is specified with the `type` option in a property declaration. For example:

```js
myProp { type: Boolean }
```

By default, LitElement uses the `String` constructor to serialize and deserialize properties and attributes. To make sure a non-string property is handled correctly, configure the property's `type` option.

`type` can be: 

* A function that performs the deserialization (i.e. returns the property value from the attribute value). The `String` constructor is used to reflect the property value to the attribute.

  ```js
  propName: { type: deserializerFunction }
  ```

* An object with two function properties, `fromAttribute` and `toAttribute`. `fromAttribute` performs deserialization, and `toAttribute` performs serialization:

  ```js
  propName: { type: {
    toAttribute: serializerFunction,
    fromAttribute: deserializerFunction
  }}
  ```

By default, `type`, `fromAttribute` and `toAttribute` are the `String` constructor. 

To handle deserialization of strings, numbers, and booleans, you can use the corresponding constructor:

```js
return { 
  myString: { type: String },
  myNumber: { type: Number },
  myBoolean: { type: Boolean }
}
```

Note that when a property of type `Boolean` is deserialized, if it is truthy, the corresponding attribute is created. If the property is falsy, the attribute is removed.

#### Serialize and deserialize object properties

**Objects (including arrays) must be handled differently.** LitElement has no default handling for converting between object properties and string attributes. If you need to serialize and deserialize complex properties, you must implement a `type` for them.

One option is to use `JSON.parse` and `JSON.stringify`:

```js
{% include projects/docs/properties/type/my-element.js %}
```

The following code will **not** deserialize attributes to objects:

```text
return { 
  // this will not deserialize strings to objects
  // it will just call `Object("some string")` on them 
  myObj: { type: Object },
}
```

### Configure observed attributes

Changes to observed attributes trigger [`attributeChangedCallback`](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks). When set, observed attributes also update their corresponding property. The property's `type` option determines how the attribute value (a string) is deserialized to the property. 

By default, all declared properties get a corresponding observed attribute. The name of the observed attribute is the property name, lowercased:

```js
static get properties() {
  return {
    // observed attribute name is "myprop"
    myProp: { type: Number }
  };
}
```

To create an observed attribute with a different name, set `attribute` to a string: 

```js
// Observed attribute will be called my-prop
myProp: { attribute: 'my-prop' }
```

To prevent an observed attribute from being created for a property, set `attribute` to `false`. The property will not be initialized from attributes in markup, and won't be updated if the attribute changes.

```js
// No observed attribute for you
myProp: { attribute: false }
```

**Example: Configuring observed attributes**

```js
{% include projects/docs/properties/attribute/my-element.js %}
```

### Configure reflection to attributes

You can configure a property so that whenever it changes, its value is reflected to its observed attribute. For example:

```js
myProp: { type: String, attribute: 'my-prop', reflect: true }
```

The property's `type` option determines how the property will be serialized.

**Example: Configuring reflection to attributes**

```js
{% include projects/docs/properties/attribute/my-element.js %}
```

## Evaluate property changes

All declared properties have a function, `hasChanged`, which is called whenever the property is set. 

`hasChanged` compares the property's old and new values, and evaluates whether or not the property has changed. If `hasChanged` returns true, LitElement starts an element update. See the [Element update lifecycle documentation](lifecycle) for more information on how updates work.

By default:

* `hasChanged` returns `true` if `newVal !== oldVal`.
* `hasChanged` returns `false` if both the new and old values are `NaN`.

To customize `hasChanged` for a property, specify it as a property option:

```js
static get properties() { return {
  myProp: {
    hasChanged(newVal, oldVal) {
      // compare newVal and oldVal
      // return `true` if an update should proceed
    }
  }};
}
```

{% include project.html folder="docs/lifecycle/haschanged" %}

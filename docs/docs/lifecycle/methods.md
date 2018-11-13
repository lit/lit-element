---
layout: post
section: docs
topic: lifecycle
subtopic: methods
---

In call order, the methods in the update lifecycle are: 

1.  [hasChanged](#haschanged)
1.  [requestUpdate](#requestupdate) 
1.  [shouldUpdate](#shouldupdate)
1.  [update](#update)
1.  [render](#render)
1.  [firstUpdated](#firstupdated)
1.  [updated](#updated)
1.  [updateComplete](#updatecomplete)

<a id="haschanged">

<br/>

[Back to top](methods)

## [hasChanged](#haschanged)

```
hasChanged(newValue, oldValue)
```

| **Params**<br/><br/>&nbsp; | `newValue`<br/><br/>`oldValue` | Property value to be set.<br /> <br/>Previous property value for comparison.|
| **Returns** | `Boolean`  | Element update proceeds if `hasChanged` returns true.|
| **Updates?** | No | Property changes inside this method will not trigger an element update. |

Called whenever a property is set. If `hasChanged` returns `true`, [`requestUpdate`](#requestupdate) is called.

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

**Example**

_my-element.js_

```js
{% include projects/docs/lifecycle/haschanged/my-element.js %}
```

{% include project.html folder="docs/lifecycle/haschanged" %}

<a id="requestupdate">

<br/>

[Back to top](methods)

## [requestUpdate](#requestupdate)

```
requestUpdate()
requestUpdate(propertyName, oldValue)
```

| **Params**<br/><br/>&nbsp; | `propertyName`<br/><br/>`oldValue`| Name of property to be updated. <br/><br/> Previous property value. |
| **Returns**  | `Promise` | Returns the [`updateComplete` Promise](#updatecomplete), which resolves on completion of the update. |
| **Updates?** | No | Property changes inside this method will not trigger an element update. |

If [`hasChanged`](#haschanged) returned `true`, `requestUpdate` fires, and the update proceeds.

To manually start an element update, call `requestUpdate` with no parameters.

To implement a custom property setter that supports property options, pass the property name and its previous value as parameters.

**Example: Manually start an element update**

```js
{% include projects/docs/lifecycle/requestupdate/my-element.js %}
```

{% include project.html folder="docs/lifecycle/requestupdate" %}

**Example: Call `requestUpdate` from a custom property setter**

```js
{% include projects/docs/lifecycle/customsetter/my-element.js %}
```

{% include project.html folder="docs/lifecycle/customsetter" %}

<a id="shouldupdate">

<br/>

[Back to top](methods)

## [shouldUpdate](#shouldupdate)

```
shouldUpdate(changedProperties)
```

| **Params** | `changedProperties`| `Map`. Keys are the names of changed properties; Values are the corresponding previous values. |
| **Returns**  | `Boolean` | If `true`, update proceeds. Default return value is `true`. |
| **Updates?** | Yes | Property changes inside this method will trigger an element update. |

**Example: Customize which property changes should cause updates**

```js
{% include projects/docs/lifecycle/shouldupdate/my-element.js %}
```

{% include project.html folder="docs/lifecycle/shouldupdate" %}

<a id="update">

<br/>

[Back to top](methods)

## [update](#update)

```
update(changedProperties)
```

| **Params** | `changedProperties`| `Map`. Keys are the names of changed properties; Values are the corresponding previous values. |
| **Updates?** | No | Property changes inside this method will not trigger an element update. |

Updates the element by reflecting property values to attributes, and calling `render()`. 

```js
{% include projects/docs/lifecycle/update/my-element.js %}
```

{% include project.html folder="docs/lifecycle/update" %}

<a id="render">

<br/>

[Back to top](methods)

## [render](#render)

```
render()
```

| **Returns** | `TemplateResult` | Must return a lit-html `TemplateResult`. |
| **Updates?** | No | Property changes inside this method will not trigger an element update. |

Uses lit-html to render the element template.

See the documentation on [writing and rendering templates](../templates) for more information.

<a id="firstupdated">

<br/>

[Back to top](methods)

## [firstUpdated](#firstupdated)

`firstUpdated(changedProperties)`

| **Params** | `changedProperties`| `Map`. Keys are the names of changed properties; Values are the corresponding previous values. |
| **Updates?** | Yes | Property changes inside this method will trigger an element update. |

Called after the element's DOM has been updated the first time, immediately before [`updated`](#updated) is called. 

Customize `firstUpdated` to perform one-time work after the element's template has been created.

**Example: Focus an input element**

```js
{% include projects/docs/lifecycle/firstupdated/my-element.js %}
```

{% include project.html folder="docs/lifecycle/firstupdated" %}

<a id="shouldupdate">

<br/>

[Back to top](methods)


## [updated](#updated)

```
updated(changedProperties)
```

| **Params** | `changedProperties`| `Map`. Keys are the names of changed properties; Values are the corresponding previous values. |
| **Updates?** | Yes | Property changes inside this method will trigger an element update. |

Called when the element's DOM has been updated and rendered. Does nothing. Implement to do stuff after anupdate e.g. focus, etc

**Example: Focus an element after update**

```js
{% include projects/docs/lifecycle/updated/my-element.js %}
```

{% include project.html folder="docs/lifecycle/updated" %}

<a id="updatecomplete">

<br/>

[Back to top](methods)

## [updateComplete](#updatecomplete)

```js
updateComplete
```

| **Type** | `Promise` | Resolves with a `Boolean` when the element has finished updating. |
| **Resolves** <br/><br/>| `true` if there are no more pending updates.<br/><br/> `false` if this update cycle triggered another update. |

The `updateComplete` Promise resolves when the element has finished updating. Use `updateComplete` to to wait for an update:

  ```js
  await updateComplete;
  // do stuff
  ```

  ```js
  updateComplete.then(() => { /* do stuff */ });
  ```

To have `updateComplete` await additional state before it resolves, implement the `updateComplete` getter:

  ```js
  get updateComplete() {
    return this.getMoreState().then(() => {
      return this._updatePromise;
    });
  }
  ```

**Example**

```js
{% include projects/docs/lifecycle/updatecomplete/my-element.js %}
```

{% include project.html folder="docs/lifecycle/updatecomplete" %}

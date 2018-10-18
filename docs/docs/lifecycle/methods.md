---
layout: post
type: reference
section: docs
topic: lifecycle
subtopic: methods
status: draft
---

This is a quick reference page. For a detailed description of the update lifecycle, see [insert link to concept page](). For API documentation, see [insert link to API docs]().

### Lifecycle call order

1.  `hasChanged`
1.  `requestUpdate` (if `hasChanged` returned `true`)
1.  `shouldUpdate`
1.  `update` (if `shouldUpdate` returned `true`)
1.  `render`
1.  [`firstUpdated`](#firstupdated) (if first update)
1.  `updated`
1.  `updateComplete` `Promise` resolves:
    *  `true` if no pending updates
    *  `false` if pending updates 


<a name="firstupdated">

`firstUpdated(changedProperties)`

**Type**: Callback

**Update on property changes**: Yes

**Call order**: After `render`, before `updated`

(protected) Called after the element's DOM has been updated the first time, immediately before updated() is called. This method can be useful for capturing references to rendered static nodes that must be directly acted upon, for example in updated(). Setting properties inside this method will trigger the element to update.

```js
firstUpdated(){

}
```

---
layout: post
section: try
topic: style
status: reviewing
---

Style your element with CSS by including a `style` block in its template. 

* [Starting code](#start)
* [Editing steps](#edit)
* [Completed code](#completed)

<a name="start">

### Starting code

_my-element.js_

```js
{% include projects/try/style/before/my-element.js %}
```

{% include project.html folder="try/style/before" openFile="my-element.js" %}

<a name="edit">

### Editing steps

Add a style block to the element template in `render`:

_my-element.js_

```js
render(){
  return html`
    <!-- Add a style block here -->
    <p>${this.message}</p>
    ...
    ...
  `;
}
```

_Style block_

```html
<style>
  p {
    font-family: Roboto;
    font-size: 24px;
    font-weight: 500;
  }
  .red {
    color: red;
  }
  .blue {
    color: blue;
  }
</style>
```

Apply the class styles to a paragraph in the element template. Use `myBool` to apply the styles conditionally.

_my-element.js_

```js
render(){
  return html`
    ...
    <!-- Style this text --> 
    <p>style me</p>
    ...
  `;
}
```

_Apply the styles conditionally_

```html
<p class="${this.myBool?'red':'blue'}">style me</p>
```

<a name="completed">

### Completed code

_my-element.js_

```js
{% include projects/try/style/after/my-element.js %}
```

{% include project.html folder="try/style/after" openFile="my-element.js" %}

Congratulations - you've made your first element with LitElement.

Next steps

* [Set up LitElement locally](/tools/setup)
* [View API documentation](/docs/index)

{% include prevnext.html prevurl="events" prevtitle="Add an event handler" %}

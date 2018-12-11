---
layout: post
title: CSS Styles
slug: styles
---

**This guide applies only if you use the default (shadow DOM) render root.** If you modify your element's render root to render into the main DOM tree instead of a shadow root, these instructions won't apply.

**If you're using the Shady CSS polyfill, be aware that it has some limitations.** See the [Shady CSS README](https://github.com/webcomponents/shadycss/blob/master/README.md#limitations) for more information.

{::options toc_levels="1..3" /}
* ToC
{:toc}

## Use the :host CSS pseudo-class 

In a style block, use the `:host` CSS pseudo-class to select the host element:

_my-element.js_

```js
render() {
  return html`
    <style>
      :host[hidden] { display: none; }
      :host { display: block; 
        border: 1px solid black;
      }
    </style>
    <p>Hello world</p>
  `;
}
```

{% include project.html folder="docs/style/hostselector" openFile="my-element.js" %}

See the MDN documentation on [:host](https://developer.mozilla.org/en-US/docs/Web/CSS/:host()) and [pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) for more information.

### Set :host display styles

Two best practices for working with custom elements are:

* Set a `:host` display style such as `block` or `inline-block` so that your component's `width` and `height` can be set.

* Set a `:host` display style that respects the `hidden` attribute.

```html
<style>
  :host[hidden] { display: none; }
  :host { display: block; }
</style>
```

{% include project.html folder="docs/style/bestpracs" openFile="my-element.js" %}

See [Custom Element Best Practices](https://developers.google.com/web/fundamentals/web-components/best-practices) for more information.

### Style shadow DOM children via properties inherited via :host 

Child elements in your template will inherit CSS properties you assign to your host via the `:host` CSS pseudo-class:

_my-element.js_

```js
render() {
  return html`
    <style>
      :host { 
        display: block; 
        font-family: Roboto;
        font-size: 20;
        color: blue;
      }
    </style>
    <p>Inherits font styles</p>
  `;
}
```

{% include project.html folder="docs/style/inherited" openFile="my-element.js" %}

If your host element itself inherits properties from another element, the host's shadow DOM children will inherit those properties in turn:

```html
  <style>
    div { font-family: Roboto; }
  </style>
  ...
  <div><my-element>Will use Roboto font</my-element></div>
```

{% include project.html folder="docs/style/inherited2" openFile="my-element.js" %}

## Style the host from the main document

You can also style the host from outside its own template.

### Use the custom element tag as a selector

You can set styles for the host from the main document by using its custom element tag as a selector. For example:

_index.html_ 

```html
<style>
  my-element { 
    font-family: Roboto;
    font-size: 20;
    color: blue;
  }
</style>
...
<my-element></my-element>
```

**The :host CSS pseudo-class has higher specificity than the element's type selector.** Styles set for your host with the `:host` pseudo-class from inside its own template will override styles set in the main document. For example:

_index.html_ 

```html
<style>
  my-element { 
    color: blue;
  }
</style>
...
<my-element></my-element>
```

_my-element.js_

```html
<style>
  /* Overrides styles set for my-element in index.html */
  :host {
    color: red;
  }
</style>
```

### Use custom properties

Custom properties inherit down the DOM tree. You can use this to let your users apply styles and themes to your elements.

For example, the following element sets its background color to a CSS variable that uses the value of the custom property `--myBackground` if it is available, and uses `yellow` otherwise:

_my-element.js_

```html
<style>
  :host {
    display: block;
    background-color: var(--myBackground, yellow);
  }
</style>
```

The user can now set the custom property `--myBackground` in their main document in order to style the background of `my-element`. 

_index.html_

```html
<style>
  my-element {
    --myBackground: rgb(67, 156, 144);
  }
</style>
```

If the user has an existing app theme, they can easily apply their theme properties to `my-element`:

```html
<style>
  html {
    --themeColor1: rgb(67, 156, 144);
  }
  my-element {
    --myBackground: var(--themeColor1);
  }
</style>
```

```js
{% include projects/docs/style/customproperties/my-element.js %}
```

{% include project.html folder="docs/style/customproperties" openFile="my-element.js" %}

See [CSS Custom Properties on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) for more information.

## Select slotted elements with the ::slotted() CSS pseudo-element

Use the `::slotted()` CSS pseudo-element to select light DOM elements that have been included in shadow DOM via the `<slot>` element.

* `::slotted(*)` matches all slotted elements.

* `::slotted(p)` matches slotted paragraphs.

* `p ::slotted(*)` matches slotted elements in a paragraph element.

```js
{% include projects/docs/style/slotted/my-element.js %}
```

{% include project.html folder="docs/style/slotted" openFile="my-element.js" %}

## Use JavaScript expressions in LitElement style blocks

You can include style information in a JavaScript expression inside a LitElement template:

```js
render() { 
  return html`
    <style>${this.myStyles}</style>
    <p>hi world</p>
  `; 
}

get myStyles() { 
  return html`p { color: red }`; 
} 
```

{% include project.html folder="docs/style/expressions" openFile="my-element.js" %}

## Example: A small theme

_index.html_

```html
<style>
  html {
    --themeColor1: rgb(67, 156, 144);
    --themeFont: Roboto;
  }
  my-element {
    --myColor: var(--themeColor1);
    --myFont: var(--themeFont);
  }
</style>
...
<my-element></my-element>
```

_my-element.js_

```js
render() {
  return html`
    <style>
      :host[hidden] { display: none; }
      :host { display: block; 
        color: var(--myColor, aliceblue);
        font-family: var(--myFont, Verdana);
      }
      ${navStyles}
    </style>

    <ul class="navigation">
      ${this.menuItems.map(item => html`<li class="item">${item}</li>`)}
    </ul>
  `;
}
```

_my-styles.js_

```js
export const navStyles = html`
  ul {
    list-style-type: none; 
    margin: 0;
    padding: 0;
  }
  .navigation {
    display: flex;
    flex-direction: row;
  }
  .item {
    padding: 8px;
  }
`;
```

{% include project.html folder="docs/style/smalltheme" openFile="my-element.js" %}

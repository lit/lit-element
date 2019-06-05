---
layout: guide
title: Styles
slug: styles
---

{::options toc_levels="1..3" /}
* ToC
{:toc}

It’s easy to style LitElement templates and components with plain CSS. 

Style the `button` elements in a component's template:

```js
class MyElement extends LitElement {
  static get styles() {
    return css`button { width: 200px; }`;
  }
  render() {
    return html`<button>click</button>`;
  }
}
```

Add a margin around a component:

```html
<style>
  my-element { margin-left: 50px; }
</style>
<my-element></my-element>
```

{% include project.html folder="style/intro" openFile="index.html" %}

Style your template from the main HTML document:

```js
class MyElement extends LitElement {
  static get styles() {
    return css`
      button { width: var(--buttonWidth, 100px); }
    `;
  }
  render() {
    return html`<button>click</button>`;
  }
}
```

```html
<style>
  my-element { --buttonWidth: 200px; }
</style>
<my-element></my-element>
```

{% include project.html folder="style/introcustomprops" openFile="index.html" %}

The component above makes the `button` element's `width` property stylable from outside the component template. See [CSS custom properties](#custom-properties) for more information.

{:.alert .alert-info}
<div>

**CSS Shadow Parts are coming.** With [CSS Shadow Parts](https://www.w3.org/TR/css-shadow-parts-1/), component authors will be able to expose elements inside shadow DOM to the outside world for styling. Stay tuned!

</div>

<div class="alert alert-info">

**If you're using the Shady CSS polyfill, be aware that it has some limitations.** See the [Shady CSS README](https://github.com/webcomponents/shadycss/blob/master/README.md#limitations) for more information.

</div>

## How to style... {#how}

### ...A LitElement template {#how-to-style-template}

To style a LitElement template from inside your component's source code, simply use standard CSS selectors to style your content:

```js
import { LitElement, css, html } from 'lit-element';

class MyElement extends LitElement {
  static get styles() {
    return css`
      * { color: black; }
      p { font-family: sans-serif; }
      .myclass { margin: 30px; }
      #main { padding: 16px; }
      h1 { font-size: 4rem; }
    `;
  }
}
```

The example above places the template styles in a static `styles` property, but you could also put them in a `<style>` block or an external stylesheet—see [Where to put your styles](#where) for details.

{:.alert .alert-info}
<div>

**Styles in a LitElement template are automatically encapsulated.** You don't need to worry about accidentally styling other elements in the page!

The template's rendered content forms a sub-tree, separate from the main HTML document. In general, from inside the sub-tree, you can only see the rest of the sub-tree. 

This also means simple selectors such as `*`, tagname, id, and class selectors work fine inside LitElement templates, as they won't match any outside content. 

</div>

To style your template from outside your component's source code, see the section on [custom CSS properties](#custom-properties).

{:.alert .alert-info}
<div>

**CSS Shadow Parts are coming.** With [CSS Shadow Parts](https://www.w3.org/TR/css-shadow-parts-1/), component authors will be able to expose elements inside LitElement templates to the outside world for styling. Stay tuned!

</div>

### ...A component's host element {#how-to-style-host}

A component's _host element_ is the HTML element that serves as a container for the component's rendered content.

The rendered content forms a separate, encapsulated sub-tree. In general, from outside the sub-tree, you can only see the host element (the container). From inside the sub-tree, you can only see the rest of the content in the sub-tree. 

To style the host element from the context where you're using the component—for example, in an HTML document—simply define styles for the component's element type selector. For example:
 
_index.html_

```html
<head>
  <style>
    my-element { 
      border: 1px solid black; 
      margin-left: 50px;
      color: blue;
    }
  </style>
</head>
<body>
  <my-element></my-element>
</body>
```

To style the host element from inside your component's source code, use the special `:host` and `:host()` CSS features. These features allow you to "peek outside" the sub-tree of your rendered content, and style its container:

*   `:host` selects the host element.

*   <code>:host(<var>selector</var>)</code> selects the host element, but only if the host element matches _selector_.

```js
class MyElement extends LitElement {
  static get styles() {
    return css`
      /* Selects the host */
      :host { 
        display: block; 
      }

      /* Selects the host element if it is hidden */
      :host([hidden]) { 
        display: none; 
      }

      /* Selects the host element if it has class "blue" */
      :host(.blue) { 
        display: inline; 
      }
    `;
  }
}
```

{:.alert .alert-info}
<div>

**An element type selector has higher specificity than the `:host` pseudo-class selector.** Styles set for a host element from outside (for example, in the main document) will override styles set with `:host` and `:host()`.

</div>

### ...Slotted content {#how-to-style-slotted}

The `<slot>` element acts as a placeholder in a LitElement template. For example: 

```js
class MyElement extends LitElement {
  render() {
    return html`
      <p>Hello/p>
      <slot></slot>
      <p>World</p>
    `;
  }
}
```

```html
<my-element>
  <p>Slotted content</p>
</my-element>
```

Use the `::slotted()` CSS pseudo-element to select elements that have been included in your component's rendered content via the `<slot>` element.

*   `::slotted(*)` matches all slotted elements.

*   `::slotted(p)` matches slotted paragraphs.

*   `p ::slotted(*)` matches slotted elements in a paragraph element.

```js
{% include projects/style/slotted/my-element.js %}
```

{% include project.html folder="style/slotted" openFile="my-element.js" %}

{:.alert .alert-info}
<div>

**Watch out for Shady CSS limitations around slotted content!** See the [Shady CSS limitations](https://github.com/webcomponents/shadycss) for details on how to use the `::slotted()` syntax in a polyfill-friendly way.

</div>

## Where to put your styles {#where}

{:.alert .alert-info}
<div>

This section is for people developing a LitElement-based component. It explains where to put the styles in your component's source code. 

When you’re consuming an element—for example, using `<some-element>` in markup—you can put styles for the `some-element` tag wherever you normally put your stylesheets. 

</div>

Component developers have a few options for where to put styles. We recommend using a [static `styles` property](#static)—this will usually be the most performant option.

### Recommended: In a static styles property {#static}

LitElement lets you define static styles that apply to all instances of a component.

To define a static `styles` property, import the `css` helper function from the `lit-element` module. Create a static `styles` getter and define your styles in plain CSS:

```js
import { LitElement, html, css } from 'lit-element';

class MyElement extends LitElement {
  static get styles() {
    return css`button { color: red; }`;
  } 
  render() {
    return html`<button>click</button>`;
  }
}
```

{:.alert .alert-info}
<div>

**Static styles provide optimal performance.** LitElement uses [Constructable Stylesheets](https://wicg.github.io/construct-stylesheets/) in browsers that support it, with a fallback for browsers that don't. Constructable Stylesheets allow the browser to parse styles exactly once and reuse the resulting Stylesheet object for maximum efficiency.

</div>

The value of the static `styles` property can be:
    
*   A single tagged template literal:
    
    ```js
    static get styles() {
      return css`:host { display: block; }`;
    } 
    ```

*   Or an array of tagged template literals:

    ```js
    static get styles() {
      return [ css`:host { display: block; }`, css`...`];
    }
    ```

You can inherit the styles from a LitElement superclass:

```js
class MyElement extends SuperElement {
  static get styles() {
    return [
      super.styles,
      css`button { color: red; }`
    ];
  }
}
```

{% include project.html folder="style/superstyles" openFile="my-element.js" %}

#### Expressions in static styles {#expressions}

Static styles apply to all instances of an element. Any expressions in your CSS are evaluated **once**, then reused for all instances. 

For security reasons, expressions must be tagged with the `cssLiteral` template literal tag:

```js
import { LitElement, css, cssLiteral } from 'lit-element';

const mainColor = cssLiteral`red`;

class MyElement extends LitElement {
  static get styles() {
    return css`
    :host {
      display: block;
      color: ${mainColor}
    }`;
  } 
}
```

### In a style element {#style-element} 

We recommend using static styles for optimal performance. However, static styles are evaluated once, and apply to all instances of a component; in some cases you may want to evaluate styles for each instance of a component.

One way to evaluate styles per instance is to place your styles in a `<style>` element in your template, and use your element's properties in your CSS rules:

```js
class MyElement extends LitElement {
  static get properties() {
    return { 
      mainColor: { type: String, value: 'blue' } 
    };
  }
  render() {
    return html`
      <style>
        :host { color: ${this.mainColor}; }
      </style>
    `;
  }
}
```

{:.alert .alert-info}
<div>

**Expressions inside a `<style>` element won't update per instance in ShadyCSS**. Due to limitations of the ShadyCSS polyfill, you can't use element properties in CSS rules as the expressions won't be evaluated. See the [ShadyCSS readme](https://github.com/webcomponents/shadycss/blob/master/README.md#limitations).

</div>

### In an external stylesheet {#external-stylesheet}

We recommend placing your styles in a static `styles` property for optimal performance. However, you can also include an external stylesheet in an element template with a `<link>` element:

```js
class MyElement extends LitElement {
  render() {
    return html`
      <link rel="stylesheet" href="./styles.css">
      <p>style me</p>
    `;
  }
}
```

There are some important caveats though:

*  The [ShadyCSS polyfill](https://github.com/webcomponents/shadycss/blob/master/README.md#limitations) doesn't support external stylesheets.

*   External styles can cause a flash-of-unstyled-content (FOUC) while they load.

*   The URL in the `href` attribute is relative to the _main document_. This is okay if you're building an app and your asset URLs are well-known. Avoid using external stylesheets in reusable elements.

## Make an app theme {#theme}

Use CSS inheritance to share styles, and custom CSS properties to configure them. Use both together to build an app theme!

### CSS inheritance {#inheritance}

Encapsulation prevents styles from outside a component from "leaking" into the component's rendered template content, and vice versa. CSS inheritance, on the other hand, provides a way for parent and host elements to propagate certain CSS properties to their descendents.

Not all CSS properties inherit. Inherited CSS properties include `color`, `font-family`, and all CSS custom properties (`--*`). See [CSS Inheritance on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance) for more information.

Component authors can take advantage of CSS inheritance to set styles on the host element that are inherited by all elements in the template. 

To do this, set inherited properties on the host element with the `:host` CSS pseudo-class:

```js
static get styles() {
  return css`
    :host { 
      font-family: Roboto;
      font-size: 20;
    }
  `;
}
render() {
  return html`<p>Inherits font styles</p>`;
}
```

{% include project.html folder="style/inherited" openFile="my-element.js" %}

Any properties that a host element inherits will also be inherited by the elements in its template:

```html
  <style>
    div { font-family: Roboto; }
  </style>
  <div><my-element></my-element></div>
```

```js
class MyElement extends LitElement {
  render() { 
    return html`<p>will use Roboto</p>`; 
  }
}
```

{% include project.html folder="style/inherited2" openFile="my-element.js" %}

A host element can also be styled with its element type selector:

```html
<style>
  my-element { font-family: Roboto; }
</style>
<my-element></my-element>
```

```js
class MyElement extends LitElement {
  render() { 
    return html`<p>will also use Roboto</p>`; 
  }
}
```

An element type selector has higher specificity than the `:host` pseudo-class selector. Styles set for a host element from the main document will override styles set with `:host` and `:host()`:

```html
<style>
  /* has higher specificity than :host */
  my-element { font-family: Courier; }
</style>
<my-element></my-element>
```

```js
class MyElement extends LitElement {
  static get styles() { 
    return css`:host { font-family: Roboto; }`
  }
  render() {
    return html`<p>will use courier</p>`;
  }
}
```

### CSS custom properties {#css-properties}

All CSS custom properties (<code>--<var>custom-property-name</var></code>) inherit. You can use this to make your component's styles configurable from outside. 

The following component sets its background color to a CSS variable. The CSS variable evaluates to the value of `--my-background` if `--my-background` is available, and to `yellow` otherwise:

```js
class MyElement extends LitElement {
  static get styles() { 
    return css`
      :host { 
        background-color: var(--my-background, yellow); 
      }
    `;
  }
  render() { return html`<p>hi</p>`; }
}
```

Users of this component can set `--my-background` on the host element from their main document:

```html
<style>
  my-element {
    --my-background: rgb(67, 156, 144);
  }
</style>
<my-element></my-element>
```

If a component user has an existing app theme, they can easily set the host element's configurable properties to their existing theme properties:

```html
<style>
  html {
    --themeColor1: rgb(67, 156, 144);
  }
  my-element {
    --my-background: var(--themeColor1);
  }
</style>
```

```js
{% include projects/style/customproperties/my-element.js %}
```

{% include project.html folder="style/customproperties" openFile="my-element.js" %}

See [CSS Custom Properties on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) for more information.

### A simple example theme {#example-theme}

_index.html_

```html
{% include projects/style/theming/index.html %}
```

_my-element.js_

```js
{% include projects/style/theming/my-element.js %}
```

{% include project.html folder="style/theming" openFile="theme.css" %}

## Use lit-html's styleMap and classMap functions {#directives}

LitElement is based on the lit-html templating library, which offers two functions, `classMap` and `styleMap`, to help apply classes and styles to HTML templates. 

For more information on these and other lit-html directives, see the documentation on [lit-html built-in directives](https://lit-html.polymer-project.org/guide/template-reference#built-in-directives).

To use these functions:

1.  Install the `lit-html` package, and add it as a dependency of your project:

    ```bash
    npm install --save lit-html
    ```

2.  Import `classMap` and/or `styleMap`:

    ```js
    import { classMap } from 'lit-html/directives/class-map';
    import { styleMap } from 'lit-html/directives/style-map';
    ```

3.  Use `classMap` and/or `styleMap` in your element template:

    ```js
    constructor() {
      super();
      this.classes = { mydiv: true, someclass: true };
      this.styles = { color: 'green', fontFamily: 'Roboto' };
    }
    render() {
      return html`
        <div class=${classMap(this.classes)} style=${styleMap(this.styles)}>
          some content
        </div>
      `;
    }
    ```

{% include project.html folder="style/maps" openFile="my-element.js" %}

`classMap` applies a set of classes to an HTML element:

```html
<div class=${classMap({alert:true,info:true})}>An info alert box.</div>
<!-- Equivalent: <div class="alert info">An info alert box.</div> -->
```

{% include project.html folder="style/classmap" openFile="my-element.js" %}

`styleMap` applies a set of CSS rules to an HTML element:

```html
<button style=${styleMap({
  backgroundColor: 'blue',
  border: '1px solid black'
})}>A button</button>

<!-- Equivalent: 
  <button style="
    background-color:blue;
    border: 1px solid black;
  ">A button</button>
-->
```

{% include project.html folder="style/stylemap" openFile="my-button.js" %}

To refer to hyphenated properties such as `font-family`, use the camelCase equivalent (`fontFamily`) or place the hyphenated property name in quotes (`'font-family'`). 

To refer to custom CSS properties such as `--custom-color`, place the whole property name in quotes (`'--custom-color'`).

|**Inline style or CSS**|**styleMap equivalent**|
|----|----|
| `background-color: blue;` <br/> | `backgroundColor: 'blue'` <br/><br/> or <br/><br/>`'background-color': 'blue'`|
| `font-family: Roboto, Arial, sans-serif;` <br/> | `fontFamily: 'Roboto, Arial, sans-serif'` <br/><br/> or <br/><br/>`'font-family': 'Roboto, Arial, sans-serif'`|
|`--custom-color: #FFFABC;`|`'--custom-color': '#FFFABC;'`|
|`--otherCustomColor: #FFFABC;`|`'--otherCustomColor': '#FFFABC;'`|
|`color: var(--customprop, blue);`|`color: 'var(--customprop, blue)'`|

**Examples**

Inline style syntax:

```html 
<div style="
  background-color:blue;
  font-family:Roboto, Arial, sans-serif;
  --custom-color:#FFFABC;
  --otherCustomColor:#FFFABC;">
</div>
```

Equivalent CSS syntax:

```css
div {
  background-color: blue;
  font-family: Roboto, Arial, sans-serif;
  --custom-color: #FFFABC;
  --otherCustomColor: #FFFABC;
}
```

Equivalent `styleMap` syntax:

```js 
html`
  <div style=${styleMap({
    'background-color': 'blue',
    fontFamily: 'Roboto, Arial, sans-serif',
    '--custom-color': '#FFFABC',
    '--otherCustomColor': '#FFFABC'
  })}></div>
`
```

{% include project.html folder="style/stylemap2" openFile="index.html" %}

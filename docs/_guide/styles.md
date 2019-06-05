---
layout: guide
title: Styles
slug: styles
---

{::options toc_levels="1..3" /}
* ToC
{:toc}

It’s easy to style LitElement templates and components with plain CSS. Here are some examples of how the main styling use cases work:

## Basic examples

### Style the contents of a template 

The following code applies styling to all `<button>` elements inside a template:

```js
class MyElement extends LitElement {
  static get styles() {
    return css`
      button { width: 200px; }
    `;
  }
  render() {
    return html`<button>click</button>`;
  }
}
```

{% include project.html folder="style/introbutton" openFile="index.html" %}

### Style a LitElement custom HTML tag 

The following code applies styling to a LitElement custom HTML tag:

```html
<style>
  my-element { margin: 100px; }
</style>
<my-element></my-element>
```

{% include project.html folder="style/intromargin" openFile="index.html" %}

### Expose properties in a template for styling 

Sometimes, you might want to make some properties of the elements in a LitElement template stylable from outside.

The following template uses a CSS variable to expose the `width` property of its `<button>` elements:

```js
class MyElement extends LitElement {
  static get styles() {
    return css`
      button { width: var(--buttonWidth); }
    `;
  }
  render() {
    return html`<button>click</button>`;
  }
}
```

To style the `width` property from outside the template, set the `--buttonWidth` custom CSS property, using the component's HTML tag as a CSS selector:

```html
<style>
  my-element { --buttonWidth: 200px; }
</style>
<my-element></my-element>
```

{% include project.html folder="style/introcustomprops" openFile="index.html" %}

See the section on [CSS custom properties](#custom-properties) for more information.

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
      * { color: red; }
      p { font-family: sans-serif; }
      .myclass { margin: 100px; }
      #main { padding: 30px; }
      h1 { font-size: 4em; }
    `;
  }
  render() {
    return html`
      <p>Hello World</p>
      <p class="myclass">Hello World</p>
      <p id="main">Hello World</p>
      <h1>Hello World</h1>
    `;
  }
}
```

{% include project.html folder="style/styleatemplate" openFile="my-element.js" %}

The example above places the template styles in a static `styles` property, but you could also put them in a `<style>` block or an external stylesheet—see [Where to put your styles](#where) for details.

In general, styles inside a LitElement template can only affect elements in the same template. Likewise, the elements in a LitElement template can only be affected by styles in that same template (with the exception of CSS inheritance. See the section on [CSS inheritance](#inheritance) for more information).

This means that you don't have to worry about the styles you set in your LitElement templates accidentally affecting the rest of your page, and vice versa.

### ...A LitElement custom HTML tag {#how-to-style-host}

Apply styles to the custom HTML tag of a LitElement component by styling its type selector, the same way you style normal HTML elements: 

```html
<head>
  <style>
    div, my-element {
      padding: 20px;
      margin: 30px;
    }
  </style>
</head>
<body>
  <div>I am div.</div>
  <my-element></my-element>
</body>
```

{% include project.html folder="style/stylecustomtag" openFile="my-element.js" %}

When the browser renders a LitElement component into an HTML document, by default, the contents of its template are placed in a **shadow root**—a special HTML subsection that is hidden from the main document.

For example, the following code:

```js
class MyElement extends LitElement {
  render() {
    return html`<p>template content</p>`;
  }
}
```

```html
<my-element></my-element>
```

Produces an HTML document that looks like this:

```html
<my-element>
  #shadowRoot
    <p>template content</p>
```

The element in the main document that contains the shadow root is called the **host**. In the example above, the host is `<my-element>`.

To style the host from inside your component's template, use the special `:host` and `:host()` CSS features. These features allow you to "peek outside" a template and style its container.

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

{% include project.html folder="style/host" openFile="my-element.js" %}

{:.alert .alert-info}
<div>

**Styles set for a custom element tag will override styles set with `:host` and `:host()`.** See the section below on [CSS inheritance](#specificity) for more information.

</div>

### ...Slotted content {#how-to-style-slotted}

The `<slot>` element acts as a placeholder in a LitElement template. For example: 

```js
class MyElement extends LitElement {
  render() {
    return html`<slot></slot>`;
  }
}
```

```html
<my-element><p>Slotted content</p></my-element>
```

{% include project.html folder="style/slottedbase" openFile="my-element.js" %}

Use the `::slotted()` CSS pseudo-element to select elements that are included in your template via the `<slot>` element.

*   `::slotted(*)` matches all slotted elements.

*   `::slotted(p)` matches slotted paragraphs.

*   `p ::slotted(*)` matches slotted elements in a paragraph element.

```js
{% include projects/style/slottedselector/my-element.js %}
```

{% include project.html folder="style/slottedselector" openFile="my-element.js" %}

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
    return css`
      button { color: red; }
    `;
  } 
  render() {
    return html`<button>click</button>`;
  }
}
```

{% include project.html folder="style/introbutton" openFile="my-element.js" %}

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

A component can inherit the styles from a LitElement superclass:

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

For security reasons, expressions in static styles must be tagged with the `cssLiteral` template literal tag:

```js
{% include projects/style/expressions/my-element.js %}
```

{% include project.html folder="style/expressions" openFile="my-element.js" %}

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
{% include projects/style/where/some-element.js %}
```

{% include project.html folder="style/where" openFile="some-element.js" %}

There are some important caveats though:

*  The [ShadyCSS polyfill](https://github.com/webcomponents/shadycss/blob/master/README.md#limitations) doesn't support external stylesheets.

*   External styles can cause a flash-of-unstyled-content (FOUC) while they load.

*   The URL in the `href` attribute is relative to the _main document_. This is okay if you're building an app and your asset URLs are well-known. Avoid using external stylesheets in reusable elements.

## Make an app theme {#theme}

Use CSS inheritance to share styles, and custom CSS properties to configure them. Use both together to build an app theme.

### CSS inheritance {#inheritance}

CSS inheritance provides a way for parent and host elements to propagate certain CSS properties to their descendents.

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

{% include project.html folder="style/inherited2" openFile="index.html" %}

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

{% include project.html folder="style/inherited3" openFile="index.html" %}

#### Type selectors have higher specificity than :host {#specificity}

An element type selector has higher specificity than the `:host` pseudo-class selector. Styles set for a custom element tag will override styles set with `:host` and `:host()`:

```html
<style>
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
    return html`<p>Will use courier</p>`;
  }
}
```

{% include project.html folder="style/specificity" openFile="index.html" %}

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
  render() {
    return html`<p>Hello world</p>`;
  }
}
```

Users of this component can set the value of `--my-background` for the component, using the `my-element` tag as a CSS selector:

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
{% include projects/style/customproperties/index.html %}
```

{% include project.html folder="style/customproperties" openFile="index.html" %}

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

LitElement is based on the lit-html templating library, which offers two functions, `classMap` and `styleMap`, to apply classes and styles in HTML templates. 

For more information on these and other lit-html directives, see the documentation on [lit-html built-in directives](https://lit-html.polymer-project.org/guide/template-reference#built-in-directives).

To use `styleMap` and/or `classMap`:

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
          Hello World
        </div>
      `;
    }
    ```

{% include project.html folder="style/maps" openFile="my-element.js" %}

### classMap syntax {#classmap}

`classMap` applies a set of classes to an HTML element:

```html
<div class=${classMap({alert:true,info:true})}>An info alert box.</div>
<!-- Equivalent: <div class="alert info">An info alert box.</div> -->
```

{% include project.html folder="style/classmap" openFile="my-element.js" %}

### styleMap syntax {#stylemap}

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

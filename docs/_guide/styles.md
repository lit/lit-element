---
layout: guide
title: Styles
slug: styles
---

{::options toc_levels="1..3" /}
* ToC
{:toc}

It’s easy to style LitElement templates and components with plain CSS. Here are some examples of how the main styling use cases work:

## Style the contents of a template 

The following code applies styling to all `<button>` elements inside a template:

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

## Style a LitElement custom HTML tag 

The following code applies styling to a LitElement custom HTML tag:

```html
<style>
  my-element { margin-left: 50px; }
</style>
<my-element></my-element>
```

## Expose properties in a template for styling 

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

Use the `::slotted()` CSS pseudo-element to select elements that have been included in your template via the `<slot>` element.

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

---
layout: guide
title: Styles
slug: styles
---

{::options toc_levels="1..3" /}
* ToC
{:toc}

This page is a guide to the styling options available for LitElement components. 

* [Styling options for component developers](#styling-for-developers) describes how to apply styles internally to a component that you're building.

* [Styling options for component consumers](#styling-for-consumers) describes how to style an element that you're importing and using. 

* [Theming](#theming) is relevant to both developers and consumers of a LitElement-based component. It describes how to create easily stylable LitElement components, and how to create a style theme that can easily be applied to imported LitElement components.

<div class="alert alert-info">

**If you're using the Shady CSS polyfill, be aware that it has some limitations.** See the [Shady CSS README](https://github.com/webcomponents/shadycss/blob/master/README.md#limitations) for more information.

</div>

## Styling options for component developers {#styling-for-developers}

The [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) API allows the creation of encapsulated DOM trees that are attached to a custom element. 

The root node of a shadow DOM tree is called the **shadow root**. The element in the main document that has a shadow root attached to it is called the **host element**, or **host**.

By default, LitElement creates a shadow root for your host element. LitElement renders the DOM structure described in your element template into this shadow root. 

Shadow DOM scopes CSS so that styles defined in a shadow root only apply to DOM inside the shadow root, and do not "leak" to outside DOM. With the exception of inherited CSS properties, shadow roots are also isolated from styles defined outside the shadow root, whether in the main page or an outer shadow root.

This section describes how to create styles in your shadow root to style your host element and its shadow DOM.

### Where to define your styles {#where}

There are three main places in which you can define styles for your host element and its shadow DOM:

* [In the static `styles` property of a LitElement class (recommended)](#static-styles).
* [Inside a `<style>` element in the HTML template defined in your `render` function](#style-element).
* [In an external stylesheet, linked to from your LitElement template with `<link rel="stylesheet" href="...">`](#external-stylesheet).

### Define styles in a static styles property {#static-styles}

LitElement lets you define static styles that apply to all instances of a component.

We recommend using static styles for optimal performance. LitElement uses [Constructable Stylesheets](https://wicg.github.io/construct-stylesheets/) in browsers that support it, with a fallback for browsers that don't. Constructable Stylesheets allow the browser to parse styles exactly once and reuse the resulting Stylesheet object for maximum efficiency.

The styles in the static `styles` property are evaluated once only and applied to all instances of the element. You can modify styles per element instance by using [CSS custom properties](#cssprops):

*   The element **developer** defines a style rule inside shadow DOM that uses CSS variables to apply a custom CSS property to a particular style property.
*   The element **consumer** defines the value of the custom CSS property outside shadow DOM in a CSS rule that is inherited by the host element.

If you don't want to use custom properties, you can define per-instance styles in a `<style>` element inside shadow DOM. See the section on [Defining your styles in a style element](#styleelement) for more information.

To define a static `styles` property:

1.  Import the `css` helper function from the `lit-element` module:

    ```js
    import {LitElement, css} from 'lit-element';
    ```

2.  Create a static `styles` property and define your styles in plain CSS.

    The value of the static `styles` property can be:
    
    *   A single tagged template literal:
    
        ```js
        class MyElement extends LitElement {
          static get styles() {
            return css`
            :host {
              display: block;
            }`;
          } 
        }
        ```

    *   Or an array of tagged template literals:

        ```js
        class MyElement extends LitElement {
          static get styles() {
            return [ css`:host { display: block; }`, ...];
          }
        }
        ```

        Using an array of tagged template literals lets you inherit the styles from a LitElement superclass, and add more:

        ```js
        class MySubElement extends MyElement {
          static get styles() {
            return [
              super.styles,
              css`
                :host(.important) {
                  color: red;
                }
              `
            ];
          }
        }
        ```

#### Expressions in static styles

Static styles apply to all instances of an element. Any expressions in your CSS are evaluated and included **once**, then reused for all instances. 

To prevent LitElement-based components from evaluating potentially malicious code, the `css` tag only accepts literal strings. You can nest them like this:

```js
static get styles() {
  const mainColor = css`red`;

  return css`
    :host { 
      color: ${mainColor}; 
    }
  `;
}
```

However, if you want to inject any variable or non-literal into a css string, you must wrap it with the `unsafeCSS` function. For example:

```js
import { LitElement, css, unsafeCSS } from 'lit-element';

class MyElement extends LitElement {
  static get styles() {
    const mainColor = 'red';
    
    return css`
      :host { 
        color: ${unsafeCSS(mainColor)};
      }
    `;
  } 
}
```

Another example:

```js
import { LitElement, css, unsafeCSS } from 'lit-element';

class MyElement extends LitElement {
  static get styles() {
    const mainWidth = 800;
    const padding = 20;   
    
    return css`
      :host { 
        width: ${unsafeCSS(mainWidth + padding)}px;
      }
    `;
  } 
}
```

<div class="alert alert-warning">

**Only use the `unsafeCSS` tag with trusted input.** To prevent LitElement-based components from evaluating potentially malicious code, the `css` tag only accepts literal strings. `unsafeCSS` circumvents this safeguard.

</div>

### Define styles in a style element {#style-element} 

We recommend using static styles to style LitElement components. However, in some cases you may want to evaluate and apply styles per instance, rather than to all instances of a LitElement component. One way to do this is to include inline styles in a `<style>` element in your template, and use your element's properties in your CSS rules to evaluate styles per instance.

<div class="alert alert-warning">

**Expressions inside a `<style>` element won't update per instance in ShadyCSS**. Due to limitations of the ShadyCSS polyfill, you can't use element properties in CSS rules as the expressions won't be evaluated.

</div>

```js
import {LitElement, property} from 'lit-element';

class MyElement extends LitElement {
  @property() mainColor = 'blue';
  render() {
    return html`
      <style>
        :host {
          color: ${this.mainColor};
        }
      </style>
    `;
  }
}
```

### Define styles in an external stylesheet {#external-stylesheet}

We strongly recommend static styles, CSS custom properties, or [lit-html's `classMap` or `styleMap` directives](TODO) if you're styling non-host shadow root contents.

However, you can load an external stylesheet into a shadow root with a `<link>` element:

```js
import {LitElement} from 'lit-element';

class MyElement extends LitElement {
  render() {
    return html`
      <link rel="stylesheet" href="./styles.css">
    `;
  }
}
```

This can be a good way to load CSS generated from tools like SASS/LESS.

There are some important caveats though:

* External styles can cause a flash-of-unstyled-content (FOUC) while they load.
* The URL in the `href` attribute is relative to the _main document_, making this technique mostly useful for application elements where asset URLs are well known, and not for reusable elements published publicly.

### Write CSS styles for a host element and its shadow DOM {#shadow-dom-styles}

In this section: 

* [Write CSS styles for a host element](#host-styles).
* [Write CSS styles for elements in shadow DOM](#shadow-dom-styles).
* [Write CSS styles for slotted children](#slotted-styles). Light DOM children of your host element can be rendered in shadow DOM via the `slot` element.

#### Write CSS styles for a host element {#host-styles}

An element can apply styles to itself with the `:host` and `:host()` CSS psuedo-classes used inside the element's ShadowRoot. The term "host" is used because an element is the host of its own shadow root.

* `:host` selects the host element of the shadow root:

  ```css
  :host {
    display: block;
    color: blue;
  }
  ```

* `:host(...)` selects the host element, but only if the selector inside the parentheses matches the host element:

  ```css
  :host(.important) {
    color: red;
    font-weight: bold;
  }
  ```

{% include project.html folder="style/hostselector" openFile="my-element.js" %}

Two best practices for working with custom elements are:

* Add a `:host` display style (such as `block` or `inline-block`) unless you prefer the default of `inline`.

  Inline elements are sized by their content and cannot have their dimensions set via CSS. They can also cause block element children to overflow its bounds.

  ```css
    :host {
      display: block;
    }
  ```

* Add a `:host()` display style that respects the `hidden` attribute.

  ```css
    :host([hidden]) {
      display: none;
    }
  ```

{% include project.html folder="style/bestpracs" openFile="my-element.js" %}

See [Custom Element Best Practices](https://developers.google.com/web/fundamentals/web-components/best-practices) for more information.

#### Write CSS styles for elements in shadow DOM {#shadow-dom-styles}

To style elements in a shadow root, simply use standard CSS selectors.

Since CSS selectors in a shadow root only apply to elements in the shadow root, you don't need to be defensive against accidentally styling other elements in the page. This means you can generally write much simpler selectors, that are easier to reason about, and faster, than without shadow DOM.

Simple selectors, like `*`, tagname, id, and class selectors, are fine in a shadow root because they don't match outside the root:

```css
* {
  color: black;
}

h1 {
  font-size: 4rem;
}

#main {
  padding: 16px;
}

.important {
  color: red;
}
```

#### Write CSS styles for slotted children {#slotted-styles}

Use the `::slotted()` CSS pseudo-element to select light DOM children that have been included in shadow DOM via the `<slot>` element.

* `::slotted(*)` matches all slotted elements.

* `::slotted(p)` matches slotted paragraphs.

* `p ::slotted(*)` matches slotted elements in a paragraph element.

```js
{% include projects/style/slotted/my-element.js %}
```

{% include project.html folder="style/slotted" openFile="my-element.js" %}

## Styling options for component consumers {#styling-for-consumers}

When you use a LitElement component, you can set styles from the main document by using its custom element tag as a selector. For example:

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

<div class="alert alert-info">

An element type selector has higher specificity than the `:host` pseudo-class selector. 

Styles set for a host element from outside its shadow DOM will override styles set with the `:host` or `:host()` pseudo-class selectors inside shadow DOM. See Inheritance. 

</div>

## Theming

This section describes how to use CSS inheritance and custom CSS properties to:

* Create easily stylable LitElement components.
* Create a style theme that can easily be applied to imported LitElement components.

### CSS Inheritance and shadow DOM {#inheritance}

[Inherited CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance) like `color`, `font-family`, and all CSS custom properties (`--*`) inherit through shadow root boundaries.

This means that by default an element will share some important styles from its outside context.

Component authors can take advantage of this to style all of a shadow root's contents by setting inherited properties on the host with the `:host` CSS pseudo-class:

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

{% include project.html folder="style/inherited" openFile="my-element.js" %}

If a host element itself inherits properties from another element, the host's shadow DOM children will inherit those properties in turn:

```html
  <style>
    div { font-family: Roboto; }
  </style>
  <div>
    <my-element>Will use Roboto font</my-element>
  </div>
```

{% include project.html folder="style/inherited2" openFile="my-element.js" %}

A LitElement component can be styled by using its custom element tag as a selector. For example:

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

An element type selector has higher specificity than the `:host` pseudo-class selector. 

Styles set for a host element from outside its shadow DOM will override styles set with the `:host` or `:host()` pseudo-class selectors inside shadow DOM. For example:

_index.html_ 

```html
<style>
  /* Overrides the `color` property of the `:host` styles in my-element.js */
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
  :host {
    color: red;
    background-color: aliceblue;
  }
</style>
```

### Custom CSS Properties {#css-properties}

Custom properties inherit down the DOM tree, and through shadow root boundaries. You can use this to let your users apply styles and themes to your elements.

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

---
layout: guide
title: Styles
slug: styles
---

{::options toc_levels="1..3" /}
* ToC
{:toc}

## Overview

This page describes how to style a web component built with LitElement and using shadow DOM.

By default, LitElement creates a shadow root and renders into [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).

Shadow DOM scopes CSS so that styles defined in a shadow root only apply to DOM inside the shadow root, and do not "leak" to outside DOM. Shadow roots are also isolated from styles defined outside the shadow root, whether in the main page or an outer shadow root.

**This guide applies only if you use the default (shadow DOM) render root.** If you [modify your element's render root](templates#renderroot) to render into the main DOM tree instead of a shadow root, these instructions won't apply.
{.alert-info}

**If you're using the Shady CSS polyfill, be aware that it has some limitations.** See the [Shady CSS README](https://github.com/webcomponents/shadycss/blob/master/README.md#limitations) for more information.
{.alert-info}

## Where to put your styles

There are three main places from which you can define CSS styles for a LitElement component:

* [In the static `styles` property of a LitElement class (recomended)](#staticstyles).
* [Inline, inside a `<style>` element within the HTML template defined in your `render` function](#inline).
* [In an external stylesheet, linked from your LitElement template with `<link rel="stylesheet" href="...">`](#linkedstylesheet).

### Define static styles

LitElement lets you define static styles that apply to all instances of a component. 

<div class="alert alert-info">

**Use static styles for optimal performance.** LitElement uses [Constructable Stylesheets](https://wicg.github.io/construct-stylesheets/) in browsers that support this new standard, with a fallback for browsers that don't. Constructable Stylesheets allow LitElement to parse styles exactly once and reuse the resulting Stylesheet object for maximum efficiency.

</div>

To define static styles for a component:

1.  Import the `css` helper function from the `lit-element` module:

    ```js
    import {LitElement, css} from 'lit-element';
    ```

2.  Create a static `styles` property and define your styles in plain CSS.

    The value of the static `styles` property can be:
    
    *   A single tagged template literal:
    
        ```js
        class MyElement extends LitElement {
          static styles = css`
            :host {
              display: block;
            }
          `;
        }
        ```

    *   Or an array of tagged template literals:

        ```js
        class MyElement extends LitElement {
          static styles = [ css`:host { display: block; }`, ...];
        }
        ```

        Using an array of tagged template literals lets you inherit the styles from a LitElement superclass, and add more:

        ```js
        class MySubElement extends MyElement {
          static styles = [
            super.styles,
            css`
              :host([.important]) {
                color: red;
              }
            `
          ];
        }
        ```

#### Expressions in styles

Static styles apply to all instances of an element. Any expressions in your CSS are evaluated and included **once**, then reused for all instances. 

For security reasons, the only types of values that can be interpolated into static styles are values returned by the `cssLiteral` and `unsafeCSS` template tags. 

To do an expression:

```js
const mainColor = cssLiteral`red`;

class MyElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      color: ${mainColor}
    }
  `;
}
```

#### Styling elements per-instance

To define styles for an element instance, you can use CSS custom properties. E.g.

In your element:

```js
class MyElement extends LitElement {
  static styles = css`
    :host { 
      display: block;
      color: var(--my-element-text-color); 
      background: var(--my-element-background-color);  
    }
  `;
}
```

In html where your element is used:

```html
<style>
  html {
    --theme-primary: green;
    --theme-secondary: aliceblue;
    --theme-warning: red;
  }
  my-element { 
    --my-element-text-color: var(--theme-primary); 
    --my-element-background-color: var(--theme-secondary); 
  } 
  my-element.warning {
    --my-element-text-color: var(--theme-warning); 
  }
</style>
...
<my-element></my-element>
<my-element class="warning"></my-element>
```

Or use inline styles.

### Inline styles

You can also style a shadow root by including inline styles in your element template. We still recommend static styles, but in some cases you may want to vary the CSS per-element. One way to do this is with bindings in `<style>` elements. 

<div class="alert alert-warning">

**this will not work with shadow DOM polyfills like ShadyCSS** this won't work with shadyCsss.

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

### External stylesheets

You can load an external stylesheet into a shadow root with a `<link>` element:

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

## What you can style

* [Styling the host element](#host).
* [Styling elements in the host's shadow root](#children).
* [Styling slotted elements](#slot). Slotted elements are rendered in shadow DOM via the `slot` element - see MDN for more info. 

You can't style other stuff because encapsulation
 
### Styling the host element {#host}

An element can apply styles to itself with the `:host` and `:host()` CSS psuedo-classes used inside the element's ShadowRoot. The tern "host" is used because an element is the host of its own shadow root.

* `:host` selects the host element of the shadow root:

  ```css
  :host {
    display: block;
    color: blue;
  }
  ```

* `:host(...)` selects the host element, but only if the selector inside the parentheses matches the host element:

  ```css
  :host([.important]) {
    color: red;
    font-weight: bold;
  }
  ```

{% include project.html folder="docs/style/hostselector" openFile="my-element.js" %}

**The :host CSS pseudo-class has higher specificity than the element's type selector.** Styles set for your host with the `:host` pseudo-class from inside its own shadow root will override styles set from outside its shadow root. For example:

_index.html_ 

```html
<style>
  my-element { 
    color: blue;
  }
</style>
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

See the MDN documentation on [:host](https://developer.mozilla.org/en-US/docs/Web/CSS/:host) and [:host()](https://developer.mozilla.org/en-US/docs/Web/CSS/:host()) for more information.

#### Host styling best practices

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

{% include project.html folder="docs/style/bestpracs" openFile="my-element.js" %}

See [Custom Element Best Practices](https://developers.google.com/web/fundamentals/web-components/best-practices) for more information.

### Styling elements in the host's shadow root

To style elements in a shadow root, use standard CSS selectors.

```css

```

Since CSS selectors in a shadow root only apply to elements in the shadow root, you don't need to be defensive against accidentally styling other elements in the page. This means you can generally write much simpler selectors, that are easier to reason about, and faster, than without shadow DOM.

Simple selectors, like `*`, tagname, id and class selectors, are fine in a shadow root because they don't match outside the root:
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

## Inherited properties

[Inherited CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance), like `color`, `font-family`, and all CSS custom properties (`--*`) _do_ inherit through shadow root boundaries.

This means by default your elements will share some important styles from their outside context.

You can take advantage of this to style all of a shadow root's contents by setting inherited properties on the host with the `:host` CSS pseudo-class:

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
  <div>
    <my-element>Will use Roboto font</my-element>
  </div>
```

{% include project.html folder="docs/style/inherited2" openFile="my-element.js" %}

## Styling slotted elements

Use the `::slotted()` CSS pseudo-element to select light DOM elements that have been included in shadow DOM via the `<slot>` element.

* `::slotted(*)` matches all slotted elements.

* `::slotted(p)` matches slotted paragraphs.

* `p ::slotted(*)` matches slotted elements in a paragraph element.

```js
{% include projects/docs/style/slotted/my-element.js %}
```

{% include project.html folder="docs/style/slotted" openFile="my-element.js" %}


## Styling custom elements from outside their shadow root

You can style custom elements from outside its own shadow root.

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

### Use custom properties

Custom properties inherit down the DOM tree, and through shadow root boundaries You can use this to let your users apply styles and themes to your elements.

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
      :host([hidden]) { display: none; }
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

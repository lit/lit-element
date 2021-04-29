# LitElement

LitElement is simple base class for creating fast, lightweight web components with [lit-html](https://lit-html.polymer-project.org/).

[![Build Status](https://travis-ci.org/lit/lit-element.svg?branch=master)](https://travis-ci.org/lit/lit-element)
[![Published on npm](https://img.shields.io/npm/v/lit-element.svg)](https://www.npmjs.com/package/lit-element)
[![Join our Slack](https://img.shields.io/badge/slack-join%20chat-4a154b.svg)](https://lit.dev/slack-invite/)
[![Mentioned in Awesome lit-html](https://awesome.re/mentioned-badge.svg)](https://github.com/web-padawan/awesome-lit)

## Looking for Lit?

LitElement is now part of the [Lit library monorepo](https://github.com/lit/lit). Lit 2 includes lit-html 2.x and LitElement 3.x. 

This repo contains the code for LitElement 2.x.

## Documentation

For LitElement 2.x documentation, see the [legacy documentation site](https://lit-element.polymer-project.org).

For Lit 2, the next version of LitElement and lit-html, see the [Lit site](https://lit.dev). 

## Overview

LitElement uses [lit-html](https://lit-html.polymer-project.org/) to render into the
element's [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
and adds API to help manage element properties and attributes. LitElement reacts to changes in properties
and renders declaratively using `lit-html`. See the [lit-html guide](https://lit-html.polymer-project.org/guide)
for additional information on how to create templates for lit-element.

```ts
    import {LitElement, html, css, customElement, property} from 'lit-element';

    // This decorator defines the element.
    @customElement('my-element')
    export class MyElement extends LitElement {

      // This decorator creates a property accessor that triggers rendering and
      // an observed attribute.
      @property()
      mood = 'great';

      static styles = css`
        span {
          color: green;
        }`;

      // Render element DOM by returning a `lit-html` template.
      render() {
        return html`Web Components are <span>${this.mood}</span>!`;
      }

    }
```

```html
    <my-element mood="awesome"></my-element>
```

Note, this example uses decorators to create properties. Decorators are a proposed
standard currently available in [TypeScript](https://www.typescriptlang.org/) or [Babel](https://babeljs.io/docs/en/babel-plugin-proposal-decorators). LitElement also supports a [vanilla JavaScript method](https://lit-element.polymer-project.org/guide/properties#declare) of declaring reactive properties.

## Examples

  * Runs in all [supported](#supported-browsers) browsers: [Glitch](https://glitch.com/edit/#!/hello-lit-element?path=index.html)

  * Runs in browsers with [JavaScript Modules](https://caniuse.com/#search=modules): [Stackblitz](https://stackblitz.com/edit/lit-element-demo?file=src%2Fmy-element.js), [JSFiddle](https://jsfiddle.net/sorvell1/801f9cdu/), [JSBin](http://jsbin.com/vecuyan/edit?html,output),
[CodePen](https://codepen.io/sorvell/pen/RYQyoe?editors=1000).

  * You can also copy [this HTML file](https://gist.githubusercontent.com/sorvell/48f4b7be35c8748e8f6db5c66d36ee29/raw/67346e4e8bc4c81d5a7968d18f0a6a8bc00d792e/index.html) into a local file and run it in any browser that supports [JavaScript Modules]((https://caniuse.com/#search=modules)).

## Installation

From inside your project folder, run:

```bash
$ npm install lit-element
```

To install the web components polyfills needed for older browsers:

```bash
$ npm i -D @webcomponents/webcomponentsjs
```

## Supported Browsers

The last 2 versions of all modern browsers are supported, including
Chrome, Safari, Opera, Firefox, Edge. In addition, Internet Explorer 11 is also supported.

Edge and Internet Explorer 11 require the web components polyfills.

## Forward Compatibility With Lit 2 

Lit 2 (LitElement 3.0) has a few breaking changes and deprecations that have been back-ported to LitElement 2.5 in order to ease upgrading.

To prepare for Lit 2, update these APIs:

| LitElement 2.4         | LitElement 2.5/Lit 2  |
|------------------------|-----------------------|
| Decorator imports:<br>`import {customElement} from 'lit-element';` | `import {customElement} from 'lit-element/decorators.js';`
| `@internalProperty() foo;`  | `@state() foo;`            |
| Override `_getUpdateComplete()` | Override `getUpdateComplete()` |
| Shadow root options:</br> Override `createRenderRoot()`. | Add `static shadowRootOptions`.
| `import {UpdatingElement} from 'lit-element';` |  `import {ReactiveElement} from 'lit-element';`  |
## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md).

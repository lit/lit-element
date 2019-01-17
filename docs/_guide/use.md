---
layout: guide
title: Use a component
slug: use
---

{::options toc_levels="1..3" /}
* ToC
{:toc}

This page describes how to [use a LitElement component in your application](#use). It also describes how to make sure your deployed code is browser-ready by [building it for production](#build) and [loading the Web Components polyfills](#polyfills).

## Use a LitElement component {#use}

This is a general guide to using third-party LitElement components. Refer to a component's README or other documentation for specific details.

To use a LitElement component in your code:

1.  Install the component from npm.

    ```
    npm install --save some-package-name
    ```

2.  Import the component.

    In a JavaScript module: 

    ```js
    import 'some-package-name';
    ```

    In an HTML page:

    ```html
    <script type="module">
    import './path-to/some-package-name/some-component.js';
    </script>
    ```

    Or:

    ```html
    <script type="module" src="./path-to/some-package-name/some-component.js"></script>
    ```

3.  Add the component to the page via markup:

    ```html
    <some-component></some-component>
    ```

## Build for production {#build}

LitElement is published on npm using JavaScript Modules. This means it can take advantage of the standard native JavaScript module loader available in all current major browsers. 

You will need a light transform to resolve LitElement's npm dependencies. This can be done with a bundler such as WebPack or Rollup.

The following example configuration for [Rollup](https://rollupjs.org/guide/en) resolves modules and dependencies, and bundles the output.

**rollup.config.js**

```js
import resolve from 'rollup-plugin-node-resolve';

export default {
  // If using any exports from a symlinked project, uncomment the following:
  // preserveSymlinks: true,
	input: ['src/index.js'],
	output: {
		file: 'build/index.js',
    format: 'es',
		sourcemap: true
	},
	plugins: [
    resolve()
  ]
};
```

See a [sample build configuration for LitElement with Babel and Rollup](https://github.com/PolymerLabs/lit-element-build-rollup/blob/master/src/index.html).

## Load the WebComponents polyfills {#polyfills}

To load the WebComponents polyfills:

1.  Install the `@webcomponents/webcomponentsjs` package:

    ```
    npm install --save-dev @webcomponents/webcomponentsjs
    ```

2.  Add the polyfills to your HTML entrypoint:

    ```html
    <head>
      <!-- 
        If you are loading es5 code you will need 
        custom-elements-es5-loader to make the element work in 
        es6-capable browsers. 
        
        If you are not loading es5 code, you don't need 
        custom-elements-es5-loader. 
      --> 
      <!-- 
      <script src="./path-to/custom-elements-es5-loader.js"></script>
      -->

      <!-- Load polyfills -->
      <script 
        src="path-to/webcomponents-loader.js"
        defer>
      </script> 

      <!-- Load component when polyfills are definitely ready -->
      <script type="module">
        // Take care of cases in which the browser runs this
        // script before it has finished running 
        // webcomponents-loader.js (e.g. Firefox script execution order)
        window.WebComponents = window.WebComponents || { 
          waitFor(cb){ addEventListener('WebComponentsReady', cb) }
        }

        WebComponents.waitFor(async () => { 
          import('./path-to/some-element.js');
        });
      </script>
    </head>
    <body>
      <!-- Add the element to the page -->
      <some-element></some-element>
    </body>
    ```

3.  Ensure that `node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js` and `node_modules/@webcomponents/webcomponentsjs/bundles/**.*` are included in your build.

<div class="alert"> 

**Do not transpile the polyfills.** Bundling them is okay.

</div>

See [the Webcomponentsjs documentation](https://github.com/webcomponents/webcomponentsjs) for more information.

---
layout: guide
title: Use a component
slug: use
---

{::options toc_levels="1..3" /}
* ToC
{:toc}

This page describes how to [use a LitElement component in your application](#use). It also describes how to make sure your deployed application is compatible with your target browsers by [building it for production](#build) and [loading the Web Components polyfills](#polyfills).

## Use a LitElement component {#use}

This is a general guide to using third-party LitElement components. Refer to a component's README or other documentation for specific details.

To use a LitElement component in your code:

1.  Install the component from npm.

    ```
    npm install some-package-name
    ```

2.  Import the component.

    In another JavaScript module: 

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

## Serve for local development {#serve}

LitElement uses npm conventions to reference dependencies by name. A light transform to rewrite specifiers to URLs is required to get it to run in the browser. 

For local development, we recommend installing the [Polymer CLI](https://github.com/Polymer/polymer-cli) and using its development server via `polymer serve`. The development server automatically handles this transform.

To install Polymer CLI:

```
npm install -g polymer-cli
```

From within your project folder, run the development server:

```
polymer serve
```

You can also use tools like [WebPack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/guide/en). See the section on [Rollup configuration](#rollup) for an example configuration.

## Build for production {#build}

LitElement is published on npm using JavaScript Modules. This means it can take advantage of the standard native JavaScript module loader available in all current major browsers. We distribute LitElement as a JavaScript library compiled from LitElement's TypeScript source. 

This section describes how to build an app that uses a LitElement component for production.

To build your app:

1.  [Configure transpilation with Babel](#babel).
2.  [Configure module resolution and bundling](#bundle).

### Configure transpilation with Babel {#babel}

To serve ES Modules:

**.babelrc**

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false,
        "targets": {
          "esmodules": true
        }
      }
    ]
  ],
  "plugins": [@babel/proposal-decorators]
}
```

To serve ES5 code:

**.babelrc**

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": ??,
        "targets": {
          ??
        }
      }
    ]
  ],
  "plugins": [@babel/proposal-decorators]
}
```

### Configure module resolution and bundling {#bundle}

This example uses [Rollup](https://rollupjs.org/guide/en) to resolve modules and dependencies, and bundle the output.

**rollup.config.js**

```js
import resolve from 'rollup-plugin-node-resolve';
import common from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
	input: 'index.js',
	output: {
		dir: 'build',
		format: 'es'
	},
	plugins: [
    resolve(),
    common(),
    babel({
      exclude: 'node_modules/**',
      include: 'src/**'
    })
  ],
  // If using any exports from a symlinked project, uncomment the following:
  // preserveSymlinks: true,
};
```

## Load the WebComponents polyfills {#polyfills}

To load the WebCompnents polyfills:

1.  Install the `@webcomponents/webcomponentsjs` package:

    ```
    npm install --save @webcomponents/webcomponentsjs
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
      <script src="./path-to/custom-elements-es5-loader.js"></script>

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

<div class="alert"> 

**Do not transpile the polyfills.**

</div>

See [the Webcomponentsjs documentation](https://github.com/webcomponents/webcomponentsjs) for more information.

---
layout: guide
title: Use an element
slug: use
---

**TODO: clean this up**

{::options toc_levels="1..3" /}
* ToC
{:toc}

General guide. you must  also the element's README

## import

### Install from npm

```
npm install some-element-package-name
```

### Import the package

```
import 'some-element-package-name';
```

or

```
<script type="module">
import './path-to/some-element-package-name/some-element.js';
</script>
```

### Use in html

```html
<some-element></some-element>
```

## Build an app with a LitElement in it

* babel 
* rollup/webpack

### Configure Babel

* babel - transpile from es2017 to target

e.g. 1 - serving esmodules

**.babelrc**

```
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

e.g. 2 - serving es5

**.babelrc**

```
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


## Configure a bundler 

### Rollup example

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
  ]
};
```

### WebPack example

```js

```


## load Polyfills from entrypoing

Because reasons

  * reason
  * reason


### install polyfills 

```
npm install @webcomponents/webcomponentsjs
```

### Use polyfills

**index.html**

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

**Do not transpile or bundle the polyfills.**

</div>

See [the Webcomponentsjs documentation](https://github.com/webcomponents/webcomponentsjs) for more information.

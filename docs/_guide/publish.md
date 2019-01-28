---
layout: guide
title: Publish an element
slug: publish
---

{::options toc_levels="1..3" /}
* ToC
{:toc}

This page describes how to publish a LitElement component to npm.

We recommend publishing JavaScript modules in standard ES2017. If you're writing your element in standard ES2017, you don't need to transpile for publication. If you're using decorators, class fields, or other ES2017+ features, you will need to transpile your element for publication.

## Publish to npm

To publish your component to npm, [see the instructions on contributing npm packages](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry).

Your package.json configuration should have both the `main` and `module` fields:

**package.json**

```json
{
  "main": "my-element.js",
  "module": "my-element.js"
}
```

You should also create a README describing how to consume your component. A basic guide to consuming LitElement components is documented at [Use a component](use).

## Transpiling with TypeScript

When compiling your code from TypeScript to JavaScript, we recommend targeting ES2017 with Node.js module resolution. See the examples below for suggested options in tsconfig.json.

### Targeting ES2017 (Recommended)

The following JSON sample is a partial tsconfig.json that uses recommended options for targeting ES2017:

```json
  "compilerOptions": {
    "target": "ES2017",
    "module": "ES2017",
    "moduleResolution": "node",
    "lib": ["ES2017", "DOM"],
    "experimentalDecorators": true,
    "outDir": "path/to/your-output-dir"
  }
```

See the 

### ES5

The following JSON sample is a partial tsconfig.json for those who need to target ES5:

```json
  "compilerOptions": {
    "downlevelIteration": true,
    "target": "ES5",
    "module": "ES2015",
    "moduleResolution": "node",
    "lib": ["ES5", "DOM", "ScriptHost" ],
    "experimentalDecorators": true,
    "outDir": "path/to/your-output-dir"
  }
```

<div class="alert alert-info">

**You may need the compiler option `downlevelIteration` when targeting ES5**. The `downlevelIteration` option enables full support for [generators and the Iterator protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Generator_functions) when compiling to ES5. You need this option if your own code iterates over, for example, a `Set` or `Map`. 

The LitElement library is distributed as JavaScript and won't be passing through your TypeScript compiler.

</div>

## Transpiling with Babel

To transpile a LitElement component that uses proposed JavaScript features, use Babel. 

Install Babel and the Babel plugins you need. For example:

```
npm install --save-dev @babel/core
npm install --save-dev @babel/plugin-proposal-class-properties
npm install --save-dev @babel/proposal-decorators
```

Configure Babel. For example:

**babel.config.js**

```js
const plugins = [
  '@babel/plugin-proposal-class-properties',
  ['@babel/proposal-decorators', { decoratorsBeforeExport: true } ],
];

module.exports = { plugins };
```

You can run Babel via a bundler plugin such as [rollup-plugin-babel](https://www.npmjs.com/package/rollup-plugin-babel), or from the command line. See the [Babel documentation](https://babeljs.io/docs/en/) for more information.

See a [sample build configuration for LitElement with Babel and Rollup](https://github.com/PolymerLabs/lit-element-build-rollup/blob/master/src/index.html).

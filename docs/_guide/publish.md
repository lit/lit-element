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

## Transpiling TypeScript

To transpile element code from TypeScript, conigure tsconfig.json. Make sure you include the `"downlevelIteration": true` option.

**tsconfig.json**

```json
{
  "include": ["src/*.ts"],
  "compilerOptions": {
    "downlevelIteration": true,
    "target": "es2017",
    "module": "es2017",
    "moduleResolution": "node",
    "lib": ["es2017"],
    "experimentalDecorators": true
  }
}
```

Run the TypeScript compiler: 

```bash
tsc 
```

Publish your `lib` folder as well as your component's `src` files. Users of your element would consume it from `lib`.

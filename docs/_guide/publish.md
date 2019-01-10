---
layout: guide
title: Publish an element
slug: publish
---

**TODO: actual sentences**

{::options toc_levels="1..3" /}
* ToC
{:toc}

TODO: make sentences

* We recommend publishing ES2017
* We recommend not bundling elements
* If you're writing your element in standard ES2017, you don't need to transpile for publication
* If you're using decorators, class fields, or other ES2017+ features, you'll need to transpile your element for publication

## publish to npm

To publish to npm [see instructions on npm site](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry).

Your package.json configuration must have both `main` and `module`:

**package.json**

```json
{
  "main": "my-element.js",
  "module": "my-element.js"
}
```

Also, make a README telling people how to consume your element

### if typescript

To transpile TypeScript, conigure tsconfig.josn. eg

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

Run `tsc`:

```bash
tsc 
```

Publish `lib` as well as `src`. Users would consume `lib`.

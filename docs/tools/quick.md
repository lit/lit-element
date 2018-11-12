---
layout: post
section: tools
topic: quick
pageid: quick
---

LitElement's pre-requisites are [Node.js](https://nodejs.org/en/download/), [npm](https://docs.npmjs.com/), and [Polymer CLI](https://github.com/Polymer/tools/tree/master/packages/cli).

Install Polymer CLI:

```
npm install -g polymer-cli
```

Create a new LitElement project:

```bash 
mkdir myproject
cd myproject
npm init -y
npm install --save @polymer/lit-element
npm install --save @webcomponents/webcomponentsjs
```

Create a polymer.json config file, and serve your project:

```bash
cd myproject
npm install
echo '{
  "npm": true,
  "moduleResolution": "node",
  "entrypoint": "src/index.html",
  "shell": "src/my-project.js",
  "extraDependencies": [
    "node_modules/@webcomponents/webcomponentsjs/**"
  ],
  "builds": [{
    "name": "mybuild",
    "bundle": true,
    "js": {
      "minify": true
    }
  }]
}' >polymer.json
polymer serve
```

Build your project, and serve the build locally:

```bash
cd myproject
polymer build
polymer serve build/mybuild
```

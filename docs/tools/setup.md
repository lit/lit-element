---
layout: post
section: tools
topic: setup
pageid: setup
---

**On this page:**

* [Install pre-requisites](#install)
* [Create a new LitElement project](#new)
* [Serve your project locally](#serve)
* [Build your project for production](#build)

<a id="install">

### [Install pre-requisites](#install)

To work locally with lit-element, you'll first need to install Git, npm and Node.js, and the Polymer CLI. 

1.  [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

2.  [Install npm and Node.js](https://nodejs.org/en/).

3.  Update npm:
    
    ```bash
    npm install -g npm@latest
    ```

4.  Install Polymer CLI: 

    ```bash
    npm install -g polymer-cli@latest
    ```

<a id="new">

### [Create a new LitElement project](#new)

```bash 
mkdir myproject
cd myproject
npm init -y
npm install --save @polymer/lit-element
npm install --save @webcomponents/webcomponentsjs
```

<a id="serve">

### [Serve](#serve)

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

See the [Developer tools documentation](develop) for more information.

<a id="build">

## [Build](#build)

Build your project, and serve the build locally:

```bash
cd myproject
polymer build
polymer serve build/mybuild
```

For more information on building LitElement projects see [Build for production](build).

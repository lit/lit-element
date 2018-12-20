---
layout: post
title: Tools
slug: tools
---

{::options toc_levels="1..3" /}
* ToC
{:toc}

## Set up LitElement locally

### Install pre-requisites

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

Read on to create a new LitElement project from scratch, or if you prefer, you can [download a sample LitElement project](https://github.com/PolymerLabs/start-lit-element).

### Create a new LitElement project

```bash 
mkdir myproject
cd myproject
npm init -y
npm install --save @polymer/lit-element
npm install --save @webcomponents/webcomponentsjs
```

### Serve your project locally

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

### Build your project for production

Build your project, and serve the build locally:

```bash
cd myproject
polymer build
polymer serve build/mybuild
```

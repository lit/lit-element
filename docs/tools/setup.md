---
layout: post
section: tools
topic: setup
pageid: setup
---

* [Install pre-requisites](#install)
* [Serve a sample project](#serve)
* [Build the sample project](#build)

<hr/>

<a id="install"></a>

## Install pre-requisites 

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

<hr/>

<a id="serve"></a>

## Serve a sample project

1.  Use Git to copy a sample lit-element project:

    ```bash
    git clone https://github.com/polymerlabs/start-lit.git
    ```

2.  Go to the `start-lit` folder:

    ```bash
    cd start-lit
    ```

3.  Install the project's dependencies: 

    ```bash
    npm install
    ```

4.  Serve the project locally:

    ```bash
    polymer serve
    ```

<hr/>

<a id="build"></a>

## Build the sample project

lit-element code needs a few changes for web browsers to load it. During developent, the Polymer CLI development server (`polymer serve`) handles this for you.

To deploy a lit-element project to the web, you need to build it. Configure build options in `polymer.json`, then run `polymer build`.

We've included a [sample polymer.json file in the start-lit project](https://github.com/polymerlabs/start-lit/link-to/polymer.json) to get you up and running.

See the [Polymr CLI documentation](https://www.polymer-project.org/3.0/docs/tools/polymer-cli) for instructions on configuring your build.

**To build the start-lit sample project:**

1.  Go to your root project folder:

    ```bash
    cd start-lit
    ```

2.  Use Polymer CLI to build your project:

    ```bash
    polymer build    
    ```

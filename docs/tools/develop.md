---
layout: post
section: tools
topic: develop
pageid: develop
---

**On this page:** 

* [Install Polymer CLI](#install)
* [Configure a project for Polymer CLI dev server](#serve)
* [Text editor](#ide)

<a id="install">

### [Install Polymer CLI](#install)

Requires npm and Nodejs.

```
npm install -g polymer-cli
```

<a id="serve">

### [Configure a project for Polymer CLI dev server](#serve)

1.  Configure Polymer CLI to serve your project locally. 

    Create a polymer.json file in your top-level project folder. For example:

    _Project folder structure_

    ```bash
    my-project/
      src/
        index.html
        my-project.js
      package.json
      polymer.json
    ```

    _polymer.json_

    ```json
    {
      "npm": true,
      "moduleResolution": "node",
      "entrypoint": "src/index.html",
      "shell": "src/my-project.js",
    }
    ```

2.  From your top-level project folder, install npm components if you haven't already done so. Then, run `polymer serve`:

    ```bash
    cd my-project
    npm install
    polymer serve
    ```

    Polymer CLI starts a local server. To view your served project, open the `applications` URL. For example:

    ```
    ~/my-project > polymer serve
    info: [cli.command.serve] Files in this directory are available under the following URLs
      applications: http://127.0.0.1:8081
      reusable components: http://127.0.0.1:8081/components/my-project/
    ```

    To view the served project in the example above, open http://127.0.0.1:8081.

<a id="ide">

### [Text editor](#ide)

You will need a text editor that does HTML syntax highlighting inside JavaScript template literals. 

* [VSCode](https://code.visualstudio.com/#alt-downloads) with [https://marketplace.visualstudio.com/items?itemName=bierner.lit-html#qna](Matt Bierner's lit-html plugin)

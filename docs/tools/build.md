---
layout: post
section: tools
topic: build
pageid: build
---

**On this page:** 

* [JavaScript import statements and package names](#import)
* [Build with Polymer CLI](#build)
 
<a id="import">

### [JavaScript import statements and package names](#import)

At the time of writing, web browsers can't load JavaScript modules by their package names. Since the LitElement library uses package names to import dependencies, you must use a build step to transform package names to URLs so that web browsers can find the files.

For example, the following import statement must be transformed to use a URL:

```js
import { LitElement, html } from '@polymer/lit-element';
```

The transformed import statement might look something like this:

```js
import { LitElement, html } from '../node_modules/@polymer/lit-element/lit-element.js';
```

If you're working with Polymer CLI, you can configure `polymer serve` and `polymer build` to take care of this transform for you. 

#### Configure Polymer CLI to transform package names to URLs

Create a JSON configuration file called polymer.json in your top-level project folder. Set the following properties in polymer.json:

|**Property**|**Value**|
|`npm`|`true`|
|`moduleResolution`|`"node"`|

For example:

_polymer.json_

```json
{
  "npm": true,
  "moduleResolution": "node",
  "entrypoint": "src/index.html",
  "shell": "src/my-project.js"
}
```

<a id="polymerbuild">

### [Build with Polymer CLI](#polymerbuild)

1.  Configure Polymer CLI to build your project. 

    Add a `builds` property to polymer.json. For example:

    ```json
    "builds": [{
      "name": "mybuild",
      "bundle": true,
      "js": {
        "minify": true
      }
    }]
    ```

    _polymer.json_: Before

    ```json
    {
      "npm": true,
      "moduleResolution": "node",
      "entrypoint": "src/index.html",
      "shell": "src/my-project.js",
    }
    ```

    _polymer.json_: After

    ```json
    {
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
    }
    ```

2.  From your top-level project folder, install npm components if you haven't already done so. Then, run `polymer build`:

    ```bash
    cd my-project
    npm install
    polymer build
    ```

    Polymer CLI builds your project. It adds a `build` folder to your top-level project folder, with sub-folders for each build you've configured. For example:

    _Project folder structure_: Before

    ```bash
    my-project/
      node_modules/
        @polymer/
          ...
        @webcomponents/
          ...
      src/
        index.html
        my-project.js
      package.json
      polymer.json
    ```

    _Project folder structure_: After

    ```bash
    my-project/
      node_modules/
        @polymer/
          ...
        @webcomponents/
          ...
      src/
        index.html
        my-project.js
      build/
        mybuild/
          node_modules/
            @polymer/
              ...
            @webcomponents/
              ...
          src/
            index.html
            my-project.js
        polymer.json
      package.json
      polymer.json
    ```

3.  Serve the built project locally.

    From your top-level project folder, run `polymer serve build/buildname` and open the `applications` URL. For example: 

    ```
    ~/my-project > polymer serve build/mybuild
    info: [cli.command.serve] Files in this directory are available under the following URLs
      applications: http://127.0.0.1:8081
      reusable components: http://127.0.0.1:8081/components/mybuild/
    ```

    To view the served project in the example above, open http://127.0.0.1:8081.

---
layout: post
section: tools
topic: sample
pageid: sample
---

* [start-lit-element sample project on GitHub](https://github.com/PolymerLabs/start-lit-element)
* [start-lit-element demo on Firebase](https://start-lit-element.firebaseapp.com/)

**On this page:**

* [Clone](#clone)
* [Serve](#serve)
* [Build](#build)

### [Clone](#clone) 

Use Git to clone the sample project:

```bash
git clone https://github.com/PolymerLabs/start-lit-element.git
```

The project is configured, ready to serve and build right away.

<a id="serve">

### [Serve](#serve)

1.  Go to the `start-lit-element` folder:

    ```bash
    cd start-lit-element
    ```

2.  Install the project's dependencies: 

    ```bash
    npm install
    ```

3.  Serve the project locally:

    ```bash
    polymer serve
    ```

    The Polymer CLI dev server starts your app and tells you where you can see it:

    ```
    ~/start-lit-element> polymer serve

    info: [cli.command.serve] Files in this directory are available under the following URLs
      applications: http://127.0.0.1:8001
      reusable components: http://127.0.0.1:8001/components/start-lit-element/
    ```

4.  Open the "applications" URL to view your app. In the example above, you'd open http://127.0.0.1:8001.

See a demo of what the app should look like at [start-lit-element.firebaseapp.com](https://start-lit-element.firebaseapp.com/). 

<a id="build">

### [Build](#build)

1.  Go to your root project folder:

    ```bash
    cd start-lit-element
    ```

2.  Use Polymer CLI to build your project:

    ```bash
    polymer build    
    ```

3.  Serve the built project locally: 

    ```bash
    polymer serve build/default
    ```

You can deploy the built project on any web server. See the [Sample project README](https://github.com/PolymerLabs/start-lit-element/blob/master/README.md#deploy) for instructions on deploying to Firebase. See a demo of the sample app deployed on Firebase at [start-lit-element.firebaseapp.com](https://start-lit-element.firebaseapp.com/). 

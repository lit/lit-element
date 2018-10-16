---
layout: post
title: Bind data to a child element in a template
parent: /docs/
type: task
topic: /docs/templates
permalink: /docs/templates/annotations
---

Use lit-element annotations with JavaScript expressions to bind data from an element's properties to a child element in its template.

Bind to a child element's: 

*   Text node:

    ```js
    html`<div>${this.prop1}</div>`
    ```

*   Attribute:

    ```js
    html`<div id="${this.prop2}"></div>`
    ```

*   Boolean attribute:

    ```js
    html`<span ?hidden="${this.prop3}">this should be hidden</span>`
    ```

*   Property:

    ```js
    html`<input type="checkbox" .value="${this.prop4}"/>`
    ```

*   Event handler:

    ```js
    html`<button id="pie" @click="${(e) => this.handlePls(e)}">pie?</button>`
    ```

### Example

_custom-element.js_

```js
{% include projects/docs/annotations/custom-element.js %}
```

{% include project.html folder="docs/annotations" openFile="custom-element.js" %}

To share data from child elements to parent elements, use events. See [...]() for more information.

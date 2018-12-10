---
layout: post
section: templates
topic: create
---

**On this page:**

* [Define a template](#define)
* [Specify the render root](#renderroot)

<a id="define">

### [Define a template](#define)

To define a template for a LitElement component, write a `render` function for your element class:

```js
class MyElement extends LitElement {
  render() {
    return html`<p>template content</p>`;
  }
}
```

* Write your template in HTML inside a JavaScript template literal by enclosing the raw HTML in back-ticks (<code>``</code>). 

* Tag your template literal with the `html` helper function, so that `render` returns a lit-html `TemplateResult`.

Example

```js
{% include projects/docs/templates/define/my-element.js %}
```

{% include project.html folder="docs/templates/define" openFile="my-element.js" %}

You can use JavaScript expressions to [add properties, loops, and conditionals](expressions), [compose templates from other templates](compose), and [bind data to child elements](databinding).

Many text editors can highlight HTML syntax inside JavaScript template literals. See the section on [HTML syntax highlighting](/tools/develop#highlighting) in the Tools documentation.

<a id="renderroot">

### [Specify the render root](#renderroot)

The node into which your component's template will render is called its **render root**.

By default, LitElement creates an open `shadowRoot` and renders inside it, producing the following DOM structure:

```text
<my-element>
  #shadow-root
    <p>child 1</p>
    <p>child 2</p>
```

To customize a component's render root, implement `createRenderRoot` and return the node you want the template to render into. 

For example, to render the template into the main DOM tree as your element's light DOM:

```text
<my-element>
  <p>child 1</p>
  <p>child 2</p>
```

Implement `createRenderRoot` and return `this`:

```js
class LightDom extends LitElement {
  render() {
    return html`
      <p>This template renders in light DOM.</p>
    `;
  }
  createRenderRoot() {
  /**
   * Render template in light DOM. Note that shadow DOM features like 
   * encapsulated CSS are unavailable.
   */
    return this;
  }
}
```

{% include project.html folder="docs/templates/renderroot" openFile="my-element.js" %}

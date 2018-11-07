---
layout: default
todo: true
---
<header class="hero gradient-bg">
{% include topnav.html %}
<div class="wrapper">
<h1 class="hero-title">{{ site.name }}</h1>
<p class="hero-caption">{{ site.description }}</p>
<a class="hero-link" href="{{ site.baseurl }}/try">Get Started</a>
</div>
</header>

<section class="grey-bg">
<div class="wrapper">
<div class="responsive-row center">
<div style="max-width: 600px">

LitElement is a simple base class for creating fast, lightweight [web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) that work in any page with your favorite libraries and frameworks.

With LitElement, you can quickly build and share a single component with [fast HTML templates](https://polymer.github.io/lit-html/), or assemble a [full-featured web app](https://polymer.github.io/pwa-starter-kit/) with many components.

</div>
</div>
</div>
</section>

<section>
<div class="wrapper">

## Define a component in JavaScript:

```js
import { LitElement, html } from 'lit-element';

// Create your custom component
class CustomGreeting extends LitElement {
  // Declare properties
  static get properties() {
    return {
      name: { type: String }
    };
  }
  // Initialize properties
  constructor() {
    super();
    this.name = 'World';
  }
  // Define an HTML template with lit-html
  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
// Register the element with the browser
customElements.define('custom-greeting', CustomGreeting);
```

## Include the custom element in your web page:

```html
<custom-greeting></custom-greeting>
```

</div>
</section>

<section class="grey-bg">
<div class="wrapper">

## Why use LitElement?

<div class="responsive-row">
<div style="flex: 1">

### Made to share

Web components built with LitElement are made to share with the world and with others across your organization, no matter what libraries or frameworks they use. 

</div>
<div style="flex: 1">

### Interoperable

LitElement follows the web platform standards, so your components are interoperable. LitElement uses custom elements for easy inclusion in web pages, and shadow DOM for encapsulation. There’s no new abstraction to learn.

</div>
<div style="flex: 1">

### Fast and light

Whether your end users are in emerging markets or Silicon Valley, they’ll appreciate that LitElement is extremely fast. LitElement uses [lit-html](https://github.com/Polymer/lit-html) to define and render HTML templates. DOM updates are lightning fast, because the browser only re-renders the data that changes.

</div>
</div>
</div>
</section>

<section>
<div class="wrapper">
<div class="responsive-row center">
<div style="max-width: 600px">

LitElement is brought to you by developers on the Google Chrome team that helped define the Web Component standards with the input of web developers at organizations big and small around the world. 

</div>
</div>
</div>
</section>

<section class="grey-bg">
<div class="wrapper">

## Next steps

- [Try LitElement]({{ site.baseurl }}/try) in our live tutorial. You don’t need to install anything.
- When you’re ready to dive in, [setup LitElement locally]({{ site.baseurl }}/tools) and start building components!

</div>
</section>

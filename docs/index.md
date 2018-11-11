---
layout: default
---

<header class="hero">
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

## Fast, lightweight web components

LitElement is a simple base class for creating fast, lightweight web components that work in any web page with any framework.

For rendering, LitElement uses [lit-html](https://lit-html.polymer-project.org/)–a fast HTML templating library. To build an app out of LitElement components, check out [PWA Starter Kit](https://pwa-starter-kit.polymer-project.org/).

</div>
</div>
</div>
</section>

<section>
<div class="wrapper">

Define a component in JavaScript:

_custom-greeting.js_

```js
{% include projects/index/custom-greeting.js %}
```

Include the component in your web page:

_index.html_

```html
<custom-greeting></custom-greeting>
```

{% include project.html folder="index" openFile="custom-greeting.js" %}

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

LitElement follows the [web components standards](https://developer.mozilla.org/en-US/docs/Web/Web_Components), so your components will work with any framework.

LitElement uses custom elements for easy inclusion in web pages, and shadow DOM for encapsulation. There’s no new abstraction on top of the web platform.

</div>
<div style="flex: 1">

### Fast and light

Whether your end users are in emerging markets or Silicon Valley, they’ll appreciate that LitElement is extremely fast.

LitElement uses [lit-html](https://github.com/Polymer/lit-html) to define and render HTML templates. DOM updates are lightning-fast, because lit-html only re-renders the data that changes.

</div>
</div>
</div>
</section>

<section>
<div class="wrapper">
<div class="responsive-row center">
<div style="max-width: 600px">

LitElement is brought to you by developers on the Google Chrome team with the input of web developers at organizations big and small around the world. 

</div>
</div>
</div>
</section>

<section class="grey-bg">
<div class="wrapper">

<section class="grey-bg">
<div class="wrapper">

## Next steps

- [Try LitElement]({{ site.baseurl }}/try) in our live tutorial. You don’t need to install anything.
- When you’re ready to dive in, [set up LitElement locally]({{ site.baseurl }}/tools) and start building components!

</div>
</section>

---
layout: default
---

<header class="hero" markdown="0">
{% include topnav.html %}
<div class="wrapper">
<div class="hero-title">{{ site.name }}</div>
<p class="hero-caption">{{ site.description }}</p>
<a class="hero-link link-with-arrow" href="{{ site.baseurl }}/guide">Get Started</a>
</div>
</header>

<section>
<div class="wrapper">
<h1 class="title">
About
</h1>

<div class="responsive-row">

<div style="flex:1;">
<h2>
Fast, lightweight web components
</h2>
<p>
LitElement is a simple base class for creating fast, lightweight web components that work in any web page with any framework.
</p>
</div>

<div style="flex:1;">
<h2>
Using lit-html
</h2>
<p>
For rendering, LitElement uses [lit-html](https://lit-html.polymer-project.org/)—a fast HTML templating library. To build an app out of LitElement components, check out [PWA Starter Kit](https://pwa-starter-kit.polymer-project.org/).
</p>
</div>

<div style="flex:1;">
<h2>
Who are we?
</h2>
<p>
LitElement is brought to you by developers on the Google Chrome team with the input of web developers at organizations big and small around the world.
</p>
</div>

</div>
</div>
</section>

<section>
<div class="wrapper">

<h1 class="title">
Get started
</h1>

<h2>
Define a component
</h2>

It's easy to define a Web Component with LitElement:

```js
{% include projects/index-typescript/custom-greeting.ts %}
```

<h2 style="margin-top: 40px;">Use a component</h2>

Then use it anywhere you use HTML:

```html
<custom-greeting></custom-greeting>
```

Click **Launch code editor** to see a live sample.

{% include project.html folder="index-typescript" openFile="custom-greeting.js" %}

See the sample in JavaScript:

{% include project.html folder="index-typescript" openFile="custom-greeting.js" %}

</div>
</section>

<section>
<div class="wrapper">

<h1 class="title">Why use LitElement?</h1>

<div class="responsive-row">
<div style="flex: 1">

<h2 class="caption">Made to share</h2>

Web components built with LitElement are made to share with the world and with others across your organization, no matter what libraries or frameworks they use.

</div>
<div style="flex: 1">

<h2 class="caption">Interoperable</h2>

LitElement follows the [web components standards](https://developer.mozilla.org/en-US/docs/Web/Web_Components), so your components will work with any framework.

LitElement uses custom elements for easy inclusion in web pages, and shadow DOM for encapsulation. There’s no new abstraction on top of the web platform.

</div>
<div style="flex: 1">

<h2 class="caption">Fast and light</h2>

Whether your end users are in emerging markets or Silicon Valley, they’ll appreciate that LitElement is extremely fast.

LitElement uses [lit-html](https://github.com/Polymer/lit-html) to define and render HTML templates. DOM updates are lightning-fast, because lit-html only re-renders the data that changes.

</div>
</div>
</div>
</section>


<section>
<div class="wrapper">

<h1 class="title">Browser Compatibility</h1>
<h2 class="description">LitElement works in all major browsers (Chrome, Firefox, IE, Edge, Safari, and Opera). </h2>
<div id="browser-thumbnails" style="margin-bottom: 20px;">
<img width="56" width="56" src="{{ site.baseurl }}/images/browsers/chrome_128x128.png" alt="chrome logo">
<img width="56" width="56" src="{{ site.baseurl }}/images/browsers/firefox_128x128.png" alt="firefox logo">
<img width="56" width="56" src="{{ site.baseurl }}/images/browsers/internet-explorer_128x128.png" alt="internet explorer logo">
<img width="56" width="56" src="{{ site.baseurl }}/images/browsers/edge_128x128.png" alt="edge logo">
<img width="56" width="56" src="{{ site.baseurl }}/images/browsers/safari_128x128.png" alt="safari logo">
<img width="56" width="56" src="{{ site.baseurl }}/images/browsers/opera_128x128.png" alt="opera logo">
</div>

</div>
</section>

<section style="margin-bottom: 60px;">
<div class="wrapper">
<h1 class="title">Next Steps</h1>

<div class="responsive-row">

<div style="flex:1">
<h2 class="caption">One.</h2>
<p>[Try LitElement]({{ site.baseurl }}/try) in our live tutorial. You don’t need to install anything.</p>
</div>

<div style="flex:1">
<h2 class="caption">Two.</h2>
<p>When you’re ready to dive in, [set up LitElement locally]({{ site.baseurl }}/guide/start) and start building components!</p>
</div>

<div style="flex:1">
</div>

</div>
</div>
</section>

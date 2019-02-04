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

<section id="section-snippet">
<div class="wrapper">
<h1 class="title">
Easily Create Fast, Lightweight Web Components
</h1>

<div class="responsive-row">

<h3 class="description" style="flex: 1; margin-bottom: 0; max-width: 600px;">It's easy to define a Web Component with LitElement...</h3>

<div style="flex: 2 2 50%">
```js
{% include projects/index-typescript/custom-greeting.ts %}
```

</div>

</div>
<div class="responsive-row">

<h3 class="description" style="flex: 1; margin-bottom: 0; max-width: 600px;">And use it anywhere you use HTML!</h3>

<div style="flex: 2 2 50%">
```html
<custom-greeting name="Everyone"></custom-greeting>
```

</div>

</div>
<div class="responsive-row">

<h3 class="description" style="flex: 1; margin-bottom: 0; max-width: 600px;">Try it now:</h3>

<div style="flex: 2 2 50%">
{% include project.html label="Launch Code Editor (TypeScript)" folder="index-typescript" openFile="custom-greeting.ts" %}
{% include project.html label="Launch Code Editor (JavaScript)" folder="index" openFile="custom-greeting.js" %}

</div>

</div>
</div>
</section>

<section>
<div class="wrapper">

<h1 class="title">Why use LitElement?</h1>

<div class="responsive-row">
<div style="flex: 1">

<h2 class="caption">Fast and light</h2>

Whether your end users are in emerging markets or Silicon Valley, they’ll appreciate that LitElement is extremely fast.

LitElement uses [lit-html](https://github.com/Polymer/lit-html) to define and render HTML templates. DOM updates are lightning-fast, because lit-html only re-renders the data that changes.

</div>
<div style="flex: 1">

<h2 class="caption">Standards-based</h2>

LitElement follows the [web components standards](https://developer.mozilla.org/en-US/docs/Web/Web_Components), so your components will work with any framework.

LitElement uses custom elements for easy inclusion in web pages, and shadow DOM for encapsulation. There’s no new abstraction on top of the web platform.

</div>
<div style="flex: 1">

<h2 class="caption">Made to share</h2>

Web components built with LitElement are made to share with the world and with others across your organization, no matter what libraries or frameworks they use.

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

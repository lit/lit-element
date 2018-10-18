---
layout: post
type: concept
section: docs
topic: create
subtopic: design
status: reviewing
---

These are some brief guidelines for designing extensible, performant, accessible elements. For more information, see the [Gold Standard Checklist for Web Components](https://github.com/webcomponents/gold-standard/wiki).

### Do one thing well

An element should **do one thing well**. It should have a clear, well-defined purpose. 

Instead of giving an element lots of options and features, provide and document properties and methods that other developers can extend for future use cases.

Keeping your element as small as possible also minimizes its download time.

### Optimize performance

An element must be **fast**. If it isn't fast, it can't do its one thing well.

Assess the speed of your element relative to its purpose. The more frequently end users will interact with your element, the faster it needs to be.

The most important aspect of an element's performance is its initial rendering speed. For optimal performance, an element should lazily perform any tasks that aren't critical to the first render. 

### Design for accessibility

Make sure your element is **accessible**. Use ARIA roles, states, and properties, or extend an accessible native HTML element.

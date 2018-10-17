---
layout: post
section: docs
topic: create
subtopic: index
---

To create a new element, [extend the LitElement base class](extend). 

Optionally, you can [use TypeScript decorators to create a new element](typescript).

By default, LitElement attaches an open shadow root to the element and renders its template in shadow DOM. To customize where an element's template will render (for instance, to render into light DOM instead of shadow DOM), see [Customize an element's render root](renderroot).

See [Designing an element](design) for basic guidelines on developing extensible, performant, accessible elements.

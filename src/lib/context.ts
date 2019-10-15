/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
import {LitElement} from '../lit-element.js';
import {property} from './decorators.js';

export class Context {

  readonly owner: LitElement;
  private _value: unknown;
  private _clients: Set<LitElement> = new Set();

  constructor(owner: LitElement, value: unknown) {
    this.owner = owner;
    this.subscribe(this.owner);
    this.value = value;
  }

  subscribe(client: LitElement) {
    this._clients.add(client);
  }

  unsubscribe(client: LitElement) {
    this._clients.delete(client);
    return (client !== this.owner);
  }

  notify() {
    this._clients.forEach(el => el.requestUpdate());
  }

  set value(value: unknown) {
    this._value = value;
    this.notify();
  }

  get value() {
    return this._value;
  }
}

const empty = {};

type AnyConstructor<A = object> = new (...input: any[]) => A;

export function ContextMixin<T extends AnyConstructor<LitElement>>(Base: T) {

  class ContextElement extends Base {

    // Look up the host tree for `context`. Note, this is only triggered
    // if context is accessed and is therefore pay for play.
    // TODO(sorvell): Alternatively, `context` could be passed down with a host
    // stack.
    static contextForElement(element: Element) {
      let root = element as Node;
      while (root = root.getRootNode()) {
        const host = (root as ShadowRoot).host || root;
        const context = (host as any)._context;
        if (context) {
          return context;
        }
      }
      return null;
    }

    _hasContext = false;
    _context?: Context|null;

    @property({attribute: false})
    get context(): unknown {
      this._hasContext = true;
      if (!this._context) {
        const context = (this.constructor as typeof ContextElement).contextForElement(this);
        if (context) {
          this._context = context;
          this._context!.subscribe(this);
        }
      }
      return this._context ? this._context.value : empty;
    }

    set context(value: unknown) {
      if (!this._context) {
        this._context = new Context(this, value);
      } else {
        this._context.value = value;
      }
    }

    connectedCallback() {
      if (this._hasContext && !this._context) {
        this._context = (this.constructor as typeof ContextElement).contextForElement(this);
      }
    }

    disconnectedCallback() {
      if (this._context) {
        if (this._context.unsubscribe(this)) {
          this._context = null;
        };
      }
    }
  }

  return ContextElement;

};

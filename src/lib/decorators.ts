/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/*
 * IMPORTANT: For compatibility with tsickle and the Closure Compiler, all
 * property decorators (but not class decorators) in this file that have
 * an @ExportDecoratedItems annotation must be defined as a regular function,
 * not an arrow function.
 */

import {LitElement} from '../lit-element.js';

import {PropertyDeclaration, UpdatingElement} from './updating-element.js';

export type Constructor<T> = {
  // tslint:disable-next-line:no-any
  new (...args: any[]): T
};

// From the TC39 Decorators proposal
interface ClassDescriptor {
  kind: 'class';
  elements: ClassElement[];
  finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
}

// From the TC39 Decorators proposal
interface ClassElement {
  kind: 'field'|'method';
  key: PropertyKey;
  placement: 'static'|'prototype'|'own';
  initializer?: Function;
  extras?: ClassElement[];
  finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
  descriptor?: PropertyDescriptor;
}

const legacyCustomElement =
    (tagName: string, clazz: Constructor<HTMLElement>) => {
      window.customElements.define(tagName, clazz);
      // Cast as any because TS doesn't recognize the return type as being a
      // subtype of the decorated class when clazz is typed as
      // `Constructor<HTMLElement>` for some reason.
      // `Constructor<HTMLElement>` is helpful to make sure the decorator is
      // applied to elements however.
      // tslint:disable-next-line:no-any
      return clazz as any;
    };

const standardCustomElement =
    (tagName: string, descriptor: ClassDescriptor) => {
      const {kind, elements} = descriptor;
      return {
        kind,
        elements,
        // This callback is called once the class is otherwise fully defined
        finisher(clazz: Constructor<HTMLElement>) {
          window.customElements.define(tagName, clazz);
        }
      };
    };

/**
 * Class decorator factory that defines the decorated class as a custom element.
 *
 * ```
 * @customElement('my-element')
 * class MyElement {
 *   render() {
 *     return html``;
 *   }
 * }
 * ```
 * @category Decorator
 * @param tagName The name of the custom element to define.
 */
export const customElement = (tagName: string) =>
    (classOrDescriptor: Constructor<HTMLElement>|ClassDescriptor) =>
        (typeof classOrDescriptor === 'function') ?
    legacyCustomElement(tagName, classOrDescriptor) :
    standardCustomElement(tagName, classOrDescriptor);

const standardProperty =
    (options: PropertyDeclaration, element: ClassElement) => {
      // When decorating an accessor, pass it through and add property metadata.
      // Note, the `hasOwnProperty` check in `createProperty` ensures we don't
      // stomp over the user's accessor.
      if (element.kind === 'method' && element.descriptor &&
          !('value' in element.descriptor)) {
        return {
          ...element,
          finisher(clazz: typeof UpdatingElement) {
            clazz.createProperty(element.key, options);
          }
        };
      } else {
        // createProperty() takes care of defining the property, but we still
        // must return some kind of descriptor, so return a descriptor for an
        // unused prototype field. The finisher calls createProperty().
        return {
          kind: 'field',
          key: Symbol(),
          placement: 'own',
          descriptor: {},
          // When @babel/plugin-proposal-decorators implements initializers,
          // do this instead of the initializer below. See:
          // https://github.com/babel/babel/issues/9260 extras: [
          //   {
          //     kind: 'initializer',
          //     placement: 'own',
          //     initializer: descriptor.initializer,
          //   }
          // ],
          initializer(this: {[key: string]: unknown}) {
            if (typeof element.initializer === 'function') {
              this[element.key as string] = element.initializer.call(this);
            }
          },
          finisher(clazz: typeof UpdatingElement) {
            clazz.createProperty(element.key, options);
          }
        };
      }
    };

const legacyProperty =
    (options: PropertyDeclaration, proto: Object, name: PropertyKey) => {
      (proto.constructor as typeof UpdatingElement)
          .createProperty(name, options);
    };

/**
 * A property decorator which creates a LitElement property which reflects a
 * corresponding attribute value. A [[`PropertyDeclaration`]] may optionally be
 * supplied to configure property features.
 *
 * This decorator should only be used for public fields. Private or protected
 * fields should use the [[`internalProperty`]] decorator.
 *
 * @example
 * ```ts
 * class MyElement {
 *   @property({ type: Boolean })
 *   clicked = false;
 * }
 * ```
 * @category Decorator
 * @ExportDecoratedItems
 */
export function property(options?: PropertyDeclaration) {
  // tslint:disable-next-line:no-any decorator
  return (protoOrDescriptor: Object|ClassElement, name?: PropertyKey): any =>
             (name !== undefined) ?
      legacyProperty(options!, protoOrDescriptor as Object, name) :
      standardProperty(options!, protoOrDescriptor as ClassElement);
}

export interface InternalPropertyDeclaration<Type = unknown> {
  /**
   * A function that indicates if a property should be considered changed when
   * it is set. The function should take the `newValue` and `oldValue` and
   * return `true` if an update should be requested.
   */
  hasChanged?(value: Type, oldValue: Type): boolean;
}

/**
 * Declares a private or protected property that still triggers updates to the
 * element when it changes.
 *
 * Properties declared this way must not be used from HTML or HTML templating
 * systems, they're solely for properties internal to the element. These
 * properties may be renamed by optimization tools like the Closure Compiler.
 * @category Decorator
 * @deprecated `internalProperty` has been renamed to `state` in lit-element
 *     3.0. Please update to `state` now to be compatible with 3.0.
 */
export function internalProperty(options?: InternalPropertyDeclaration) {
  return property({attribute: false, hasChanged: options?.hasChanged});
}

/**
 * Declares a private or protected property that still triggers updates to the
 * element when it changes.
 *
 * Properties declared this way must not be used from HTML or HTML templating
 * systems, they're solely for properties internal to the element. These
 * properties may be renamed by optimization tools like the Closure Compiler.
 * @category Decorator
 */
export const state = (options?: InternalPropertyDeclaration) =>
    internalProperty(options);

/**
 * A property decorator that converts a class property into a getter that
 * executes a querySelector on the element's renderRoot.
 *
 * @param selector A DOMString containing one or more selectors to match.
 * @param cache An optional boolean which when true performs the DOM query only
 * once and caches the result.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 *
 * @example
 *
 * ```ts
 * class MyElement {
 *   @query('#first')
 *   first;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 * ```
 * @category Decorator
 */
export function query(selector: string, cache?: boolean) {
  return (protoOrDescriptor: Object|ClassElement,
          // tslint:disable-next-line:no-any decorator
          name?: PropertyKey): any => {
    const descriptor = {
      get(this: LitElement) {
        return this.renderRoot.querySelector(selector);
      },
      enumerable: true,
      configurable: true,
    };
    if (cache) {
      const prop =
          name !== undefined ? name : (protoOrDescriptor as ClassElement).key;
      const key = typeof prop === 'symbol' ? Symbol() : `__${prop}`;
      descriptor.get = function(this: LitElement) {
        if ((this as unknown as
             {[key: string]: Element | null})[key as string] === undefined) {
          ((this as unknown as {[key: string]: Element | null})[key as string] =
               this.renderRoot.querySelector(selector));
        }
        return (
            this as unknown as {[key: string]: Element | null})[key as string];
      };
    }
    return (name !== undefined) ?
        legacyQuery(descriptor, protoOrDescriptor as Object, name) :
        standardQuery(descriptor, protoOrDescriptor as ClassElement);
  };
}

// Note, in the future, we may extend this decorator to support the use case
// where the queried element may need to do work to become ready to interact
// with (e.g. load some implementation code). If so, we might elect to
// add a second argument defining a function that can be run to make the
// queried element loaded/updated/ready.
/**
 * A property decorator that converts a class property into a getter that
 * returns a promise that resolves to the result of a querySelector on the
 * element's renderRoot done after the element's `updateComplete` promise
 * resolves. When the queried property may change with element state, this
 * decorator can be used instead of requiring users to await the
 * `updateComplete` before accessing the property.
 *
 * @param selector A DOMString containing one or more selectors to match.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 *
 * @example
 * ```ts
 * class MyElement {
 *   @queryAsync('#first')
 *   first;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 *
 * // external usage
 * async doSomethingWithFirst() {
 *  (await aMyElement.first).doSomething();
 * }
 * ```
 * @category Decorator
 */
export function queryAsync(selector: string) {
  return (protoOrDescriptor: Object|ClassElement,
          // tslint:disable-next-line:no-any decorator
          name?: PropertyKey): any => {
    const descriptor = {
      async get(this: LitElement) {
        await this.updateComplete;
        return this.renderRoot.querySelector(selector);
      },
      enumerable: true,
      configurable: true,
    };
    return (name !== undefined) ?
        legacyQuery(descriptor, protoOrDescriptor as Object, name) :
        standardQuery(descriptor, protoOrDescriptor as ClassElement);
  };
}

/**
 * A property decorator that converts a class property into a getter
 * that executes a querySelectorAll on the element's renderRoot.
 *
 * @param selector A DOMString containing one or more selectors to match.
 *
 * See:
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
 *
 * @example
 * ```ts
 * class MyElement {
 *   @queryAll('div')
 *   divs;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 * ```
 * @category Decorator
 */
export function queryAll(selector: string) {
  return (protoOrDescriptor: Object|ClassElement,
          // tslint:disable-next-line:no-any decorator
          name?: PropertyKey): any => {
    const descriptor = {
      get(this: LitElement) {
        return this.renderRoot.querySelectorAll(selector);
      },
      enumerable: true,
      configurable: true,
    };
    return (name !== undefined) ?
        legacyQuery(descriptor, protoOrDescriptor as Object, name) :
        standardQuery(descriptor, protoOrDescriptor as ClassElement);
  };
}

const legacyQuery =
    (descriptor: PropertyDescriptor, proto: Object, name: PropertyKey) => {
      return Object.defineProperty(proto, name, descriptor);
    };

const standardQuery = (descriptor: PropertyDescriptor, element: ClassElement) =>
    ({
      kind: 'method',
      placement: 'prototype',
      key: element.key,
      descriptor,
    });

const standardEventOptions =
    (options: AddEventListenerOptions, element: ClassElement) => {
      return {
        ...element,
        finisher(clazz: typeof UpdatingElement) {
          Object.assign(
              clazz.prototype[element.key as keyof UpdatingElement], options);
        }
      };
    };

const legacyEventOptions =
    // tslint:disable-next-line:no-any legacy decorator
    (options: AddEventListenerOptions, proto: any, name: PropertyKey) => {
      Object.assign(proto[name], options);
    };

/**
 * Adds event listener options to a method used as an event listener in a
 * lit-html template.
 *
 * @param options An object that specifies event listener options as accepted by
 * `EventTarget#addEventListener` and `EventTarget#removeEventListener`.
 *
 * Current browsers support the `capture`, `passive`, and `once` options. See:
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters
 *
 * @example
 * ```ts
 * class MyElement {
 *   clicked = false;
 *
 *   render() {
 *     return html`
 *       <div @click=${this._onClick}`>
 *         <button></button>
 *       </div>
 *     `;
 *   }
 *
 *   @eventOptions({capture: true})
 *   _onClick(e) {
 *     this.clicked = true;
 *   }
 * }
 * ```
 * @category Decorator
 */
export function eventOptions(options: AddEventListenerOptions) {
  // Return value typed as any to prevent TypeScript from complaining that
  // standard decorator function signature does not match TypeScript decorator
  // signature
  // TODO(kschaaf): unclear why it was only failing on this decorator and not
  // the others
  return ((protoOrDescriptor: Object|ClassElement, name?: string) =>
              (name !== undefined) ?
              legacyEventOptions(options, protoOrDescriptor as Object, name) :
              standardEventOptions(
                  options, protoOrDescriptor as ClassElement)) as
             // tslint:disable-next-line:no-any decorator
             any;
}

// x-browser support for matches
// tslint:disable-next-line:no-any
const ElementProto = Element.prototype as any;
const legacyMatches =
    ElementProto.msMatchesSelector || ElementProto.webkitMatchesSelector;

/**
 * A property decorator that converts a class property into a getter that
 * returns the `assignedNodes` of the given named `slot`. Note, the type of
 * this property should be annotated as `NodeListOf<HTMLElement>`.
 *
 * @param slotName A string name of the slot.
 * @param flatten A boolean which when true flattens the assigned nodes,
 * meaning any assigned nodes that are slot elements are replaced with their
 * assigned nodes.
 * @param selector A string which filters the results to elements that match
 * the given css selector.
 *
 * * @example
 * ```ts
 * class MyElement {
 *   @queryAssignedNodes('list', true, '.item')
 *   listItems;
 *
 *   render() {
 *     return html`
 *       <slot name="list"></slot>
 *     `;
 *   }
 * }
 * ```
 * @category Decorator
 */
export function queryAssignedNodes(
    slotName = '', flatten = false, selector = '') {
  return (protoOrDescriptor: Object|ClassElement,
          // tslint:disable-next-line:no-any decorator
          name?: PropertyKey): any => {
    const descriptor = {
      get(this: LitElement) {
        const slotSelector =
            `slot${slotName ? `[name=${slotName}]` : ':not([name])'}`;
        const slot = this.renderRoot.querySelector(slotSelector);
        let nodes = slot && (slot as HTMLSlotElement).assignedNodes({flatten});
        if (nodes && selector) {
          nodes = nodes.filter(
              (node) => node.nodeType === Node.ELEMENT_NODE &&
                  // tslint:disable-next-line:no-any testing existence on older browsers
                  ((node as any).matches ?
                       (node as Element).matches(selector) :
                       legacyMatches.call(node as Element, selector)));
        }
        return nodes;
      },
      enumerable: true,
      configurable: true,
    };
    return (name !== undefined) ?
        legacyQuery(descriptor, protoOrDescriptor as Object, name) :
        standardQuery(descriptor, protoOrDescriptor as ClassElement);
  };
}

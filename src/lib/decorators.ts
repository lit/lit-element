
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

import {LitElement} from '../lit-element.js';

import {PropertyDeclaration, UpdatingElement} from './updating-element.js';

export type Constructor<T> = {
  new (...args: unknown[]): T
};

/**
 * Class decorator factory that defines the decorated class as a custom element.
 *
 * @param tagName the name of the custom element to define
 *
 * In TypeScript, the `tagName` passed to `customElement` must be a key of the
 * `HTMLElementTagNameMap` interface. To add your element to the interface,
 * declare the interface in this module:
 *
 *     @customElement('my-element')
 *     export class MyElement extends LitElement {}
 *
 *     declare global {
 *       interface HTMLElementTagNameMap {
 *         'my-element': MyElement;
 *       }
 *     }
 *
 */
export const customElement = (tagName: keyof HTMLElementTagNameMap) =>
    (clazz: Constructor<HTMLElement>) => {
      window.customElements.define(tagName, clazz);
      // Cast as any because TS doesn't recognize the return type as being a
      // subtype of the decorated class when clazz is typed as
      // `Constructor<HTMLElement>` for some reason. `Constructor<HTMLElement>`
      // is helpful to make sure the decorator is applied to elements however.
      return clazz as any;
    };

/**
 * A property decorator which creates a LitElement property which reflects a
 * corresponding attribute value. A `PropertyDeclaration` may optionally be
 * supplied to configure property features.
 */
export const property = (options?: PropertyDeclaration) => (proto: Object,
                                                            name: string) => {
  (proto.constructor as typeof UpdatingElement).createProperty(name, options);
};

/**
 * A property decorator that converts a class property into a getter that
 * executes a querySelector on the element's renderRoot.
 */
export const query = _query((target: NodeSelector, selector: string) =>
                                target.querySelector(selector));

/**
 * A property decorator that converts a class property into a getter
 * that executes a querySelectorAll on the element's renderRoot.
 */
export const queryAll = _query((target: NodeSelector, selector: string) =>
                                   target.querySelectorAll(selector));

/**
 * Base-implementation of `@query` and `@queryAll` decorators.
 *
 * @param queryFn exectute a `selector` (ie, querySelector or querySelectorAll)
 * against `target`.
 */
function _query<T>(queryFn: (target: NodeSelector, selector: string) => T) {
  return (selector: string) => (proto: any, propName: string) => {
    Object.defineProperty(proto, propName, {
      get(this: LitElement) { return queryFn(this.renderRoot!, selector); },
      enumerable : true,
      configurable : true,
    });
  };
}

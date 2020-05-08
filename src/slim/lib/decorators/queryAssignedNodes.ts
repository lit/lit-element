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

import {LitElement} from '../../../lit-element.js';

/**
 * A property decorator that converts a class property into a getter that
 * returns the `assignedNodes` of the given named `slot`. Note, the type of
 * this property should be annotated as `NodeListOf<HTMLElement>`.
 * @category Decorator
 */
export const queryAssignedNodes = (
  slotName: string = '', flatten: boolean = false) =>
    (proto: Object,
    // tslint:disable-next-line:no-any decorator
    name: PropertyKey): any => {
  const descriptor = {
    get(this: LitElement) {
      const selector = `slot${slotName ? `[name=${slotName}]` : ''}`;
      const slot = this.renderRoot.querySelector(selector);
      return slot && (slot as HTMLSlotElement).assignedNodes({flatten});
    },
    enumerable: true,
    configurable: true,
  };
  Object.defineProperty(proto, name, descriptor);
};
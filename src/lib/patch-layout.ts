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

import {elementsPendingUpdate, UpdatingElement} from './updating-element.js';

/**
 * **EXPERIMENTAL**
 * Loading this module redefines properties that provoke a
 * layout and style calculation on *all DOM elements*. These properties are
 * are redefined such that they provoke any contained UpdatingElements to
 * synchronously update before returning the native property value. This ensures
 * that these properties will always return the expected value, even if
 * contained UpdatingElements are pending update.
 */

const contains = (container: Element, element: UpdatingElement) => {
  while (element && container !== element) {
    element = (element as any)._updateParent || element.parentNode  || (element as any).host;
  }
  return container === element;
};

/**
 * Commits updates within the given element's subtree.
 */
export const commit = (element: Element) => {
  elementsPendingUpdate.forEach((updatingElement) => {
    if (contains(element, updatingElement)) {
      updatingElement.flushUpdate();
    }
  });
};

const protos = [Element.prototype, HTMLElement.prototype];

const getProto = (prop: PropertyKey) => {
  return protos.find((proto) => proto.hasOwnProperty(prop));
};

const redefineProperty = (prop: PropertyKey, isMethod?: boolean) => {
  const proto = getProto(prop);
  if (!proto) {
    return;
  }
  const descriptor = Object.getOwnPropertyDescriptor(proto, prop);
  if (!descriptor!.configurable) {
    return;
  }
  const native = isMethod ? descriptor!.value : descriptor!.get!;
  const wrapped = function(this: Element) {
    commit(this);
    return native.call(this);
  };
  if (isMethod) {
    descriptor!.value = wrapped;
  } else {
    descriptor!.get = wrapped;
  }
  Object.defineProperty(proto, prop, descriptor!);
};

// methods
[
  'getClientRects',
  'getBoundingClientRect',
].forEach((prop) => redefineProperty(prop, true));



// getters
[
  'offsetLeft',
  'offsetTop',
  'offsetWidth',
  'offsetHeight',
  'offsetParent',
  'clientLeft',
  'clientWidth',
  'clientHeight',
  'scrollLeft',
  'scrollTop',
  'scrollWidth',
  'scrollHeight',
  'innerText',
  'outerText',
].forEach((prop) => redefineProperty(prop));

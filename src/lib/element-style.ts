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
import {CSSResult} from './css-tag.js';

export {part, CSSPartRule} from './css-part.js';
export {css} from './css-tag.js';

export const elementStyleMap: Map<PropertyKey, Set<CSSResult>> = new Map();

export const elementStyle = (elementName: PropertyKey, result: CSSResult) => {
  let styleSet = elementStyleMap.get(elementName);
  if (styleSet === undefined) {
    styleSet = new Set();
    elementStyleMap.set(elementName, styleSet);
  }
  styleSet.add(result);
};
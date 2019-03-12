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
import {CSSResult, supportsAdoptingStyleSheets} from './css-tag.js';
import {useNativePart, PartRules, addPartRules} from './css-part.js';

export {part, CSSPartRule} from './css-part.js';
export {css} from './css-tag.js';
export const documentPartRules: PartRules = new Set;

// TODO(sorvell): scope selectors with `:not(style-scope)` for shady scoping.
export const documentStyle = (result: CSSResult) => {
  if (supportsAdoptingStyleSheets) {
    const sheet = new CSSStyleSheet;
    sheet.replaceSync(result.cssText);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  } else {
    const style = document.createElement('style');
    style.textContent = result.cssText;
    document.head.appendChild(style);
  }
  if (!useNativePart() && result.parts) {
    addPartRules(documentPartRules, result.parts);
  }
};
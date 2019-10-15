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
import {unsafeCSS, CSSResult} from './css-tag.js';

let themeMap: Map<string, CSSResult[]>;
export const themes = () => {
  if (themeMap) {
    return themeMap;
  }
  themeMap = new Map();
  const styles = document.querySelectorAll('style[type=element-theme]');
  styles.forEach(style => {
    const name = style.getAttribute('for');
    if (name) {
      let cssResults = themeMap.get(name);
      if (!cssResults) {
        cssResults = [];
        themeMap.set(name, cssResults);
      }
      cssResults.push(unsafeCSS(style.textContent));
    }
  });
  return themeMap;
}
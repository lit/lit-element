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

/**
 * Returns a string of CSS class names formed by taking the properties
 * in the `classInfo` object and appending the property name to the string of
 * class names if the property value is truthy.
 * @param classInfo
 */
export function classString(
    classInfo: {[name: string]: string|boolean|number}) {
  const o = [];
  for (const name in classInfo) {
    // We explicitly want a loose truthy check here because
    // it seems more convenient that '' and 0 are skipped.
    if (classInfo[name]) {
      o.push(name);
    }
  }
  return o.join(' ');
}

/**
 * Returns a CSS style string formed from the `styleInfo` object. Property names
 * are automatically converted from *camelCase* to *dash-case*, so that you can use
 * unquoted names like `backgroundColor`. The property values are formatted
 * as css. For example `{backgroundColor: 'red', borderTop: '5px'}` becomes
 * `background-color: red; border-top: 5px;`.
 * @param styleInfo
 */
export function styleString(
    styleInfo: {[name: string]: string|boolean|number}) {
  const o = [];
  for (const name in styleInfo) {
    const v = styleInfo[name];
    if (v || v === 0) {
      o.push(`${name.replace(/([A-Z])/, '-$1').toLowerCase()}: ${v}`);
    }
  }
  return o.join('; ');
}

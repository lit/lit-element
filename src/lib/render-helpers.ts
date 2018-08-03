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
 * Returns a string of css class names formed by taking the properties
 * in the `classInfo` object and appending the property name to the string of
 * class names if the property value is truthy.
 * @param classInfo
 */
export function classString(
    classInfo: {[name: string]: string|boolean|number}) {
  const o = [];
  for (const name in classInfo) {
    const v = classInfo[name];
    if (v) {
      o.push(name);
    }
  }
  return o.join(' ');
}

/**
 * Returns a css style string formed by taking the properties in the `styleInfo`
 * object and appending the property name (dash-cased) colon the
 * property value. Properties are separated by a semi-colon.
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

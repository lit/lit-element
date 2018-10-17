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
import { Template } from './template.js';
/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */

export function templateFactory(result) {
  let templateCache = templateCaches.get(result.type);

  if (templateCache === undefined) {
    templateCache = new Map();
    templateCaches.set(result.type, templateCache);
  }

  let template = templateCache.get(result.strings);

  if (template === undefined) {
    template = new Template(result, result.getTemplateElement());
    templateCache.set(result.strings, template);
  }

  return template;
} // The first argument to JS template tags retain identity across multiple
// calls to a tag for the same literal, so we can cache work done per literal
// in a Map.

export const templateCaches = new Map(); //# sourceMappingURL=template-factory.js.map
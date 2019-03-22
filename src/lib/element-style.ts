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
import {CSSPartRuleSet} from './css-part.js';
import {css, unsafeCSS} from './css-tag.js';
export {css} from './css-tag.js';

export const elementStyleMap: Map<string, Set<CSSResult>> = new Map();

const styleSetForElement = (elementName: string) => {
  let styleSet = elementStyleMap.get(elementName);
  if (styleSet === undefined) {
    styleSet = new Set();
    elementStyleMap.set(elementName, styleSet);
  }
  return styleSet;
};

export const unsafeElementStyle = (elementName: string, result: CSSResult) => {
  styleSetForElement(elementName).add(result);
};

export const elementStyle = (elementName: string, ...parts: CSSPseudoPartRuleSet[]) => {
  const styleSet = styleSetForElement(elementName);
  const cssText = parts.map((p) => p.toString()).join('\n');
  styleSet.add(css`${unsafeCSS(cssText)}`);
};

const HOST = ':host';

// TODO(sorvell): improve factoring; experimenting with API...
class CSSPseudoPartRuleSet extends CSSPartRuleSet {

  private _rulesDeleted = false;
  private _stringResult?: string;

  get rules() {
    return this._rulesDeleted ? [] : super.rules;
  }

  toString() {
    if (this._stringResult === undefined) {
      const result: string[] = [];
      this.rules.forEach((rule) => {
        let selector = rule.rawSelector;
        if (rule.part) {
          const hostParen = `${rule.selector || ''}${rule.selectorPseudo || ''}`;
          const host = hostParen ? `${HOST}(${hostParen})` : HOST;
          selector = `${host} [part~=${rule.part}]${rule.partPseudo || ''}`;
        }
        result.push(`${selector} { ${rule.propertySet} }`);
      });
      this._rulesDeleted = true;
      this._stringResult = result.join('\n');
    }
    return this._stringResult;
  }
}

export const part = (selector: string|Array<string>, propertySet: CSSResult) =>
  new CSSPseudoPartRuleSet(selector, propertySet);
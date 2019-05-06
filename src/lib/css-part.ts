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
export {css} from './css-tag.js';

declare global {
  interface Window {
    forcePartPolyfill?: boolean;
  }
}

window.forcePartPolyfill = window.forcePartPolyfill ||
  window.location.search.indexOf('forcePartPolyfill') >= 0;

const usingShadyDom = !!window.ShadyDOM;

const supportsPart = 'part' in Element.prototype;

export const useNativePart = () => supportsPart &&
  !(usingShadyDom || window.forcePartPolyfill);

export interface CSSPartRule {
  rawSelector: string;
  slotSelector: string;
  selector: string;
  selectorPseudo?: string;
  part?: string;
  partPseudo?: string;
  guid: string;
  dynamic: boolean;
  propertySet: CSSResult;
  order?: number;
}

let guid = 0;
export const GUID_PREFIX = 'pr-';

export const dynamicSelector = (value: string) => !!/\./.test(value);

export class CSSPartRuleSet {

  selector: string[]|string;
  propertySet: CSSResult;

  private _rules?: CSSPartRule[];

  // TODO(sorvell): support multiple pseudo selectors
  // (1. nothing)(2. nothing)(3. non-pseudo selector):(4. pseudo)::part((5. part)):(6. pseudo)
  private _rx = /()()([^:]*)(?:\:([^:]+))?(?:\:\:part\(([^)]*)\))?(?:\:(.+))?/;
  // (1. non-pseudo selector)(2. (::slotted))(3. non-pseudo or end paren):(4. pseudo)::part((5. part)):(6. pseudo)
  private _slottedRx = /([^:]*)(\:\:slotted)\(([^):]*)(?:\:([^:]+))?\)(?:\:\:part\(([^)]*)\))?(?:\:(.+))?/;

  constructor(selector: string[]|string, propertySet: CSSResult) {
    this.selector = selector;
    this.propertySet = propertySet;
  }

  get rules() {
    if (this._rules === undefined) {
      this._rules = [];
      if (Array.isArray(this.selector)) {
        this.selector.forEach((selector) => this._parse(selector));
      } else {
        this._parse(this.selector);
      }
    }
    return this._rules;
  }

  _parse(selector: string) {
    let match = selector.match(this._slottedRx) || selector.match(this._rx);
    if (match) {
      // @ts-ignore (ignore unused variable there for destructuring)
      const [rawSelector, slotSelector, isSlotted, selector, selectorPseudo, part, partPseudo] = match;
      this._rules!.push({
        rawSelector,
        slotSelector: isSlotted ? slotSelector || '*' : '',
        selector,
        selectorPseudo,
        part,
        partPseudo,
        guid: `${GUID_PREFIX}${++guid}`,
        dynamic: dynamicSelector(selector),
        propertySet: this.propertySet
      });
    }
  }

  toString() {
    if (!useNativePart()) {
      return '';
    }
    const result: string[] = [];
    this.rules.forEach((rule) =>
      result.push(`${rule.rawSelector} { ${rule.propertySet} }`));
    return result.join('\n');
  }

}

export type PartRules = Set<CSSPartRule>;

export const addPartRules = (set: PartRules, rules: CSSPartRuleSet[]) => {
  rules.forEach((rule) => rule.rules.forEach((ruleInfo) => {
    if (ruleInfo.part) {
      const r = Object.create(ruleInfo);
      r.order = set.size;
      set.add(r);
    }
  }));
};

export const part = (selector: string|Array<string>, propertySet: CSSResult) =>
  new CSSPartRuleSet(selector, propertySet);


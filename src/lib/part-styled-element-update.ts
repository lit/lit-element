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
import {LitElement, PropertyValues, property} from '../lit-element.js';
import {unsafeCSS} from './css-tag.js';

export * from '../lit-element.js';

interface CSSPartRule {
  selector: string;
  part: string;
  propertySet: string;
  pseudo: string;
  guid: string;
  dynamic: string;
}

type CSSPartRuleSet = Set<CSSPartRule>;

// converts "inner:outer, ..." to a Map<outer: inner>
const exportPartsConverter = (value: string) => {
  const map = new Map();
  value.split(',').forEach((mapping) => {
    const parts = mapping.split(':');
    const inner = parts[0].trim();
    const outer = parts[1] ? parts[1].trim() : inner;
    map.set(outer, inner);
  });
  return map;
};

let guid = 0;
const partRulesByGuid: Map<string, CSSPartRule> = new Map();

const PART_ATTR = 'part-guid';

const GUID_PREFIX = 'pr-';
const STYLE_SCOPE = 'style-scope';
const dynamicSelector = (value: string) => /^\.[^\s\]\[#~+>()]*$/.test(value) ? value.substring(1) : '';

export class PartStyledElement extends LitElement {

  static useNativePart = 'part' in Element.prototype;

  static partRuleMap: Map<string, CSSPartRuleSet>;

  static partRule(selector: string, part: string, propertySet: string, pseudo = '') {
    let rule;
    if (this.useNativePart && !window.ShadyDOM) {
      rule = `${selector}::part(${part})${pseudo ? `:${pseudo}` : ''} { ${propertySet} }`;
    } else {
      const dynamic = dynamicSelector(selector);
      this._addToPartRuleMap({selector, part, propertySet, pseudo, guid: `${GUID_PREFIX}${++guid}`, dynamic});
      rule = '';
    }
    // TODO(sorvell): avoid using this but require only literals in these arguments
    return unsafeCSS(rule);
  }

  static _addToPartRuleMap(rule: CSSPartRule) {
    if (!this.hasOwnProperty('partRuleMap')) {
        this.partRuleMap = new Map();
      }
      let rules = this.partRuleMap.get(rule.selector);
      if (!rules) {
        rules = new Set();
        this.partRuleMap.set(rule.selector, rules);
      }
      rules.add(rule);
      partRulesByGuid.set(rule.guid, rule);
  }

  @property({attribute: 'exportparts', converter: exportPartsConverter})
  exportParts: Map<string, string>|null = null;

  private _styleHost?: PartStyledElement|null;
  private _partsChildren = new Set();
  private _exportedPartRuleMap: Map<string, CSSPartRuleSet> = new Map();

  partGuid: Set<string> = new Set();
  updatePartGuid() {
    const v: string[] = [];
    this.partGuid.forEach((g) => v.push(g));
    this.setAttribute(PART_ATTR, v.join(' '));
  }

  /**
   * By default, this queries for elements with a part attribute in the initially
   * rendered DOM. If parts are needed that are not initially rendered,
   * override and provide the additional part names.
   *
   * Returns an array of part names rendered in this element.
   */
  protected get cssPartNames() {
    return Array.from(this.shadowRoot!.querySelectorAll('[part]'))
        .map((e) => e.getAttribute('part'));
  }

  __cssParts?: Map<string, CSSPartRuleSet|null>;
  private get _cssParts() {
    if (!this.__cssParts) {
      const parts = this.cssPartNames;
      this.__cssParts = new Map();
      parts.forEach((p) => this.__cssParts!.set(p as string, new Set()));
    }
    return this.__cssParts;
  }

  addPartStyle(part: string, rule: CSSPartRule) {
    //console.log('addPartStyle', this.localName, part, rule, forward);
    this._ensurePartRule(part, rule.selector, rule);
    // forward
    this._addPartToExportChildren(part, rule);
  }

  private _addPartToExportChildren(part: string, rule: CSSPartRule) {
    let ruleSet = this._exportedPartRuleMap.get(part);
    if (!ruleSet) {
      ruleSet = new Set();
      this._exportedPartRuleMap.set(part, ruleSet);
    }
    this._partsChildren.forEach(async (child) => {
      await child.updateComplete;
      const inner = (child as PartStyledElement).exportParts!.get(part);
      if (inner) {
        ruleSet!.add(rule);
        child._ensurePartRule(inner, `[${PART_ATTR}~=${rule.guid}]`, rule);
        child.partGuid.add(rule.guid);
        child.updatePartGuid();
        child._addPartToExportChildren(inner, rule);
      }
    });
  }

  removePartStyle(part: string, rule: CSSPartRule) {
    this._removePartFromExportChildren(part, rule);
  }

  private _removePartFromExportChildren(part: string, rule: CSSPartRule) {
    const ruleSet = this._exportedPartRuleMap.get(part);
    if (!ruleSet || ruleSet.size === 0) {
      return;
    }
    ruleSet.delete(rule);
    //console.log('removePartStyle', this.localName, rule);
    this._partsChildren.forEach(async (child) => {
      await child.updateComplete;
      const inner = (child as PartStyledElement).exportParts!.get(part);
      if (inner) {
        child.partGuid.delete(rule.guid);
        child.updatePartGuid();
        child._removePartFromExportChildren(inner, rule);
      }
    });
  }

  private _ensurePartRule(part: string, selector: string, rule: CSSPartRule) {
    const rules = this._cssParts.get(part);
    // if we are interested in this part and don't have have a rule for it, add it.
    if (rules !== undefined && !rules!.has(rule)) {
      rules!.add(rule);
      const {propertySet, pseudo} = rule;
      const partStyle = document.createElement('style');
      let hostSelector = `:host(${selector})`;
      let partSelector = `[part=${part}]`;
      if (window.ShadyDOM) {
        const host = this._styleHost;
        const hostScope = `${this.localName}${host ? `.${STYLE_SCOPE}.${host.localName}` : ''}`;
        hostSelector = `${hostScope}${selector.replace(new RegExp(`${this.localName}|\\*`), '')}`;
        partSelector = `.${STYLE_SCOPE}.${this.localName}${partSelector}`;
      }
      partStyle.textContent = `${hostSelector} ${partSelector}${pseudo ? `:${pseudo}` : ''} { ${propertySet} }`;
      if (window.ShadyDOM) {
        document.head.appendChild(partStyle);
      } else {
        this.shadowRoot!.appendChild(partStyle);
      }
    }
  }

  addPartsChild(child: Element) {
    this._partsChildren.add(child);
  }

  removePartsChild(child: Element) {
    this._partsChildren.delete(child);
  }

  connectedCallback() {
    super.connectedCallback();
    this._styleHost = (this.getRootNode() as ShadowRoot).host as PartStyledElement || null;
    if (this._styleHost && this._styleHost.addPartsChild) {
      this._styleHost.addPartsChild(this);
    }

  }

  disconnectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    if (this._styleHost && this._styleHost.removePartsChild) {
      this._styleHost.removePartsChild(this);
      this._styleHost = null;
    }
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    this._updateParts();
  }

  private _updateParts() {
    const ruleSetMap = (this.constructor as typeof PartStyledElement).partRuleMap;
    if (!ruleSetMap) {
      return;
    }
    this._partsChildren.forEach(async (child) => {
      await child.updateComplete;
      ruleSetMap.forEach((ruleSet, selector) => {
        if (child.matches(selector)) {
          ruleSet.forEach((rule) => child.addPartStyle(rule.part, rule));
        } else {
          ruleSet.forEach((rule) => child.removePartStyle(rule.part, rule));
        }
      });
    });
  }

}
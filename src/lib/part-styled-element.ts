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

  static get observedAttributes() {
    return super.observedAttributes.concat(['class']);
  }

  @property({attribute: 'exportparts', converter: exportPartsConverter})
  exportParts: Map<string, string>|null = null;

  private _styleHost?: PartStyledElement|null;
  private _exportPartsChildren = new Set();
  private _partsDirty = true;
  private _exportedPartRules: Map<CSSPartRule, string> = new Map();
  private _dynamicPartRuleMap?: Map<string, CSSPartRuleSet>;

  attributeChangedCallback(name: string, old: string|null, value: string|null) {
    if (old !== value) {
      super.attributeChangedCallback(name, old, value);
      // When the class attribute changes, update dynamic part at next update.
      if (name === 'class') {
        this._partsDirty = true;
        this.requestUpdate();
      }
    }
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



  addPartStyle(part: string, rule: CSSPartRule, forward = false) {
    //console.log('addPartStyle', this.localName, part, rule, forward);
    const rules = this._cssParts.get(part);
    // if we are interested in this part and don't have have a rule for it, add it.
    if (rules !== undefined && !rules!.has(rule)) {
      rules!.add(rule);
      const {propertySet, pseudo} = rule;
      const selector = forward ? `.${rule.guid}` : rule.selector;
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
    // forward
    this._exportPartsChildren.forEach((child) => {
      const exports = (child as PartStyledElement).exportParts;
      if (exports && exports.get(part)) {
        this._exportedPartRules.set(rule, part);
        child.classList.add(rule.guid);
      }
    });
  }

  removePartStyle(rule: CSSPartRule) {
    //console.log('removePartStyle', this.localName, rule);
    this._exportPartsChildren.forEach((child) => {
      const exports = (child as PartStyledElement).exportParts;
      if (exports) {
        child.classList.remove(rule.guid);
      }
    });
  }

  addExportPartsChild(child: Element) {
    this._exportPartsChildren.add(child);
  }

  removeExportPartsChild(child: Element) {
    this._exportPartsChildren.delete(child);
  }

  connectedCallback() {
    this._styleHost = (this.getRootNode() as ShadowRoot).host as PartStyledElement || null;
    // Note, dynamically adding `exportParts` is not supported.
    if (this._styleHost && this._styleHost.addExportPartsChild && this.exportParts) {
      this._styleHost.addExportPartsChild(this);
    }
    super.connectedCallback();
  }

  disconnectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    if (this._styleHost && this._styleHost.removeExportPartsChild) {
      this._styleHost.removeExportPartsChild(this);
      this._styleHost = null;
    }
  }

  firstUpdated(changedProperties: PropertyValues) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    if (!(this.constructor as typeof PartStyledElement).useNativePart ||  window.ShadyDOM) {
      this._updateStaticParts();
    }
  }


  private _updateStaticParts() {
    const map = this._styleHost && (this._styleHost.constructor as typeof PartStyledElement).partRuleMap;
    // process static part rules here and store dynamic rules for runtime updates.
    if (map) {
      this._dynamicPartRuleMap = new Map();
      map.forEach((rules: CSSPartRuleSet, selector: string) => {
        if (dynamicSelector(selector) !== '') {
          this._dynamicPartRuleMap!.set(selector, rules);
        } else {
          rules.forEach((rule) => {
            if (this.matches(rule.selector)) {
              this.addPartStyle(rule.part, rule);
            }
          });
        }
      });
    }
  }

  updated(changedProperties: PropertyValues) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if ((!(this.constructor as typeof PartStyledElement).useNativePart || window.ShadyDOM) && this._partsDirty) {
      this._updateDynamicParts();
    }
  }

  _previousClassList = new Set();

  private _updateDynamicParts() {
    //console.log('_updatePartsByClass', this.localName, this.className);
    this._partsDirty = false;
    const map = this._dynamicPartRuleMap!;
    const exports = this.exportParts;
    const classList = new Set();
    this.classList.forEach((value) => {
      // build a set of existing classes
      // (build this up instead of constructing Set with classList for IE compat)
      classList.add(value);
      // if this class is a `guid`, then this class is only for forwarding.
      const forwardRule = partRulesByGuid.get(value);
      // create a list of removed classes while iterating
      if (this._previousClassList.has(value)) {
        this._previousClassList.delete(value);
      // non-guid class, get the dynamic part rules matching this class
      // and ensure they are added.
      } else if (map && !forwardRule) {
        const ruleSet = map.get(`.${value}`);
        if (ruleSet !== undefined) {
          ruleSet.forEach((rule) => {
            this.addPartStyle(rule.part, rule);
          });
        }
      // guid class: forward this rule if we have an export for it.
      } else if (exports && forwardRule) {
        const part = this._styleHost && this._styleHost._exportedPartRules.get(forwardRule);
        const inner = exports && exports.get(part!);
        if (inner !== undefined) {
          this.addPartStyle(inner, forwardRule, true);
        }
      }
    });
    // process removed classes: this is needed only for forwards
    const removedClasses = this._previousClassList;
    this._previousClassList = classList;
    removedClasses.forEach((value) => {
      if (this._exportedPartRules !== undefined) {
        const forwardRule = partRulesByGuid.get(value);
        this._exportedPartRules.forEach((_part, rule) => {
          if ((forwardRule && rule.guid === value) || (rule!.dynamic === value)) {
            this.removePartStyle(rule);
          }
        });
      }
    });
  }

}
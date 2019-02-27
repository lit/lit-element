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

/**
 * TODO
 * 1. Instead of add/removing styles, use a class on the host to turn on/off styles
 * 2. For efficiency have elements register the parts they are interested in.
 * 3. Try MO instead of updated for updating parts
 * 4. perf testing
 * 5. ideally this is a mixin but TypeScript is not cooperating with
 * extending a class with private fields.
 */

interface CSSPartRule {
  selector: string;
  part: string;
  propertySet: string;
  pseudo: string;
}

// converts "inner:outer, ..." to a Map<outer: inner>
const exportPartsConverter = (value: string) => {
  const map = new Map();
  value.split(',').forEach((mapping) => {
    const parts = mapping.split(':');
    const inner = parts[0].trim();
    const outer = parts[1] !== '' ? parts[1].trim() : inner;
    map.set(outer, inner);
  });
  return map;
};

export class PartStyledElement extends LitElement {

  @property({attribute: 'exportparts', converter: exportPartsConverter})
  exportParts: Map<string, string>|null = null;

  static useNativePart = 'part' in Element.prototype;

  private static _cssPartRules: Map<string, CSSPartRule>;

  static partRule(selector: string, part: string, propertySet: string, pseudo = '') {
    if (!this.hasOwnProperty('_cssPartRules')) {
      this._cssPartRules = new Map();
    }
    let rule;
    if (this.useNativePart) {
      rule = `${selector}::part(${part})${pseudo ? `:${pseudo}` : ''} { ${propertySet} }`;
    } else {
      this._cssPartRules.set(part, {selector, part, propertySet, pseudo});
      rule = '';
    }
    // TODO(sorvell): avoid using this but require only literals in these arguments
    return unsafeCSS(rule);
  }

  private _cssParts = new Map();

  private _partStyledChildren = new Set();

  addPartStyle(part: string, rule: CSSPartRule) {
    if (this._partNames.has(part)) {
      const {propertySet, pseudo} = rule;
      let partStyle = this._cssParts.get(rule);
      if (partStyle === undefined) {
        partStyle = document.createElement('style');
        this._cssParts.set(rule, partStyle);
      }
      /**
       * Using a GUID the rule might be something like this.
       * :host(.guid) [part=partName] {...}
       * The descendant selector here is (1) maybe slow, (2) needs scoping to
       * not overly match when ShadyDOM is in use.
       */
      partStyle.textContent = `:host(${this.localName}) [part=${part}]${pseudo ? `:${pseudo}` : ''} { ${propertySet} }`;
      this.shadowRoot!.appendChild(partStyle);
    }
    // forwarding
    this._partStyledChildren.forEach(async (child) => {
      await child.updateComplete;
      const exports = (child as PartStyledElement).exportParts;
      const inner = exports !== null ? exports.get(part) : undefined;
      if (inner !== undefined) {
        child.addPartStyle(inner, rule);
      }
    });
  }

  removePartStyle(part: string, rule: CSSPartRule) {
    if (this._partNames.has(part)) {
      const partStyle = this._cssParts.get(rule);
      if (partStyle) {
        partStyle.parentNode.removeChild(partStyle);
      }
    }
    // forwarding
    this._partStyledChildren.forEach(async (child) => {
      await child.updateComplete;
      const exports = (child as PartStyledElement).exportParts;
      const inner = exports !== null ? exports.get(part) : undefined;
      if (inner !== undefined) {
        child.removePartStyle(inner, rule);
      }
    });
  }

  addPartChild(child: Element) {
    this._partStyledChildren.add(child);
  }

  removePartChild(child: Element) {
    this._partStyledChildren.delete(child);
  }

  connectedCallback() {
    const host = (this.getRootNode() as ShadowRoot).host as PartStyledElement || null;
    // TODO(sorvell): only add this child if it has parts or exportedParts
    if (host && host.addPartChild) {
      host.addPartChild(this);
    }
    super.connectedCallback();
  }

  disconnectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    const host = (this.getRootNode() as ShadowRoot).host as PartStyledElement || null;
    if (host && host.removePartChild) {
      host.removePartChild(this);
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

  __partNames?: Set<string>|null;
  private get _partNames() {
    if (!this.__partNames) {
      const parts = this.cssPartNames;
      this.__partNames = new Set();
      parts.forEach((p) => this.__partNames!.add(p as string));
    }
    return this.__partNames;
  }

  updated(changedProperties: PropertyValues) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    this._updatePartChildren();
  }

  private _updatePartChildren() {
    const partRules = (this.constructor as typeof PartStyledElement)._cssPartRules;
    if (!partRules) {
      return;
    }
    this._partStyledChildren.forEach(async (child) => {
      await child.updateComplete;
      partRules.forEach((rule: CSSPartRule) => {
        if (child.matches(rule.selector)) {
          child.addPartStyle(rule.part, rule);
        } else {
          child.removePartStyle(rule.part, rule);
        }
      });
    });
  }
}

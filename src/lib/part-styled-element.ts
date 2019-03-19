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
import {CSSPartRule, addPartRules, useNativePart} from './css-part.js';
import {documentPartRules} from './document-style.js';
import {LitElement, PropertyValues, property} from '../lit-element.js';

export {part} from './css-part.js';

export * from '../lit-element.js';

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

const usingShadyDom = !!window.ShadyDOM;

const PART_ATTR = 'part-guid';

const STYLE_SCOPE = 'style-scope';

type StyleOrdering = Array<Array<HTMLStyleElement|null>>;
/**
 * Place this style into the `ordering` map at sorted location and return a
 * reference node to insert the style before.
 */
const orderStyle = (style: HTMLStyleElement, ordering: StyleOrdering, distance: number, order: number) => {
  let ref = null;
  // ensure order array for this `distance`
  let list = ordering[distance] || (ordering[distance] = []);
  // place style at ordered location.
  list[order] = style;
  // at the current distance, return any style after this one.
  for (let i = order + 1; i < list.length; i++) {
    ref = list[i];
    if (ref !== null) {
      break;
    }
  }
  if (ref === null) {
    // if no style is returned, search greater distances and just get the first style.
    for (let i = distance + 1; i < ordering.length; i++) {
      list = ordering[i];
      if (list) {
        // get the first style in this list
        list.some((style) => !!(ref = style));
        if (ref !== null) {
          break;
        }
      }
    }
  }
  return ref;
};

const removeStyles = (list: Array<HTMLStyleElement|null>) =>
  list.forEach((style) => {
    if (style !== null) {
      style.parentNode!.removeChild(style);
    }
  });

// Set of style cssText added to document in ShadyDOM case.
const appliedShadyStyles: Set<string> = new Set();

// TODO(sorvell): if not polyfiling part, just use LitElement.
export class PartStyledElement extends LitElement {

  // overridden to establish part context
  static getUniqueStyles(name: string) {
    const cssResults = super.getUniqueStyles(name);
    cssResults.forEach((s) => {
      if (s.parts!.length) {
        if (!this.hasOwnProperty('cssPartRules')) {
          this.cssPartRules = new Set();
        }
        addPartRules(this.cssPartRules!, s.parts!);
      }
    });
    return cssResults;
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'class'];
  }

  @property({attribute: 'exportparts', converter: exportPartsConverter})
  exportParts: Map<string, string>|null = null;

  static cssPartRules?: Set<CSSPartRule>;

  private _staticPartsDirty = true;
  private _dynamicPartsDirty = true;
  private _partParent?: PartStyledElement|null;
  private _exportPartChildren = new Set();
  private _dynamicParts?: Set<CSSPartRule>|null;
  private _partOrder: StyleOrdering = [];

  private _partGuid: Set<string> = new Set();
  private _updatePartGuid() {
    const v: string[] = [];
    this._partGuid.forEach((g) => v.push(g));
    this.setAttribute(PART_ATTR, v.join(' '));
  }

  attributeChangedCallback(name: string, old: string|null, value: string|null) {
    if (old !== value) {
      super.attributeChangedCallback(name, old, value);
      // When the class attribute changes, update dynamic part at next update.
      if (name === 'class' && !this._dynamicPartsDirty) {
        this._dynamicPartsDirty = true;
        this.updateComplete.then(() => {
          if (this._dynamicPartsDirty) {
            this._updateDynamicParts();
          }
        });
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
  // TODO(sorvell): can we avoid this since it depends on rendering state?
  // TODO(sorvell): qsa'ing here costs about 5%.
  static _cssPartNames?: Set<string>;
  protected get cssPartNames() {
    if (!this.constructor.hasOwnProperty('_cssPartNames')) {
      (this.constructor as typeof PartStyledElement)
        ._cssPartNames = new Set();
      const els = this.shadowRoot!.querySelectorAll('[part]');
      for (let i = 0; i < els.length; i++) {
        const parts = els[i].getAttribute('part')!.split(/\s/).filter((e) => e);
        parts.forEach((part) => {
          (this.constructor as typeof PartStyledElement)
            ._cssPartNames!.add(part!);
        });
      }
    }
    return (this.constructor as typeof PartStyledElement)
      ._cssPartNames;
  }

  _appliedParts = new Set();

  addPartStyle(part: string, rule: CSSPartRule) {
    // console.log('addPartStyle', this.localName, part, rule);
    this._ensurePartRule(part, rule.selector, rule);
    this.addExportPartStyle(part, rule);
  }

  addExportPartStyle(part: string, rule: CSSPartRule, distance: number = 0) {
    if (distance > 0) {
      // TODO(sorvell): setting attribute and using attr selector costs ~8%
      this._ensurePartRule(part, `[${PART_ATTR}~=${rule.guid}]`, rule, distance);
      //this._ensurePartRule(part, this.localName, rule, distance);
      this._partGuid.add(rule.guid);
      this._updatePartGuid();
    }
    // TODO(sorvell): could filter by `cssPartNames` to avoid trying to export
    // parts that are not needed.
    // TODO(sorvell): we should either send these as a block or just
    // set guids and let the system pull.
    this._exportPartChildren.forEach(async (child) => {
      const inner = (child as PartStyledElement).exportParts!.get(part);
      if (inner) {
        await child.updateComplete;
        child.addExportPartStyle(inner, rule, ++distance);
      }
    });
  }

  removePartStyle(part: string, rule: CSSPartRule) {
    this.removeExportPartStyle(part, rule);
  }

  removeExportPartStyle(part: string, rule: CSSPartRule, distance: number = 0) {
    if (distance > 0) {
      this._partGuid.delete(rule.guid);
      this._updatePartGuid();
    }
    //console.log('removePartStyle', this.localName, rule);
    this._exportPartChildren.forEach(async (child) => {
      const inner = (child as PartStyledElement).exportParts!.get(part);
      if (inner) {
        await child.updateComplete;
        child.removeExportPartStyle(inner, rule, ++distance);
      }
    });
  }

  private _ensurePartRule(part: string, selector: string, rule: CSSPartRule, distance: number = 0) {
    // Bail if we don't care about this part or have already applied it.
    if (!this.cssPartNames!.has(part) || this._appliedParts.has(rule)) {
      return;
    }
    this._appliedParts.add(rule);
    const {selectorPseudo, partPseudo, propertySet} = rule;
    let hostSelector = `:host(${selector}${selectorPseudo ? `:${selectorPseudo}` : ''})`;
    let partSelector = `[part~=${part}]`;
    if (usingShadyDom) {
      const hostScope = `${this.localName}${this._partParent ?
        `.${STYLE_SCOPE}.${this._partParent.localName}` : ''}`;
      hostSelector = `${hostScope}${selector.replace(new RegExp(`${this.localName}|\\*`), '')}`;
      partSelector = `.${STYLE_SCOPE}.${this.localName}${partSelector}`;
    }
    const cssText = `${hostSelector} ${partSelector}${partPseudo ? `:${partPseudo}` : ''} { ${propertySet} }`;
    // Bail if already added in ShadyDOM case.
    if (usingShadyDom && appliedShadyStyles.has(cssText)) {
      return;
    }
    const partStyle = document.createElement('style');
    const refNode = orderStyle(partStyle, this._partOrder, distance, rule.order!);
    partStyle.textContent = cssText;
    if (usingShadyDom) {
      appliedShadyStyles.add(cssText);
      document.head.insertBefore(partStyle, refNode);
    } else {
      this.shadowRoot!.insertBefore(partStyle, refNode);
    }
  }

  addExportPartChild(child: Element) {
    this._exportPartChildren.add(child);
  }

  removeExportPartChild(child: Element) {
    this._exportPartChildren.delete(child);
  }

  connectedCallback() {
    this._partParent = (this.getRootNode() as ShadowRoot).host as PartStyledElement;
    // Note, dynamically adding `exportParts` is not supported.
    if (this._partParent && this._partParent.addExportPartChild && this.exportParts) {
      this._partParent.addExportPartChild(this);
    }
    if (this.hasUpdated) {
      this.updateComplete.then(() => this._updateParts());
    }
    super.connectedCallback();
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    // remove all part rules.
    this._dynamicParts = null;
    this._appliedParts = new Set();
    // TODO(sorvell): This could remove styles only if there is no parentNode.
    // In that case, export children would need to remove any styling
    // at a distances greater than or equal to this element's distance to the child.
    // This would require being able to remove rules associated with styles
    // which would mean keeping a map of style => rule.
    // TODO(sorvell): This work could also be debounced to avoid doing it if the
    // node is immediately re-connected (to the same host).
    // Remove all part styles; note, exported styles will be auto
    // removed via disconnect. We avoid doing this for ShadyDOM since they
    // may be used for other elements and will no longer match this element.
    if (!usingShadyDom) {
      this._partOrder.forEach((list) => removeStyles(list));
    }
    this._partOrder = [];
    this._staticPartsDirty = true;
    this._dynamicPartsDirty = true;
    if (this._partParent && this._partParent.removeExportPartChild) {
      this._partParent.removeExportPartChild(this);
    }
    this._partParent = null;
  }

  updated(changedProperties: PropertyValues) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    this._updateParts();
  }

  private _updateParts() {
    if (!useNativePart() && this._dynamicPartsDirty) {
      if (this._staticPartsDirty) {
        this._updateStaticParts();
      }
      this._updateDynamicParts();
    }
  }

  private _updateStaticParts() {
    this._staticPartsDirty = false;
    const map = this._partParent ?
      (this._partParent.constructor as typeof PartStyledElement).cssPartRules : documentPartRules;
    // process static part rules here and store dynamic rules for runtime updates.
    if (map) {
      this._dynamicParts = new Set();
      map.forEach((rule: CSSPartRule) => {
        if (rule.dynamic) {
          this._dynamicParts!.add(rule);
        } else {
          if (this.matches(rule.selector)) {
            this.addPartStyle(rule.part!, rule);
          }
        }
      });
    }
  }

  private _updateDynamicParts() {
    this._dynamicPartsDirty = false;
    if (this._dynamicParts) {
      this._dynamicParts.forEach((rule) => this.matches(rule.selector) ?
        this.addPartStyle(rule.part!, rule) :
        this.removePartStyle(rule.part!, rule)
      );
    }
  }

}
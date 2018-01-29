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
import { PropertiesMixin } from '../../@polymer/polymer/lib/mixins/properties-mixin.js';
import { camelToDashCase } from '../../@polymer/polymer/lib/utils/case-map.js';
import { TemplateResult } from '../../lit-html/lit-html.js';
import { render } from '../../lit-html/lib/lit-extended.js';

export { html } from '../../lit-html/lit-html.js';

/**
 * Renders attributes to the given element based on the `attrInfo` object where
 * boolean values are added/removed as attributes.
 * @param {*} element Element on which to set attributes.
 * @param {*} attrInfo Object describing attributes.
 */
export function renderAttributes(element: HTMLElement, attrInfo: any) {
  for (const a in attrInfo) {
    const v = attrInfo[a] === true ? '' : attrInfo[a];
    if (v || v === '' || v === 0)  {
      if (element.getAttribute(a) !== v) {
        element.setAttribute(a, v);
      }
    } else if (element.hasAttribute(a)) {
      element.removeAttribute(a);
    }
  }
}

/**
 * Returns a string of css class names formed by taking the properties
 * in the `classInfo` object and appending the property name to the string of
 * class names if the property value is truthy.
 * @param {*} classInfo
 */
export function classString(classInfo: any) {
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
 * @param {*} styleInfo
 */
export function styleString(styleInfo: any) {
  const o = [];
  for (const name in styleInfo) {
    const v = styleInfo[name];
    if (v || v === 0) {
      o.push(`${camelToDashCase(name)}: ${v}`);
    }
  }
  return o.join('; ');
}

export class LitElement extends PropertiesMixin(HTMLElement) {

  private __nextRendered: Promise<any>|null = null;
  private __nextRenderedResolver: Function|null = null;

  protected ready() {
    this.attachShadow({mode: 'open'});
    super.ready();
  }

  protected _shouldPropertiesChange() { return true; }

  // TODO(sorvell): push to PropertiesChanged
  protected _flushProperties() {
    if (this._shouldPropertiesChange()) {
      let changedProps = this.__dataPending;
      this.__dataPending = null;
      this._propertiesChanged(this.__data, changedProps, this.__dataOld);
    }
  }

  protected _propertiesChanged(props: any, ...args) {
    super._propertiesChanged(props, ...args);
    const result = this.render(props);
    if (result) {
      render(result, this.shadowRoot!);
    }
    this.didRender();
    if (this.__nextRenderedResolver) {
      this.__nextRenderedResolver();
      this.__nextRenderedResolver = null;
      this.__nextRendered = null;
    }
  }

  /**
   * Return a template result to render using lit-html.
   */
  protected render(_props: object): TemplateResult {
    throw new Error('render() not implemented');
  }

  /**
   * Method called after rendering; can be used to directly access element DOM.
   */
  protected didRender() {}

  /**
   * Provokes the element to asynchronously re-render.
   */
  invalidate() {
    this._invalidateProperties();
  }

  /**
   * Returns a promise which resolves after the element next renders.
   */
  get nextRendered() {
    if (!this.__nextRendered) {
      // TODO(sorvell): handle rejected render.
      this.__nextRendered = new Promise((resolve) => {
        this.__nextRenderedResolver = resolve;
      });
    }
    return this.__nextRendered;
  }

}

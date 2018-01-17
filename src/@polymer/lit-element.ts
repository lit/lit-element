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
import { TemplateResult } from '../../lit-html/lit-html.js';
import { render } from '../../lit-html/lib/lit-extended.js';

export { html } from '../../lit-html/lit-html.js';
export class LitElement extends PropertiesMixin(HTMLElement) {

  _nextRendered: Promise<any>|null = null;
  _nextRenderedResolver: Function|null = null;

  ready() {
    this.attachShadow({mode: 'open'});
    super.ready();
  }

  _flushProperties() {
    super._flushProperties();
    // TODO(sorvell): propertiesChanged should have `_getData`
    const result = this.render(this.__data);
    if (result) {
      render(result, this.shadowRoot!);
    }
    if (this._nextRenderedResolver) {
      this._nextRenderedResolver();
      this._nextRenderedResolver = null;
      this._nextRendered = null;
    }
  }

  /**
   * Return a template result to render using lit-html.
   */
  render(_props: object): TemplateResult {
    throw new Error('render() not implemented');
  }

  invalidate() {
    this._invalidateProperties();
  }

  get nextRendered() {
    if (!this._nextRendered) {
      // TODO(sorvell): handle rejected render.
      this._nextRendered = new Promise((resolve) => {
        this._nextRenderedResolver = resolve;
      });
    }
    return this._nextRendered;
  }

}

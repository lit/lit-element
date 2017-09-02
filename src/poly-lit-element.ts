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

import { dedupingMixin } from '../@polymer/polymer/lib/utils/mixin.js';
import { TemplateResult } from '../lit-html/lit-html.js';
import { render } from '../lit-html/lib/lit-extended.js';

export { html } from '../lit-html/lit-html.js';

export type Constructor<T> = { new(...args: any[]): T };

declare interface PropertyAccessors {
  ready(): void;
  __dataPending: object;
  __dataOld: object;
  _invalidateProperties(): void;
  _propertiesChanged(props: any, changed: any, old: any): void;
}

export const PolymerLit = dedupingMixin(<S extends Constructor<HTMLElement & PropertyAccessors>>(base: S) => {

  return class PolymerLit extends base {

    _templateResult: TemplateResult;

    ready() {
      this.attachShadow({mode: 'open'});
      super.ready();
      // TODO(sorvell): we need to trigger rendering even if no changes occurred!
      // can set a dummy property, but that's maybe not good so we "invalidate"
      // but need to ready private state to do so.
      //this._setProperty('_readied', true);
      this.__dataPending = this.__dataPending || {};
      this.__dataOld = this.__dataOld || {};
      this._invalidateProperties();
    }

    _propertiesChanged(props: any, changed: any, old: any) {
      super._propertiesChanged(props, changed, old);
      this._templateResult = this.render();
      if (this._templateResult) {
        render(this._templateResult, this.shadowRoot!);
      }
    }

    /**
     * Return a template result to render using lit-html.
     */
    render(): TemplateResult {
      throw new Error('render() not implemented');
    }
  }

});

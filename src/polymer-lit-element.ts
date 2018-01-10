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
import { PropertiesMixin } from '../@polymer/polymer/lib/mixins/properties-mixin.js';
import { TemplateResult, html } from '../lit-html/lit-html.js';
import { render } from '../lit-html/lib/lit-extended.js';

export type Constructor<T> = { new(...args: any[]): T };

declare interface PropertiesMixin {
  ready(): void;
  __dataPending: object;
  __dataOld: object;
  _invalidateProperties(): void;
  _propertiesChanged(props: any, changed: any, old: any): void;
}

const htmlFnCache = new Map();

function getHtmlFn(name: string|null) {
  let fn = htmlFnCache.get(name);
  if (!fn) {
    fn = function(strings: TemplateStringsArray, ...values: any[]) {
      return html(strings, ...values);
    }
    htmlFnCache.set(name, fn);
  }
  return fn;
}

export const PolymerLitMixin = dedupingMixin(<S extends Constructor<HTMLElement & PropertiesMixin>>(base: S) => {

  return class PolymerLitElement extends PropertiesMixin(base) {

    __didRender = false;

    ready() {
      this.attachShadow({mode: 'open'});
      super.ready();
      if (!this.__didRender) {
        this._doRender({});
      }
    }

    _propertiesChanged(props: object, changed: object, old: object) {
      super._propertiesChanged(props, changed, old);
      this._doRender(props);
    }

    _doRender(props: object) {
      this.__didRender = true;
      const result = this.render(props, getHtmlFn(this.localName));
      if (result) {
        render(result, this.shadowRoot as DocumentFragment);
      }
    }

    /**
     * Return a template result to render using lit-html.
     */
    render(_props: object, _html: Function): TemplateResult {
      throw new Error('render() not implemented');
    }
  }

});

export const PolymerLitElement = PolymerLitMixin(HTMLElement);

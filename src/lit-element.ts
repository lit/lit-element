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
import {render} from 'lit-html/lib/shady-render';
import {TemplateResult} from 'lit-html';
import {UpdatingElement, PropertyValues} from './lib/updating-element.js';

export {property, identity, BooleanAttribute, PropertyDeclarations, PropertyDeclaration, PropertyValues} from './lib/updating-element.js';
export {html, svg} from 'lit-html/lit-html';


export abstract class LitElement extends UpdatingElement {

  /**
   * Override which performs element rendering by calling the `render` method.
   * Override to perform tasks before and/or after updating.
   */
  protected update(_props: PropertyValues) {
    super.update(_props);
    if (typeof this.render === 'function') {
      render(this.render(), this.renderRoot!, this.localName!);
    } else {
      throw new Error('render() not implemented');
    }
  }

  /**
   Invoked on each update to perform rendering tasks. This method must return a
   lit-html TemplateResult.
   * @returns {TemplateResult} Must return a lit-html TemplateResult.
   */
  protected abstract render(): TemplateResult;

}
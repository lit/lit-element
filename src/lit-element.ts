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
import {UpdatingElement} from './lib/updating-element.js';

export {microTask, property} from './lib/updating-element.js';
export {html, svg} from 'lit-html/lib/lit-extended';


export class LitElement extends UpdatingElement {

  /**
   * Override which performs element rendering by calling the `render` method.
   * Override to perform tasks before and/or after updating.
   */
  protected update() {
    render(this.render(), this.root!, this.localName!);
  }

  /**
   * Implement to describe the DOM which should be rendered in the element.
   * The implementation must return a `lit-html` TemplateResult.
   * @param {*} _props Current element properties
   * @returns {TemplateResult} Must return a lit-html TemplateResult.
   */
  protected render(): TemplateResult {
    throw new Error('render() not implemented');
  }

}
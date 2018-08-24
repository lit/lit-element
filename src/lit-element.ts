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

export * from './lib/updating-element.js';
export {html, svg} from 'lit-html/lit-html';


export abstract class LitElement extends UpdatingElement {

  private _firstRendered = false;
  /**
   * Render method used to render the lit-html TemplateResult to the element's DOM.
   * @param {TemplateResult} Template to render.
   * @param {Element|DocumentFragment} Node into which to render.
   * @param {String} Element name.
   */
  static render = render;

  /**
   * Updates the element. This method reflects property values to attributes
   * and calls `render` to render DOM via lit-html. It should be overridden to
   * perform tasks on rendered DOM. Within `update()` setting properties does
   * not trigger `invalidate()`, allowing property values to be computed and
   * validated before DOM is rendered and updated. This means in an override
   * of `update()`, before calling `super.update()` setting properties will not
   * trigger another update, but after calling `super.update()` setting
   * properties will trigger another update.
   * * @param changedProperties Map of changed properties with old values
   */
  protected update(changedProperties: PropertyValues) {
    super.update(changedProperties);
    if (typeof this.render === 'function') {
      (this.constructor as typeof LitElement).render(this.render(), this.renderRoot!, this.localName!);
    } else {
      throw new Error('render() not implemented');
    }
    if (!this._firstRendered) {
      this._firstRendered = true;
      if (typeof this.firstRendered === 'function') {
        this.firstRendered();
      }
    }
  }

  /**
   Invoked on each update to perform rendering tasks. This method must return a
   lit-html TemplateResult. Setting properties in `render()` will not trigger
   the element to update.
   * @returns {TemplateResult} Must return a lit-html TemplateResult.
   */
  protected abstract render(): TemplateResult;

  /**
   Invoked when the element's DOM is first rendered. Override to perform
   post rendering tasks via DOM APIs. For example, focusing a rendered element.
   Setting properties in `firstRendered()` will trigger the element to update.
   * @returns {TemplateResult} Must return a lit-html TemplateResult.
   */
  protected firstRendered?(): void;

}

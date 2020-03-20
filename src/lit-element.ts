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
import {render, ShadyRenderOptions} from 'lit-html/lib/shady-render.js';

import {PropertyValues, UpdatingElement} from './lib/updating-element.js';

export * from './lib/updating-element.js';
export * from './lib/decorators.js';
export {html, svg, TemplateResult, SVGTemplateResult} from 'lit-html/lit-html.js';
import {supportsAdoptingStyleSheets, CSSResult} from './lib/css-tag.js';
export * from './lib/css-tag.js';

declare global {
  interface Window {
    litElementVersions: string[];
  }
}

// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for LitElement usage.
// TODO(justinfagnani): inject version number at build time
(window['litElementVersions'] || (window['litElementVersions'] = []))
    .push('2.3.1');

export interface CSSResultArray extends Array<CSSResult|CSSResultArray> {}

/**
 * Sentinal value used to avoid calling lit-html's render function when
 * subclasses do not implement `render`
 */
const renderNotImplemented = {};

export class LitElement extends UpdatingElement {
  /**
   * Ensure this class is marked as `finalized` as an optimization ensuring
   * it will not needlessly try to `finalize`.
   *
   * Note this property name is a string to prevent breaking Closure JS Compiler
   * optimizations. See updating-element.ts for more information.
   */
  protected static['finalized'] = true;

  /**
   * Render method used to render the value to the element's DOM.
   * @param result The value to render.
   * @param container Node into which to render.
   * @param options Element name.
   * @nocollapse
   */
  static render:
      (result: unknown, container: Element|DocumentFragment,
       options: ShadyRenderOptions) => void = render;

  /**
   * Array of styles to apply to the element. The styles should be defined
   * using the `css` tag function.
   */
  static styles?: CSSResult|CSSResultArray;

  private static _styles: CSSResult[]|undefined;

  /**
   * Return the array of styles to apply to the element.
   * Override this method to integrate into a style management system.
   *
   * @nocollapse
   */
  static getStyles(): CSSResult|CSSResultArray|undefined {
    return this.styles;
  }

  /** @nocollapse */
  private static _getUniqueStyles() {
    // Only gather styles once per class
    if (this.hasOwnProperty(JSCompiler_renameProperty('_styles', this))) {
      return;
    }
    // Take care not to call `this.getStyles()` multiple times since this
    // generates new CSSResults each time.
    // TODO(sorvell): Since we do not cache CSSResults by input, any
    // shared styles will generate new stylesheet objects, which is wasteful.
    // This should be addressed when a browser ships constructable
    // stylesheets.
    const userStyles = this.getStyles();
    if (userStyles === undefined) {
      this._styles = [];
    } else if (Array.isArray(userStyles)) {
      // De-duplicate styles preserving the _last_ instance in the set.
      // This is a performance optimization to avoid duplicated styles that can
      // occur especially when composing via subclassing.
      // The last item is kept to try to preserve the cascade order with the
      // assumption that it's most important that last added styles override
      // previous styles.
      const addStyles =
          (styles: CSSResultArray, set: Set<CSSResult>): Set<CSSResult> =>
              styles.reduceRight(
                  (set: Set<CSSResult>, s) =>
                      // Note: On IE set.add() does not return the set
                  Array.isArray(s) ? addStyles(s, set) : (set.add(s), set),
                  set);
      // Array.from does not work on Set in IE, otherwise return
      // Array.from(addStyles(userStyles, new Set<CSSResult>())).reverse()
      const set = addStyles(userStyles, new Set<CSSResult>());
      const styles: CSSResult[] = [];
      set.forEach((v) => styles.unshift(v));
      this._styles = styles;
    } else {
      this._styles = [userStyles];
    }
  }

  private _needsShimAdoptedStyleSheets?: boolean;

  /**
   * Node or ShadowRoot into which element DOM should be rendered. Defaults
   * to an open shadowRoot.
   */
  readonly renderRoot!: Element|DocumentFragment;

  /**
   * Performs element initialization. By default this calls `createRenderRoot`
   * to create the element `renderRoot` node and captures any pre-set values for
   * registered properties.
   */
  protected initialize() {
    super.initialize();
    (this.constructor as typeof LitElement)._getUniqueStyles();
    (this as {renderRoot: Element | DocumentFragment}).renderRoot =
        this.createRenderRoot();
    // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
    // element's getRootNode(). While this could be done, we're choosing not to
    // support this now since it would require different logic around de-duping.
    if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
      this.adoptStyles();
    }
  }

  /**
   * Returns the node into which the element should render and by default
   * creates and returns an open shadowRoot. Implement to customize where the
   * element's DOM is rendered. For example, to render into the element's
   * childNodes, return `this`.
   * @returns {Element|DocumentFragment} Returns a node into which to render.
   */
  protected createRenderRoot(): Element|ShadowRoot {
    return this.attachShadow({mode: 'open'});
  }

  /**
   * Applies styling to the element shadowRoot using the `static get styles`
   * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
   * available and will fallback otherwise. When Shadow DOM is polyfilled,
   * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
   * is available but `adoptedStyleSheets` is not, styles are appended to the
   * end of the `shadowRoot` to [mimic spec
   * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
   */
  protected adoptStyles() {
    const styles = (this.constructor as typeof LitElement)._styles!;
    if (styles.length === 0) {
      return;
    }
    // There are three separate cases here based on Shadow DOM support.
    // (1) shadowRoot polyfilled: use ShadyCSS
    // (2) shadowRoot.adoptedStyleSheets available: use it.
    // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
    // rendering
    if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
      window.ShadyCSS.ScopingShim!.prepareAdoptedCssText(
          styles.map((s) => s.cssText), this.localName);
    } else if (supportsAdoptingStyleSheets) {
      (this.renderRoot as ShadowRoot).adoptedStyleSheets =
          styles.map((s) => s.styleSheet!);
    } else {
      // This must be done after rendering so the actual style insertion is done
      // in `update`.
      this._needsShimAdoptedStyleSheets = true;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    // Note, first update/render handles styleElement so we only call this if
    // connected after first update.
    if (this.hasUpdated && window.ShadyCSS !== undefined) {
      window.ShadyCSS.styleElement(this);
    }
  }

  /**
   * Updates the element. This method reflects property values to attributes
   * and calls `render` to render DOM via lit-html. Setting properties inside
   * this method will *not* trigger another update.
   * @param _changedProperties Map of changed properties with old values
   */
  protected update(changedProperties: PropertyValues) {
    // Setting properties in `render` should not trigger an update. Since
    // updates are allowed after super.update, it's important to call `render`
    // before that.
    const templateResult = this.render();
    super.update(changedProperties);
    // If render is not implemented by the component, don't call lit-html render
    if (templateResult !== renderNotImplemented) {
      (this.constructor as typeof LitElement)
          .render(
              templateResult,
              this.renderRoot,
              {scopeName: this.localName, eventContext: this});
    }
    // When native Shadow DOM is used but adoptedStyles are not supported,
    // insert styling after rendering to ensure adoptedStyles have highest
    // priority.
    if (this._needsShimAdoptedStyleSheets) {
      this._needsShimAdoptedStyleSheets = false;
      (this.constructor as typeof LitElement)._styles!.forEach((s) => {
        const style = document.createElement('style');
        style.textContent = s.cssText;
        this.renderRoot.appendChild(style);
      });
    }
  }

  /**
   * Invoked on each update to perform rendering tasks. This method may return
   * any value renderable by lit-html's NodePart - typically a TemplateResult.
   * Setting properties inside this method will *not* trigger the element to
   * update.
   */
  protected render(): unknown {
    return renderNotImplemented;
  }
}

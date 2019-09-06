/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/

export const supportsAdoptingStyleSheets =
    ('adoptedStyleSheets' in Document.prototype) &&
    ('replace' in CSSStyleSheet.prototype);

const constructionToken = Symbol();

export class CSSResult {
  _styleSheet?: CSSStyleSheet|null;

  readonly cssText: string;

  constructor(cssText: string, safeToken: symbol) {
    if (safeToken !== constructionToken) {
      throw new Error(
          'CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
    }
    this.cssText = cssText;
  }

  // Note, this is a getter so that it's lazy. In practice, this means
  // stylesheets are not created until the first element instance is made.
  get styleSheet(): CSSStyleSheet|null {
    if (this._styleSheet === undefined) {
      // Note, if `adoptedStyleSheets` is supported then we assume CSSStyleSheet
      // is constructable.
      if (supportsAdoptingStyleSheets) {
        this._styleSheet = new CSSStyleSheet();
        this._styleSheet.replaceSync(this.cssText);
      } else {
        this._styleSheet = null;
      }
    }
    return this._styleSheet;
  }

  toString(): string {
    return this.cssText;
  }

  /**
   * Used when generating files at build time that transform .css files
   * into something like CSS Modules that export CSSResults.
   *
   * Does nothing in production, and doesn't replace existing references
   * unless the current browser supports adopting stylesheets (at time of
   * writing that Chrome only).
   *
   * We could support replacing styles cross-browser,
   * but it would be very tricky to do so without leaking memory, becasue we'd
   * need to keep track of every style element that `this` is written into.
   * This actually seems like a legit use case for WeakRefs.
   */
  notifyOnHotModuleReload(newVal: CSSResult) {
    if (goog.DEBUG) {
      const sheet = this.styleSheet;
      // Only works with constructable stylesheets
      if (sheet === null) {
        return;
      }
      // tslint:disable-next-line:no-any hot module reload writes readonly prop.
      (this as any).cssText = newVal.cssText;
      sheet.replaceSync(newVal.cssText);
    }
  }
}

/**
 * Wrap a value for interpolation in a css tagged template literal.
 *
 * This is unsafe because untrusted CSS text can be used to phone home
 * or exfiltrate data to an attacker controlled site. Take care to only use
 * this with trusted input.
 */
export const unsafeCSS = (value: unknown) => {
  return new CSSResult(String(value), constructionToken);
};

const textFromCSSResult = (value: CSSResult|number) => {
  if (value instanceof CSSResult) {
    return value.cssText;
  } else if (typeof value === 'number') {
    return value;
  } else {
    throw new Error(
        `Value passed to 'css' function must be a 'css' function result: ${
            value}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
  }
};

/**
 * Template tag which which can be used with LitElement's `style` property to
 * set element styles. For security reasons, only literal string values may be
 * used. To incorporate non-literal values `unsafeCSS` may be used inside a
 * template string part.
 */
export const css =
    (strings: TemplateStringsArray, ...values: (CSSResult|number)[]) => {
      const cssText = values.reduce(
          (acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1],
          strings[0]);
      return new CSSResult(cssText, constructionToken);
    };

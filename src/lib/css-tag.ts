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
    ('adoptedStyleSheets' in Document.prototype);

export class CSSResult {

  _styleSheet?: CSSStyleSheet|null;

  readonly cssText: string;

  constructor(cssText: string) { this.cssText = cssText; }

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
}

const textFromCSSResult = (value: CSSResult) => {
  if (value instanceof CSSResult) {
    return value.cssText;
  } else {
    throw new Error(
        `Value passed to 'css' function must be a 'css' function result: ${
            value}.`);
  }
};

export const css =
    (strings: TemplateStringsArray, ...values: CSSResult[]): CSSResult => {
      const cssText = values.reduce(
          (acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1],
          strings[0]);
      return new CSSResult(cssText);
    };
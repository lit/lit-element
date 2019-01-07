/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
export const supportsAdoptedStyleSheets = ('adoptedStyleSheets' in Document.prototype);

interface ConstructableStyleSheet extends CSSStyleSheet {
  replaceSync(cssText: string): void;
  replace(cssText: string): Promise<unknown>;
}

class CSSLiteral {

  value: string;

  constructor(value: string) {
    this.value = value.toString();
  }

  toString() {
    return this.value;
  }
}

const cssLiteralValue = (value: CSSLiteral) => {
  if (value instanceof CSSLiteral) {
    return value.value;
  } else {
    throw new Error(
        `Non-literal value passed to 'css' function: ${value}.`
    );
  }
};

export type CSSStyleSheetOrCssText = {
  cssText?: CSSLiteral,
  styleSheet?: ConstructableStyleSheet}
;

export const css = (strings: TemplateStringsArray, ...values: CSSLiteral[]): CSSStyleSheetOrCssText => {
  const cssText = values.reduce((acc, v, idx) =>
      acc + cssLiteralValue(v) + strings[idx + 1], strings[0]);
  const result: CSSStyleSheetOrCssText = {};
  if (supportsAdoptedStyleSheets) {
    result.styleSheet = new CSSStyleSheet() as ConstructableStyleSheet;
    result.styleSheet.replaceSync(cssText);
  } else {
    result.cssText = new CSSLiteral(cssText);
  }
  return result;
};

export const cssLiteral = (strings: TemplateStringsArray, ...values: any[]) => {
  return new CSSLiteral(values.reduce((acc, v, idx) =>
      acc + cssLiteralValue(v) + strings[idx + 1], strings[0]));
};

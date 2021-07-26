interface Window {
  ShadowRoot: typeof ShadowRoot;
}

// Augment existing types with styling API
interface ShadowRoot {
  adoptedStyleSheets: CSSStyleSheet[];
}

declare var ShadowRoot: {prototype: ShadowRoot; new (): ShadowRoot;}

interface CSSStyleSheet {
  replaceSync(cssText: string): void;
  replace(cssText: string): Promise<unknown>;
}

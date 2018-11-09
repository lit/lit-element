interface ShadyCSS {
  styleElement(host: Element, overrideProps?: {[key: string]: string}): void;
  getComputedStyleValue(element: Element, property: string): string;
}

interface ShadyDOM {
  inUse: boolean;
}

interface Window {
  ShadyCSS?: ShadyCSS;
  ShadyDOM?: ShadyDOM;
}

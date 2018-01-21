export type LitElementPropertyType = BooleanConstructor|DateConstructor|NumberConstructor|StringConstructor|ArrayConstructor|ObjectConstructor;

export interface PropertyOptions {
  type: LitElementPropertyType;
}

export const customElement = (tagname: keyof HTMLElementTagNameMap) => {
  return <T extends { new (...args: any[]): HTMLElement }>(clazz: T) => {
    window.customElements.define(tagname, clazz);
    return clazz;
  };
}

export const property = (options: PropertyOptions | LitElementPropertyType) => {
  return (prototype: any, propertyName: string): any => {
    createProperty(prototype, propertyName, options);
  };
}

function createProperty(prototype: any, propertyName: string, options: PropertyOptions | LitElementPropertyType): void {
  if (!prototype.constructor.hasOwnProperty('properties')) {
    Object.defineProperty(prototype.constructor, 'properties', { value: {} });
  }
  prototype.constructor.properties[propertyName] = options;
}
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
import {UpdatingElement, PropertyValues} from '../updating-element.js';

/*
 * IMPORTANT: For compatibility with tsickle and the Closure JS compiler, all
 * property decorators (but not class decorators) in this file that have
 * an @ExportDecoratedItems annotation must be defined as a regular function,
 * not an arrow function.
 */

 /**
 * Converts property values to and from attribute values.
 */
export interface ComplexAttributeConverter<Type = unknown, TypeHint = unknown> {
  /**
   * Function called to convert an attribute value to a property
   * value.
   */
  fromAttribute?(value: string|null, type?: TypeHint): Type;

  /**
   * Function called to convert a property value to an attribute
   * value.
   *
   * It returns unknown instead of string, to be compatible with
   * https://github.com/WICG/trusted-types (and similar efforts).
   */
  toAttribute?(value: Type, type?: TypeHint): unknown;
}

type AttributeConverter<Type = unknown, TypeHint = unknown> =
    ComplexAttributeConverter<Type>|
    ((value: string|null, type?: TypeHint) => Type);

/**
 * Defines options for a property accessor.
 */
export interface PropertyDeclaration<Type = unknown, TypeHint = unknown> {
  /**
   * Indicates how and whether the property becomes an observed attribute.
   * If the value is `false`, the property is not added to `observedAttributes`.
   * If true or absent, the lowercased property name is observed (e.g. `fooBar`
   * becomes `foobar`). If a string, the string value is observed (e.g
   * `attribute: 'foo-bar'`).
   */
  readonly attribute?: boolean|string;

  /**
   * Indicates the type of the property. This is used only as a hint for the
   * `converter` to determine how to convert the attribute
   * to/from a property.
   */
  readonly type?: TypeHint;

  /**
   * Indicates how to convert the attribute to/from a property. If this value
   * is a function, it is used to convert the attribute value a the property
   * value. If it's an object, it can have keys for `fromAttribute` and
   * `toAttribute`. If no `toAttribute` function is provided and
   * `reflect` is set to `true`, the property value is set directly to the
   * attribute. A default `converter` is used if none is provided; it supports
   * `Boolean`, `String`, `Number`, `Object`, and `Array`. Note,
   * when a property changes and the converter is used to update the attribute,
   * the property is never updated again as a result of the attribute changing,
   * and vice versa.
   */
  readonly converter?: AttributeConverter<Type, TypeHint>;

  /**
   * Indicates if the property should reflect to an attribute.
   * If `true`, when the property is set, the attribute is set using the
   * attribute name determined according to the rules for the `attribute`
   * property option and the value of the property converted using the rules
   * from the `converter` property option.
   */
  readonly reflect?: boolean;

  /**
   * A function that indicates if a property should be considered changed when
   * it is set. The function should take the `newValue` and `oldValue` and
   * return `true` if an update should be requested.
   */
  hasChanged?(value: Type, oldValue: Type): boolean;

  /**
   * Indicates whether an accessor will be created for this property. By
   * default, an accessor will be generated for this property that requests an
   * update when set. If this flag is `true`, no accessor will be created, and
   * it will be the user's responsibility to call
   * `this.requestUpdate(propertyName, oldValue)` to request an update when
   * the property changes.
   */
  readonly noAccessor?: boolean;
}

export const defaultConverter: ComplexAttributeConverter = {

  toAttribute(value: unknown, type?: unknown): unknown {
    switch (type) {
      case Boolean:
        return value ? '' : null;
      case Object:
      case Array:
        // if the value is `null` or `undefined` pass this through
        // to allow removing/no change behavior.
        return value == null ? value : JSON.stringify(value);
    }
    return value;
  },

  fromAttribute(value: string|null, type?: unknown) {
    switch (type) {
      case Boolean:
        return value !== null;
      case Number:
        return value === null ? null : Number(value);
      case Object:
      case Array:
        return JSON.parse(value!);
    }
    return value;
  }

};

/**
 * A property decorator which creates a LitElement property which reflects a
 * corresponding attribute value. A [[`PropertyDeclaration`]] may optionally be
 * supplied to configure property features.
 *
 * This decorator should only be used for public fields. Private or protected
 * fields should use the [[`internalProperty`]] decorator.
 *
 * @example
 * ```ts
 * class MyElement {
 *   @property({ type: Boolean })
 *   clicked = false;
 * }
 * ```
 * @category Decorator
 * @ExportDecoratedItems
 */
export const property = (options?: PropertyDeclaration) =>
  // tslint:disable-next-line:no-any decorator
  (proto: UpdatingElement, name: PropertyKey): any => {
    if (!shouldCreateProperty(proto, name, options)) {
      return;
    }
    const attribute = calcAttributeName(name, options);
    if (attribute !== undefined) {
      createObservedAttribute(proto, attribute, name, options);
      createToAttribute(proto, attribute, name, options);
      createFromAttribute(proto, attribute, name, options);
    }
    createProperty(proto, name, options);
  }

export const shouldCreateProperty = (proto: UpdatingElement,
    _name: PropertyKey, options?: PropertyDeclaration) =>
  !options?.noAccessor && !proto.hasOwnProperty(name);

export const createProperty = (proto: UpdatingElement,
  name: PropertyKey, _options?: PropertyDeclaration) => {
  const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
  const descriptor = {
    // tslint:disable-next-line:no-any no symbol in index
    get(): any {
      return (this as {[key: string]: unknown})[key as string];
    },
    set(this: UpdatingElement, value: unknown) {
      const oldValue =
          (this as {} as {[key: string]: unknown})[name as string];
      (this as {} as {[key: string]: unknown})[key as string] = value;
      (this as unknown as UpdatingElement).requestUpdate(name, oldValue);
    },
    configurable: true,
    enumerable: true
  };
  Object.defineProperty(proto, name, descriptor);
}

export const calcAttributeName = (name: PropertyKey,
    options?: PropertyDeclaration) =>
  typeof options?.attribute === 'string' ?
    options.attribute :
    typeof name === 'string' ? name : undefined;


export const createObservedAttribute = (proto: UpdatingElement,
    attribute: string, _name: PropertyKey,
    _options?: PropertyDeclaration) => {
  let observedAttributes =
      (proto.constructor as typeof UpdatingElement).observedAttributes;
  if (!observedAttributes) {
    observedAttributes =
        (proto.constructor as typeof UpdatingElement).observedAttributes = [];
  }
  observedAttributes.push(attribute);
}

export const createToAttribute = (proto: UpdatingElement,
    attribute: string, name: PropertyKey,
    options?: PropertyDeclaration) => {
  if (!options || !options.reflect) {
    return;
  }
  const converter = options.converter;
  const toAttribute =
        converter && (converter as ComplexAttributeConverter).toAttribute ||
        defaultConverter.toAttribute;
  const reflectAttribute = (element: UpdatingElement,
      changedProperties: PropertyValues) => {
    if (changedProperties.has(name)) {
      const propertyValue =
        (element as {} as {[key: string]: unknown})[name as string];
      const value = toAttribute!(propertyValue, options.type);
      if (value === undefined) {
        return;
      }
      if (value == null) {
        element.removeAttribute(attribute);
      } else {
        element.setAttribute(attribute, value as string);
      }
    }
  }
  composeUpdate(proto, reflectAttribute);
}

type UpdateFunction = (element: UpdatingElement,
  changedProperties: PropertyValues) => void;

export const composeUpdate = (proto: UpdatingElement,
    updateFn: UpdateFunction) => {
  // tslint:disable-next-line:no-any decorator
  const updatingElementProto = proto as any;
  if (updatingElementProto.__baseUpdate === undefined) {
    updatingElementProto.__baseUpdate = updatingElementProto.update;
    const callbacks: UpdateFunction[] = [];
    updatingElementProto.update = function(changedProperties: PropertyValues) {
      this.__baseUpdate(changedProperties);
      callbacks.forEach(fn => fn(this, changedProperties));
    }
    updatingElementProto.update.callbacks = callbacks;
  }
  updatingElementProto.update.callbacks.push(updateFn);
}

export const createFromAttribute = (proto: UpdatingElement,
    attribute: string, name: PropertyKey,
    options?: PropertyDeclaration) => {
  const converter = options && options.converter || defaultConverter;
  const fromAttribute =
      (typeof converter === 'function' ? converter : converter.fromAttribute);
  const reflectToProperty = (element: UpdatingElement, attributeName: string,
      _oldValue: string|null, value: string) => {
    if (attribute === attributeName) {
      (element as {} as {[key: string]: unknown})[name as string] =
        fromAttribute!(value, options?.type);
    }
  }
  composeAttributeChange(proto, reflectToProperty);
}

type AttributeChangedFunction = (element: UpdatingElement, name: string,
  oldValue: string|null, value: string) => void;

export const composeAttributeChange = (proto: UpdatingElement,
    attributeChangeFn: AttributeChangedFunction) => {
  // tslint:disable-next-line:no-any decorator
  const updatingElementProto = proto as any;
  if (updatingElementProto.__baseAttributeChangedCallback === undefined) {
    updatingElementProto.__baseAttributeChangedCallback =
      updatingElementProto.attributeChangedCallback;
    const callbacks: AttributeChangedFunction[] = [];
    updatingElementProto.attributeChangedCallback = function(name: string,
        oldValue: string|null, value: string) {
      this.__baseAttributeChangedCallback(name, oldValue, value);
      callbacks.forEach(fn => fn(this, name, oldValue, value));
    }
    updatingElementProto.attributeChangedCallback.callbacks = callbacks;
  }
  updatingElementProto.attributeChangedCallback.callbacks.push(attributeChangeFn);
}

export interface InternalPropertyDeclaration<Type = unknown> {
  /**
   * A function that indicates if a property should be considered changed when
   * it is set. The function should take the `newValue` and `oldValue` and
   * return `true` if an update should be requested.
   */
  hasChanged?(value: Type, oldValue: Type): boolean;
}

/**
 * Declares a private or protected property that still triggers updates to the
 * element when it changes.
 *
 * Properties declared this way must not be used from HTML or HTML templating
 * systems, they're solely for properties internal to the element. These
 * properties may be renamed by optimization tools like closure compiler.
 * @category Decorator
 */
export function internalProperty(options?: InternalPropertyDeclaration) {
  return property({attribute: false, hasChanged: options?.hasChanged});
}
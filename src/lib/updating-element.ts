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

/**
 * Converts property values to and from attribute values.
 */
interface AttributeSerializer<T = any> {

  /**
   * Deserializing function called to convert an attribute value to a property value.
   */
  fromAttribute?(value: string): T;

  /**
   * Serializing function called to convert a property value to an attribute value.
   */
  toAttribute?(value: T): string|null;

}

type AttributeType<T = any> = AttributeSerializer<T>|((value: string) => T);

/**
 * Defines options for a property accessor.
 */
export interface PropertyDeclaration<T = any> {

  /**
   * Describes how and if the property becomes an observedAttribute.
   * If the value is false, the property is not added to `observedAttributes`.
   * If true or absent, the lowercased property name is observed (e.g. `fooBar` becomes `fobar`).
   * If a string, the string value is observed (e.g `attribute: 'foo-bar'`).
   */
  attribute?: boolean|string;

  /**
   * Describes how to convert the attribute to/from a property.
   * If this value is a function, it is used to deserialize the attribute value
   * a the property value. If it's an AttributeSerializer, it can have keys for
   * `fromAttribute` and `toAttribute` where `fromAttribute` is the deserialize
   * function and `toAttribute` is a serialize function used to convert the property
   * to an attribute.
   */
  type?: AttributeType<T>;

  /**
   * Describes if the property should reflect to an attribute.
   * If true, when the property is set, the attribute value is set using the
   * attribute name taken from the property's `attribute` and the value
   * of the property serialized using `type.toAttribute` if it exists.
   */
  reflect?: boolean;

  /**
   * Describes if setting a property should trigger invalidation and updating.
   * This function takes the new and oldValue and returns true if invalidation
   * should occur. If not present, a strict identity check is used. This is useful
   * if a property should be considered dirty only if some condition is met;
   * for example, the function could return true only when the key property of
   * an object value changed.
   */
  shouldInvalidate?(value: T, oldValue: T): boolean;

}

/**
 * Object that describes accessors to be created on the element prototype.
 * An accessor is created for each key with the given options.
 */
export interface PropertyDeclarations {
  [key: string]: PropertyDeclaration;
}

interface AttributeMap {
  [key: string]: string;
}

interface PropertyValues {
  [key: string]: unknown;
}

/**
 * Creates a property accessor on the given prototype if one does not exist.
 * Uses `getProperty` and `setProperty` to manage the property's value.
 */
const makeProperty = (name: PropertyKey, proto: Object) => {
  if (name in proto) {
    return;
  }
  Object.defineProperty(proto, name, {
    get() {
      return this.getProperty(name);
    },
    set(value) {
      this.setProperty(name, value);
    },
    configurable: true,
    enumerable: true
  });
};

/**
 * Creates and sets object used to memoize all class property values. Object
 * is chained from superclass.
 */
const ensurePropertyStorage = (ctor: typeof UpdatingElement) => {
  if (!ctor.hasOwnProperty('_classProperties')) {
    ctor._classProperties = Object.create(Object.getPrototypeOf(ctor)._classProperties);
  }
};

/**
 * Decorator which creates a property. Optionally a `PropertyDeclaration` object
 * can be supplied to describe how the property should be configured.
 */
export const property = (options: PropertyDeclaration = {}) => (proto: Object, name: string) => {
  const ctor = proto.constructor as typeof UpdatingElement;
  ensurePropertyStorage(ctor);
  ctor._classProperties[name] = options;
  makeProperty(name, proto);
};


/**
 * AttributeSerializer which configures properties which should reflect to and
 * from boolean attributes. If the attribute exists, the property is set to true.
 * If the property value is truthy, the attribute is set to an empty string;
 * otherwise, the attribute is removed.
 */
export const BooleanAttribute: AttributeSerializer = {
  fromAttribute: (value: string) => value !== null,
  toAttribute: (value: string) => value ? '' : null
};

/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `shouldChange` function.
 */
export const identity = (value: unknown, old: unknown) => {
  // This ensures (old==NaN, value==NaN) always returns false
  return old !== value && (old === old || value === value);
};

const disabled = 0;
const valid = 1;
const invalid = 2;
type ValidationState = typeof disabled | typeof valid | typeof invalid;

/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclassers to render updates as desired.
 */
export abstract class UpdatingElement extends HTMLElement {

  /**
   * Maps attribute names to properties; for example `foobar` attribute
   * to `fooBar` property.
   */
  private static _attributeToPropertyMap: AttributeMap = {};

  /**
   * Marks class as having finished creating properties.
   */
  private static _finalized = true;

  /**
   * Memoized result of computed observedAttributes.
   */
  private static _observedAttributes: string[]|undefined;

  // TODO(sorvell): intended to be private but called by decorator.
  /**
   * Memoized list of all class properties, including any superclass properties.
   */
  static _classProperties: PropertyDeclarations = {};

  static properties: PropertyDeclarations = {};

  /**
   * Returns a list of attributes corresponding to the registered properties.
   */
  static get observedAttributes() {
    if (!this.hasOwnProperty('_observedAttributes')) {
      // note: piggy backing on this to ensure we're _finalized.
      this._finalize();
      this._observedAttributes = [];
      for (const p in this._classProperties) {
        const attr = this.attributeNameForProperty(p);
        if (attr !== undefined) {
          this._attributeToPropertyMap[attr] = p;
          this._observedAttributes.push(attr);
        }
      }
    }
    return this._observedAttributes;
  }

  /**
   * Creates property accessors for registered properties and ensures
   * any superclasses are also finalized.
   */
  private static _finalize() {
    if (this.hasOwnProperty('_finalized') && this._finalized) {
      return;
    }
    // finalize any superclasses
    const superCtor = Object.getPrototypeOf(this);
    if (typeof superCtor._finalize === 'function') {
      superCtor._finalize();
    }
    this._finalized = true;
    // make any properties
    const props = this.properties;
    for (const p in props) {
      makeProperty(p, this.prototype);
    }
    // initialize map populated in observedAttributes
    this._attributeToPropertyMap = {};
    // memoize list of all class properties.
    ensurePropertyStorage(this);
    Object.assign(this._classProperties, props);
  }

  /**
   * Returns the property name for the given attribute `name`.
   */
  private static attributeNameForProperty(name: string) {
    const info = this._classProperties[name];
    const attribute = info && info.attribute;
    return attribute === false ? undefined : (typeof attribute === 'string' ?
        attribute : name.toLowerCase());
  }

  /**
   * Returns true if a property should cause invalidation and update.
   * Called when a property value is set and uses the `shouldInvalidate`
   * option for the property if present or a strict identity check.
   */
  // tslint:disable-next-line no-any
  private static propertyShouldInvalidate(name: string, value: any, old: any) {
    const info = this._classProperties[name];
    const fn = info && info.shouldInvalidate || identity;
    return fn(value, old);
  }

  /**
   * Returns the property value for the given attribute value.
   * Called via the `attributeChangedCallback` and uses the property's `type`
   * or `type.fromAttribute` property option.
   */
  private static propertyValueFromAttribute(name: string, value: string) {
    const info = this._classProperties[name];
    const type = info && info.type;
    if (!type) {
      return value;
    }
    const fromAttribute = typeof type === 'function' ? type : type.fromAttribute;
    return fromAttribute ? fromAttribute(value) : value;
  }

  /**
   * Returns the attribute value for the given property value. If this
   * returns undefined, the property will *not* be reflected to an attribute.
   * If this returns null, the attribute will be removed, otherwise the
   * attribute will be set to the value.
   * This uses the property's `reflect` and `type.toAttribute` property options.
   */
  // tslint:disable-next-line no-any
  private static propertyValueToAttribute(name: string, value: any) {
    const info = this._classProperties[name];
    if (!info || !info.reflect) {
      return;
    }
    const toAttribute = info.type && (info.type as AttributeSerializer).toAttribute || String;
    return (typeof toAttribute === 'function') ? toAttribute(value) : null;
  }

  private _validationState: ValidationState = disabled;
  private _serializingInfo: [string|null, string|null]|undefined = undefined;
  private _instanceProperties: PropertyValues|undefined = undefined;
  private _validatePromise: any = undefined;
  private _validateResolver: (() => void)|undefined = undefined;

  /**
   * Object with keys for all properties with their current values.
   */
  private _props: PropertyValues = {};

  /**
   * Object with keys for any properties that have changed since the last
   * update cycle with previous values.
   */
  private _changedProps?: PropertyValues|undefined;

  /**
   * Node or ShadowRoot into which element DOM should be rendered. Defaults
   * to an open shadowRoot.
   */
  protected renderRoot?: Element|DocumentFragment;

  constructor() {
    super();
    this.initialize();
  }

  /**
   * Performs element initialization. By default this calls `createRoot` to
   * create the element `root` node and captures any pre-set values for
   * registered properties.
   */
  initialize() {
    this.renderRoot = this.createRenderRoot();
    // Apply any properties set on the instance before upgrade time.
    for (const p in (this.constructor as typeof UpdatingElement)._classProperties) {
      if (this.hasOwnProperty(p)) {
        const value = this[p as keyof this];
        delete this[p as keyof this];
        this._instanceProperties = this._instanceProperties || {};
        // NOTE: must capture these into a bag and reset at when validating
        // to avoid stomping on a user value set in the constructor. Being
        // async doesn't help here since the subclass' constructor value should
        // be overwritten.
        this._instanceProperties![p] = value;
      }
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
    return this.attachShadow({mode : 'open'});
  }

  /**
   * Uses ShadyCSS to keep element DOM updated.
   */
  connectedCallback() {
    if (this._validationState !== disabled) {
      window.ShadyCSS.styleElement(this);
    }
    this.invalidate();
  }

  /**
   * Synchronizes property values when attributes change.
   */
  attributeChangedCallback(name: string, old: string, value: string) {
    if (old !== value) {
      this._attributeToProperty(name, value);
    }
  }

  /**
   * Returns the value of the property with `name`. This method is used
   * to get property values of registered properties.
   */
  protected getProperty(name: string) {
    return this._props[name];
  }

  /**
   * Sets the property `name` to the given `value`. This method is used
   * to set property values of registered properties.
   * Setting a property value calls `invalidate` which asynchronously updates
   * the element. If a property value is set inside the `update` method,
   * it does not trigger `invalidate`.
   */
  // tslint:disable-next-line no-any
  protected setProperty(name: string, value: any) {
    const old = this._props[name];
    const ctor = (this.constructor as typeof UpdatingElement);
    if (ctor.propertyShouldInvalidate(name, value, old)) {
      // track old value when changing.
      if (!this._changedProps) {
        this._changedProps = {};
      }
      if (!(name in this._changedProps)) {
        this._changedProps[name] = this._props[name];
      }
      this._props[name] = value;
      this._propertyToAttribute(name, value);
      this.invalidate();
    }
  }

  private _propertyToAttribute(name: string, value: any) {
    const ctor = (this.constructor as typeof UpdatingElement);
    const attrValue = ctor.propertyValueToAttribute(name, value);
    if (attrValue !== undefined) {
      const attr = ctor.attributeNameForProperty(name);
      if (attr !== undefined) {
        // track the attr name/value being set to be able to avoid
        // reflecting back to the property setter via attributeChangedCallback.
        this._serializingInfo = [attr, attrValue];
        if (attrValue === null) {
          this.removeAttribute(attr);
        } else {
          this.setAttribute(attr, attrValue);
        }
        this._serializingInfo = undefined;
      }
    }
  }

  private _attributeToProperty(name: string, value: string) {
    // Use tracking info to avoid deserializing attribute value if it was
    // just set from a property setter.
    if (this._serializingInfo === undefined ||
        (this._serializingInfo[0] !== name && this._serializingInfo[1] !== value)) {
      const ctor = (this.constructor as typeof UpdatingElement);
      const propName = ctor._attributeToPropertyMap[name];
      this[propName as keyof this] = ctor.propertyValueFromAttribute(propName, value);
    }
  }

  /**
   * Invalidates the element causing it to asynchronously update regardless
   * of whether or not any property changes are pending. This method is
   * automatically called when any registered property changes. Returns a Promise
   * that resolves when the element has finished updating.
   */
  async invalidate() {
    // Do not re-queue validation if already invalid (pending) or currently updating.
    if (this._isPendingUpdate()) {
      return this._validatePromise;
    }
    this._validationState = invalid;
    // Make a new promise only if the current one is not pending resolution
    // (resolver has not been set to undefined)
    if (this._validateResolver === undefined) {
      this._validatePromise = new Promise((resolve) => this._validateResolver = resolve);
    }
    // Wait a tick to actually process changes (allows batching).
    await 0;
    // Mixin instance properties once, if they exist.
    if (this._instanceProperties) {
      Object.assign(this, this._instanceProperties);
      this._instanceProperties = undefined;
    }
    // Rip off changedProps.
    const changedProps = this._changedProps || {};
    this._changedProps = undefined;
    if (this.shouldUpdate(changedProps)) {
      // During update (which is abstract), setting properties does not trigger invalidation.
      if (typeof this.update === 'function') {
        this.update(changedProps);
      }
      this._validationState = valid;
      // During finishUpdate (which is abstract), setting properties does trigger invalidation,
      // and users may choose to await other state, like children being updated.
      if (typeof this.finishUpdate === 'function') {
        await this.finishUpdate(changedProps);
      }
    } else {
      this._validationState = valid;
    }
    // Only resolve the promise if we finish in a valid state (finishUpdate
    // did not trigger more work).
    if (this._validationState === valid && this._validateResolver !== undefined) {
      this._validateResolver();
      this._validateResolver = undefined;
    }
    return this._validatePromise;
  }

  private _isPendingUpdate() {
    return this._validationState === invalid;
  }

  /**
   * Returns a Promise that resolves when the element has finished updating.
   */
  get updateComplete() {
    return this._isPendingUpdate() ? this._validatePromise : Promise.resolve();
  }

  /**
   * Controls whether or not `update` should be called when the element invalidates.
   * By default, this method always returns true, but this can be customized to
   * control when to update.
   * * @param _changedProperties changed properties with old values
   */
  protected shouldUpdate(_changedProperties: PropertyValues): boolean {
    return true;
  }

  /**
   * Updates the element. This method does nothing by default and should be
   * implemented to render and keep updated DOM in the element's root.
   * * @param _changedProperties changed properties with old values
   */
  protected abstract update(_changedProperties: PropertyValues): void;

  /**
   * Finishes updating the element. This method does nothing by default and
   * should be implemented to perform post update tasks on element DOM. This
   * async function can await other Promises to defer the resolution of the
   * `invalidate` and `updateComplete` Proimses.
   * * @param _changedProperties changed properties with old values
   */
  protected finishUpdate?(_changedProperties: PropertyValues): void;

}
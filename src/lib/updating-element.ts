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
   * Describes how and if the property becomes an observed attribute.
   * If the value is false, the property is not added to `observedAttributes`.
   * If true or absent, the lowercased property name is observed (e.g. `fooBar` becomes `foobar`).
   * If a string, the string value is observed (e.g `attribute: 'foo-bar'`).
   */
  attribute?: boolean|string;

  /**
   * Describes how to serialize and deserialize the attribute to/from a property.
   * If this value is a function, it is used to deserialize the attribute value
   * a the property value. If it's an object, it can have keys for `fromAttribute` and
   * `toAttribute` where `fromAttribute` is the deserialize function and `toAttribute`
   * is a serialize function used to set the property to an attribute. If no `toAttribute`
   * function is provided and `reflect` is set to true, the property value is set
   * directly to the attribute.
   */
  type?: AttributeType<T>;

  /**
   * Describes if the property should reflect to an attribute.
   * If true, when the property is set, the attribute is set using the
   * attribute name determined according to the rules for the `attribute`
   * propety option and the value of the property serialized using the rules from
   * the `type` property option.
   */
  reflect?: boolean;

  /**
   * Describes if setting a property should trigger invalidation and updating.
   * This function takes the `newValue` and `oldValue` and returns true if
   * invalidation should occur. If not present, a strict identity check
   * (eg. === operator) is used. This is useful if a property should be
   * considered dirty only if some condition is met, like if a key of an
   * object value changes.
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

type PropertyDeclarationMap = Map<PropertyKey, PropertyDeclaration>;

type AttributeMap = Map<string, PropertyKey>;

export type PropertyValues = Map<PropertyKey, unknown>;

/**
 * Creates and sets object used to memoize all class property values. Object
 * is chained from superclass.
 */
const ensurePropertyStorage = (ctor: typeof UpdatingElement) => {
  if (!ctor.hasOwnProperty('_classProperties')) {
    ctor._classProperties = new Map(Object.getPrototypeOf(ctor)._classProperties);
  }
};

/**
 * Decorator which creates a property. Optionally a `PropertyDeclaration` object
 * can be supplied to describe how the property should be configured.
 */
export const property = (options: PropertyDeclaration = {}) => (proto: Object, name: string) => {
  const ctor = proto.constructor as typeof UpdatingElement;
  ensurePropertyStorage(ctor);
  ctor._classProperties.set(name, options);
  ctor.createProperty(name);
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

const STATE_HAS_UPDATED = 1;
const STATE_IS_VALID = 1 << 2;
const STATE_IS_REFLECTING = 1 << 3;
type ValidationState = typeof STATE_HAS_UPDATED | typeof STATE_IS_VALID | typeof STATE_IS_REFLECTING;

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
  private static _attributeToPropertyMap: AttributeMap = new Map();

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
  static _classProperties: PropertyDeclarationMap = new Map();

  static properties: PropertyDeclarations = {};

  /**
   * Returns a list of attributes corresponding to the registered properties.
   */
  static get observedAttributes() {
    if (!this.hasOwnProperty('_observedAttributes')) {
      // note: piggy backing on this to ensure we're _finalized.
      this._finalize();
      this._observedAttributes = [];
      for (const p of this._classProperties.keys()) {
        const attr = this._attributeNameForProperty(p);
        if (attr !== undefined) {
          this._attributeToPropertyMap.set(attr, p);
          this._observedAttributes.push(attr);
        }
      }
    }
    return this._observedAttributes;
  }

  /**
   * Creates a property accessor on the element prototype if one does not exist.
   * The property setter calls the property's `shouldInvalidate` property option
   * or uses a strict identity check to determine if the set should trigger
   * invalidation and update.
   */
  static createProperty(name: PropertyKey) {
    if (name in this.prototype) {
      return;
    }
    const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
    Object.defineProperty(this.prototype, name, {
      get() {
        return this[key];
      },
      set(value) {
        const old = this[key];
        const ctor = (this.constructor as typeof UpdatingElement);
        if (ctor._propertyShouldInvalidate(name, value, old)) {
          // track old value when changing.
          if (!this._changedProperties.has(name)) {
            this._changedProperties.set(name, old);
          }
          this[key] = value;
          this.invalidate();
        }
      },
      configurable: true,
      enumerable: true
    });
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
    ensurePropertyStorage(this);
    // initialize map populated in observedAttributes
    this._attributeToPropertyMap = new Map();
    // make any properties
    const props = this.properties;
    // support symbols in properties (IE11 does not support this)
    const propKeys = [...Object.getOwnPropertyNames(props),
        ...(typeof Object.getOwnPropertySymbols === 'function') ? Object.getOwnPropertySymbols(props) : []];
    for (const p of propKeys) {
      this.createProperty(p);
      // note, use of `any` is due to TypeSript lack of support for symbol in index types
      this._classProperties.set(p, (props as any)[p]);
    }
  }

  /**
   * Returns the property name for the given attribute `name`.
   */
  private static _attributeNameForProperty(name: PropertyKey) {
    const info = this._classProperties.get(name);
    const attribute = info !== undefined && info.attribute;
    return attribute === false ? undefined : (typeof attribute === 'string' ?
        attribute : (typeof name === 'string' ? name.toLowerCase() : undefined));
  }

  /**
   * Returns true if a property should cause invalidation and update.
   * Called when a property value is set and uses the `shouldInvalidate`
   * option for the property if present or a strict identity check.
   */
  private static _propertyShouldInvalidate(name: PropertyKey, value: unknown, old: unknown) {
    const info = this._classProperties.get(name);
    const fn = info !== undefined && info.shouldInvalidate || identity;
    return fn(value, old);
  }

  /**
   * Returns the property value for the given attribute value.
   * Called via the `attributeChangedCallback` and uses the property's `type`
   * or `type.fromAttribute` property option.
   */
  private static _propertyValueFromAttribute(name: PropertyKey, value: string) {
    const info = this._classProperties.get(name);
    const type = info && info.type;
    if (type === undefined) {
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
  private static _propertyValueToAttribute(name: PropertyKey, value: unknown) {
    const info = this._classProperties.get(name);
    if (info === undefined || info.reflect === undefined) {
      return;
    }
    const toAttribute = info.type && (info.type as AttributeSerializer).toAttribute || String;
    return (typeof toAttribute === 'function') ? toAttribute(value) : null;
  }

  private _validationState: ValidationState = STATE_IS_VALID;
  private _instanceProperties: PropertyValues|undefined = undefined;
  private _validatePromise: Promise<unknown>|undefined = undefined;
  private _validateResolver: (() => void)|undefined = undefined;

  /**
   * Object with keys for any properties that have changed since the last
   * update cycle with previous values.
   */
  private _changedProperties: PropertyValues = new Map();

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
   * Performs element initialization. By default this calls `createRenderRoot` to
   * create the element `renderRoot` node and captures any pre-set values for
   * registered properties.
   */
  protected initialize() {
    this.renderRoot = this.createRenderRoot();
    // Apply any properties set on the instance before upgrade time.
    for (const p of (this.constructor as typeof UpdatingElement)._classProperties.keys()) {
      if (this.hasOwnProperty(p)) {
        const value = this[p as keyof this];
        delete this[p as keyof this];
        if (!this._instanceProperties) {
          this._instanceProperties = new Map();
        }
        // NOTE: must capture these into a map and reset at when validating
        // to avoid stomping on a user value set in the constructor. Being
        // async doesn't help here since the subclass' constructor value should
        // be overwritten.
        this._instanceProperties.set(p, value);
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
    if ((this._validationState & STATE_HAS_UPDATED) && typeof window.ShadyCSS !== 'undefined') {
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

  private _propertyToAttribute(name: PropertyKey, value: unknown) {
    const ctor = (this.constructor as typeof UpdatingElement);
    const attrValue = ctor._propertyValueToAttribute(name, value);
    if (attrValue !== undefined) {
      const attr = ctor._attributeNameForProperty(name);
      if (attr !== undefined) {
        // Track if the property is being reflected to avoid
        // setting the property again via `attributeChangedCallback`. Note:
        // 1. this takes advantage of the fact that the callback is synchronous.
        // 2. will behave incorrectly if multiple attributes are in the reaction
        // stack at time of calling. However, since we process attributes
        // in `update` this should not be possible (or an extreme corner case
        // that we'd like to discover).
        // mark state reflecting
        this._validationState = this._validationState | STATE_IS_REFLECTING;
        if (attrValue === null) {
          this.removeAttribute(attr);
        } else {
          this.setAttribute(attr, attrValue);
        }
        // mark state not reflecting
        this._validationState = this._validationState & ~STATE_IS_REFLECTING;
      }
    }
  }

  private _attributeToProperty(name: string, value: string) {
    // Use tracking info to avoid deserializing attribute value if it was
    // just set from a property setter.
    if (!(this._validationState & STATE_IS_REFLECTING)) {
      const ctor = (this.constructor as typeof UpdatingElement);
      const propName = ctor._attributeToPropertyMap.get(name);
      if (propName !== undefined) {
        this[propName as keyof this] = ctor._propertyValueFromAttribute(propName, value);
      }
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
    if (this._isPendingUpdate) {
      return this._validatePromise;
    }
    // mark state invalid...
    this._validationState = this._validationState & ~STATE_IS_VALID;
    // Make a new promise only if the current one is not pending resolution
    // (resolver has not been set to undefined)
    if (this._validateResolver === undefined) {
      this._validatePromise = new Promise((resolve) => this._validateResolver = resolve);
    }
    // Wait a tick to actually process changes (allows batching).
    await 0;
    // Mixin instance properties once, if they exist.
    if (this._instanceProperties) {
      for (const [p, v] of this._instanceProperties) {
        (this as any)[p] = v;
      }
      this._instanceProperties = undefined;
    }
    if (this.shouldUpdate(this._changedProperties)) {
      // During update, setting properties does not trigger invalidation.
      this.update(this._changedProperties);
      // copy changedProperties to hand to finishUpdate.
      let changedProperties;
      const hasFinishUpdate = (typeof this.finishUpdate === 'function');
      // clone changedProperties before resetting only if needed for finishUpdate.
      if (hasFinishUpdate) {
        changedProperties = new Map(this._changedProperties);
      }
      this._changedProperties.clear();
      // mark state valid
      this._validationState = this._validationState | STATE_IS_VALID;
      if (!(this._validationState & STATE_HAS_UPDATED)) {
        // mark state has updated
        this._validationState = this._validationState | STATE_HAS_UPDATED;
        if (typeof this.finishFirstUpdate === 'function') {
          // During `finishFirstUpdate` (which is optional), setting properties triggers invalidation,
          // and users may choose to await other state.
          const result = this.finishFirstUpdate();
          if (result != null && typeof (result as PromiseLike<unknown>).then === 'function') {
            await result;
          }
        }
      }
      // During `finishUpdate` (which is optional), setting properties triggers invalidation,
      // and users may choose to await other state, like children being updated.
      if (hasFinishUpdate) {
        const result = this.finishUpdate!(changedProperties as PropertyValues);
        if (result != null && typeof (result as PromiseLike<unknown>).then === 'function') {
          await result;
        }
      }
    } else {
      this._changedProperties.clear();
      // mark state valid
      this._validationState = this._validationState | STATE_IS_VALID;
    }
    // Only resolve the promise if we finish in a valid state (finishUpdate
    // did not trigger more work). Note, if invalidate is triggered multiple
    // times in `finishUpdate`, only the first time will resolve the promise
    // by calling `_validateResolver`. This is why we guard for its existence.
    if ((this._validationState & STATE_IS_VALID) && typeof this._validateResolver === 'function') {
      this._validateResolver();
      this._validateResolver = undefined;
    }
    return this._validatePromise;
  }

  private get _isPendingUpdate() {
    return !(this._validationState & STATE_IS_VALID);
  }

  /**
   * Returns a Promise that resolves when the element has finished updating.
   */
  get updateComplete() {
    return this._isPendingUpdate ? this._validatePromise : Promise.resolve();
  }

  /**
   * Controls whether or not `update` should be called when the element invalidates.
   * By default, this method always returns true, but this can be customized to
   * control when to update.
   * * @param _changedProperties Map of changed properties with old values
   */
  protected shouldUpdate(_changedProperties: PropertyValues): boolean {
    return true;
  }

  /**
   * Updates the element. By default this method reflects property values to attributes.
   * It should be implemented to render and keep updated DOM in the element's root.
   * Note, within `update()` setting properties does not trigger `invalidate()`, allowing
   * property values to be computed and validated before DOM is rendered and updated.
   * * @param _changedProperties Map of changed properties with old values
   */
  protected update(_changedProperties: PropertyValues): void {
    for (const name of _changedProperties.keys()) {
      this._propertyToAttribute(name, (this as any)[name]);
    }
  }

  /**
   * Finishes updating the element. This method does nothing by default and
   * can be implemented to perform post update tasks on element DOM.
   * Note, setting properties in `finishUpdate()` triggers `invalidate()`.
   * There are a couple of common cases when it's useful to implement
   * `finishUpdate`:
   * (1) A property should be updated based on the rendered state of the
   * DOM. In this case it's important to avoid creating a loop since setting
   * properties triggers invalidate and update.
   * (2) The `updateComplete` promise should block on the `updateComplete` promise
   * of a rendered `UpdatingElement`.
   * * @param _changedProperties Map of changed properties with old values
   * * @returns {Promise} Optionally, this function can return a promise that blocks
   * resolution of the `invalidate` and updateComplete` promise.
   */
  protected finishUpdate?(_changedProperties: PropertyValues): void|Promise<unknown>;

  /**
   * Called with the element is first updated. This method does nothing by
   * default and can be implemented to perform post first update tasks on
   * element DOM. Any tasks which depend on dynamic updates should instead
   * be implemented in `finishUpdate`.
   * * @returns {Promise} Optionally can return a promise that blocks
   * resolution of the `invalidate` and updateComplete` promise.
   */
  protected finishFirstUpdate?(): void;
}
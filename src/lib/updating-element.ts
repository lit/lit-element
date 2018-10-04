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
export interface AttributeSerializer<T = any> {

  /**
   * Deserializing function called to convert an attribute value to a property
   * value.
   */
  fromAttribute?(value: string): T;

  /**
   * Serializing function called to convert a property value to an attribute
   * value.
   */
  toAttribute?(value: T): string|null;
}

type AttributeType<T = any> = AttributeSerializer<T>|((value: string) => T);

/**
 * Defines options for a property accessor.
 */
export interface PropertyDeclaration<T = any> {

  /**
   * Indicates how and whether the property becomes an observed attribute.
   * If the value is `false`, the property is not added to `observedAttributes`.
   * If true or absent, the lowercased property name is observed (e.g. `fooBar`
   * becomes `foobar`). If a string, the string value is observed (e.g
   * `attribute: 'foo-bar'`).
   */
  attribute?: boolean|string;

  /**
   * Indicates how to serialize and deserialize the attribute to/from a
   * property. If this value is a function, it is used to deserialize the
   * attribute value a the property value. If it's an object, it can have keys
   * for `fromAttribute` and `toAttribute` where `fromAttribute` is the
   * deserialize function and `toAttribute` is a serialize function used to set
   * the property to an attribute. If no `toAttribute` function is provided and
   * `reflect` is set to `true`, the property value is set directly to the
   * attribute.
   */
  type?: AttributeType<T>;

  /**
   * Indicates if the property should reflect to an attribute.
   * If `true`, when the property is set, the attribute is set using the
   * attribute name determined according to the rules for the `attribute`
   * property option and the value of the property serialized using the rules
   * from the `type` property option.
   */
  reflect?: boolean;

  /**
   * A function that indicates if a property should be considered changed when
   * it is set. The function should take the `newValue` and `oldValue` and
   * return `true` if an update should be requested.
   */
  hasChanged?(value: T, oldValue: T): boolean;
}

/**
 * Map of properties to PropertyDeclaration options. For each property an
 * accessor is made, and the property is processed according to the
 * PropertyDeclaration options.
 */
export interface PropertyDeclarations {
  [key: string]: PropertyDeclaration;
}

type PropertyDeclarationMap = Map<PropertyKey, PropertyDeclaration>;

type AttributeMap = Map<string, PropertyKey>;

export type PropertyValues = Map<PropertyKey, unknown>;

// serializer/deserializers for boolean attribute
const fromBooleanAttribute = (value: string) => value !== null;
const toBooleanAttribute = (value: string) => value ? '' : null;

export interface HasChanged {
  (value: unknown, old: unknown): boolean;
}

/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */
export const notEqual: HasChanged = (value: unknown, old: unknown): boolean => {
  // This ensures (old==NaN, value==NaN) always returns false
  return old !== value && (old === old || value === value);
};

const defaultPropertyDeclaration: PropertyDeclaration = {
  attribute : true,
  type : String,
  reflect : false,
  hasChanged : notEqual
};

const microtaskPromise = new Promise((resolve) => resolve(true));

const STATE_HAS_UPDATED = 1;
const STATE_UPDATE_REQUESTED = 1 << 2;
const STATE_IS_REFLECTING = 1 << 3;
type UpdateState = typeof STATE_HAS_UPDATED|typeof STATE_UPDATE_REQUESTED|
    typeof STATE_IS_REFLECTING;

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
   * Memoized list of all class properties, including any superclass properties.
   */
  private static _classProperties: PropertyDeclarationMap = new Map();

  static properties: PropertyDeclarations = {};

  /**
   * Returns a list of attributes corresponding to the registered properties.
   */
  static get observedAttributes() {
    // note: piggy backing on this to ensure we're _finalized.
    this._finalize();
    const attributes = [];
    for (const [p, v] of this._classProperties) {
      const attr = this._attributeNameForProperty(p, v);
      if (attr !== undefined) {
        this._attributeToPropertyMap.set(attr, p);
        attributes.push(attr);
      }
    }
    return attributes;
  }

  /**
   * Creates a property accessor on the element prototype if one does not exist.
   * The property setter calls the property's `hasChanged` property option
   * or uses a strict identity check to determine whether or not to request
   * an update.
   */
  static createProperty(name: PropertyKey,
                        options:
                            PropertyDeclaration = defaultPropertyDeclaration) {
    // ensure private storage for property declarations.
    if (!this.hasOwnProperty('_classProperties')) {
      this._classProperties = new Map();
      // NOTE: Workaround IE11 not supporting Map constructor argument.
      const superProperties = Object.getPrototypeOf(this)._classProperties;
      if (superProperties !== undefined) {
        superProperties.forEach((v: any, k: PropertyKey) =>
                                    this._classProperties.set(k, v));
      }
    }
    this._classProperties.set(name, options);
    // Allow user defined accessors by not replacing an existing own-property
    // accessor.
    if (this.prototype.hasOwnProperty(name)) {
      return;
    }
    const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
    Object.defineProperty(this.prototype, name, {
      get() { return this[key]; },
      set(value) {
        const oldValue = this[name];
        this[key] = value;
        this._requestPropertyUpdate(name, oldValue, options);
      },
      configurable : true,
      enumerable : true
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
    // initialize Map populated in observedAttributes
    this._attributeToPropertyMap = new Map();
    // make any properties
    const props = this.properties;
    // support symbols in properties (IE11 does not support this)
    const propKeys = [
      ...Object.getOwnPropertyNames(props),
      ...(typeof Object.getOwnPropertySymbols === 'function')
          ? Object.getOwnPropertySymbols(props)
          : []
    ];
    for (const p of propKeys) {
      // note, use of `any` is due to TypeSript lack of support for symbol in
      // index types
      this.createProperty(p, (props as any)[p]);
    }
  }

  /**
   * Returns the property name for the given attribute `name`.
   */
  private static _attributeNameForProperty(name: PropertyKey,
                                           options?: PropertyDeclaration) {
    const attribute = options !== undefined && options.attribute;
    return attribute === false
               ? undefined
               : (typeof attribute === 'string'
                      ? attribute
                      : (typeof name === 'string' ? name.toLowerCase()
                                                  : undefined));
  }

  /**
   * Returns true if a property should request an update.
   * Called when a property value is set and uses the `hasChanged`
   * option for the property if present or a strict identity check.
   */
  private static _valueHasChanged(value: unknown, old: unknown,
                                  hasChanged: HasChanged = notEqual) {
    return hasChanged(value, old);
  }

  /**
   * Returns the property value for the given attribute value.
   * Called via the `attributeChangedCallback` and uses the property's `type`
   * or `type.fromAttribute` property option.
   */
  private static _propertyValueFromAttribute(value: string,
                                             options?: PropertyDeclaration) {
    const type = options && options.type;
    if (type === undefined) {
      return value;
    }
    // Note: special case `Boolean` so users can use it as a `type`.
    const fromAttribute =
        type === Boolean
            ? fromBooleanAttribute
            : (typeof type === 'function' ? type : type.fromAttribute);
    return fromAttribute ? fromAttribute(value) : value;
  }

  /**
   * Returns the attribute value for the given property value. If this
   * returns undefined, the property will *not* be reflected to an attribute.
   * If this returns null, the attribute will be removed, otherwise the
   * attribute will be set to the value.
   * This uses the property's `reflect` and `type.toAttribute` property options.
   */
  private static _propertyValueToAttribute(value: unknown,
                                           options?: PropertyDeclaration) {
    if (options === undefined || options.reflect === undefined) {
      return;
    }
    // Note: special case `Boolean` so users can use it as a `type`.
    const toAttribute =
        options.type === Boolean
            ? toBooleanAttribute
            : (options.type &&
                   (options.type as AttributeSerializer).toAttribute ||
               String);
    return toAttribute(value);
  }

  private _updateState: UpdateState = 0;
  private _instanceProperties: PropertyValues|undefined = undefined;
  private _updatePromise: Promise<unknown> = microtaskPromise;

  /**
   * Map with keys for any properties that have changed since the last
   * update cycle with previous values.
   */
  private _changedProperties: PropertyValues = new Map();

  /**
   * Map with keys of properties that should be reflected when updated.
   */
  private _reflectingProperties: Map<PropertyKey, PropertyDeclaration>|
      undefined = undefined;

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
   * Performs element initialization. By default this calls `createRenderRoot`
   * to create the element `renderRoot` node and captures any pre-set values for
   * registered properties.
   */
  protected initialize() {
    this.renderRoot = this.createRenderRoot();
    this._saveInstanceProperties();
  }

  /**
   * Fixes any properties set on the instance before upgrade time.
   * Otherwise these would shadow the accessor and break these properties.
   * The properties are stored in a Map which is played back after the
   * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
   * (<=41), properties created for native platform properties like (`id` or
   * `name`) may not have default values set in the element constructor. On
   * these browsers native properties appear on instances and therefore their
   * default value will overwrite any element default (e.g. if the element sets
   * this.id = 'id' in the constructor, the 'id' will become '' since this is
   * the native platform default).
   */
  private _saveInstanceProperties() {
    for (const [p] of (this.constructor as typeof UpdatingElement)
             ._classProperties) {
      if (this.hasOwnProperty(p)) {
        const value = this[p as keyof this];
        delete this[p as keyof this];
        if (!this._instanceProperties) {
          this._instanceProperties = new Map();
        }
        this._instanceProperties.set(p, value);
      }
    }
  }

  /**
   * Applies previously saved instance properties.
   */
  private _applyInstanceProperties() {
    for (const [p, v] of this._instanceProperties!) {
      (this as any)[p] = v;
    }
    this._instanceProperties = undefined;
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
    if ((this._updateState & STATE_HAS_UPDATED)) {
      if (window.ShadyCSS !== undefined) {
        window.ShadyCSS.styleElement(this);
      }
    } else {
      this.requestUpdate();
    }
  }

  /**
   * Allows for `super.disconnectedCallback()` in extensions while
   * reserving the possibility of making non-breaking feature additions
   * when disconnecting at some point in the future.
   */
  disconnectedCallback() {}

  /**
   * Synchronizes property values when attributes change.
   */
  attributeChangedCallback(name: string, old: string, value: string) {
    if (old !== value) {
      this._attributeToProperty(name, value);
    }
  }

  private _propertyToAttribute(
      name: PropertyKey, value: unknown,
      options: PropertyDeclaration = defaultPropertyDeclaration) {
    const ctor = (this.constructor as typeof UpdatingElement);
    const attrValue = ctor._propertyValueToAttribute(value, options);
    if (attrValue !== undefined) {
      const attr = ctor._attributeNameForProperty(name, options);
      if (attr !== undefined) {
        // Track if the property is being reflected to avoid
        // setting the property again via `attributeChangedCallback`. Note:
        // 1. this takes advantage of the fact that the callback is synchronous.
        // 2. will behave incorrectly if multiple attributes are in the reaction
        // stack at time of calling. However, since we process attributes
        // in `update` this should not be possible (or an extreme corner case
        // that we'd like to discover).
        // mark state reflecting
        this._updateState = this._updateState | STATE_IS_REFLECTING;
        if (attrValue === null) {
          this.removeAttribute(attr);
        } else {
          this.setAttribute(attr, attrValue);
        }
        // mark state not reflecting
        this._updateState = this._updateState & ~STATE_IS_REFLECTING;
      }
    }
  }

  private _attributeToProperty(name: string, value: string) {
    // Use tracking info to avoid deserializing attribute value if it was
    // just set from a property setter.
    if (!(this._updateState & STATE_IS_REFLECTING)) {
      const ctor = (this.constructor as typeof UpdatingElement);
      const propName = ctor._attributeToPropertyMap.get(name);
      if (propName !== undefined) {
        const options = ctor._classProperties.get(propName);
        this[propName as keyof this] =
            ctor._propertyValueFromAttribute(value, options);
      }
    }
  }

  /**
   * Requests an update which is processed asynchronously. This should
   * be called when an element should update based on some state not triggered
   * by setting a property. In this case, pass no arguments. It should also be
   * called when manually implementing a property setter. In this case, pass the
   * property `name` and `oldValue` to ensure that any configured property
   * options are honored. Returns the `updateComplete` Promise which is resolved
   * when the update completes.
   *
   * @param name {PropertyKey} (optional) name of requesting property
   * @param oldValue {any} (optional) old value of requesting property
   * @returns {Promise} A Promise that is resolved when the update completes.
   */
  requestUpdate(name?: PropertyKey, oldValue?: any) {
    if (name !== undefined) {
      const options = (this.constructor as typeof UpdatingElement)
                          ._classProperties.get(name) ||
                      defaultPropertyDeclaration;
      return this._requestPropertyUpdate(name, oldValue, options);
    }
    return this._invalidate();
  }

  /**
   * Requests an update for a specific property and records change information.
   * @param name {PropertyKey} name of requesting property
   * @param oldValue {any} old value of requesting property
   * @param options {PropertyDeclaration}
   */
  private _requestPropertyUpdate(name: PropertyKey, oldValue: any,
                                 options: PropertyDeclaration) {
    if (!(this.constructor as typeof UpdatingElement)
             ._valueHasChanged(this[name as keyof this], oldValue,
                               options.hasChanged)) {
      return this.updateComplete;
    }
    // track old value when changing.
    if (!this._changedProperties.has(name)) {
      this._changedProperties.set(name, oldValue);
    }
    // add to reflecting properties set
    if (options.reflect === true) {
      if (this._reflectingProperties === undefined) {
        this._reflectingProperties = new Map();
      }
      this._reflectingProperties.set(name, options);
    }
    return this._invalidate();
  }

  /**
   * Invalidates the element causing it to asynchronously update regardless
   * of whether or not any property changes are pending. This method is
   * automatically called when any registered property changes.
   */
  private async _invalidate() {
    if (!this._hasRequestedUpdate) {
      // mark state updating...
      this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
      let resolver: any;
      const previousValidatePromise = this._updatePromise;
      this._updatePromise = new Promise((r) => resolver = r);
      await previousValidatePromise;
      this._validate();
      resolver!(!this._hasRequestedUpdate);
    }
    return this.updateComplete;
  }

  private get _hasRequestedUpdate() {
    return (this._updateState & STATE_UPDATE_REQUESTED);
  }

  /**
   * Validates the element by updating it.
   */
  private _validate() {
    // Mixin instance properties once, if they exist.
    if (this._instanceProperties) {
      this._applyInstanceProperties();
    }
    if (this.shouldUpdate(this._changedProperties)) {
      const changedProperties = this._changedProperties;
      this.update(changedProperties);
      this._markUpdated();
      if (!(this._updateState & STATE_HAS_UPDATED)) {
        this._updateState = this._updateState | STATE_HAS_UPDATED;
        this.firstUpdated(changedProperties);
      }
      this.updated(changedProperties);
    } else {
      this._markUpdated();
    }
  }
  private _markUpdated() {
    this._changedProperties = new Map();
    this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
  }

  /**
   * Returns a Promise that resolves when the element has completed updating.
   * The Promise value is a boolean that is `true` if the element completed the
   * update without triggering another update. The Promise result is `false` if
   * a property was set inside `updated()`. This getter can be implemented to
   * await additional state. For example, it is sometimes useful to await a
   * rendered element before fulfilling this Promise. To do this, first await
   * `super.updateComplete` then any subsequent state.
   *
   * @returns {Promise} The Promise returns a boolean that indicates if the
   * update resolved without triggering another update.
   */
  get updateComplete() { return this._updatePromise; }

  /**
   * Controls whether or not `update` should be called when the element requests
   * an update. By default, this method always returns `true`, but this can be
   * customized to control when to update.
   *
   * * @param _changedProperties Map of changed properties with old values
   */
  protected shouldUpdate(_changedProperties: PropertyValues): boolean {
    return true;
  }

  /**
   * Updates the element. This method reflects property values to attributes.
   * It can be overridden to render and keep updated DOM in the element's
   * `renderRoot`. Setting properties inside this method will *not* trigger
   * another update.
   *
   * * @param _changedProperties Map of changed properties with old values
   */
  protected update(_changedProperties: PropertyValues) {
    if (this._reflectingProperties !== undefined &&
        this._reflectingProperties.size > 0) {
      for (const [k, v] of this._reflectingProperties) {
        this._propertyToAttribute(k, this[k as keyof this], v);
      }
      this._reflectingProperties = undefined;
    }
  }

  /**
   * Invoked whenever the element is updated. Implement to perform
   * post-updating tasks via DOM APIs, for example, focusing an element.
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * * @param _changedProperties Map of changed properties with old values
   */
  protected updated(_changedProperties: PropertyValues) {}

  /**
   * Invoked when the element is first updated. Implement to perform one time
   * work on the element after update.
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * * @param _changedProperties Map of changed properties with old values
   */
  protected firstUpdated(_changedProperties: PropertyValues) {}
}

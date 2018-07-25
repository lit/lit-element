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
// TODO(sorvell): consider `noAttribute` instead of `attribute`
interface PropertyOptions {
  // true to put property into observedAttributes
  attribute?: boolean;
  // defaults to lowercase
  attributeName?: string;
  // custom deserializer
  fromAttribute?: Function;
  // custom serializer
  toAttribute?: Function;
  // custom change function
  shouldChange?: Function;
}

interface Properties {
  [key: string]: PropertyOptions;
}

interface AttributeMap {
  [key: string]: string;
}

interface AnyObject {
  [key: string]: {};
}

/**
 * Creates a property accessor on the given prototype if one does not exist.
 * Uses `getProperty` and `setProperty` to manage the property's value.
 */
function makeProperty(name: string, proto: Object) {
  if (proto.hasOwnProperty(name) || (name in proto)) {
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
}

/**
 * Decorator which creates a property. Optionally a `PropertyOptions` object
 * can be supplied with keys:
 * * attribute: a boolean that should be true if the property should be an observedAttribute
 * * fromAttribute: function used to deserialize an attribute value
 * * toAttribute: function used to serialize a property to an attribute value
 * * attributeName: string that is a custom attribute name (defaults to lowercased property name)
 */
export const property = (options?: PropertyOptions) => (proto: Object, name: string) => {
  const ctor = proto.constructor as typeof UpdatingElement;
  ctor._ensurePropertyStorage();
  ctor._classProperties[name] = options || {};
  makeProperty(name, proto);
};

/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `shouldChange` function.
 */
// tslint:disable-next-line no-any
export function identity(value: any, old: any) {
  // This ensures (old==NaN, value==NaN) always returns false
  return old !== value && (old === old || value === value);
}

/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclassers to render updates as desired.
 */
export class UpdatingElement extends HTMLElement {

  private _updatePromise: Promise<boolean>|null = null;
  private _isEnabled = false;
  private _isValidating = false;
  private _hasUpdated = false;
  private _isUpdating = false;
  private _serializingProperty = false;
  private _instanceProperties: AnyObject = {};
  private _updateCompleteResolver: Function|null = null;

  /**
   * Node or ShadowRoot into which element DOM should be renderd. Defaults
   * to an open shadowRoot.
   */
  root?: Element|DocumentFragment;

  /**
   * Object with keys for all properties with their current values.
   */
  props: AnyObject = {};
  /**
   * Object with keys for any properties that have changed since the last
   * update cycle.
   */
  changedProps: AnyObject = {};
  /**
   * Object with keys for all properties with their value from the previous
   * update cycle.
   */
  prevProps: AnyObject = {};

  private static _attributeToPropertyMap: AttributeMap = {};
  private static _finalized = false;
  private static _observedAttributes: string[]|undefined;
  // TODO(sorvell): intended to be private but called by decorator.
  static _classProperties: Properties = {};

  /**
   * Implement to return an object with keys that become registered properties,
   * changes to which will trigger `update`. A set of options may be supplied
   * for a property:
   * * attribute: a boolean that should be true if the property should be an observedAttribute
   * * fromAttribute: function used to deserialize an attribute value
   * * toAttribute: function used to serialize a property to an attribute value
   * * attributeName: string that is a custom attribute name (defaults to lowercased property name)
   */
  static properties: Properties = {};

  /**
   * Returns a list of attributes corresponding to the registered properties
   * that have listed themselves as attributes.
   */
  static get observedAttributes() {
    if (!this.hasOwnProperty('_observedAttributes')) {
      // note: piggy backing on this to ensure we're _finalized.
      this._finalize();
      this._observedAttributes = [];
      for (const p in this._classProperties) {
        const info = this._classProperties[p];
        if (info.attribute) {
          const attr = this.propertyToAttributeName(p);
          this._attributeToPropertyMap[attr] = p;
          this._observedAttributes.push(attr);
        }
      }
    }
    return this._observedAttributes;
  }

  // TODO(sorvell): intended to be private but called by decorator
  static _ensurePropertyStorage() {
    if (!this.hasOwnProperty('_classProperties')) {
      this._classProperties = Object.create(Object.getPrototypeOf(this)._classProperties);
    }
  }

  /**
   * Creates property accessors for registered properties and ensures
   * any superclasses are also finalized.
   */
  private static _finalize() {
    if (!(this.hasOwnProperty('_finalized') && this._finalized)) {
      const superCtor = Object.getPrototypeOf(this);
      if (superCtor.prototype instanceof UpdatingElement) {
        superCtor._finalize();
      }
      this._finalized = true;
      const props = this.properties;
      for (const p in props) {
        makeProperty(p, this.prototype);
      }
      this._attributeToPropertyMap = Object.create(superCtor._attributeToPropertyMap);
      this._ensurePropertyStorage();
      Object.assign(this._classProperties, props);
    }
  }

  /**
   * Returns the property name for the given attribute `name`.
   */
  protected static propertyToAttributeName(name: string) {
    const info = this._classProperties[name];
    return info && info.attributeName || name.toLowerCase();
  }

  /**
   * Called when a property value is set to determine if the value should change.
   * This uses the `shouldChange` property option for the given property `name`.
   */
  // tslint:disable-next-line no-any
  protected static propertyShouldChange(name: string, value: any, old: any) {
    const info = this._classProperties[name];
    const fn = info && info.shouldChange || identity;
    return fn(value, old);
  }

  /**
   * Called to deserialize an attribute value to a property value.
   * This uses the `fromAttribute` property option for the given property `name`.
   */
  // tslint:disable-next-line no-any
  protected static propertyValueFromAttribute(name: string, value: string) {
    const info = this._classProperties[name];
    const fromAttribute = info && info.fromAttribute;
    return fromAttribute ? fromAttribute(value) : value;
  }

  /**
   * Called to serialize an property value to an attribute value. If this
   * returns undefined, the property will *not* be reflected to an attribute.
   * This uses the `toAttribute` property option for the given property `name`.
   */
  // tslint:disable-next-line no-any
  protected static propertyValueToAttribute(name: string, value: any) {
    const info = this._classProperties[name];
    const toAttribute = info && info.toAttribute;
    if (toAttribute !== undefined) {
      return toAttribute(value);
    }
  }

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
    this.createRoot();
    // save instance properties.
    for (const p in (this.constructor as typeof UpdatingElement)._classProperties) {
      if (this.hasOwnProperty(p)) {
        // tslint:disable-next-line no-any
        const me = (this as any);
        const value = me[p];
        delete me[p];
        this._instanceProperties[p] = value;
      }
    }
  }

  /**
   * Implement to customize where the element's template is rendered by
   * returning an element into which to render. By default this creates
   * a shadowRoot for the element. To render into the element's childNodes,
   * return `this`.
   * @returns {Element|DocumentFragment} Returns a node into which to render.
   */
  protected createRoot() {
    this.root = this.attachShadow({mode : 'open'});
  }

  /**
   * Calls `enableUpdate` and uses ShadyCSS to keep element DOM updated.
   */
  connectedCallback() {
    if (window.ShadyCSS && this._hasUpdated) {
      window.ShadyCSS.styleElement(this);
    }
    this.enableUpdate();
  }

  /**
   * Call to enable element updating. This is called in `connectedCallback`
   * but can be called sooner if desired.
   */
  enableUpdate() {
    if (!this._isEnabled) {
      // replay instance properties
      for (const p in this._instanceProperties) {
        // tslint:disable-next-line no-any
        (this as any)[p] = this._instanceProperties[p];
      }
      this._isEnabled = true;
      this.invalidate();
    }
  }

  /**
   * Synchronizes property values when attributes change.
   */
  attributeChangedCallback(name: string, old: string, value: string) {
    if (old !== value) {
      const ctor = (this.constructor as typeof UpdatingElement);
      const propName = ctor._attributeToPropertyMap[name];
      // TODO(sorvell): currently not used.
      if (!this._serializingProperty) {
        // tslint:disable-next-line no-any
        (this as any)[propName] = ctor.propertyValueFromAttribute(propName, value);
      }
    }
  }

  /**
   * Returns the value of the property with `name`. This method is used
   * to get property values of registered properties.
   */
  protected getProperty(name: string) {
    return this.props[name];
  }

  /**
   * Sets the property `name` to the given `value`. This method is used
   * to set property values of registered properties.
   */
  // tslint:disable-next-line no-any
  protected setProperty(name: string, value: any) {
    const old = this.props[name];
    const ctor = (this.constructor as typeof UpdatingElement);
    if (ctor.propertyShouldChange(name, value, old)) {
      this.props[name] = value;
      this.changedProps[name] = value;
      const attrValue = ctor.propertyValueToAttribute(name, value);
      if (attrValue !== undefined) {
        // TODO(sorvell): doing this here means we need to allow round tripping
        // through property setting to not interfere with the reaction stack.
        // However, we could move this to update (as in Polymer) to avoid this
        // with a flag, but this is undesirable since we want to keep update
        // unimplemented here.
        this.setAttribute(name, attrValue);
      }
      this.invalidate();
    }
  }

  /**
   * Call to request the element to asynchronously update regardless
   * of whether or not any property changes are pending. This method is
   * automatically called when any registered property changes.
   */
  protected async invalidate() {
    if (this._isEnabled) {
      if (this._isUpdating) {
        console.warn('Requested an update while updating. This is not supported.');
      } else if (!this._isValidating) {
        this._isValidating = true;
        await Promise.resolve();
        this._validate();
      }
    }
  }

  /**
   * Validates the element. If `shouldUpdate` returns true then `update` is
   * called. When the update is complete `changeProps` and `prevProps` are
   * updated and any `updateComplete` promise is resolved.
   */
  private _validate() {
    this._isValidating = false;
    if (!this.shouldUpdate()) {
      return;
    }
    this._isUpdating = true;
    this.update();
    this._hasUpdated = true;
    this.changedProps = {};
    Object.assign(this.prevProps, this.props);
    this._isUpdating = false;
    if (this._updateCompleteResolver) {
      this._updateCompleteResolver(true);
    }
  }

  /**
   * Implement to control if updating should occur when property values
   * change or `invalidate` is called. By default, this method always
   * returns true, but this can be customized as an optimization to avoid
   * rendering work when changes occur which should not be rendered.
   */
  protected shouldUpdate(): boolean {
    return true;
  }

  /**
   * Implement to update the element. Typically renders and keeps updated DOM
   * in the element's root.
   */
  protected update() {
  }

 /**
   * Returns a promise which resolves after the element next updates.
   * The promise resolves to `true` if the element updated and `false` if the
   * element did not.
   * This is useful when users (e.g. tests) need to react to the updated state
   * of the element after a change is made.
   * This can also be useful in event handlers if it is desireable to wait
   * to send an event until after updating.
   */
  get updateComplete() {
    if (!this._updatePromise) {
      this._updatePromise = new Promise((resolve) => {
        this._updateCompleteResolver = (value: boolean) => {
          this._updateCompleteResolver = this._updatePromise = null;
          resolve(value);
        };
      });
      if (!this._isUpdating) {
        Promise.resolve().then(() => this._updateCompleteResolver!(false));
      }
    }
    return this._updatePromise;
  }
}
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
 * Use this module if you want to create your own base class extending [[UpdatingElement]].
 * @packageDocumentation
 */

 export * from './decorators/property.js';

/**
 * Map of changed properties with old values. Takes an optional generic
 * interface corresponding to the declared element properties.
 */
// tslint:disable-next-line:no-any
export type PropertyValues<T = any> =
    keyof T extends PropertyKey ? Map<keyof T, unknown>: never;

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

const STATE_HAS_UPDATED = 1;
const STATE_UPDATE_REQUESTED = 1 << 2;
type UpdateState = typeof STATE_HAS_UPDATED|typeof STATE_UPDATE_REQUESTED;

/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclassers to render updates as desired.
 * @noInheritDoc
 */
export abstract class UpdatingElement extends HTMLElement {

  static observedAttributes?: string[];
  /*
   * Due to closure compiler ES6 compilation bugs, @nocollapse is required on
   * all static methods and properties with initializers.  Reference:
   * - https://github.com/google/closure-compiler/issues/1776
   */

  /**
   * Returns true if a property should request an update.
   * Called when a property value is set and uses the `hasChanged`
   * option for the property if present or a strict identity check.
   * @nocollapse
   */
  protected valueHasChanged(
      value: unknown, old: unknown, hasChanged: HasChanged = notEqual) {
    return hasChanged(value, old);
  }

  private _updateState!: UpdateState;
  // Initialize to an unresolved Promise so we can make sure the element has
  // connected before first update.
  private _updatePromise!: Promise<unknown>;
  private _enableUpdatingResolver: (() => void)|undefined;

  /**
   * Map with keys for any properties that have changed since the last
   * update cycle with previous values.
   */
  private _changedProperties!: PropertyValues;

  constructor() {
    super();
    this.initialize();
  }

  /**
   * Performs element initialization. By default captures any pre-set values for
   * registered properties.
   */
  protected initialize() {
    this._updateState = 0;
    this._updatePromise = new Promise((res) => this._enableUpdatingResolver = res);
    this._changedProperties = new Map();
    this.requestUpdate();
  }

  protected attributeChangedCallback(_name: string, _oldValue: string|null,
      _value: string) {}

  protected connectedCallback() {
    // Ensure first connection completes an update. Updates cannot complete
    // before connection.
    this.enableUpdating();
  }

  protected enableUpdating() {
    if (this._enableUpdatingResolver !== undefined) {
      this._enableUpdatingResolver();
      this._enableUpdatingResolver = undefined;
    }
  }

  /**
   * Allows for `super.disconnectedCallback()` in extensions while
   * reserving the possibility of making non-breaking feature additions
   * when disconnecting at some point in the future.
   */
  protected disconnectedCallback() {
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
   */
  protected requestUpdate(name?: PropertyKey, oldValue?: unknown) {
    let shouldRequestUpdate = true;
    // If we have a property key, perform property update steps.
    if (name !== undefined) {
      if (this.valueHasChanged(
              this[name as keyof this], oldValue)) {
        if (!this._changedProperties.has(name)) {
          this._changedProperties.set(name, oldValue);
        }
      } else {
        // Abort the request if the property should not be considered changed.
        shouldRequestUpdate = false;
      }
    }
    if (shouldRequestUpdate && this.shouldEnqueueUpdate()) {
      this._updatePromise = this._enqueueUpdate();
    }
  }

  protected shouldEnqueueUpdate() {
    return !this.hasRequestedUpdate;
  }

  /**
   * Sets up the element to asynchronously update.
   */
  private async _enqueueUpdate() {
    this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
    try {
      // Ensure any previous update has resolved before updating.
      // This `await` also ensures that property changes are batched.
      await this._updatePromise;
    } catch (e) {
      // Ignore any previous errors. We only care that the previous cycle is
      // done. Any error should have been handled in the previous update.
    }
    const result = this.performUpdate();
    // If `performUpdate` returns a Promise, we await it. This is done to
    // enable coordinating updates with a scheduler. Note, the result is
    // checked to avoid delaying an additional microtask unless we need to.
    if (result != null) {
      await result;
    }
    return !this.hasRequestedUpdate;
  }

  protected get hasRequestedUpdate() {
    return (this._updateState & STATE_UPDATE_REQUESTED);
  }

  protected get hasUpdated() {
    return (this._updateState & STATE_HAS_UPDATED);
  }

  /**
   * Performs an element update. Note, if an exception is thrown during the
   * update, `firstUpdated` and `updated` will not be called.
   *
   * You can override this method to change the timing of updates. If this
   * method is overridden, `super.performUpdate()` must be called.
   *
   * For instance, to schedule updates to occur just before the next frame:
   *
   * ```
   * protected async performUpdate(): Promise<unknown> {
   *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
   *   super.performUpdate();
   * }
   * ```
   */
  protected performUpdate(): void|Promise<unknown> {
    // Abort any update if one is not pending when this is called.
    // This can happen if `performUpdate` is called early to "flush"
    // the update.
    if (!this.hasRequestedUpdate) {
      return;
    }
    const changedProperties = this._changedProperties;
    try {
      if (this.shouldUpdate(changedProperties)) {
        this.update(changedProperties);
      } else {
        this._markUpdated();
      }
    } catch (e) {
      // Ensure element can accept additional updates after an exception.
      this._markUpdated();
      throw e;
    }
  }

  private _markUpdated() {
    this._changedProperties = new Map();
    this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
  }

  /**
   * Controls whether or not `update` should be called when the element requests
   * an update. By default, this method always returns `true`, but this can be
   * customized to control when to update.
   *
   * @param _changedProperties Map of changed properties with old values
   */
  protected shouldUpdate(_changedProperties: PropertyValues): boolean {
    return true;
  }

  /**
   * Updates the element. This method reflects property values to attributes.
   * It can be overridden to render and keep updated element DOM.
   * Setting properties inside this method will *not* trigger
   * another update.
   *
   * @param _changedProperties Map of changed properties with old values
   */
  protected update(_changedProperties: PropertyValues) {
    this._markUpdated();
  }

}

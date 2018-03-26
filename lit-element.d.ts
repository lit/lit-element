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
import { PropertiesChangedConstructor } from '@polymer/polymer/lib/mixins/properties-changed.js';
import { PropertiesMixinConstructor } from '@polymer/polymer/lib/mixins/properties-mixin.js';
import { TemplateResult } from 'lit-html/lit-html.js';
export { PropertiesChangedConstructor } from '@polymer/polymer/lib/mixins/properties-changed.js';
export { PropertiesMixinConstructor } from '@polymer/polymer/lib/mixins/properties-mixin.js';
export { html } from 'lit-html/lib/lit-extended.js';
export declare type __unused = PropertiesChangedConstructor & PropertiesMixinConstructor;
/**
 * Renders attributes to the given element based on the `attrInfo` object where
 * boolean values are added/removed as attributes.
 * @param element Element on which to set attributes.
 * @param attrInfo Object describing attributes.
 */
export declare function renderAttributes(element: HTMLElement, attrInfo: {
    [name: string]: any;
}): void;
/**
 * Returns a string of css class names formed by taking the properties
 * in the `classInfo` object and appending the property name to the string of
 * class names if the property value is truthy.
 * @param classInfo
 */
export declare function classString(classInfo: {
    [name: string]: any;
}): string;
/**
 * Returns a css style string formed by taking the properties in the `styleInfo`
 * object and appending the property name (dash-cased) colon the
 * property value. Properties are separated by a semi-colon.
 * @param styleInfo
 */
export declare function styleString(styleInfo: {
    [name: string]: any;
}): string;
declare const LitElement_base: {
    new (): HTMLElement;
    prototype: HTMLElement;
} & PropertiesMixinConstructor & PropertiesChangedConstructor;
export declare class LitElement extends LitElement_base {
    private __renderComplete;
    private __resolveRenderComplete;
    private __isInvalid;
    private __isChanging;
    private _root?;
    ready(): void;
    /**
     * Returns an
     * @returns {Element|DocumentFragment} Returns a node into which to render.
     */
    protected _createRoot(): Element | DocumentFragment;
    /**
     * Override which always returns true so that `_propertiesChanged`
     * is called whenver properties are invalidated. This ensures `render`
     * is always called in response to `invalidate`.
     * @param _props Current element properties
     * @param _changedProps Changing element properties
     * @param _prevProps Previous element properties
     * @returns {boolean} Default implementation always returns true.
     */
    _shouldPropertiesChange(_props: object, _changedProps: object, _prevProps: object): boolean;
    /**
     * Override which always calls `render` and `didRender` to perform
     * element rendering.
     * @param props Current element properties
     * @param changedProps Changing element properties
     * @param prevProps Previous element properties
     */
    _propertiesChanged(props: object, changedProps: object, prevProps: object): void;
    _shouldPropertyChange(property: string, value: any, old: any): boolean;
    /**
     * Returns a lit-html TemplateResult which is rendered into the element's
     * shadowRoot. This method must be implemented.
     * @param {*} _props Current element properties
     * @returns {TemplateResult} Must return a lit-html TemplateResult.
     */
    protected render(_props: object): TemplateResult;
    /**
     * Called after element dom has been rendered. Implement to
     * directly access element DOM.
     * @param _props Current element properties
     * @param _changedProps Changing element properties
     * @param _prevProps Previous element properties
     */
    protected didRender(_props: object, _changedProps: object, _prevProps: object): void;
    /**
     * Provokes the element to asynchronously re-render.
     */
    invalidate(): void;
    /**
     * Override which provides tracking of invalidated state.
     */
    _invalidateProperties(): void;
    /**
     * Returns a promise which resolves after the element next renders.
     */
    readonly renderComplete: Promise<any>;
}

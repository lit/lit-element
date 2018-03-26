import { PropertiesMixin } from '@polymer/polymer/lib/mixins/properties-mixin.js';
import { camelToDashCase } from '@polymer/polymer/lib/utils/case-map.js';
import { render } from 'lit-html/lib/shady-render.js';
export { html } from 'lit-html/lib/lit-extended.js';
/**
 * Renders attributes to the given element based on the `attrInfo` object where
 * boolean values are added/removed as attributes.
 * @param element Element on which to set attributes.
 * @param attrInfo Object describing attributes.
 */
export function renderAttributes(element, attrInfo) {
    for (const a in attrInfo) {
        const v = attrInfo[a] === true ? '' : attrInfo[a];
        if (v || v === '' || v === 0) {
            if (element.getAttribute(a) !== v) {
                element.setAttribute(a, v);
            }
        }
        else if (element.hasAttribute(a)) {
            element.removeAttribute(a);
        }
    }
}
/**
 * Returns a string of css class names formed by taking the properties
 * in the `classInfo` object and appending the property name to the string of
 * class names if the property value is truthy.
 * @param classInfo
 */
export function classString(classInfo) {
    const o = [];
    for (const name in classInfo) {
        const v = classInfo[name];
        if (v) {
            o.push(name);
        }
    }
    return o.join(' ');
}
/**
 * Returns a css style string formed by taking the properties in the `styleInfo`
 * object and appending the property name (dash-cased) colon the
 * property value. Properties are separated by a semi-colon.
 * @param styleInfo
 */
export function styleString(styleInfo) {
    const o = [];
    for (const name in styleInfo) {
        const v = styleInfo[name];
        if (v || v === 0) {
            o.push(`${camelToDashCase(name)}: ${v}`);
        }
    }
    return o.join('; ');
}
export class LitElement extends PropertiesMixin(HTMLElement) {
    constructor() {
        super(...arguments);
        this.__renderComplete = null;
        this.__resolveRenderComplete = null;
        this.__isInvalid = false;
        this.__isChanging = false;
    }
    ready() {
        this._root = this._createRoot();
        super.ready();
    }
    /**
     * Returns an
     * @returns {Element|DocumentFragment} Returns a node into which to render.
     */
    _createRoot() {
        return this.attachShadow({ mode: 'open' });
    }
    /**
     * Override which always returns true so that `_propertiesChanged`
     * is called whenver properties are invalidated. This ensures `render`
     * is always called in response to `invalidate`.
     * @param _props Current element properties
     * @param _changedProps Changing element properties
     * @param _prevProps Previous element properties
     * @returns {boolean} Default implementation always returns true.
     */
    _shouldPropertiesChange(_props, _changedProps, _prevProps) {
        return true;
    }
    /**
     * Override which always calls `render` and `didRender` to perform
     * element rendering.
     * @param props Current element properties
     * @param changedProps Changing element properties
     * @param prevProps Previous element properties
     */
    _propertiesChanged(props, changedProps, prevProps) {
        this.__isChanging = true;
        this.__isInvalid = false;
        super._propertiesChanged(props, changedProps, prevProps);
        const result = this.render(props);
        if (result && this._root !== undefined) {
            render(result, this._root, this.localName);
        }
        this.didRender(props, changedProps, prevProps);
        if (this.__resolveRenderComplete) {
            this.__resolveRenderComplete();
        }
        this.__isChanging = false;
    }
    _shouldPropertyChange(property, value, old) {
        const change = super._shouldPropertyChange(property, value, old);
        if (change && this.__isChanging) {
            console.trace(`Setting properties in response to other properties changing ` +
                `considered harmful. Setting '${property}' from ` +
                `'${this._getProperty(property)}' to '${value}'.`);
        }
        return change;
    }
    /**
     * Returns a lit-html TemplateResult which is rendered into the element's
     * shadowRoot. This method must be implemented.
     * @param {*} _props Current element properties
     * @returns {TemplateResult} Must return a lit-html TemplateResult.
     */
    render(_props) {
        throw new Error('render() not implemented');
    }
    /**
     * Called after element dom has been rendered. Implement to
     * directly access element DOM.
     * @param _props Current element properties
     * @param _changedProps Changing element properties
     * @param _prevProps Previous element properties
     */
    didRender(_props, _changedProps, _prevProps) { }
    /**
     * Provokes the element to asynchronously re-render.
     */
    invalidate() { this._invalidateProperties(); }
    /**
     * Override which provides tracking of invalidated state.
     */
    _invalidateProperties() {
        this.__isInvalid = true;
        super._invalidateProperties();
    }
    /**
     * Returns a promise which resolves after the element next renders.
     */
    get renderComplete() {
        if (!this.__renderComplete) {
            // TODO(sorvell): handle rejected render.
            this.__renderComplete = new Promise((resolve) => {
                this.__resolveRenderComplete =
                    () => {
                        this.__resolveRenderComplete = this.__renderComplete = null;
                        resolve();
                    };
            });
            if (!this.__isInvalid && this.__resolveRenderComplete) {
                this.__resolveRenderComplete();
            }
        }
        return this.__renderComplete;
    }
}
//# sourceMappingURL=lit-element.js.map
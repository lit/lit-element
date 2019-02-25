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
import { LitElement, PropertyValues } from '../lit-element.js';
export * from '../lit-element.js';
interface CSSPartRule {
    selector: string;
    part: string;
    propertySet: string;
    pseudo: string;
    guid: string;
    dynamic: string;
}
declare type CSSPartRuleSet = Set<CSSPartRule>;
export declare class PartStyledElement extends LitElement {
    static useNativePart: boolean;
    static partRuleMap: Map<string, CSSPartRuleSet>;
    static partRule(selector: string, part: string, propertySet: string, pseudo?: string): any;
    static _addToPartRuleMap(rule: CSSPartRule): void;
    static readonly observedAttributes: string[];
    private _exportPartsChildren;
    exportParts: Map<string, string> | null;
    private _partsDirty;
    attributeChangedCallback(name: string, old: string | null, value: string | null): void;
    /**
     * By default, this queries for elements with a part attribute in the initially
     * rendered DOM. If parts are needed that are not initially rendered,
     * override and provide the additional part names.
     *
     * Returns an array of part names rendered in this element.
     */
    protected readonly cssPartNames: (string | null)[];
    __cssParts?: Map<string, CSSPartRuleSet | null>;
    private readonly _cssParts;
    private _exportedPartRules;
    addPartStyle(part: string, rule: CSSPartRule, forward?: boolean): void;
    removePartStyle(rule: CSSPartRule): void;
    addExportPartsChild(child: Element): void;
    removeExportPartsChild(child: Element): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(changedProperties: PropertyValues): void;
    _dynamicPartRuleMap?: Map<string, CSSPartRuleSet>;
    private _updateStaticParts;
    updated(changedProperties: PropertyValues): void;
    _previousClassList: Set<any>;
    private _updateDynamicParts;
}
//# sourceMappingURL=part-styled-element.d.ts.map
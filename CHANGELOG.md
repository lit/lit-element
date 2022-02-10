# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

<!--
   PRs should document their user-visible changes (if any) in the
   Unreleased section, uncommenting the header as necessary.
-->

<!-- ## [x.y.z] - YYYY-MM-DD -->
<!-- ## Unreleased -->
<!-- ### Changed -->
<!-- ### Added -->
<!-- ### Removed -->
<!-- ### Fixed -->

## [2.5.1] - 2021-05-05

### Fixed

* Fixed an issue that was causing VS Code to mark `@state()` as deprecated ([#1192](https://github.com/lit/lit-element/pull/1192)).

## [2.5.0] - 2021-04-29

### Changed

* Added the `@state()` decorator as an alias for `@internalProperty()`, and deprecated `@internalProperty()` which will be renamed to `@state` in lit-element 3.0 ([#1162](https://github.com/Polymer/lit-element/issues/1162)).
* Added `UpdatingElement.prototype.getUpdateComplete()` and deprecated `_getUpdateComplete()` for forward compibility with lit-element 3.0.

### Added
* Adds a `static shadowRootOptions` property for specifying shadow root options. This is a slightly simpler alternative to implementing a custom `createRenderRoot` method ([#1147](https://github.com/Polymer/lit-element/issues/1147)).
* Adds an export of `UpdatingElement` as `ReactiveElement` for forward-compatibility with lit-element 3.0 ([#1177](https://github.com/Polymer/lit-element/issues/1177)).

### Fixed
* Fixes an issue with `queryAssignedNodes` when applying a selector on a slot that included text nodes on older browsers not supporting Element.matches ([#1088](https://github.com/Polymer/lit-element/issues/1088)).

## [2.4.0] - 2020-08-19

### Changed
* Set type in package.json to "module" ([#974](https://github.com/Polymer/lit-element/pull/974))

### Added
* Adds a `cache: boolean` argument to the `@query` decorator as a performance optimization for properties whose queried element is not expected to change. If cache is set to true, element DOM is queried when the property is first accessed, and the value is cached so it can be immediately returned on all subsequent property accesses. ([#1013](https://github.com/Polymer/lit-element/issues/1013))

* Adds a `selector: string` argument to the `@queryAssignedNodes` decorator as a convenience to filter the assigned nodes by the given selector ([#1016](https://github.com/Polymer/lit-element/issues/1016)).

* The `requestUpdateInternal(name, oldValue, options)` method has been added. This method is sometimes useful to call in a custom property setter to optimize performance. It is slightly more efficient than `requestUpdate` since it does not return the `updateComplete` property which can be overridden to do work.

* The protected `performUpdate()` method may now be called to syncronously "flush" a pending update, for example via a property setter. Note, performing a synchronous update only updates the element and not any potentially pending descendants in the element's local DOM ([#959](https://github.com/Polymer/lit-element/issues/959)).

* Constructible stylesheets may now be provided directly as styles, in addition to using the `css` tagged template function ([#853](https://github.com/Polymer/lit-element/issues/853)).

### Fixed
* queryAssignedNodes doesn't correctly locate default slot ([#1002](https://github.com/Polymer/lit-element/issues/1002))

## [2.3.1] - 2020-03-19

### Fixed
* Add TypeScript type declarations for older versions of TypeScript. We're currently testing back to TS 3.4. We can't commit to never breaking TypeScript builds, but we'll be supporting older versions as best we can.

## [2.3.0] - 2020-03-18

### Changed
* Added a static `getPropertyDescriptor` method to allow easier customization of property accessors. This method should return a a `PropertyDescriptor` to install on the property. If no descriptor is returned, no property accessor is created. ([#911](https://github.com/Polymer/lit-element/issues/911))
* The value returned by `render` is always rendered, even if it isn't a `TemplateResult`. ([#712](https://github.com/Polymer/lit-element/issues/712))

### Added
* Added `@queryAsync(selector)` decorator which returns a Promise that resolves to the result of querying for the given selector after the element's `updateComplete` Promise resolves ([#903](https://github.com/Polymer/lit-element/issues/903)).
* Added `enableUpdating()` to `UpdatingElement` to enable customizing when updating is enabled [#860](https://github.com/Polymer/lit-element/pull/860).
* Added `@queryAssignedNodes(slotName, flatten)` decorator to enable querying assignedNodes for a given slot [#860](https://github.com/Polymer/lit-element/pull/860).
* Added `getStyles()` to `LitElement` to allow hooks into style gathering for component sets [#866](https://github.com/Polymer/lit-element/pull/866).
* Added `@internalProperty(options)` decorator to define properties internal to an element. [#881](https://github.com/Polymer/lit-element/pull/881).

### Fixed
* Ensure `UpdatingElement` allows updates when properties are set after calling `super.update()`.
`LitElement` renders when updates are triggered as a result of rendering ([#549](https://github.com/Polymer/lit-element/issues/549)).
* Properties annotated with the `eventOptions` decorator will now survive property renaming optimizations when used with tsickle and Closure JS Compiler.
* Moved style gathering from `finalize` to `initialize` to be more lazy, and create stylesheets on the first instance initializing [#866](https://github.com/Polymer/lit-element/pull/866).
* Fixed behavior change for components that do not implement `render()` introduced in ([#712](https://github.com/Polymer/lit-element/pull/712)) ([#917](https://github.com/Polymer/lit-element/pull/917))

## [2.2.1] - 2019-07-23
### Changed
* Elements should now override the new `_getUpdateComplete` method instead of the `updateComplete` getter, for compatibility with TypeScript ES5 output, which does not support calling a superclass getter (e.g.`super.updateComplete.then(...)`) due to [TypeScript#338](https://github.com/microsoft/TypeScript/issues/338).
### Fixed
* Fixed compatibility with Closure JS Compiler optimizations relating to static properties ([#732](https://github.com/Polymer/lit-element/issues/732)).

## [2.2.0] - 2019-06-11
### Added
* css tagged template literals now allow numbers to be used in expressions ([#488](https://github.com/Polymer/lit-element/issues/488)).

## [2.1.0] - 2019-03-21
### Changed
* `LitElement.renderRoot` is now `public readonly` instead of `protected`.

### Fixed
* Exceptions generated during update/render do not block subsequent updates ([#262](https://github.com/Polymer/lit-element/issues/262)).
* Initial update is scheduled at construction time rather than connected time ([#594](https://github.com/Polymer/lit-element/issues/594)).
* A reflecting property set immediately after a corresponding attribute
now reflects properly ([#592](https://github.com/Polymer/lit-element/issues/592)).
* Properties annotated with the `@query` and `@queryAll` decorators will now
  survive property renaming optimizations when used with tsickle and Closure JS
  Compiler.

## [2.0.1] - 2019-02-05
### Fixed
* Use `lit-html` 1.0 ([#543](https://github.com/Polymer/lit-element/pull/543)).

## [2.0.0] - 2019-02-05
### Added
* Add `toString()` function to `CSSResult` ([#508](https://github.com/Polymer/lit-element/pull/508))
* Add a global version to `window` ([#536](https://github.com/Polymer/lit-element/pull/536))

### Changed
* [Breaking] Renamed `unsafeCss` to `unsafeCSS` for consistency with lit-html's `unsafeHTML` ([#524](https://github.com/Polymer/lit-element/pull/524))
* Remove all uses of `any` outside of tests ([#457](https://github.com/Polymer/lit-element/pull/457))

### Fixed
* A bunch of docs fixes ([#464](https://github.com/Polymer/lit-element/pull/464)), ([#458](https://github.com/Polymer/lit-element/pull/458)), ([#493](https://github.com/Polymer/lit-element/pull/493)), ([#504](https://github.com/Polymer/lit-element/pull/504)), ([#505](https://github.com/Polymer/lit-element/pull/505)), ([#501](https://github.com/Polymer/lit-element/pull/501)), ([#494](https://github.com/Polymer/lit-element/pull/494)), ([#491](https://github.com/Polymer/lit-element/pull/491)), ([#509](https://github.com/Polymer/lit-element/pull/509)), ([#513](https://github.com/Polymer/lit-element/pull/513)), ([#515](https://github.com/Polymer/lit-element/pull/515)), ([#512](https://github.com/Polymer/lit-element/pull/512)), ([#503](https://github.com/Polymer/lit-element/pull/503)), ([#460](https://github.com/Polymer/lit-element/pull/460)), ([#413](https://github.com/Polymer/lit-element/pull/413)), ([#426](https://github.com/Polymer/lit-element/pull/426)), ([#516](https://github.com/Polymer/lit-element/pull/516)), ([#537](https://github.com/Polymer/lit-element/pull/537)), ([#535](https://github.com/Polymer/lit-element/pull/535)), ([#539](https://github.com/Polymer/lit-element/pull/539)), ([#540](https://github.com/Polymer/lit-element/pull/540))
* Build on checkout ([#423](https://github.com/Polymer/lit-element/pull/423))

### Fixed
* Adds a check to ensure `CSSStyleSheet` is constructable ([#527](https://github.com/Polymer/lit-element/pull/527)).

## [2.0.0-rc.5] - 2019-01-24
### Fixed
* Fixed a bug causing duplicate styles when an array was returned from `static get styles` ([#480](https://github.com/Polymer/lit-element/issues/480)).

## [2.0.0-rc.4] - 2019-01-24
### Added
* [Maintenance] Added script to publish dev releases automatically ([#476](https://github.com/Polymer/lit-element/pull/476)).
* Adds `unsafeCss` for composing "unsafe" values into `css`. Note, `CSSResult` is no longer constructable. ([#451](https://github.com/Polymer/lit-element/issues/451) and [#471](https://github.com/Polymer/lit-element/issues/471)).

### Fixed
* Fixed a bug where we broke compatibility with closure compiler's property renaming optimizations. JSCompiler_renameProperty can't be a module export ([#465](https://github.com/Polymer/lit-element/pull/465)).
* Fixed an issue with inheriting from `styles` property when extending a superclass that is never instanced. ([#470](https://github.com/Polymer/lit-element/pull/470)).
* Fixed an issue with Closure Compiler and ([#470](https://github.com/Polymer/lit-element/pull/470)) ([#476](https://github.com/Polymer/lit-element/pull/476)).

## [2.0.0-rc.3] - 2019-01-18
### Fixed
* README: Fixed jsfiddle reference ([#435](https://github.com/Polymer/lit-element/pull/435)).
* Compile with Closure Compiler cleanly ([#436](https://github.com/Polymer/lit-element/pull/436)).
* Opt `@property` decorators out of Closure Compiler renaming ([#448](https://github.com/Polymer/lit-element/pull/448)).

### Changed
* [Breaking] Property accessors are no longer wrapped when they already exist. Instead the `noAccessor` flag should be set when a user-defined accessor exists on the prototype (and in this case, user-defined accessors must call `requestUpdate` themselves). ([#454](https://github.com/Polymer/lit-element/pull/454)).
* Class fields can now be used to define styles, e.g. `static styles = css` and `styles` correctly compose when elements are extended ([#456](https://github.com/Polymer/lit-element/pull/456)).
* Styles returned via `static styles` are automatically flattend ([#437](https://github.com/Polymer/lit-element/pull/437)).
* Replace use of for/of loops over Maps with forEach ([#455](https://github.com/Polymer/lit-element/pull/455))

## [2.0.0-rc.2] - 2019-01-11
### Fixed
* Fix references to `@polymer/lit-element` in README and docs ([#427](https://github.com/Polymer/lit-element/pull/427)).
* Fix decorator types causing compiler errors for TypeScript users. ([#431](https://github.com/Polymer/lit-element/pull/431)).

## [2.0.0-rc.1] - 2019-01-10
### Changed
* [Breaking] Changed NPM package name to `lit-element`

## [0.7.0] - 2019-01-10
### Added
* Updated decorator implementations to support TC39 decorator API proposal (supported by Babel 7.1+) in addition to the legacy decorator API (supported by older Babel and TypeScript) ([#156](https://github.com/Polymer/lit-element/issues/156)).
* Added `static get styles()` to allow defining element styling separate from `render` method.
This takes advantage of [`adoptedStyleSheets`](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets) when possible ([#391](https://github.com/Polymer/lit-element/issues/391)).
* Added the `performUpdate` method to allow control of update timing ([#290](https://github.com/Polymer/lit-element/issues/290)).
* Updates deferred until first connection ([#258](https://github.com/Polymer/lit-element/issues/258)).
* Export `TemplateResult` and `SVGTemplateResult` ([#415](https://github.com/Polymer/lit-element/pull/415)).
### Changed
* [Breaking] The `createRenderRoot` method has moved from `UpdatingElement` to `LitElement`. Therefore, `UpdatingElement` no longer creates a `shadowRoot` by default ([#391](https://github.com/Polymer/lit-element/issues/391)).
* [Breaking] Changes property options to add `converter`. This option works the same as the previous `type` option except that the `converter` methods now also get `type` as the second argument. This effectively changes `type` to be a hint for the `converter`. A default `converter` is used if none is provided and it now supports `Boolean`, `String`, `Number`, `Object`, and `Array` ([#264](https://github.com/Polymer/lit-element/issues/264)).
* [Breaking] Numbers and strings now become null if their reflected attribute is removed (https://github.com/Polymer/lit-element/issues/264)).
* [Breaking] Previously, when an attribute changed as a result of a reflecting property changing, the property was prevented from mutating again as can happen when a custom
`converter` is used. Now, the oppose is also true. When a property changes as a result of an attribute changing, the attribute is prevented from mutating again (https://github.com/Polymer/lit-element/issues/264))
### Fixed
* [Breaking] User defined accessors are now wrapped to enable better composition ([#286](https://github.com/Polymer/lit-element/issues/286))
* Type for `eventOptions` decorator now properly includes `passive` and `once` options ([#325](https://github.com/Polymer/lit-element/issues/325))

## [0.6.5] - 2018-12-13
### Changed:
* Use lit-html 1.0 release candidate.

### Fixed
* Types for the `property` and `customElement` decorators updated ([#288](https://github.com/Polymer/lit-element/issues/288) and [#291](https://github.com/Polymer/lit-element/issues/291)).
* Docs updated.

## [0.6.4] - 2018-11-30
### Changed
* Update lit-html dependency to ^0.14.0 ([#324](https://github.com/Polymer/lit-element/pull/324)).

## [0.6.3] - 2018-11-08
### Changed
* Update lit-html dependency to ^0.13.0 ([#298](https://github.com/Polymer/lit-element/pull/298)).

## [0.6.2] - 2018-10-05

### Changed
* LitElement changed to a non-abstract class to be more compatible with the JavaScript mixin pattern
([#227](https://github.com/Polymer/lit-element/issues/227)).
* Update lit-html dependency to ^0.12.0 ([#244](https://github.com/Polymer/lit-element/pull/244)).
* Passes the component's `this` reference to lit-html as the `eventContext`, allowing unbound event listener methods ([#244](https://github.com/Polymer/lit-element/pull/244)).
### Added
* A `disconnectedCallback()` method was added to UpdatingElement ([#213](https://github.com/Polymer/lit-element/pull/213)).
* Added `@eventOptions()` decorator for setting event listener options on methods ([#244](https://github.com/Polymer/lit-element/pull/244)).

## [0.6.1] - 2018-09-17

### Fixed
* Fixes part rendering and css custom properties issues introduced with lit-html 0.11.3 by updating to 0.11.4 (https://github.com/Polymer/lit-element/issues/202).

### Removed
* Removed custom_typings for Polymer as they are no longer needed
(https://github.com/Polymer/lit-element/issues/186).

## [0.6.0] - 2018-09-13

### Added
* Added `@query()`, `@queryAll()`, and `@customElement` decorators ([#159](https://github.com/Polymer/lit-element/pull/159))

### Changed
* Significantly changed update/render lifecycle and property API. Render lifecycle
is now `requestUpdate`, `shouldUpdate`, `update`, `render`, `firstUpdated`
(first time only), `updated`, `updateComplete`. Property options are now
`{attribute, reflect, type, hasChanged}`. Properties may be defined in a
`static get properties` or using the `@property` decorator.
(https://github.com/Polymer/lit-element/pull/132).


### Removed
* Removed render helpers `classString` and `styleString`. Similar directives
(`classMap` and `styleMap`) have been added to lit-html and should be used instead
(https://github.com/Polymer/lit-element/pull/165 and
https://github.com/Polymer/lit-html/pull/486).

### Fixed
* The `npm run checksize` command should now return the correct minified size
(https://github.com/Polymer/lit-element/pull/153).
* The `firstUpdated` method should now always be called the first time the element
updates, even if `shouldUpdate` initially returned `false`
(https://github.com/Polymer/lit-element/pull/173).

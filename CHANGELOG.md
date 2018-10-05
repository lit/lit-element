# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

<!--
   PRs should document their user-visible changes (if any) in the
   Unreleased section, uncommenting the header as necessary.
-->

<!-- ## Unreleased -->

<!-- ### Changed -->
<!-- ### Added -->
<!-- ### Removed -->
<!-- ### Fixed -->

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


<!-- ### Changed -->
<!-- ### Removed -->
<!-- ### Fixed -->

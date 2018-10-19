/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
'use strict';

/*
 * Polyfills loaded: HTML Imports, Custom Elements, Shady DOM/Shady CSS, platform polyfills, template
 * Used in: webcomponents bundle to load ALL the things
 */

import './webcomponents-sd-ce-pf-index.js';

const customElements = window.customElements;

let shouldFlush = false;
/** @type {?function()} */
let flusher = null;

if (customElements['polyfillWrapFlushCallback']) {
  customElements['polyfillWrapFlushCallback']((flush) => {
    flusher = flush;
    if (shouldFlush) {
      flush();
    }
  });
}

function flushAndFire() {
  if (window.HTMLTemplateElement.bootstrap) {
    window.HTMLTemplateElement.bootstrap(window.document);
  }
  flusher && flusher();
  shouldFlush = true;
  window.WebComponents.ready = true;
  document.dispatchEvent(new CustomEvent('WebComponentsReady', { bubbles: true }));
}

if (document.readyState !== 'complete') {
  // this script may come between DCL and load, so listen for both, and cancel load listener if DCL fires
  window.addEventListener('load', flushAndFire)
  window.addEventListener('DOMContentLoaded', () => {
    window.removeEventListener('load', flushAndFire);
    flushAndFire();
  });
} else {
  flushAndFire();
}
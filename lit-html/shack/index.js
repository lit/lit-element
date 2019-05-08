/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {appData, renderApp} from './elements/shack-app.js';

(async function() {
  appData.categories = {
    'mens_outerwear': {
      title: 'Men\'s Outerwear',
    },
    'ladies_outerwear': {
      title: 'Ladies Outerwear',
    },
    'mens_tshirts': {
      title: 'Men\'s T-Shirts',
    },
    'ladies_tshirts': {
      title: 'Ladies T-Shirts',
    },
  };

  const promises = [];
  for (const c in appData.categories) {
    promises.push((async () => {
      const resp = await fetch(`./${c}.json`);
      appData.categories[c].items = await resp.json();
      appData.categories[c].slug = c;
    })());
  }
  await Promise.all(promises);

  // TODO We defer rendering for 100ms in the micro benchmark case because this
  // reduces variance substantially, plus we won't always have the bench.js
  // library available. For the first-contentful-paint case, we don't need
  // bench.js and shouldn't defer rendering. Clean up this logic somehow.
  const nobench = new URL(window.location.href).searchParams.has('nobench');
  if (nobench) {
    renderApp();
  } else {
    const bench = await import('/bench.js');
    setTimeout(() => {
      bench.start();
      renderApp();
      bench.stop();
    }, 100);
  }
})();

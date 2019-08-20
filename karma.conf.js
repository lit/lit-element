/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
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
module.exports = (config) => {
  config.set({
    browsers: [...localBrowsers, ...Object.keys(sauceBrowsers)],
    client: {runInParent: true, mocha: {ui: 'tdd'}},
    frameworks: ['mocha', 'chai', 'source-map-support'],
    files: [
      'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js',
      {pattern: 'test/lit-element_test.js', type: 'module'},
      {pattern: 'test/lit-element_styling_test.js', type: 'module'},
      {pattern: 'test/lib/decorators_test.js', type: 'module'},
      {pattern: 'test/lib/updating-element_test.js', type: 'module'}
    ],
    logLevel: config.LOG_INFO,
    reporters: ['spec']
  });

  if (runTestsOnSauce) {
    config.set({
      customLaunchers: sauceBrowsers,
      sauceLabs: {
        testName: 'lit-element unit tests',
        startConnect: typeof process.env.TRAVIS_JOB_NUMBER === 'undefined',
        tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
        idleTimeout: 300,
        build: process.env.TRAVIS_BUILD_NUMBER
      },
      transports: ['polling'],
      browserDisconnectTolerance: 5,
      reporters: ['spec', 'saucelabs']
    });
  }
};

const localBrowsers =
    (process.env.KARMA_LOCAL_BROWSERS || '').split(',').filter(Boolean);
const sauceBrowsers = parseBrowserSpecs(process.env.KARMA_SAUCE_BROWSERS || '');
const runTestsOnSauce = process.env.SAUCE_USERNAME &&
    process.env.SAUCE_ACCESS_KEY && Object.keys(sauceBrowsers).length > 0;

/**
 * Format of browsersList is:
 * ```
 * windows 7/chrome@35,Android/Browser@4.4:Samsung Galaxy S3
 * Emulator|portrait
 * ```
 */
function parseBrowserSpecs(browsersList) {
  return browsersList.split(',').filter(Boolean).reduce((browsers, spec) => {
    const match =
        spec.match(/([^/]+)(?:\/([^@]+))?(?:@([^:]+))?(?:\:(.+)\|(.+))?/);
    if (match) {
      browsers[spec.replace(/[^A-Za-z0-9]+/g, '_')] = {
        base: 'SauceLabs',
        platform: match[1],
        browserName: match[2],
        version: match[3],
        deviceName: match[4],
        deviceOrientation: match[5]
      };
    }
    return browsers;
  }, {});
}

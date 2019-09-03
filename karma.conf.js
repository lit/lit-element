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
require('source-map-support/register');

const {readFileSync, existsSync} = require('fs');

module.exports = (config) => {
  try {
    config.set({
      browsers: [...browsers, ...Object.keys(customLaunchers)],
      client: {
        captureConsole: true,
        runInParent: true,
        useIframe: true,
        mocha: {ui: 'tdd'}
      },
      frameworks: ['mocha', 'chai', 'source-map-support'],
      concurrency: 1,
      hostname: '127.0.0.1',
      listenAddress: '127.0.0.1',
      files: [
        polyfills.includes('wc-ce') &&
            {pattern: 'test/wc-ce.html', type: 'dom'},
        polyfills.includes('wc-shadydom') &&
            {pattern: 'test/wc-shadydom.js', type: 'dom'},
        polyfills.includes('wc-shimcssproperties') &&
            {pattern: 'test/wc-shimcssproperties.js', type: 'dom'},
        'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js',
        {pattern: 'test/lit-element_test.js', type: 'module'},
        {pattern: 'test/lit-element_styling_test.js', type: 'module'},
        {pattern: 'test/lib/decorators_test.js', type: 'module'},
        {pattern: 'test/lib/updating-element_test.js', type: 'module'},
        {pattern: 'test/lib/decorators-babel_test.js', type: 'module'}
      ].filter(Boolean),
      customLaunchers,
      logLevel: config.LOG_INFO
    });

    if (runTestsOnBrowserStack) {
      config.set({
        browserStack: {
          username: process.env.BROWSERSTACK_USERNAME,
          accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
          project: 'lit-element'
        },
        browserDisconnectTolerance: 5,
      });
    }

    if (runTestsOnSauce) {
      config.set({
        sauceLabs: {
          testName: 'lit-element unit tests',
          startConnect: typeof process.env.TRAVIS_JOB_NUMBER === 'undefined',
          tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
          idleTimeout: 300,
          build: process.env.TRAVIS_BUILD_NUMBER
        },
        transports: ['polling'],
        browserDisconnectTolerance: 5,
      });
    }

    config.set({reporters});

  } catch (error) {
    console.log('ERROR HAPPENED', error);
    throw 'up';
  }
};

const polyfills = (process.env.POLYFILLS || '').split(',').filter(Boolean);
console.log('\n---\nPOLYFILLS:', polyfills, '\n---');

const browsers = (process.env.KARMA_BROWSERS || '').split(',').filter(Boolean);
const customLaunchers = process.env.KARMA_CUSTOM_LAUNCHERS &&
        JSON.parse(
            existsSync(process.env.KARMA_CUSTOM_LAUNCHERS) ?
                readFileSync(process.env.KARMA_CUSTOM_LAUNCHERS, 'utf-8') :
                process.env.KARMA_CUSTOM_LAUNCHERS) ||
    {};

const runTestsOnBrowserStack = process.env.BROWSERSTACK_USERNAME &&
    process.env.BROWSERSTACK_ACCESS_KEY &&
    Object.keys(customLaunchers)
        .some((name) => customLaunchers[name].base === 'BrowserStack');

const runTestsOnSauce = process.env.SAUCE_USERNAME &&
    process.env.SAUCE_ACCESS_KEY &&
    Object.keys(customLaunchers)
        .some((name) => customLaunchers[name].base === 'SauceLabs');

const reporters = [
  'summary',
  runTestsOnBrowserStack && 'BrowserStack',
  runTestsOnSauce && 'saucelabs'
].filter(Boolean);

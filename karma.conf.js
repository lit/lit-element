module.exports = (config) => {
  const {
    KARMA_LOCAL_BROWSERS,
    KARMA_SAUCE_BROWSERS,
    SAUCE_USERNAME,
    SAUCE_ACCESS_KEY,
    TRAVIS_BUILD_NUMBER,
    TRAVIS_JOB_NUMBER
  } = process.env;

  config.set({
    client: {runInParent: true, mocha: {ui: 'tdd'}},
    frameworks: ['mocha', 'chai', 'source-map-support'],
    files: [
      'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js',
      {pattern: 'test/**/*_test.js', type: 'module'}
    ],
    logLevel: config.LOG_INFO,
    reporters: ['spec']
  });

  const localBrowsers = (KARMA_LOCAL_BROWSERS || '').split(',').filter(Boolean);
  const sauceBrowsers = SAUCE_USERNAME && SAUCE_ACCESS_KEY &&
      parseSauceBrowsers(KARMA_SAUCE_BROWSERS);

  if (localBrowsers.length > 0) {
    console.log('KARMA_LOCAL_BROWSERS defined', KARMA_LOCAL_BROWSERS);
    config.set({browsers: localBrowsers});
  } else if (sauceBrowsers.length > 0) {
    console.log('KARMA_SAUCE_BROWSERS defined', KARMA_SAUCE_BROWSERS);
    const customLaunchers = sauceBrowsers.reduce(
        (customLaunchers, launcher) => Object.assign(
            customLaunchers, {[keyFromValues(launcher)]: launcher}),
        {});
    config.set({
      sauceLabs: {
        testName: 'lit-element unit tests',
        startConnect: typeof TRAVIS_JOB_NUMBER === 'undefined',
        tunnelIdentifier: TRAVIS_JOB_NUMBER,
        idleTimeout: 300,
        build: TRAVIS_BUILD_NUMBER
      },
      transports: ['polling'],
      browserDisconnectTolerance: 3,
      browsers: Object.keys(customLaunchers),
      customLaunchers,
      reporters: ['spec', 'saucelabs']
    });
  }
};

const keyFromValues = (obj) => Object.keys(obj)
                                   .map((key) => obj[key].toString())
                                   .join('_')
                                   .toLowerCase()
                                   .replace(/[^a-z0-9]+/g, '_')
                                   .replace(/^_|_$/g, '');

/**
 * Format of browsersList is:
 * ```
 * windows 7/chrome@35,Android/Browser@4.4:Samsung Galaxy S3
 * Emulator|portrait
 * ```
 */
function parseSauceBrowsers(browsersList) {
  return (browsersList || '')
      .split(',')
      .filter(Boolean)
      .map((sauceBrowserSpec) => {
        const [platform, afterPlatform] =
            sauceBrowserSpec.split('/').filter(Boolean);
        const [browserName, afterBrowserName] =
            (afterPlatform || '').split('@').filter(Boolean);
        const [version, afterVersion] =
            (afterBrowserName || '').split(':').filter(Boolean);
        const [deviceName, deviceOrientation] =
            (afterVersion || '').split('|').filter(Boolean);
        const sauceBrowser =
            {base: 'SauceLabs', browserName, platform, version};
        if (deviceName) {
          Object.assign(sauceBrowser, {deviceName, deviceOrientation});
        }
        return sauceBrowser;
      });
}

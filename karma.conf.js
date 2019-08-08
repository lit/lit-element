module.exports = (config) => {
  // Establish browsers to test by
  config.set({
    client: {runInParent: true, mocha: {ui: 'tdd'}},
    frameworks: ['mocha', 'chai', 'source-map-support'],
    files: [{pattern: 'test/**/*_test.js', type: 'module'}],
    logLevel: config.LOG_DEBUG
  });
  if (localBrowsers.length > 0) {
    config.set({browsers: localBrowsers});
  }
  if (sauceBrowsers.length > 0) {
    config.set({
      sauceLabs: {
        testName: 'lit-element unit tests',
        startConnect: typeof travisJobNumber === 'undefined',
        tunnelIdentifier: travisJobNumber,
        idleTimeout: 300
      },
      transports: ['polling'],
      browserDisconnectTolerance: 3,
      browsers: Object.keys(customLaunchers),
      customLaunchers,
      captureTimeout: 240000,
      browserDisconnectTimeout: 240000,
      reporters: ['spec', 'saucelabs']
    });
  }
};

const travisJobNumber = process.env['TRAVIS_JOB_NUMBER'];

const localBrowsers =
    (process.env['KARMA_LOCAL_BROWSERS'] || '').split(',').filter(Boolean);

/**
 * Format of this ENV variable is:
 *     KARMA_SAUCE_BROWSERS="(,$browserName/$platform@$version(:$deviceName|$deviceOrientation)?)+"
 * Example:
 *     KARMA_SAUCE_BROWSERS="chrome@35/Windows 7,Browser@4.4/Android:Samsung
 * Galaxy S3 Emulator|portrait"
 */
const sauceBrowsers =
    (process.env['SAUCE_USERNAME'] && process.env['SAUCE_ACCESS_KEY'] &&
         process.env['KARMA_SAUCE_BROWSERS'] ||
     '')
        .split(',')
        .filter(Boolean)
        .map((sauceBrowser) => {
          const [browserName, afterBrowserName] =
              sauceBrowser.split('@').filter(Boolean);
          const [version, afterVersion] =
              (afterBrowserName || '').split('/').filter(Boolean);
          const [platform, afterPlatform] =
              (afterVersion || '').split(':').filter(Boolean);
          const [deviceName, deviceOrientation] =
              (afterPlatform || '').split('|').filter(Boolean);
          return {
            base: 'SauceLabs',
            browserName,
            platform,
            version,
            deviceName,
            deviceOrientation
          };
        });

const customLaunchers = sauceBrowsers.reduce(
    (customLaunchers,
     {base, browserName, platform, version, deviceName, deviceOrientation}) => {
      const propertyName =
          [browserName, platform, version, deviceName, deviceOrientation]
              .join('_')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '_')
              .replace(/^_|_$/g, '');
      customLaunchers[propertyName] =
          {base, browserName, platform, version, deviceName, deviceOrientation};
      return customLaunchers;
    },
    {});

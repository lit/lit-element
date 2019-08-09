module.exports = (config) => {
  // Establish browsers to test by
  config.set({
    client: {runInParent: true, mocha: {ui: 'tdd'}},
    frameworks: ['mocha', 'chai', 'source-map-support'],
    files: [{pattern: 'test/**/*_test.js', type: 'module'}],
    logLevel: config.LOG_INFO,
    reporters: ['spec']
  });
  if (localBrowsers.length > 0) {
    console.log(
        'KARMA_LOCAL_BROWSERS defined', process.env['KARMA_LOCAL_BROWSERS']);
    config.set({browsers: localBrowsers});
  } else if (sauceBrowsers.length > 0) {
    console.log(
        'KARMA_SAUCE_BROWSERS defined', process.env['KARMA_SAUCE_BROWSERS']);
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
      reporters: ['spec', 'saucelabs']
    });
  }
};

const travisJobNumber = process.env['TRAVIS_JOB_NUMBER'];

const localBrowsers =
    (process.env['KARMA_LOCAL_BROWSERS'] || '').split(',').filter(Boolean);

/**
 * Format of this ENV variable is:
 *     KARMA_SAUCE_BROWSERS="$platform/$browser@$version(:$deviceName|$deviceOrientation)?"
 * Example:
 *     KARMA_SAUCE_BROWSERS="windows 7/chrome@35,Android/Browser@4.4:Samsung
 * Galaxy S3 Emulator|portrait"
 */
const sauceBrowsers =
    (process.env['SAUCE_USERNAME'] && process.env['SAUCE_ACCESS_KEY'] &&
         process.env['KARMA_SAUCE_BROWSERS'] ||
     '')
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

const customLaunchers = sauceBrowsers.reduce((customLaunchers, launcher) => {
  const propertyName = Object.keys(launcher)
                           .map((key) => launcher[key])
                           .join('_')
                           .toLowerCase()
                           .replace(/[^a-z0-9]+/g, '_')
                           .replace(/^_|_$/g, '');
  customLaunchers[propertyName] = launcher;
  return customLaunchers;
}, {});

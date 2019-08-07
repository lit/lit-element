module.exports = (config) => {
  // Establish browsers to test by
  config.set({
    client: {runInParent: true, mocha: {ui: 'tdd'}},
    frameworks: ['mocha', 'chai', 'source-map-support'],
    browsers: ['Chrome', 'Firefox', 'Safari'],
    files: [{pattern: 'test/**/*_test.js', type: 'module'}]
  })
}

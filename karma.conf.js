module.exports = (config) => {
  config.set({
    client: {runInParent: true, mocha: {ui: 'tdd'}},
    frameworks: ['mocha', 'chai', 'source-map-support'],
    browsers: ['Chrome'],
    files: [
      {pattern: 'test/**/*_test.js', type: 'module'},
      {pattern: 'node_modules/**/*', included: false, watched: false},
      {pattern: 'lit-*.js', included: false},
      {pattern: 'lib/**/*.js.map', included: false},
      {pattern: 'lib/**/*.js', included: false},
      {pattern: 'test/**/*.js.map', included: false},
      {pattern: 'test/**/*.js', included: false}
    ]
  })
}

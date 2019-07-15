module.exports = (config) => {
  config.set({
    client: {runInParent: true, mocha: {ui: 'tdd'}},
    frameworks: ['mocha', 'chai', 'source-map-support'],
    browsers: ['Chrome','Firefox','Safari'],
    files: [
      {pattern: 'test/**/*_test.js', type: 'module'},
      {pattern: 'lit-*.js', included: false},
      {pattern: 'lib/**/*.js.map', included: false},
      {pattern: 'lib/**/*.js', included: false},
      {pattern: 'test/**/*.js.map', included: false},
      {pattern: 'test/**/*.js', included: false}
    ]
  })
}

module.exports = config => {
  config.set({
    files: [
      {
        pattern: 'providers/**/*.js',
        mutated: true,
        included: true
      },
      {
        pattern: '**/*.mustache',
        mutated: false,
        included: false
      },
      {
        pattern: '**/*.pug',
        mutated: false,
        included: false
      },
      {
        pattern: 'src/**/*.js',
        mutated: true,
        included: true
      },
      'test/**/*.js'
    ],
    testRunner: 'mocha',
    mutator: 'javascript',
    transpilers: [],
    reporter: ['html', 'clear-text', 'progress'],
    testFramework: 'mocha',
    coverageAnalysis: 'perTest'
  })
}

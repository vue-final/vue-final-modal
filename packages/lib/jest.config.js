module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**', '!src/utils/bodyScrollLock.js', '!src/utils/focusTrap.js'],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.js$': 'babel-jest'
  },
  testEnvironment: 'jest-environment-jsdom-fifteen'
}

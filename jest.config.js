module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['lib/**', '!lib/utils/bodyScrollLock.js', '!lib/utils/focusTrap.js'],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
    '.*\\.(js)$': 'babel-jest'
  }
}

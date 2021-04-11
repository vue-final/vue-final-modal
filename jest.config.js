module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['lib/**', '!lib/utils/bodyScrollLock.js', '!lib/utils/focusTrap.js'],
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
    '.*\\.(js)$': 'babel-jest'
  }
}

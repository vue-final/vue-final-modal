module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['lib/**', '!lib/utils/**'],
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.js$': 'babel-jest'
  },
  testEnvironment: 'jest-environment-jsdom-fifteen'
}

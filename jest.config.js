module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/no-babel',
  collectCoverage: true,
  collectCoverageFrom: ['lib/**', '!lib/utils/bodyScrollLock.js', '!lib/utils/focusTrap.js']
}

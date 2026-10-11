# Changelog

# [0.4.0](https://github.com/hunterliu1003/vue-use-template/compare/0.3.3...0.4.0) (2026-10-07)

### Bug Fixes

* tell an outlet mounted again apart from hydration ([5b8e72c](https://github.com/hunterliu1003/vue-use-template/commit/5b8e72c9d943ca4218468cda1eb7fb80b3b5b481))

### Features

* let a server that defines window say so with markServer() ([e63b041](https://github.com/hunterliu1003/vue-use-template/commit/e63b041cd04d6d35abe9c0a81e99311b8b033e9f))
* report from useTemplate() whether show() will be ignored ([c1e591c](https://github.com/hunterliu1003/vue-use-template/commit/c1e591cdc6bbb00a98b1ba7611e0a7a8a490d570))

## [0.3.3](https://github.com/hunterliu1003/vue-use-template/compare/0.3.2...0.3.3) (2026-10-07)

### Bug Fixes

* ignore show() in app.runWithContext() on servers that polyfill window ([b16a55c](https://github.com/hunterliu1003/vue-use-template/commit/b16a55cda88c075b00accf2a601d43a99c5746c3))

## [0.3.2](https://github.com/hunterliu1003/vue-use-template/compare/0.3.1...0.3.2) (2026-10-07)

### Bug Fixes

* hold back only templates the server ignored while hydrating ([89a84bc](https://github.com/hunterliu1003/vue-use-template/commit/89a84bc5b4789e36cd66ab35135fc2eddab1feb6))

## [0.3.1](https://github.com/hunterliu1003/vue-use-template/compare/0.3.0...0.3.1) (2026-10-07)

### Bug Fixes

* hydrate templates shown outside components without a mismatch ([7998db3](https://github.com/hunterliu1003/vue-use-template/commit/7998db3e86170eb425fdfa5d91917360eaec115d))
* ignore show() outside components on servers that polyfill window ([00ef56e](https://github.com/hunterliu1003/vue-use-template/commit/00ef56e9eb00959a82670e1dfb579b54751533be))

# [0.3.0](https://github.com/hunterliu1003/vue-use-template/compare/0.2.0...0.3.0) (2026-10-06)

### Features

* installable template states and createInstanceResolver ([7eca249](https://github.com/hunterliu1003/vue-use-template/commit/7eca249fde9630b579327013abba1241fbce91d4))

# [0.2.0](https://github.com/hunterliu1003/vue-use-template/compare/0.1.1...0.2.0) (2026-10-05)


### Bug Fixes

* do not call a function passed to isTemplate ([bde3071](https://github.com/hunterliu1003/vue-use-template/commit/bde3071e8f687c2d173827d81fb94cef95573263))
* raise the vue peer range to >=3.3.0 ([67616ef](https://github.com/hunterliu1003/vue-use-template/commit/67616ef97aa79e0ab6adf108d167252a2f65fc20))


### Features

* warn in development when show() is ignored on the server ([b753ca8](https://github.com/hunterliu1003/vue-use-template/commit/b753ca8f2e31639fe50a5442692aee3abb23bc78))

## [0.1.1](https://github.com/hunterliu1003/vue-use-template/compare/0.1.0...0.1.1) (2026-10-05)


### Bug Fixes

* apply attrs, props and emits given as a getter ([5e4b2a9](https://github.com/hunterliu1003/vue-use-template/commit/5e4b2a9202b90e254af2579c13ae21201bf7fe61))
* render functional component slots instead of an empty comment ([aa3a509](https://github.com/hunterliu1003/vue-use-template/commit/aa3a509ea8fc7f3a0fcb982d569d3ca9bfec11d3))

# [0.1.0](https://github.com/hunterliu1003/vue-use-template/compare/0.0.6...0.1.0) (2026-10-05)


### Bug Fixes

* keep hideOnUnmounted on by default when only some options are passed ([bee8bc1](https://github.com/hunterliu1003/vue-use-template/commit/bee8bc1f355af3f921822087ade30686851120d5))
* tell server renders apart by SSR context instead of window ([7041751](https://github.com/hunterliu1003/vue-use-template/commit/70417519e6946145891eacc2a361b1f9af4c98cd))


### Features

* isolate templates per SSR render so they never leak across requests ([9a21f37](https://github.com/hunterliu1003/vue-use-template/commit/9a21f37615ef5770636d92258e20899ef6527812))
* render templates shown during setup into the server HTML ([d27eb62](https://github.com/hunterliu1003/vue-use-template/commit/d27eb62662138eb4849fd8cd7ac0f0cae7f881ea))


### Performance Improvements

* let bundlers drop the default provider when only the template helpers are imported ([4e7452b](https://github.com/hunterliu1003/vue-use-template/commit/4e7452bf4961203d6ecca40895daa86420201bd9))
* stop re-rendering open templates without slots when another one opens ([014331c](https://github.com/hunterliu1003/vue-use-template/commit/014331ceac5d3afc6238f991b8702626c2ee8985))

## [0.0.6](https://github.com/hunterliu1003/vue-use-template/compare/0.0.4...0.0.6) (2024-10-22)


### Features

* do not support SSR ([a1a41cf](https://github.com/hunterliu1003/vue-use-template/commit/a1a41cf07f7c6886519470f12b9d14e742b16f7e))

## [0.0.4](https://github.com/hunterliu1003/vue-use-template/compare/0.0.3...0.0.4) (2024-10-13)


### Features

* createTemplateProvider ([6d58a65](https://github.com/hunterliu1003/vue-use-template/commit/6d58a656af0b925a19b0c3839d1203e000f92b59))

## [0.0.3](https://github.com/hunterliu1003/vue-use-template/compare/0.0.2...0.0.3) (2024-03-27)


### Features

* Allow to pass a ref, reactive, computed object as a parameter to useTemplate() and add test cases ([4accf74](https://github.com/hunterliu1003/vue-use-template/commit/4accf74ce7775ac4b5ac7e2cbe71267cb80ce116))

## [0.0.2](https://github.com/hunterliu1003/vue-use-template/compare/0.0.1...0.0.2) (2024-03-26)


### Features

* export mergeTemplateAttrs ([3089ae6](https://github.com/hunterliu1003/vue-use-template/commit/3089ae6c4c0e7f62a345a5dea2a58fa53b02de19))

## [0.0.1](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0...0.0.1) (2024-03-26)


### Bug Fixes

* ReferenceError: Cannot access 'vNodeFn' before initialization ([1fe51d3](https://github.com/hunterliu1003/vue-use-template/commit/1fe51d3fbe316ddd7173c974f40ed070758f5a08))

# [0.0.0](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.11...0.0.0) (2024-03-26)

# [0.0.0-beta.11](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.10...0.0.0-beta.11) (2024-03-17)


### Features

* export useProvider ([3eb90d6](https://github.com/hunterliu1003/vue-use-template/commit/3eb90d6681a640dc3dbb1d0bfc8fb3d3e8523015))

# [0.0.0-beta.10](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.9...0.0.0-beta.10) (2024-03-17)


### Features

* export templateToVNodeFn, isTemplate ([7849986](https://github.com/hunterliu1003/vue-use-template/commit/7849986b4ffc0d61a9d94ed2a9dddfdbd22d44ba))

# [0.0.0-beta.9](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.8...0.0.0-beta.9) (2024-03-17)


### Features

* add showByDefault option to useTemplate ([6477756](https://github.com/hunterliu1003/vue-use-template/commit/64777563c917a3c84208f2e888008a732bcff410))

# [0.0.0-beta.8](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.7...0.0.0-beta.8) (2024-03-17)

# [0.0.0-beta.7](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.6...0.0.0-beta.7) (2024-03-15)

# [0.0.0-beta.6](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.5...0.0.0-beta.6) (2024-02-22)


### Features

* 1. useTemplate support attrs, props, emits with ref, reactive, computed object 2. rename options.onUnmounted to options.hideOnUnmounted 3. add more test cases ([e1fa815](https://github.com/hunterliu1003/vue-use-template/commit/e1fa81528bdd2589f83182eb93b80ad21e953fed))

# [0.0.0-beta.5](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.4...0.0.0-beta.5) (2024-02-14)


### Features

* nuxt 3 ([56ea1c8](https://github.com/hunterliu1003/vue-use-template/commit/56ea1c83886005b8d49e6880f954825750c16547))

# [0.0.0-beta.4](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.3...0.0.0-beta.4) (2024-02-14)

# [0.0.0-beta.3](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.2...0.0.0-beta.3) (2024-02-14)

# [0.0.0-beta.2](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.1...0.0.0-beta.2) (2024-02-14)


### Bug Fixes

* export types ([576f901](https://github.com/hunterliu1003/vue-use-template/commit/576f9013c86a2a1219d307687375b5bb5ed3571f))

# [0.0.0-beta.1](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.0...0.0.0-beta.1) (2024-02-14)


### Bug Fixes

* types path ([517a357](https://github.com/hunterliu1003/vue-use-template/commit/517a35745a768e38ca2c596e84d98859db89a6d2))

# 0.0.0-beta.0 (2024-02-14)


### Features

* vue-use-template ([ed30218](https://github.com/hunterliu1003/vue-use-template/commit/ed30218450f2e741d255ff7cbc91be0cbee7bc07))



# [4.0.0](https://github.com/vue-final/vue-final-modal/compare/v4.0.0-rc.14...v4.0.0) (2023-02-03)

# [4.0.0-rc.14](https://github.com/vue-final/vue-final-modal/compare/v4.0.0-rc.13...v4.0.0-rc.14) (2023-02-03)

- Support props including `swipe-to-close`, `threshold`, `showSwipeBanner`, `preventNavigationGestures`
- Support slot `swipe-banner`
- Delete `ModalFullscreen` and `ModalBottom` 
- Add built-in support transition names including: `'vfm-fade' | 'vfm-slide-down' | 'vfm-slide-up' | 'vfm-slide-right' | 'vfm-slide-left'`
- The default value of `contentTransition` and `overlayTransition` are changed to `undefined`
- Improve autocompletion for contentTransition and overlayTransition

# [4.0.0-rc.13](https://github.com/vue-final/vue-final-modal/compare/v4.0.0-rc.12...v4.0.0-rc.13) (2023-01-29)


### Bug Fixes

* patchOptions fix ([0805410](https://github.com/vue-final/vue-final-modal/commit/0805410e1af4f42f8d676effa68cdfbf31ad97c2))

# [4.0.0-rc.12](https://github.com/vue-final/vue-final-modal/compare/v4.0.0-rc.11...v4.0.0-rc.12) (2023-01-27)


### Features

* improve `patchOptions` implement ([#310](https://github.com/vue-final/vue-final-modal/issues/310)) ([216222b](https://github.com/vue-final/vue-final-modal/commit/216222be6f4b0281fc8f91afd98d357bb355a1a6))
* improve useModal type ([#311](https://github.com/vue-final/vue-final-modal/issues/311)) ([668a77b](https://github.com/vue-final/vue-final-modal/commit/668a77b4093bf284f3c26b0eb77f7cc4d1be6fc6))

# [4.0.0-rc.11](https://github.com/vue-final/vue-final-modal/compare/v4.0.0-rc.10...v4.0.0-rc.11) (2023-01-18)


### Bug Fixes

* get rid of side effect ([b0cda9f](https://github.com/vue-final/vue-final-modal/commit/b0cda9f1e406a9248b540871df40faec4b9c6575))
* patchOptions should withMarkRaw and its options should be Partial of UseModalOptions ([a63857e](https://github.com/vue-final/vue-final-modal/commit/a63857ebd7d7252d941e6ce3a8e6d04616932753))

# [4.0.0-rc.10](https://github.com/vue-final/vue-final-modal/compare/v4.0.0-rc.9...v4.0.0-rc.10) (2023-01-17)


### Bug Fixes

* not use destructure syntax ([f285e33](https://github.com/vue-final/vue-final-modal/commit/f285e3334ef4f3811e648523d2f06b40c260451e))
* **nuxt module:** fixed @vue-final-modal/nuxt module ([cc4dc22](https://github.com/vue-final/vue-final-modal/commit/cc4dc225d9693a116e0917eeb616dc971caeeef5))
* use shallowRef instead of ref ([8fb0908](https://github.com/vue-final/vue-final-modal/commit/8fb090871a06c8be94e82267bf538dd0bfa88dfe))


### Features

* **nuxt:** bump @vue-final-modal/nuxt module to nuxt 3 latest ([21e592d](https://github.com/vue-final/vue-final-modal/commit/21e592d7ff799bc545bd8264035a9fd9cc0c3c6e))

# [4.0.0-rc.9](https://github.com/vue-final/vue-final-modal/compare/v4.0.0-rc.8...v4.0.0-rc.9) (2023-01-17)


### Bug Fixes

* bring back CodeBlockFile component ([8633f26](https://github.com/vue-final/vue-final-modal/commit/8633f268431bbca9f2189c92147a31468d6967f8))
* defaultModelValue should be optional ([87f6e01](https://github.com/vue-final/vue-final-modal/commit/87f6e01d5a626ada9823aff60593461073c6e7bc))
* nuxt rc to 3.0 ([156f88d](https://github.com/vue-final/vue-final-modal/commit/156f88d299e664dda2bd6f4b2d5d5c20cfb0d793))
* update docs to nuxt 3 ([f5c2f9b](https://github.com/vue-final/vue-final-modal/commit/f5c2f9b9298f0a4c0a0cb676802ecd2c37be3678))

# [4.0.0-rc.8](https://github.com/vue-final/vue-final-modal/compare/v4.0.0-rc.7...v4.0.0-rc.8) (2023-01-14)


### Bug Fixes

* avoid mount before modal open ([#306](https://github.com/vue-final/vue-final-modal/issues/306)) ([17760b6](https://github.com/vue-final/vue-final-modal/commit/17760b6a9745864fa3cb447413326c87ea2cf00b))


### Features

* `useModal()` slots allow passing components directly ([502ced1](https://github.com/vue-final/vue-final-modal/commit/502ced11b8068f30bc697e153953583b33d71926))
* allow useModal options to pass defaultModelValue ([655457e](https://github.com/vue-final/vue-final-modal/commit/655457e9e6e719b8f9dc015e92d69a537408ce3a))

# [4.0.0-rc.7](https://github.com/vue-final/vue-final-modal/compare/v4.0.0-rc.6...v4.0.0-rc.7) (2023-01-10)


### Bug Fixes

* **types:** append declare module ([68d9a55](https://github.com/vue-final/vue-final-modal/commit/68d9a5523a21fef12e631991dc9134715ef4084d))

# [4.0.0-rc.6](https://github.com/vue-final/vue-final-modal/compare/v4.0.0-rc.5...v4.0.0-rc.6) (2023-01-10)

# [4.0.0-rc.5](https://github.com/vue-final/vue-final-modal/compare/v4.0.0-rc.4...v4.0.0-rc.5) (2022-12-26)


### Bug Fixes

* script name ([a37e09c](https://github.com/vue-final/vue-final-modal/commit/a37e09c4b88773ba0500476b1734b03b84c505d0))

# [4.0.0-rc.4](https://github.com/vue-final/vue-final-modal/compare/v4.0.0-rc.3...v4.0.0-rc.4) (2022-12-26)

# [4.0.0-rc.3](https://github.com/vue-final/vue-final-modal/compare/v4.0.0-rc.2...v4.0.0-rc.3) (2022-12-26)


### Bug Fixes

* fixed resolvedClosed error and resolvedOpened error in internalVfm ([16e556b](https://github.com/vue-final/vue-final-modal/commit/16e556b0062135321d466e53ea6500cb32ee3b3f))

# [4.0.0-rc.2](https://github.com/vue-final/vue-final-modal/compare/v4.0.0-rc.1...v4.0.0-rc.2) (2022-11-16)


### Bug Fixes

* delete postinstall ([2b6ae71](https://github.com/vue-final/vue-final-modal/commit/2b6ae7173370b456b2e38a3d11f8056bf61c53d5))

# [4.0.0-rc.1](https://github.com/vue-final/vue-final-modal/compare/v4.0.0-rc.0...v4.0.0-rc.1) (2022-11-15)

### Features

* [#274](https://github.com/vue-final/vue-final-modal/issues/274) improve DOM architecture of VFullscreen, VBottomSheet ([eebfa97](https://github.com/vue-final/vue-final-modal/commit/eebfa9721bb76a27c3928e3f6bac1ac1a65a6c6c))
* add context property to useModal()'s options ([2b2fa92](https://github.com/vue-final/vue-final-modal/commit/2b2fa921bff75ef64ea61e7184add9c410777c2f))
* nuxt module ([6ec6393](https://github.com/vue-final/vue-final-modal/commit/6ec6393f7bbfd8f098c0685fcbc78153762c5df1))

# [4.0.0-rc.0](https://github.com/vue-final/vue-final-modal/compare/v4.0.0-beta.3...v4.0.0-rc.0) (2022-11-01)

## BREAKING CHANGE

vue-final-modal 4.0 introduced a lot of breaking changes. You should treat 4.x as a different library and read the documentation carefully.

### [Documentation](https://v4.vue-final-modal.org/)
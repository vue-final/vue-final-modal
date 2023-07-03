

## [4.4.4](https://github.com/vue-final/vue-final-modal/compare/v4.4.3...v4.4.4) (2023-07-03)


### Features

* **modal:** Add support for reserveScrollBarGap prop ([#376](https://github.com/vue-final/vue-final-modal/issues/376)) ([96830ae](https://github.com/vue-final/vue-final-modal/commit/96830aec0c3de44ab96ca342cd71f51a0fe8fd18))

## [4.4.3](https://github.com/vue-final/vue-final-modal/compare/v4.4.2...v4.4.3) (2023-06-29)


### Bug Fixes

* [#375](https://github.com/vue-final/vue-final-modal/issues/375) ([4b1ca52](https://github.com/vue-final/vue-final-modal/commit/4b1ca5235ba84ab25307589f8b013af1921ad2df))

## [4.4.2](https://github.com/vue-final/vue-final-modal/compare/v4.4.1...v4.4.2) (2023-04-24)


### Bug Fixes

* add dependencies ([ebe9732](https://github.com/vue-final/vue-final-modal/commit/ebe97324a49277eb0c7edaab7dfb4e2aa4099aaa))

## [4.4.1](https://github.com/vue-final/vue-final-modal/compare/v4.4.0...v4.4.1) (2023-04-24)


### Bug Fixes

* set vue version >=3.2.0 ([5d93903](https://github.com/vue-final/vue-final-modal/commit/5d9390393826f92d819bfe0455310b3d494ef311))

# [4.4.0](https://github.com/vue-final/vue-final-modal/compare/v4.3.1...v4.4.0) (2023-04-24)


### Bug Fixes

* vue should be a peer dependency ([607e145](https://github.com/vue-final/vue-final-modal/commit/607e145428c73450579dd24f773061c19f0bde02))
* when displayDirective="show", should not run onEntering() and onEnter() if visible is false ([e8ae92f](https://github.com/vue-final/vue-final-modal/commit/e8ae92fc38dde8fd3a1d400cb18b9ab0b87b1618))

## [4.3.1](https://github.com/vue-final/vue-final-modal/compare/v4.3.0...v4.3.1) (2023-04-17)


### Bug Fixes

* resolve the error caused by VueUse removing `isString` ([#359](https://github.com/vue-final/vue-final-modal/issues/359)) ([85f52a3](https://github.com/vue-final/vue-final-modal/commit/85f52a3466dfa692991de20ac6cdf88923ed1c69))

# [4.3.0](https://github.com/vue-final/vue-final-modal/compare/v4.2.0...v4.3.0) (2023-04-12)


### Features

* support  value of displayDirective ([509a405](https://github.com/vue-final/vue-final-modal/commit/509a405e21de5fbc8c331a7d42cd09b1b43f82ff))

# [4.2.0](https://github.com/vue-final/vue-final-modal/compare/v4.1.4...v4.2.0) (2023-04-04)


### Bug Fixes

* make sure SSR still work ([c134d8a](https://github.com/vue-final/vue-final-modal/commit/c134d8ae55c7285de7e300ce4450c6ead317fc16))


### Features

* get rid of context and made useModal can be execute everywhere ([47cf520](https://github.com/vue-final/vue-final-modal/commit/47cf5208f973c2b7a3e645bf2fba32e72a894c11))

## [4.1.4](https://github.com/vue-final/vue-final-modal/compare/v4.1.3...v4.1.4) (2023-03-31)


### Bug Fixes

* should not disableBodyScroll when modelValueLocal is false ([c5eab4f](https://github.com/vue-final/vue-final-modal/commit/c5eab4ffe2677bbcaa32fe8312712f02123a8ac4))

## [4.1.3](https://github.com/vue-final/vue-final-modal/compare/v4.1.2...v4.1.3) (2023-03-31)


### Bug Fixes

* [#352](https://github.com/vue-final/vue-final-modal/issues/352) ([2d9298c](https://github.com/vue-final/vue-final-modal/commit/2d9298c0d24dd58041e8b79f4d83f398123fe4d8))

## [4.1.2](https://github.com/vue-final/vue-final-modal/compare/v4.1.1...v4.1.2) (2023-03-30)


### Bug Fixes

* execute setActiveVfm on createVfm() ([c7a6090](https://github.com/vue-final/vue-final-modal/commit/c7a60905d99b61530eb627158a66d9e7b3962e4f))

## [4.1.1](https://github.com/vue-final/vue-final-modal/compare/v4.1.0...v4.1.1) (2023-03-28)


### Bug Fixes

* syntax ([f1ffd64](https://github.com/vue-final/vue-final-modal/commit/f1ffd649c5391a1b805cf98390fbb021bea77fc3))

# [4.1.0](https://github.com/vue-final/vue-final-modal/compare/v4.0.11...v4.1.0) (2023-03-28)


### Bug Fixes

* **transition:** only set transition appear when displayDirective is set to `if`, because of the focusTrap should be activated until the modal transition end ([7e38512](https://github.com/vue-final/vue-final-modal/commit/7e38512e0f52bc530c2694b45b805aef702f3a96))
* type ([c820c02](https://github.com/vue-final/vue-final-modal/commit/c820c0221b94fc4ce4e7dc3114ff2fb6faeccea8))


### Features

* Add activeVfm (inspire by pinia), so we don't need to pass down `vfm` instance anymore. We can use `useVfm()` and `useModal()` out of setup script ([8ee2021](https://github.com/vue-final/vue-final-modal/commit/8ee2021adc5e97fdcb626c79824c4e8090dcf7c0))
* Destroy dynamic modal onClosed by default and add `keepAlive` option for keeping modal instance alive after `modal.close()` ([f2cb5bf](https://github.com/vue-final/vue-final-modal/commit/f2cb5bf58d0ba6248018621b079d0e0e7037c472))

## [4.0.11](https://github.com/vue-final/vue-final-modal/compare/v4.0.10...v4.0.11) (2023-03-08)


### Bug Fixes

* fixed animation of swipe to close ([81ff204](https://github.com/vue-final/vue-final-modal/commit/81ff2043ada6918779ec4b2fb682dc459fc489d2))
* should focus vfmContent element when click outside ([503c1f1](https://github.com/vue-final/vue-final-modal/commit/503c1f1d27b3eb631c720d8dd920c9c3f801152f))

## [4.0.10](https://github.com/vue-final/vue-final-modal/compare/v4.0.9...v4.0.10) (2023-03-07)


### Bug Fixes

* fixed focusTrap in nested modals ([#341](https://github.com/vue-final/vue-final-modal/issues/341)) ([8c7b7b5](https://github.com/vue-final/vue-final-modal/commit/8c7b7b512cb0f6b1886b28cf727dfc265b2cc050))

## [4.0.9](https://github.com/vue-final/vue-final-modal/compare/v4.0.8...v4.0.9) (2023-03-02)


### Bug Fixes

* fixed focus, blur and disableBodyScroll timing ([4cfc8b9](https://github.com/vue-final/vue-final-modal/commit/4cfc8b94e7b98bd7d3d81301c62f553737cc4448))

## [4.0.8](https://github.com/vue-final/vue-final-modal/compare/v4.0.7...v4.0.8) (2023-03-02)


### Bug Fixes

* fixed focusTrap ([9173014](https://github.com/vue-final/vue-final-modal/commit/917301426b21a8770a7074ba22b9b3e944f92967))

## [4.0.7](https://github.com/vue-final/vue-final-modal/compare/v4.0.6...v4.0.7) (2023-03-01)


### Bug Fixes

* add package information and MIT license ([41e9a7e](https://github.com/vue-final/vue-final-modal/commit/41e9a7e988e5ec39549024de8f09c16650ac7404))
* make sure the overlay closed ([3899876](https://github.com/vue-final/vue-final-modal/commit/38998767a43ae6493e56a09f63975e2879c41dab))

## [4.0.6](https://github.com/vue-final/vue-final-modal/compare/v4.0.5...v4.0.6) (2023-02-28)


### Bug Fixes

* fixed zIndex calculation logic ([#335](https://github.com/vue-final/vue-final-modal/issues/335)) ([b28eacb](https://github.com/vue-final/vue-final-modal/commit/b28eacbc66874462fa64c6569bd16efa26cb8ac5))

## [4.0.5](https://github.com/vue-final/vue-final-modal/compare/v4.0.4...v4.0.5) (2023-02-27)


### Features

* update `z-index` after state changes ([#334](https://github.com/vue-final/vue-final-modal/issues/334)) ([86216b3](https://github.com/vue-final/vue-final-modal/commit/86216b30dd8c4c4e893c0c0777e22734be5a8b79))

## [4.0.4](https://github.com/vue-final/vue-final-modal/compare/v4.0.3...v4.0.4) (2023-02-14)


### Bug Fixes

* TouchEvent not supported in Safari [#329](https://github.com/vue-final/vue-final-modal/issues/329) ([#330](https://github.com/vue-final/vue-final-modal/issues/330)) ([dddb928](https://github.com/vue-final/vue-final-modal/commit/dddb9284f7be3b1aa4f4adb8a18d19135d3b5c8c))

## [4.0.3](https://github.com/vue-final/vue-final-modal/compare/v4.0.2...v4.0.3) (2023-02-10)


### Bug Fixes

* export useModalSlot ([69a0bfe](https://github.com/vue-final/vue-final-modal/commit/69a0bfeb0609bc85fd363180790fb4f982ad1a1f))

## [4.0.2](https://github.com/vue-final/vue-final-modal/compare/v4.0.1...v4.0.2) (2023-02-10)


### Bug Fixes

* should display type error when using `useModal()` [#323](https://github.com/vue-final/vue-final-modal/issues/323) ([#324](https://github.com/vue-final/vue-final-modal/issues/324)) ([2b9f2bb](https://github.com/vue-final/vue-final-modal/commit/2b9f2bb99444732e93e54ccd440d873ef249ede8))

## [4.0.1](https://github.com/vue-final/vue-final-modal/compare/v4.0.0...v4.0.1) (2023-02-08)


### Bug Fixes

* fixed built-in transition style ([a7fb444](https://github.com/vue-final/vue-final-modal/commit/a7fb44488f9fad0ebae46d1dca11fbc8b1cf3479))


### Features

* ability to use `<VueFinalModal />` without register `createVfm()` plugin ([#320](https://github.com/vue-final/vue-final-modal/issues/320)) ([68600b7](https://github.com/vue-final/vue-final-modal/commit/68600b70221a236939eac1f4f6c60c4a45ff0b74))

# [4.0.0](https://github.com/vue-final/vue-final-modal/compare/v4.0.0-rc.14...v4.0.0) (2023-02-03)

## Vue Final Modal 4 🚀

### [Documentation](https://vue-final-modal.org/)

### [Migration Guide](https://vue-final-modal.org/get-started/guide/migration-guide)

vue-final-modal 4.0 introduced a lot of breaking changes. You should treat 4.x as a different library and read the documentation carefully.

### 🚀 Features

- Providing the `useModal` composable function
- Supporting Nuxt 3 SSR
- Rewritten with TS for a better DX
- Support new props including `swipe-to-close`, `threshold`, `showSwipeBanner`, `preventNavigationGestures`
- Support slot `swipe-banner`
- Add built-in support transition names including: `'vfm-fade' | 'vfm-slide-down' | 'vfm-slide-up' | 'vfm-slide-right' | 'vfm-slide-left'`


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
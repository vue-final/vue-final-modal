# Changelog

# [5.0.0-rc.0](https://github.com/vue-final/vue-final-modal/compare/v5.0.0-beta.14...v5.0.0-rc.0) (2026-10-16)

# [5.0.0-beta.14](https://github.com/vue-final/vue-final-modal/compare/v5.0.0-beta.13...v5.0.0-beta.14) (2026-10-14)

### Bug Fixes

* **vue-final-modal:** keep the status in place when beforeOpen or beforeClose stops it ([b9d45b1](https://github.com/vue-final/vue-final-modal/commit/b9d45b191fe13800983f2480f658ac1f7433b444))

# [5.0.0-beta.13](https://github.com/vue-final/vue-final-modal/compare/v5.0.0-beta.12...v5.0.0-beta.13) (2026-10-14)

### Bug Fixes

* **vue-final-modal:** report the closed status once ([7a370c9](https://github.com/vue-final/vue-final-modal/commit/7a370c912a0db9cd3b39799e65337076a101e1dd))
* **vue-final-modal:** track presses from when a vfm is created ([a5a3d1a](https://github.com/vue-final/vue-final-modal/commit/a5a3d1a3829760929aa89e52ced10d70ce6f6718))

# [5.0.0-beta.12](https://github.com/vue-final/vue-final-modal/compare/v5.0.0-beta.11...v5.0.0-beta.12) (2026-10-14)

### Bug Fixes

* **vue-final-modal:** keep a press that comes before the previous click's timer ([22932b0](https://github.com/vue-final/vue-final-modal/commit/22932b0a009dec446e81dc65645e6519f5ba9938))

# [5.0.0-beta.11](https://github.com/vue-final/vue-final-modal/compare/v5.0.0-beta.10...v5.0.0-beta.11) (2026-10-14)

### Bug Fixes

* **vue-use-template:** keep props optional for a component without types ([1badf62](https://github.com/vue-final/vue-final-modal/commit/1badf6256736c0a03379dedbd3e361c48199a33e))
* **vue-use-template:** take a component a function is generic over again ([23fb13a](https://github.com/vue-final/vue-final-modal/commit/23fb13a7fa15c4fbf2e694bf6063b3dc9640f1f0))

### Features

* **vue-final-modal:** type the open and close results and expose the status ([54ef24a](https://github.com/vue-final/vue-final-modal/commit/54ef24af3575db89d56075141143b2a7ea5f3d4d))

# [5.0.0-beta.10](https://github.com/vue-final/vue-final-modal/compare/v5.0.0-beta.9...v5.0.0-beta.10) (2026-10-14)

### Bug Fixes

* **vue-final-modal:** give the focus back along the modals that opened each other ([557249b](https://github.com/vue-final/vue-final-modal/commit/557249b1acc93cf4d96a3cf7faa74d9cb8e1e5d0))
* **vue-final-modal:** keep a kept-alive VueFinalDialog clean, and quiet once unmounted ([97fdef7](https://github.com/vue-final/vue-final-modal/commit/97fdef7b4ad3329f317c25cd548572778e89dae3))
* **vue-final-modal:** record the pressed button as the opener of a modal ([d85d463](https://github.com/vue-final/vue-final-modal/commit/d85d463029f7fc3cb85a1cc1bbdeca6d4fe3f479))
* **vue-final-modal:** settle once when the transitions end within the patch ([5101b7e](https://github.com/vue-final/vue-final-modal/commit/5101b7e52e4353a744d7b1f158611f7eefb26670))
* **vue-final-modal:** skip on the server a modal created outside a component ([59c9c91](https://github.com/vue-final/vue-final-modal/commit/59c9c91144aaad12419b4074069c4f594dd78a41))
* **vue-final-modal:** swipe to close after a mouse drag from the swipe banner ([df820ba](https://github.com/vue-final/vue-final-modal/commit/df820ba646fcf58b036ce26050e8e10a83c4cf41))

### Features

* **vue-final-modal:** type the required props of useModal() across attrs and props ([8c2be49](https://github.com/vue-final/vue-final-modal/commit/8c2be490a45868f403d52ab73902677a08461b0b))

# [5.0.0-beta.9](https://github.com/vue-final/vue-final-modal/compare/v5.0.0-beta.8...v5.0.0-beta.9) (2026-10-13)

### Bug Fixes

* **vue-final-modal:** declare the native cancel and close events of VueFinalDialog ([beb8147](https://github.com/vue-final/vue-final-modal/commit/beb8147037afff76c16be357c839cd3bb34b3107))
* **vue-final-modal:** emit closed while the leaving modal is still rendered ([9399d21](https://github.com/vue-final/vue-final-modal/commit/9399d219edf7713bff82fc3f3ecb55bdf58b2741))
* **vue-final-modal:** skip the deferred lifecycle hooks of an unmounted component ([d6767d5](https://github.com/vue-final/vue-final-modal/commit/d6767d54afdb08672eb5ecc08437a2c568cef3b1))

### Features

* **vue-final-modal:** add VueFinalDialog and useModalLifecycle ([7e113b8](https://github.com/vue-final/vue-final-modal/commit/7e113b85a5fc35c158a38e4c06657bbbb21c6cbb))
* **vue-final-modal:** render a VueFinalModal opened over a VueFinalDialog inside it ([061ddda](https://github.com/vue-final/vue-final-modal/commit/061ddda3ad8c7380dfa886a50277bbde16a089fd))

# [5.0.0-beta.8](https://github.com/vue-final/vue-final-modal/compare/v5.0.0-beta.7...v5.0.0-beta.8) (2026-10-13)

### Bug Fixes

* ModalsContainer does not inherit attrs ([89002a2](https://github.com/vue-final/vue-final-modal/commit/89002a2e7f99c8efb674cb68762be825d4088987)), closes [#454](https://github.com/vue-final/vue-final-modal/issues/454) [#453](https://github.com/vue-final/vue-final-modal/issues/453)
* narrow template slots with isTemplate() ([c0df0bb](https://github.com/vue-final/vue-final-modal/commit/c0df0bb889e403d1f7420f8f0fea5572750364a5))
* useModal() attrs accept a ref per prop again ([6ea5fec](https://github.com/vue-final/vue-final-modal/commit/6ea5fec6e405d78ae7a42f1e7b03e4338bed2007)), closes [#464](https://github.com/vue-final/vue-final-modal/issues/464) [#468](https://github.com/vue-final/vue-final-modal/issues/468)
* useModal() slots accept a ref or computed again ([d54bcb6](https://github.com/vue-final/vue-final-modal/commit/d54bcb69b0f3cb5a2bbdfe8c18898c47c55247df)), closes [#437](https://github.com/vue-final/vue-final-modal/issues/437)
* **vue-final-modal:** drop a modal closed before it renders ([5864ffc](https://github.com/vue-final/vue-final-modal/commit/5864ffc3cc576f1a9261ad079d7de3bc80c24561))
* **vue-final-modal:** end a swipe that is released outside the modal ([0368720](https://github.com/vue-final/vue-final-modal/commit/03687206f939ea72f7a3bf5a92fa1e8eb4dbbac4))
* **vue-final-modal:** keep trapping focus when initialFocus matches nothing ([b89155f](https://github.com/vue-final/vue-final-modal/commit/b89155fc0d6a10dbacf686b7d6914a7d2cec198f))
* **vue-final-modal:** let clicks pass through a modal while it leaves ([6a9d3d1](https://github.com/vue-final/vue-final-modal/commit/6a9d3d1f7acb7e23870b27a5411d58ec2f412114))
* **vue-final-modal:** list the events VueFinalModal emits where lint sees them ([29a823b](https://github.com/vue-final/vue-final-modal/commit/29a823b9e2a3ad4ed6ce052f6ddcdcada5b12eae))
* **vue-final-modal:** swipe to close while text outside the modal is selected ([a8c47f4](https://github.com/vue-final/vue-final-modal/commit/a8c47f41566e0da42da618b4594c6ff466f2a933))

# [5.0.0-beta.7](https://github.com/vue-final/vue-final-modal/compare/v5.0.0-beta.6...v5.0.0-beta.7) (2026-10-11)

# [5.0.0-beta.6](https://github.com/vue-final/vue-final-modal/compare/v5.0.0-beta.5...v5.0.0-beta.6) (2026-10-10)


### Bug Fixes

* [#424](https://github.com/vue-final/vue-final-modal/issues/424) ([f2a86b9](https://github.com/vue-final/vue-final-modal/commit/f2a86b9eaa1114f3cbe7a8fb8bc6c0666e984bcf))
* also lock the scroll container a modal is rendered in ([7300e21](https://github.com/vue-final/vue-final-modal/commit/7300e21c1e26615f38ea3478a7ec4f83cd67f96c))
* apply useModal props and emits given as a getter ([4ce8b9b](https://github.com/vue-final/vue-final-modal/commit/4ce8b9ba2fa5bb938e6bfcfa58603a3090b59bb5))
* drop a modal that unmounts while open from the overlay registry ([3745b2a](https://github.com/vue-final/vue-final-modal/commit/3745b2a9e96ef4de769058b4638988e9706d5b53))
* finish opening a modal whose overlay is hidden while it fades in ([4757c7e](https://github.com/vue-final/vue-final-modal/commit/4757c7e5c3ae92e8e43e77bf5e62873f7282d3b6))
* give an inline overflow-y back to the scroll container on close ([ba520f7](https://github.com/vue-final/vue-final-modal/commit/ba520f72e8b55d32397c17a694beda57dd09afd3))
* hydrate a server-rendered open modal already open, with its z-index ([6c0431b](https://github.com/vue-final/vue-final-modal/commit/6c0431badfc1e77e9701c2017cd83269e5925dda))
* import defineNuxtPlugin from #imports in the Nuxt runtime plugin ([a286093](https://github.com/vue-final/vue-final-modal/commit/a2860934219663102f2a823ed83aff563c6357e4))
* keep a scroll container two modals share locked for the last one ([05bd227](https://github.com/vue-final/vue-final-modal/commit/05bd227f368a83b5c83c05926f0b804871b552c5))
* keep the internal events out of VueFinalModalEmits ([b4f4e61](https://github.com/vue-final/vue-final-modal/commit/b4f4e613d4b9646a0a2ab3be8b7c79186ef3158e))
* keep UseModal's model value wiring over the user's props and emits ([44bf483](https://github.com/vue-final/vue-final-modal/commit/44bf483267efe106d6bded5bb0543fa104eacb1e))
* keep what a server render registers per request ([691036a](https://github.com/vue-final/vue-final-modal/commit/691036a54b49827aeddaa35b2adfcc2505eed309))
* leave Escape to escToClose instead of focus-trap's escapeDeactivates ([cfad77f](https://github.com/vue-final/vue-final-modal/commit/cfad77fa3a71f8c59ea96b28eb7037c20decaf5b))
* let the overlay and the content transitions finish independently ([b59d51c](https://github.com/vue-final/vue-final-modal/commit/b59d51c94bcee2b9cdfcfa3cfd2b2782e3c714ea))
* make the UMD build usable from a CDN ([8d9f802](https://github.com/vue-final/vue-final-modal/commit/8d9f802b046c09a6878636882fcffa4f054b2ed7))
* merge the focusTrap prop over vfm's own focus-trap defaults ([19c5ac6](https://github.com/vue-final/vue-final-modal/commit/19c5ac61b7ed122e20f6c34c3f62a97e2b22f501))
* NestedModal example still used the removed useModal second argument ([a5c0d6d](https://github.com/vue-final/vue-final-modal/commit/a5c0d6de44870dfebb4c0f071a8c5d0ab4cc5681))
* never activate the focus trap of a modal closed before its first frame ([ceeaae1](https://github.com/vue-final/vue-final-modal/commit/ceeaae17cd1ebb9b9fb6f9ac19427b4995341022))
* order the runtime plugin imports for import/order ([b543b5c](https://github.com/vue-final/vue-final-modal/commit/b543b5c88ec69c32576bf421062013f6433300ad))
* raise the vue peer range to >=3.3.0 ([223609b](https://github.com/vue-final/vue-final-modal/commit/223609b718b80d7085d0e3499b64366fec40f76c))
* render modals opened during setup into the server HTML ([c10b4d1](https://github.com/vue-final/vue-final-modal/commit/c10b4d1b8ab0429bc4ccd0451f94f3f4b55e0515))
* resolve open() right away when the modal was created during a server render ([2c78352](https://github.com/vue-final/vue-final-modal/commit/2c783525ca1abbd1f8a0afad68f9694d68a096b6))
* resolve vfm.open() and vfm.close() right away when nothing changes ([6a0b428](https://github.com/vue-final/vue-final-modal/commit/6a0b42814c7a8698a4dfc1d7eeca2cef400512ef))
* resolve vfm.open(), close() and toggle() with the right result ([357d693](https://github.com/vue-final/vue-final-modal/commit/357d693d6beaa4f77e01c005567147c4898184d1))
* settle open() and close() when beforeOpen or beforeClose stops them ([001a08d](https://github.com/vue-final/vue-final-modal/commit/001a08deaf1cc8d95927d0a55be17c86503e21d4))
* settle pending promises when a modal is destroyed mid-transition ([2e93ad8](https://github.com/vue-final/vue-final-modal/commit/2e93ad8a80757672ab04bb894ddb890c1691c10b))
* settle promises of a modal that is closed before it finished opening ([02f821c](https://github.com/vue-final/vue-final-modal/commit/02f821c5bd3efa242a8c08f416925e5248b48e1d))
* settle the open() or close() promise that another close or open overtook ([9773238](https://github.com/vue-final/vue-final-modal/commit/9773238a84efd11e3b099b33cae33c76695c4ef1))
* show a modal opened outside a component once the app has mounted ([6c01748](https://github.com/vue-final/vue-final-modal/commit/6c017486dd2c848c643eec1c87396c2e74a68d48))
* skip a modal on the server through useTemplate().ignored ([add3410](https://github.com/vue-final/vue-final-modal/commit/add3410f6335c17c183781c74d87d040b7050b48))
* tell a server that polyfills window apart with isBrowser() ([c0840b7](https://github.com/vue-final/vue-final-modal/commit/c0840b7430c4bcd8f9ee1601aa9edee7aaf64764))
* tell hydration apart from a vnode mounted again on the client ([c554587](https://github.com/vue-final/vue-final-modal/commit/c554587455e9189cf734dd1a182b928a53e1f01b))
* type the Nuxt runtime plugins instead of leaving them any ([03eed01](https://github.com/vue-final/vue-final-modal/commit/03eed010163f9054e66a6db77f21cb95f7374f97))
* warn instead of throwing when open() runs outside any app context on the server ([652eba6](https://github.com/vue-final/vue-final-modal/commit/652eba6ec98270c204d798e1f5b5122574744fc8))


### Features

* auto-import the components and composables in Nuxt ([c002fd9](https://github.com/vue-final/vue-final-modal/commit/c002fd9c99c585ab8e9436cfa7c65c1a7d107f96))
* export markServer from vue-final-modal ([84a54a1](https://github.com/vue-final/vue-final-modal/commit/84a54a1ae8c027c5ad95c719adb5e7cced9c48b6))
* mark the Nuxt server for vue-use-template ([8cf9145](https://github.com/vue-final/vue-final-modal/commit/8cf9145dceca512a41136ee178ae97ef64b3c12d))
* ship the Nuxt module as vue-final-modal/nuxt ([0606ef4](https://github.com/vue-final/vue-final-modal/commit/0606ef4e97f1bf186af7247853a48eb4f0f7229c))


### Performance Improvements

* stop re-rendering open modals when another modal opens or closes ([1bcd945](https://github.com/vue-final/vue-final-modal/commit/1bcd9451c641683004fbc86c58d56817742d01cb))

# [5.0.0-beta.5](https://github.com/vue-final/vue-final-modal/compare/v5.0.0-beta.4...v5.0.0-beta.5) (2024-01-31)

# [5.0.0-beta.4](https://github.com/vue-final/vue-final-modal/compare/v5.0.0-beta.3...v5.0.0-beta.4) (2024-01-30)

# [5.0.0-beta.3](https://github.com/vue-final/vue-final-modal/compare/v5.0.0-beta.2...v5.0.0-beta.3) (2024-01-30)

# [5.0.0-beta.2](https://github.com/vue-final/vue-final-modal/compare/v5.0.0-beta.1...v5.0.0-beta.2) (2024-01-11)

# [5.0.0-beta.1](https://github.com/vue-final/vue-final-modal/compare/v5.0.0-beta.0...v5.0.0-beta.1) (2024-01-11)

# [5.0.0-beta.0](https://github.com/vue-final/vue-final-modal/compare/v4.5.3...v5.0.0-beta.0) (2024-01-11)

### Features

* replace body-scroll-lock with scroll-lock [#403](https://github.com/vue-final/vue-final-modal/issues/403) ([a9a2e8a](https://github.com/vue-final/vue-final-modal/commit/a9a2e8a7794c6d9c67eb7650a74f6894b2b558b0))

## [4.5.3](https://github.com/vue-final/vue-final-modal/compare/v4.5.2...v4.5.3) (2023-12-15)

## [4.5.2](https://github.com/vue-final/vue-final-modal/compare/v4.5.1...v4.5.2) (2023-12-15)


### Bug Fixes

* export Component helper type ([b0b7427](https://github.com/vue-final/vue-final-modal/commit/b0b7427c1b71a1c80dc132635f1d16e6258df414))

## [4.5.1](https://github.com/vue-final/vue-final-modal/compare/v4.5.0...v4.5.1) (2023-12-15)


### Bug Fixes

* fix type of function byPassAllModalEvents ([53e1812](https://github.com/vue-final/vue-final-modal/commit/53e18128a80fe6d2fae679eed04f67c3f1852e88))
* fixed type ComponentEmit ([fec4f47](https://github.com/vue-final/vue-final-modal/commit/fec4f4786f568d313d35728c2dea1960a0ee6338))


### Features

* **type:** support auto completion for the useModal slots with type ComponentSlots ([7db7267](https://github.com/vue-final/vue-final-modal/commit/7db72675e08bd4f88b5186c80e6b643ed968f2a8))

# [4.5.0](https://github.com/vue-final/vue-final-modal/compare/v4.4.6...v4.5.0) (2023-12-07)


### Bug Fixes

* [#390](https://github.com/vue-final/vue-final-modal/issues/390) ([7ac758b](https://github.com/vue-final/vue-final-modal/commit/7ac758bd908f1e9342e1d3cda824bd531fc97cb7))
* bump deps ([9e4645a](https://github.com/vue-final/vue-final-modal/commit/9e4645aadb9f6f9c478335c263c79b941975df6a))
* **deps:** fix nuxt module deps ([dad15e2](https://github.com/vue-final/vue-final-modal/commit/dad15e28537a051b58d15a7af16358eb80da2432))
* fixed generic component type in useModal composable ([8304d63](https://github.com/vue-final/vue-final-modal/commit/8304d63dd2bcfb37fa990da92a72477e05cd92b5))
* overlayBehavior ([eeaa41b](https://github.com/vue-final/vue-final-modal/commit/eeaa41b35e0d5b0612d9dd8222f823b2d71325eb))
* setModelValueLocal and add StopEvent example ([a060fae](https://github.com/vue-final/vue-final-modal/commit/a060fae53d2c4bce87e873dd534a641e803ba933))


### Features

* add `stop()` for `[@before](https://github.com/before)Open` and `beforeClose` event [#367](https://github.com/vue-final/vue-final-modal/issues/367) ([bbd4786](https://github.com/vue-final/vue-final-modal/commit/bbd4786b7e7fcd00ba000cc18bd8fc6ac69e95e4))
* add close function to defineSlots ([e6ed697](https://github.com/vue-final/vue-final-modal/commit/e6ed6979a4ec381e250a53dd75455e37b6c1b1d5))
* add overlayBehavior prop to VueFinalModal [#405](https://github.com/vue-final/vue-final-modal/issues/405) ([dafa559](https://github.com/vue-final/vue-final-modal/commit/dafa559d7dcf2f17c8bd76dbf55c08126e400554))


### Performance Improvements

* use getter and setter instead of `computed` for `modelValueLocal` ([fc67d94](https://github.com/vue-final/vue-final-modal/commit/fc67d945ad744d665ce5bdecbe2337e7a1861a09))

## [4.4.6](https://github.com/vue-final/vue-final-modal/compare/v4.4.5...v4.4.6) (2023-11-08)


### Bug Fixes

* import nuxt composables from #imports ([#398](https://github.com/vue-final/vue-final-modal/issues/398)) ([cafb367](https://github.com/vue-final/vue-final-modal/commit/cafb3677a02e8da6bb40d9ee7da55a8c83d8ddb2))
* chore(deps): keep vue as peer dependency ([#396](https://github.com/vue-final/vue-final-modal/pull/396))
* maintain dependencies ([#399](https://github.com/vue-final/vue-final-modal/pull/399))


### Features

* Repaint the vfm logo ([72317a0](https://github.com/vue-final/vue-final-modal/commit/72317a0c78b8420afcbb93228f7dc8c07d11150b))

## [4.4.5](https://github.com/vue-final/vue-final-modal/compare/v4.4.4...v4.4.5) (2023-07-27)

### Bug Fixes

* [#380](https://github.com/vue-final/vue-final-modal/issues/380) ([45703e9](https://github.com/vue-final/vue-final-modal/commit/45703e9bd443aac7f9dac4954a776958f0eac89c))

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

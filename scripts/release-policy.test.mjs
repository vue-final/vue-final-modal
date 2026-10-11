import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { packageFromTag, planRelease, registryUrl } from './release-policy.mjs'

const vfmRegistry = {
  distTags: { latest: '4.5.5', beta: '5.0.0-beta.6' },
  versions: ['4.5.5', '5.0.0-beta.5', '5.0.0-beta.6'],
}

describe('planRelease', () => {
  it('publishes a prerelease under its own id, never latest', () => {
    assert.deepEqual(planRelease({ name: 'vue-final-modal', version: '5.0.0-beta.7', registry: vfmRegistry }), {
      name: 'vue-final-modal',
      dir: 'packages/vue-final-modal',
      version: '5.0.0-beta.7',
      distTag: 'beta',
      prerelease: true,
      tag: 'v5.0.0-beta.7',
      githubLatest: false,
      title: 'Release 5.0.0-beta.7',
    })
  })

  it('refuses a stable release that starts a new major on latest unless the version is typed again', () => {
    assert.throws(() => planRelease({ name: 'vue-final-modal', version: '5.0.0', registry: vfmRegistry }), /confirm/)
    assert.throws(() => planRelease({ name: 'vue-final-modal', version: '5.0.0', confirm: '5.0.0-beta.7', registry: vfmRegistry }), /confirm/)
    assert.equal(planRelease({ name: 'vue-final-modal', version: '5.0.0', confirm: '5.0.0', registry: vfmRegistry }).distTag, 'latest')
  })

  it('marks only a stable vue-final-modal release as the latest GitHub release', () => {
    assert.equal(planRelease({ name: 'vue-final-modal', version: '5.0.0', confirm: '5.0.0', registry: vfmRegistry }).githubLatest, true)
    assert.equal(planRelease({ name: 'vue-use-template', version: '0.4.1', registry: { distTags: { latest: '0.4.0' }, versions: ['0.4.0'] } }).githubLatest, false)
  })

  it('refuses a version that is already published, even when confirmed', () => {
    assert.throws(() => planRelease({ name: 'vue-final-modal', version: '5.0.0-beta.6', confirm: '5.0.0-beta.6', registry: vfmRegistry }), /already published/)
  })

  it('publishes a stable release within the current major without confirmation', () => {
    assert.deepEqual(planRelease({ name: 'vue-use-template', version: '0.4.1', registry: { distTags: { latest: '0.4.0' }, versions: ['0.4.0'] } }), {
      name: 'vue-use-template',
      dir: 'packages/vue-use-template',
      version: '0.4.1',
      distTag: 'latest',
      prerelease: false,
      tag: 'vue-use-template@0.4.1',
      githubLatest: false,
      title: 'vue-use-template 0.4.1',
    })
  })

  it('refuses to move a dist-tag back unless confirmed', () => {
    const registry = { distTags: { latest: '0.4.0' }, versions: ['0.3.0', '0.4.0'] }
    assert.throws(() => planRelease({ name: 'vue-use-template', version: '0.3.9', registry }), /back/)
    assert.equal(planRelease({ name: 'vue-use-template', version: '0.3.9', confirm: '0.3.9', registry }).distTag, 'latest')
  })

  it('needs confirmation for the first stable release of a package', () => {
    assert.throws(() => planRelease({ name: '@hunterliu/scroll-lock', version: '1.0.0', registry: { distTags: {}, versions: [] } }), /confirm/)
  })

  it('names scroll-lock tags after the scoped package', () => {
    const plan = planRelease({ name: '@hunterliu/scroll-lock', version: '0.0.10', registry: { distTags: { latest: '0.0.9' }, versions: ['0.0.9'] } })
    assert.equal(plan.tag, '@hunterliu/scroll-lock@0.0.10')
    assert.equal(plan.dir, 'packages/scroll-lock')
  })

  it('refuses a prerelease id that is not a word, or that is latest', () => {
    assert.throws(() => planRelease({ name: 'vue-final-modal', version: '5.0.0-1', registry: vfmRegistry }), /prerelease id/)
    assert.throws(() => planRelease({ name: 'vue-final-modal', version: '5.0.0-latest.1', registry: vfmRegistry }), /prerelease id/)
  })

  it('refuses a version that is not plain semver', () => {
    assert.throws(() => planRelease({ name: 'vue-final-modal', version: 'v5.0.0-beta.7', registry: vfmRegistry }), /version/)
    assert.throws(() => planRelease({ name: 'vue-final-modal', version: '5.0', registry: vfmRegistry }), /version/)
  })

  it('refuses a package it does not release', () => {
    assert.throws(() => planRelease({ name: 'vue', version: '3.6.0', registry: vfmRegistry }), /package/)
  })
})

describe('packageFromTag', () => {
  it('reads the package and version back from each tag format', () => {
    assert.deepEqual(packageFromTag('v5.0.0-beta.7'), { name: 'vue-final-modal', version: '5.0.0-beta.7' })
    assert.deepEqual(packageFromTag('vue-use-template@0.4.1'), { name: 'vue-use-template', version: '0.4.1' })
    assert.deepEqual(packageFromTag('@hunterliu/scroll-lock@0.0.10'), { name: '@hunterliu/scroll-lock', version: '0.0.10' })
  })

  it('refuses a tag of no package it releases', () => {
    assert.throws(() => packageFromTag('foo@1.0.0'), /tag/)
  })
})

describe('registryUrl', () => {
  it('encodes the whole package name into one path segment', () => {
    assert.equal(registryUrl('@hunterliu/scroll-lock'), 'https://registry.npmjs.org/%40hunterliu%2Fscroll-lock')
  })

  it('refuses a package it does not release before building a URL', () => {
    assert.throws(() => registryUrl('@hunterliu/scroll-lock/../../x'), /package/)
  })
})

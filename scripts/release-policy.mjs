import { appendFileSync, readFileSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import semver from 'semver'

const PACKAGES = {
  'vue-final-modal': {
    dir: 'packages/vue-final-modal',
    tagPrefix: 'v',
    githubLatest: true,
    title: version => `Release ${version}`,
  },
  'vue-use-template': {
    dir: 'packages/vue-use-template',
    tagPrefix: 'vue-use-template@',
    githubLatest: false,
    title: version => `vue-use-template ${version}`,
  },
  '@hunterliu/scroll-lock': {
    dir: 'packages/scroll-lock',
    tagPrefix: '@hunterliu/scroll-lock@',
    githubLatest: false,
    title: version => `@hunterliu/scroll-lock ${version}`,
  },
}

/**
 * Decides where a version is published, and refuses one that would spend a version number by mistake:
 * npm never takes a published version again, even after an unpublish.
 */
export function planRelease({ name, version, confirm, registry }) {
  const pkg = PACKAGES[name]
  if (!pkg)
    throw new Error(`No package named ${name} is released from this repo`)
  if (semver.valid(version) !== version)
    throw new Error(`${version} is not a version such as 5.0.0-beta.7`)
  if (registry.versions.includes(version))
    throw new Error(`${name}@${version} is already published`)

  const prereleaseIds = semver.prerelease(version)
  const distTag = prereleaseIds ? prereleaseIds[0] : 'latest'
  if (prereleaseIds && (typeof distTag !== 'string' || !/^[a-z]+$/.test(distTag) || distTag === 'latest'))
    throw new Error(`The prerelease id of ${version} must be a word such as beta or rc, other than latest`)

  const current = registry.distTags[distTag]
  const reasons = []
  if (!prereleaseIds && (!current || semver.major(version) > semver.major(current)))
    reasons.push(`it starts major ${semver.major(version)} on latest`)
  if (current && semver.lte(version, current))
    reasons.push(`it moves ${distTag} back from ${current}`)
  if (reasons.length > 0 && confirm !== version)
    throw new Error(`${name}@${version} needs confirm set to ${version}, since ${reasons.join(' and ')}`)

  return {
    name,
    dir: pkg.dir,
    version,
    distTag,
    prerelease: Boolean(prereleaseIds),
    tag: `${pkg.tagPrefix}${version}`,
    githubLatest: pkg.githubLatest && !prereleaseIds,
    title: pkg.title(version),
  }
}

export function packageFromTag(tag) {
  for (const [name, { tagPrefix }] of Object.entries(PACKAGES)) {
    const version = tag.slice(tagPrefix.length)
    if (tag.startsWith(tagPrefix) && semver.valid(version) === version)
      return { name, version }
  }
  throw new Error(`${tag} is not a release tag of this repo`)
}

async function fetchRegistry(name) {
  const response = await fetch(`https://registry.npmjs.org/${name.replace('/', '%2f')}`, {
    headers: { accept: 'application/vnd.npm.install-v1+json' },
  })
  if (response.status === 404)
    return { distTags: {}, versions: [] }
  if (!response.ok)
    throw new Error(`The npm registry answered ${response.status} for ${name}`)
  const packument = await response.json()
  return { distTags: packument['dist-tags'] ?? {}, versions: Object.keys(packument.versions ?? {}) }
}

function report(plan) {
  process.stdout.write(`${plan.name}@${plan.version}: npm dist-tag ${plan.distTag}, git tag ${plan.tag}\n`)
  if (!process.env.GITHUB_OUTPUT)
    return
  const outputs = {
    name: plan.name,
    dir: plan.dir,
    version: plan.version,
    dist_tag: plan.distTag,
    prerelease: plan.prerelease,
    tag: plan.tag,
    github_latest: plan.githubLatest,
    title: plan.title,
  }
  appendFileSync(process.env.GITHUB_OUTPUT, Object.entries(outputs).map(([key, value]) => `${key}=${value}\n`).join(''))
}

async function check(name, version) {
  report(planRelease({ name, version, confirm: process.env.RELEASE_CONFIRM, registry: await fetchRegistry(name) }))
}

/** Run on the tag: the tag, the package.json it points at and the dispatch inputs must all name the same release. */
async function publish(tag) {
  const { name, version } = packageFromTag(tag)
  const manifest = JSON.parse(readFileSync(`${PACKAGES[name].dir}/package.json`, 'utf8'))
  if (manifest.name !== name || manifest.version !== version)
    throw new Error(`${tag} points at ${manifest.name}@${manifest.version}`)
  const { RELEASE_PACKAGE, RELEASE_VERSION } = process.env
  if ((RELEASE_PACKAGE && RELEASE_PACKAGE !== name) || (RELEASE_VERSION && RELEASE_VERSION !== version))
    throw new Error(`${tag} does not match the inputs ${RELEASE_PACKAGE}@${RELEASE_VERSION}`)
  await check(name, version)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [command, ...args] = process.argv.slice(2)
  const commands = { check, publish }
  try {
    if (!commands[command])
      throw new Error('Usage: release-policy.mjs check <package> <version> | publish <tag>')
    await commands[command](...args)
  }
  catch (error) {
    process.stderr.write(`${error.message}\n`)
    process.exitCode = 1
  }
}

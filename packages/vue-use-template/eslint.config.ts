import antfu from '@antfu/eslint-config'

export default antfu({
  /** The pnpm rules would add settings such as shellEmulator and trustPolicy to pnpm-workspace.yaml, changing how pnpm runs scripts and resolves packages. */
  pnpm: false,
})

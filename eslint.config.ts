import antfu from '@antfu/eslint-config'

export default antfu(
  {
    /** The pnpm rules would add settings such as shellEmulator and trustPolicy to pnpm-workspace.yaml, changing how pnpm runs scripts and resolves packages. */
    pnpm: false,
    ignores: [
      'packages/scroll-lock',
      /** MDC, not Markdown: the markdown rules would turn slot lines such as `#title` into headings. */
      'docs/content/**/*.md',
    ],
  },
  {
    rules: {
      'ts/consistent-type-definitions': 'off',
    },
  },
  {
    files: ['viteplay/**'],
    rules: {
      'no-console': 'off',
      'no-alert': 'off',
    },
  },
)

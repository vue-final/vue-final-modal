import unjs from "eslint-config-unjs";

export default unjs({
  ignores: ["docs/.vitepress/cache/**", "docs/.vitepress/dist/**"],
  rules: {
    // rule overrides
  },
  markdown: {
    rules: {
      // markdown rule overrides
    },
  },
});

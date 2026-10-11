import Tailwind from "@tailwindcss/vite";
import { defineConfig } from "vitepress";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "@hunterliu/scroll-lock",
  description:
    "A lightweight, SSR-safe scroll locking library with reference counting support. Perfect for modals, dialogs, and overlays that need to prevent background scrolling.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide" },
      { text: "API", link: "/api" },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/hunterliu1003/scroll-lock" },
    ],
  },
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin);
    },
  },
  vite: {
    plugins: [Tailwind()],
  },
});

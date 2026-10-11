---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "@hunterliu/scroll-lock"
  tagline: A lightweight, SSR-safe scroll locking library with reference counting support.
  actions:
    - theme: brand
      text: Get Started
      link: /guide
    - theme: alt
      text: Github
      link: https://github.com/hunterliu1003/scroll-lock

features:
  - title: 🔒 Reference counting
    details: Multiple locks on the same element work properly
  - title: 🌐 SSR-safe
    details: Works seamlessly in server-side rendering environments
  - title: 🎯 Multiple targets
    details: Lock body, or any HTMLElement
  - title: 📱 iOS support
    details: Cancels touch scrolling on iOS, except inside elements that can still scroll
  - title: 📏 Scrollbar gap
    details: Optionally keeps the layout still when the scrollbar disappears
  - title: 🧩 Isolated instances
    details: createScrollLock() gives a library or widget its own lock registry
  - title: 🔧 TypeScript
    details: Full type safety out of the box
  - title: ⚡ Lightweight
    details: Minimal bundle size with zero dependencies
---

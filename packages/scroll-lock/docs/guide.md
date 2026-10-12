<script setup>
import ScrollLockTargetQueue from './components/ScrollLockTargetQueue.vue';
import ScrollLockBody from './components/ScrollLockBody.vue';
import ScrollLockClearAll from './components/ScrollLockClearAll.vue';
</script>

# Guide

Complete guide to using `@hunterliu/scroll-lock` for preventing unwanted scrolling in web applications.

## Installation

```sh
npm install @hunterliu/scroll-lock
```

## Quick Start

The simplest way to lock and unlock scrolling:

```ts
import {
  lockScroll,
  unlockScroll,
  isScrollLocked,
} from "@hunterliu/scroll-lock";

lockScroll(document.body);

console.log(isScrollLocked(document.body)); // true

unlockScroll(document.body);
```

## Basic Examples

### Locking Body Scroll

:::tabs
== Example
<ScrollLockBody />
== Code

```ts
import {
  lockScroll,
  unlockScroll,
  isScrollLocked,
} from "@hunterliu/scroll-lock";

lockScroll(document.body);

const isLocked = isScrollLocked(document.body);

unlockScroll(document.body);
```

:::

### Locking Custom Element Scroll

:::tabs
== Example
<ScrollLockTargetQueue />
== Code

```ts
import {
  lockScroll,
  unlockScroll,
  isScrollLocked,
} from "@hunterliu/scroll-lock";

const element = document.querySelector(".scrollable-element");

lockScroll(element);

unlockScroll(element);

unlockScroll(element, { force: true });
```

:::

### Keeping the Layout Still

When the scrollbar disappears, the page content shifts by its width. Pass `reserveScrollBarGap` to keep that room while the target is locked. The body gets the width as `padding-right`. Any other element keeps a stable `scrollbar-gutter` where the browser supports it, and otherwise gets the width as padding on its scrollbar's side, the left for a right-to-left element. Nothing is added when the gutter is already stable.

```ts
import { lockScroll, unlockScroll } from "@hunterliu/scroll-lock";

lockScroll(document.body, { reserveScrollBarGap: true });

unlockScroll(document.body);
```

### Style Written Over a Lock

A framework that re-renders a locked element's style binding writes over the lock. The lock watches the element's `style` attribute, takes the values written as the ones to give back on unlock, and applies itself again before the next paint. The scrollbar gap is put back when the write removed it; a gap someone else wrote, such as another lock's, is left as it is.

### iOS

iOS ignores `overflow: hidden` on the page, so on iOS a lock cancels `touchmove` on the locked element instead. An element below it that can still scroll in the direction of the finger, vertically or horizontally, keeps scrolling, so a list or carousel inside a modal works as usual while the page behind it stays put. Multi-touch gestures are never cancelled.

### Clear All Locks

:::tabs
== Example
<ScrollLockClearAll />
== Code

```ts
import { clearAllScrollLocks } from "@hunterliu/scroll-lock";

// Immediately unlock all targets
clearAllScrollLocks();
```

:::

### Isolated Instances

The functions exported from the package share one lock registry. `createScrollLock()` returns the same functions bound to a registry of their own, so a library or widget can count and clear its locks without touching the ones the app made:

```ts
import { createScrollLock, lockScroll } from "@hunterliu/scroll-lock";

const drawerLocks = createScrollLock();
const drawer = document.querySelector<HTMLElement>(".drawer");

lockScroll(document.body);
drawerLocks.lockScroll(drawer);

// Unlocks the drawer, body stays locked
drawerLocks.clearAllScrollLocks();
```

Instances do not know about each other, so lock a given element through one instance only.

For complete API documentation, see the [API Reference](/api).

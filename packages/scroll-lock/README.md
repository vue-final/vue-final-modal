# @hunterliu/scroll-lock

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/@hunterliu/scroll-lock?color=yellow)](https://npmjs.com/package/@hunterliu/scroll-lock)
[![npm downloads](https://img.shields.io/npm/dm/@hunterliu/scroll-lock?color=yellow)](https://npm.chart.dev/@hunterliu/scroll-lock)

<!-- /automd -->

A lightweight, SSR-safe scroll locking library with reference counting support. Perfect for modals, dialogs, and overlays that need to prevent background scrolling.

## Features

- 🔒 **Reference counting** - Multiple locks on the same element work properly
- 🌐 **SSR-safe** - Works seamlessly in server-side rendering environments
- 🎯 **Multiple targets** - Lock body, documentElement, or any HTMLElement
- 📱 **iOS support** - Cancels touch scrolling on iOS, except inside elements that can still scroll
- 📏 **Scrollbar gap** - Optionally keeps the layout still when the scrollbar disappears
- 🧩 **Isolated instances** - `createScrollLock()` gives a library or widget its own lock registry
- 🔧 **TypeScript** - Full type safety out of the box
- ⚡ **Lightweight** - Minimal bundle size with zero dependencies
- 🧹 **Clean restoration** - Properly restores original overflow styles

## Installation

```sh
# ✨ Auto-detect (supports npm, yarn, pnpm, deno and bun)
npx nypm install @hunterliu/scroll-lock
```

## Basic Usage

```ts
import {
  lockScroll,
  unlockScroll,
  isScrollLocked,
} from "@hunterliu/scroll-lock";

// Lock body scroll (default target)
lockScroll(document.body);

// Check if scroll is locked
console.log(isScrollLocked(document.body)); // true

// Unlock body scroll
unlockScroll(document.body);

console.log(isScrollLocked(document.body)); // false
```

## Reference Counting

The library uses reference counting, so multiple `lockScroll()` calls require the same number of `unlockScroll()` calls:

```ts
lockScroll(document.body); // count: 1
lockScroll(document.body); // count: 2

unlockScroll(document.body); // count: 1 - still locked
unlockScroll(document.body); // count: 0 - now unlocked
```

## Custom Targets

Lock scroll on specific elements:

```ts
const modal = document.querySelector(".modal");

// Lock specific element
lockScroll(modal);

// Check if scroll is locked
console.log(isScrollLocked(modal)); // true

// Unlock with same target
unlockScroll(modal);
```

## Force Unlock

Bypass reference counting with force unlock:

```ts
lockScroll(document.body); // count: 1
lockScroll(document.body); // count: 2

// Force unlock ignores count
unlockScroll(document.body, { force: true }); // immediately unlocked
```

## Scrollbar Gap

When the scrollbar of a locked element disappears, its content shifts by the scrollbar's width. `reserveScrollBarGap` keeps that room for the duration of the lock. The body gets the width as `padding-right`. Any other element keeps a stable `scrollbar-gutter` where the browser supports it, and otherwise gets the width as padding on its scrollbar's side, the left for a right-to-left element. Nothing is added when the gutter is already stable.

```ts
lockScroll(document.body, { reserveScrollBarGap: true });
// body gets padding-right: <current padding> + <scrollbar width>

unlockScroll(document.body);
// padding-right is restored
```

The gap is reserved by the first lock and restored by the last unlock, so nested locks never add it twice.

## iOS

iOS ignores `overflow: hidden` on the page, so on iOS a lock cancels `touchmove` on the locked element instead. Touches inside an element that can still scroll in the direction of the finger, vertically or horizontally, are left alone, so lists and carousels inside a modal keep scrolling without rubber-banding the page behind it. Multi-touch gestures such as pinch to zoom are never cancelled.

## Clear All Locks

Reset all scroll locks across all targets:

```ts
import { clearAllScrollLocks } from "@hunterliu/scroll-lock";

// Lock multiple targets
lockScroll(document.body);
lockScroll(document.querySelector(".modal"));
lockScroll(document.querySelector(".sidebar"));

// Clear everything
clearAllScrollLocks(); // all targets unlocked
```

## Isolated Instances

The functions exported from the package share one lock registry. `createScrollLock()` returns the same functions bound to a registry of their own, so a library or widget can count and clear its locks without touching the ones the app made:

```ts
import { createScrollLock, lockScroll } from "@hunterliu/scroll-lock";

const drawerLocks = createScrollLock();
const drawer = document.querySelector<HTMLElement>(".drawer");

lockScroll(document.body); // the app's own lock
drawerLocks.lockScroll(drawer);

drawerLocks.clearAllScrollLocks(); // unlocks the drawer, body stays locked
```

Instances do not know about each other, so lock a given element through one instance only: when two instances lock the same element, one releasing it can make it scrollable while the other still counts it as locked.

## API Reference

### `lockScroll(target, options?)`

Lock scroll on target element.

```typescript
function lockScroll(
  target: ScrollLockTarget,
  options?: LockScrollOptions,
): LockState | undefined;
```

**Parameters:**

- `target: ScrollLockTarget` - Element to lock (defaults to `document.body` if `null`/`undefined`)
- `options?: LockScrollOptions` - Optional configuration object
  - `reserveScrollBarGap?: boolean` - Keep the room of the disappearing scrollbar, see [Scrollbar Gap](#scrollbar-gap) (default: `false`)

**Returns:**

- `LockState | undefined` - The lock state object, or `undefined` if not in browser environment

### `unlockScroll(target, options?)`

Unlock scroll on target element.

```typescript
function unlockScroll(
  target: ScrollLockTarget,
  options?: {
    force?: boolean;
  },
): LockState | undefined;
```

**Parameters:**

- `target: ScrollLockTarget` - Element to unlock (defaults to `document.body` if `null`/`undefined`)
- `options?` - Optional configuration object
  - `force?: boolean` - Bypass reference counting (default: `false`)

**Returns:**

- `LockState | undefined` - The lock state object, or `undefined` if not in browser environment

### `isScrollLocked(target)`

Check if target is currently locked.

```typescript
function isScrollLocked(target: ScrollLockTarget): boolean;
```

**Parameters:**

- `target: ScrollLockTarget` - Element to check (defaults to `document.body` if `null`/`undefined`)

**Returns:**

- `boolean` - `true` if the element is locked, `false` otherwise

### `clearAllScrollLocks()`

Clear all scroll locks on all targets.

```typescript
function clearAllScrollLocks(): void;
```

### `createScrollLock()`

Create an isolated instance with its own lock registry.

```typescript
function createScrollLock(): {
  lockScroll: typeof lockScroll;
  unlockScroll: typeof unlockScroll;
  isScrollLocked: typeof isScrollLocked;
  clearAllScrollLocks: typeof clearAllScrollLocks;
  lockStateMap: WeakMap<HTMLElement | SVGElement, LockState>;
  lockedElementSet: Set<HTMLElement | SVGElement>;
};
```

**Returns:**

- The same functions and constants the package exports, bound to the new instance. The top-level exports are one shared instance created this way.

### Types

#### `ScrollLockTarget`

```typescript
type ScrollLockTarget =
  | HTMLElement
  | SVGElement
  | Window
  | Document
  | null
  | undefined;
```

**Target Resolution:**

- `HTMLElement | SVGElement` - Used directly as the lock target
- `Window` - Targets `window.document.documentElement`
- `Document` - Targets `document.documentElement`
- `null | undefined` - Defaults to `document.body`

#### `LockScrollOptions`

```typescript
interface LockScrollOptions {
  reserveScrollBarGap?: boolean;
}
```

#### `LockState`

```typescript
interface LockState {
  count: number;
  originalOverflowX?: string;
  originalOverflowY?: string;
  reservedScrollBarGap?: ReservedScrollBarGap;
  stopTouchEventListener?: () => void;
  stopWatchingStyle?: () => void;
}

interface ReservedScrollBarGap {
  property: "scrollbar-gutter" | "padding-left" | "padding-right";
  original: string;
  value: string;
  width: number;
}
```

### Exported Constants

Advanced usage - access the internal state of the shared instance:

```ts
import { lockStateMap, lockedElementSet } from "@hunterliu/scroll-lock";

// WeakMap storing lock state for each element
const state = lockStateMap.get(document.body);

// Set of all currently locked elements
const isLocked = lockedElementSet.has(document.body);
```

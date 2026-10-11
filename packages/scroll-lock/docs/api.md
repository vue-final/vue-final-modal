---
outline: deep
---

# API Reference

Complete reference for all functions and types in the `@hunterliu/scroll-lock` library.

## Functions

### `lockScroll(target, options?)`

Locks scroll on the specified target element. Multiple calls on the same element use reference counting.

```typescript
function lockScroll(
  target: ScrollLockTarget,
  options?: LockScrollOptions,
): LockState | undefined;
```

**Parameters:**

- `target: ScrollLockTarget` - Element to lock (default: `document.body` if null/undefined)
- `options?: LockScrollOptions` - Optional configuration object
  - `reserveScrollBarGap?: boolean` - Keep the room of the disappearing scrollbar, reserved by the first lock and restored by the last unlock (default: `false`). The body gets the width as `padding-right`. Any other element keeps a stable `scrollbar-gutter` where the browser supports it, and otherwise gets the width as padding on its scrollbar's side, the left for a right-to-left element. Nothing is added when the gutter is already stable.

**Returns:**

- `LockState | undefined` - The lock state object, or `undefined` if not in browser environment

**Example:**

```js
import { lockScroll } from "@hunterliu/scroll-lock";

// Lock body scroll (pass null/undefined for default)
lockScroll(document.body);

// Lock specific element
const modal = document.querySelector(".modal");
lockScroll(modal);

// Lock using window (targets documentElement)
lockScroll(window);

// Keep the layout still when the scrollbar disappears
lockScroll(document.body, { reserveScrollBarGap: true });
```

### `unlockScroll(target, options?)`

Unlocks scroll on the specified target element. Uses reference counting unless forced.

```typescript
function unlockScroll(
  target: ScrollLockTarget,
  options?: {
    force?: boolean;
  },
): LockState | undefined;
```

**Parameters:**

- `target: ScrollLockTarget` - Element to unlock (default: `document.body` if null/undefined)
- `options?` - Optional configuration object
  - `force?: boolean` - Bypass reference counting (default: `false`)

**Returns:**

- `LockState | undefined` - The lock state object, or `undefined` if not in browser environment

**Example:**

```js
import { unlockScroll } from "@hunterliu/scroll-lock";

// Normal unlock (respects reference counting)
unlockScroll(document.body);

// Force unlock (ignores reference count)
unlockScroll(document.body, { force: true });

// Unlock specific element
unlockScroll(modal);
```

### `isScrollLocked(target)`

Checks if the specified target element is currently locked by this library.

```typescript
function isScrollLocked(target: ScrollLockTarget): boolean;
```

**Parameters:**

- `target: ScrollLockTarget` - Element to check (default: `document.body` if null/undefined)

**Returns:**

- `boolean` - `true` if the element is locked, `false` otherwise

**Example:**

```js
import { isScrollLocked, lockScroll } from "@hunterliu/scroll-lock";

console.log(isScrollLocked(document.body)); // false

lockScroll(document.body);
console.log(isScrollLocked(document.body)); // true

// Check specific element
const modal = document.querySelector(".modal");
console.log(isScrollLocked(modal)); // false
```

### `clearAllScrollLocks()`

Immediately clears all scroll locks on all targets, restoring their original styles.

```typescript
function clearAllScrollLocks(): void;
```

**Example:**

```js
import { clearAllScrollLocks, lockScroll } from "@hunterliu/scroll-lock";

// Lock multiple elements
lockScroll(document.body);
lockScroll(document.querySelector(".modal"));
lockScroll(document.querySelector(".sidebar"));

// Clear all locks at once
clearAllScrollLocks();
```

### `createScrollLock()`

Creates an isolated instance with its own lock registry. Reference counts, `isScrollLocked()` and `clearAllScrollLocks()` of an instance only see the locks made through it.

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

**Example:**

```js
import { createScrollLock, lockScroll } from "@hunterliu/scroll-lock";

const drawerLocks = createScrollLock();
const drawer = document.querySelector(".drawer");

lockScroll(document.body);
drawerLocks.lockScroll(drawer);

console.log(drawerLocks.isScrollLocked(document.body)); // false

// Unlocks the drawer, body stays locked
drawerLocks.clearAllScrollLocks();
```

::: warning
Instances do not know about each other, so lock a given element through one instance only. When two instances lock the same element, one releasing it can make it scrollable while the other still counts it as locked.
:::

## Types

### `ScrollLockTarget`

Union type defining valid targets for scroll locking operations.

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

### `LockScrollOptions`

Options accepted by `lockScroll()`.

```typescript
interface LockScrollOptions {
  reserveScrollBarGap?: boolean;
}
```

**Properties:**

- `reserveScrollBarGap?: boolean` - Keep the room of the disappearing scrollbar (default: `false`). The body gets the width as `padding-right`. Any other element keeps a stable `scrollbar-gutter` where the browser supports it, and otherwise gets the width as padding on its scrollbar's side, the left for a right-to-left element. Nothing is added when the gutter is already stable.

### `LockState`

Interface representing the state of a locked element.

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

**Properties:**

- `count: number` - Reference count for the lock
- `originalOverflowX?: string` - Original inline overflow-x value
- `originalOverflowY?: string` - Original inline overflow-y value
- `reservedScrollBarGap?: ReservedScrollBarGap` - Present when `reserveScrollBarGap` kept the scrollbar's room: the property it set, its original inline value, the value it set and the scrollbar's width
- `stopTouchEventListener?: () => void` - Function to cleanup the iOS touch event listeners
- `stopWatchingStyle?: () => void` - Function to stop watching the element's style for writes over the lock

## Exported Constants

The state of the shared instance behind the top-level functions. An instance from `createScrollLock()` returns its own pair.

### `lockStateMap`

WeakMap storing the lock state for each locked element.

```typescript
export const lockStateMap: WeakMap<HTMLElement | SVGElement, LockState>;
```

**Usage:**

```js
import { lockStateMap, lockScroll } from "@hunterliu/scroll-lock";

lockScroll(document.body);
const state = lockStateMap.get(document.body);
console.log(state?.count); // 1
```

### `lockedElementSet`

Set containing all currently locked elements for iteration purposes.

```typescript
export const lockedElementSet: Set<HTMLElement | SVGElement>;
```

**Usage:**

```js
import { lockedElementSet, lockScroll } from "@hunterliu/scroll-lock";

lockScroll(document.body);
console.log(lockedElementSet.has(document.body)); // true
```

const isClient = globalThis.window && typeof document !== "undefined";
const isIOS = getIsIOS();

function getIsIOS(): boolean {
  return (
    isClient &&
    !!globalThis.window?.navigator?.userAgent &&
    (/iP(?:ad|hone|od)/.test(globalThis.window.navigator.userAgent) ||
      // The new iPad Pro Gen3 does not identify itself as iPad, but as Macintosh.
      // https://github.com/vueuse/vueuse/issues/3577
      (globalThis.window?.navigator?.maxTouchPoints > 2 &&
        /iPad|Macintosh/.test(globalThis.window?.navigator.userAgent)))
  );
}

export type ScrollLockTarget =
  | HTMLElement
  | SVGElement
  | Window
  | Document
  | null
  | undefined;

export interface LockScrollOptions {
  /**
   * Keep the room of the scrollbar that disappears, so the target's content does not shift:
   * an element keeps a stable `scrollbar-gutter` where the browser supports it, and otherwise
   * gets the width as padding on its scrollbar's side; the body gets it as `padding-right`.
   * Nothing is added when the gutter is already stable. Applied with the first lock and restored with the last unlock.
   */
  reserveScrollBarGap?: boolean;
}

export interface ReservedScrollBarGap {
  property: "scrollbar-gutter" | "padding-left" | "padding-right";
  original: string;
  value: string;
  width: number;
}

export interface LockState {
  count: number;
  originalOverflowX?: string;
  originalOverflowY?: string;
  reservedScrollBarGap?: ReservedScrollBarGap;
  stopTouchEventListener?: () => void;
  stopWatchingStyle?: () => void;
}

export function createScrollLock() {
  const lockStateMap = new WeakMap<HTMLElement | SVGElement, LockState>();
  const lockedElementSet = new Set<HTMLElement | SVGElement>();

  function lockScroll(
    target: ScrollLockTarget,
    options?: LockScrollOptions,
  ): LockState | undefined {
    if (!isBrowser()) return;

    const el = resolveTarget(target);
    if (!el) return;

    return applyLock(el, options, {
      lockStateMap,
      lockedElementSet,
    });
  }

  function unlockScroll(
    target: ScrollLockTarget,
    options?: {
      force?: boolean;
    },
  ): LockState | undefined {
    if (!isBrowser()) return;

    const force = options?.force ?? false;

    const el = resolveTarget(target);
    if (!el) return;

    const state = lockStateMap.get(el);
    if (!state) return;

    if (force) {
      restoreElement(el, state, {
        lockedElementSet,
        lockStateMap,
      });
      return {
        count: 0,
      };
    }

    state.count -= 1;

    if (state.count <= 0) {
      restoreElement(el, state, {
        lockedElementSet,
        lockStateMap,
      });
    }
    return state;
  }

  function isScrollLocked(target: ScrollLockTarget): boolean {
    if (!isBrowser()) return false;

    const el = resolveTarget(target);
    if (!el) return false;

    const state = lockStateMap.get(el);
    return !!state && state.count > 0;
  }

  function clearAllScrollLocks(): void {
    if (!isBrowser()) return;

    // Use lockedElements (Set) to safely iterate through all previously locked elements
    for (const el of lockedElementSet) {
      const state = lockStateMap.get(el);
      if (state) {
        restoreElement(el, state, {
          lockedElementSet,
          lockStateMap,
        });
      }
    }

    lockedElementSet.clear();
  }

  return {
    lockStateMap,
    lockedElementSet,
    lockScroll,
    unlockScroll,
    isScrollLocked,
    clearAllScrollLocks,
  };
}

export const {
  lockStateMap,
  lockedElementSet,
  lockScroll,
  unlockScroll,
  isScrollLocked,
  clearAllScrollLocks,
} = createScrollLock();

function applyLock(
  el: HTMLElement | SVGElement,
  options: LockScrollOptions | undefined,
  ctx: {
    lockStateMap: WeakMap<HTMLElement | SVGElement, LockState>;
    lockedElementSet: Set<HTMLElement | SVGElement>;
  },
): LockState {
  let state = ctx.lockStateMap.get(el);

  if (!state) {
    state = {
      count: 0,
      originalOverflowX: el.style.overflowX,
      originalOverflowY: el.style.overflowY,
    };

    if (isIOS) {
      state.stopTouchEventListener = listenTouches(el);
    }
    state.stopWatchingStyle = watchStyle(el, state);
    ctx.lockStateMap.set(el, state);
    ctx.lockedElementSet.add(el);
  }

  if (state.count === 0) {
    // The gap must be measured while the scrollbar is still there.
    if (options?.reserveScrollBarGap) reserveScrollBarGap(el, state);
    // Longhands, because restoring the shorthand would also drop an overflow-x or overflow-y set on its own.
    el.style.overflowX = "hidden";
    el.style.overflowY = "hidden";
  }

  state.count += 1;

  return state;
}

function restoreElement(
  el: HTMLElement | SVGElement,
  state: LockState,
  ctx: {
    lockStateMap: WeakMap<HTMLElement | SVGElement, LockState>;
    lockedElementSet: Set<HTMLElement | SVGElement>;
  },
): void {
  if (isIOS) {
    state.stopTouchEventListener?.();
  }
  state.stopWatchingStyle?.();
  el.style.overflowX = state.originalOverflowX ?? "";
  el.style.overflowY = state.originalOverflowY ?? "";
  if (state.reservedScrollBarGap) {
    const { property, original } = state.reservedScrollBarGap;
    if (original) {
      el.style.setProperty(property, original);
    } else {
      el.style.removeProperty(property);
    }
  }

  ctx.lockStateMap.delete(el);
  ctx.lockedElementSet.delete(el);
}

function reserveScrollBarGap(
  el: HTMLElement | SVGElement,
  state: LockState,
): void {
  const gap = scrollBarGap(el);
  if (gap <= 0) return;

  const page = el === document.body || el === document.documentElement;
  /** The page's scrollbar belongs to the viewport, whose gutter is set on the root element. */
  const gutter = globalThis.window
    .getComputedStyle(page ? document.documentElement : el)
    .getPropertyValue("scrollbar-gutter");
  if (gutter.startsWith("stable")) return;

  if (!page && supportsStableGutter()) {
    reserve(el, state, "scrollbar-gutter", "stable", gap);
    return;
  }

  /** A right-to-left element shows its scrollbar on the left. */
  const property =
    !page && globalThis.window.getComputedStyle(el).direction === "rtl"
      ? "padding-left"
      : "padding-right";
  reserve(el, state, property, widenedPadding(el, property, gap), gap);
}

function reserve(
  el: HTMLElement | SVGElement,
  state: LockState,
  property: ReservedScrollBarGap["property"],
  value: string,
  width: number,
): void {
  state.reservedScrollBarGap = {
    property,
    original: el.style.getPropertyValue(property),
    value,
    width,
  };
  el.style.setProperty(property, value);
}

function widenedPadding(
  el: HTMLElement | SVGElement,
  property: "padding-left" | "padding-right",
  width: number,
): string {
  const padding =
    Number.parseFloat(
      globalThis.window.getComputedStyle(el).getPropertyValue(property),
    ) || 0;
  return `${padding + width}px`;
}

/**
 * A framework re-rendering the element's style binding writes over the lock. Its values
 * become the ones to give back, and the lock is applied again before the next paint.
 */
function watchStyle(
  el: HTMLElement | SVGElement,
  state: LockState,
): () => void {
  const observer = new MutationObserver(() => {
    if (el.style.overflowX !== "hidden") {
      state.originalOverflowX = el.style.overflowX;
      el.style.overflowX = "hidden";
    }
    if (el.style.overflowY !== "hidden") {
      state.originalOverflowY = el.style.overflowY;
      el.style.overflowY = "hidden";
    }
    const gap = state.reservedScrollBarGap;
    /** Only a removed gap is put back: rewriting a value someone else wrote, such as another lock's padding, would have the two rewrite each other forever. */
    if (gap && !el.style.getPropertyValue(gap.property)) {
      gap.original = "";
      if (gap.property !== "scrollbar-gutter")
        gap.value = widenedPadding(el, gap.property, gap.width);
      el.style.setProperty(gap.property, gap.value);
    }
  });
  observer.observe(el, { attributes: true, attributeFilter: ["style"] });
  return () => observer.disconnect();
}

function supportsStableGutter(): boolean {
  return (
    typeof CSS !== "undefined" && CSS.supports("scrollbar-gutter", "stable")
  );
}

function scrollBarGap(el: HTMLElement | SVGElement): number {
  if (el === document.body || el === document.documentElement) {
    return globalThis.window.innerWidth - document.documentElement.clientWidth;
  }
  if (!(el instanceof HTMLElement)) return 0;

  const style = globalThis.window.getComputedStyle(el);
  const borders =
    (Number.parseFloat(style.borderLeftWidth) || 0) +
    (Number.parseFloat(style.borderRightWidth) || 0);
  return el.offsetWidth - el.clientWidth - borders;
}

function resolveTarget(
  target: HTMLElement | SVGElement | Window | Document | null | undefined,
): HTMLElement | SVGElement | undefined {
  if (!target) return document.body;

  if (typeof Window !== "undefined" && target instanceof Window)
    return target.document.documentElement;

  if (typeof Document !== "undefined" && target instanceof Document)
    return target.documentElement;
  if (target instanceof HTMLElement || target instanceof SVGElement)
    return target;
  return undefined;
}

function isBrowser(): boolean {
  return globalThis.window !== undefined && typeof document !== "undefined";
}

/**
 * iOS ignores `overflow: hidden` on the page, so touch scrolling is cancelled instead,
 * except inside an element below the locked one that can still scroll the way the finger moves.
 */
function listenTouches(el: HTMLElement | SVGElement): () => void {
  let start = { x: 0, y: 0 };
  let last = start;

  const onTouchStart = (event: Event) => {
    const { touches } = event as TouchEvent;
    const [first] = touches;
    if (touches.length === 1 && first)
      start = last = { x: first.clientX, y: first.clientY };
  };

  const onTouchMove = (event: Event) => {
    const { touches } = event as TouchEvent;
    const [first] = touches;
    // More than one touch is usually a gesture such as pinch to zoom.
    if (!first || touches.length > 1) return;

    const point = { x: first.clientX, y: first.clientY };
    /** The whole gesture picks the axis, so a jittery step cannot flip it. */
    const horizontal =
      Math.abs(point.x - start.x) > Math.abs(point.y - start.y);
    const axis = horizontal ? "x" : "y";
    /** The last step picks the direction, so a finger turning back is followed. */
    const delta = point[axis] - last[axis] || point[axis] - start[axis];
    last = point;
    if (canScroll(event.composedPath(), horizontal, delta, el)) return;

    event.preventDefault();
  };

  el.addEventListener("touchstart", onTouchStart, { passive: true });
  el.addEventListener("touchmove", onTouchMove, { passive: false });

  return () => {
    el.removeEventListener("touchstart", onTouchStart);
    el.removeEventListener("touchmove", onTouchMove);
  };
}

/**
 * Whether an element on the event's path below the locked `root` can still scroll along the
 * axis of the gesture, in the direction the finger moves (positive is down or right).
 * The composed path reaches into shadow roots, which the retargeted `event.target` hides.
 */
function canScroll(
  path: EventTarget[],
  horizontal: boolean,
  delta: number,
  root: Element,
): boolean {
  for (const node of path) {
    if (node === root) return false;
    if (
      node instanceof Element &&
      (horizontal ? canScrollX(node, delta) : canScrollY(node, delta))
    )
      return true;
  }
  return false;
}

/** Scroll offsets are fractional on high-density screens, so less than a pixel from an edge counts as at it. */
const EDGE = 1;

function canScrollY(el: Element, delta: number): boolean {
  if (
    !isScrollable(
      globalThis.window.getComputedStyle(el).overflowY,
      el.scrollHeight,
      el.clientHeight,
    )
  )
    return false;
  return delta > 0
    ? el.scrollTop >= EDGE
    : delta < 0 && el.scrollTop + el.clientHeight <= el.scrollHeight - EDGE;
}

function canScrollX(el: Element, delta: number): boolean {
  const style = globalThis.window.getComputedStyle(el);
  if (!isScrollable(style.overflowX, el.scrollWidth, el.clientWidth))
    return false;
  /** A right-to-left scroller's scrollLeft runs from 0 at its right edge to negative values toward its left edge. */
  const fromLeft =
    style.direction === "rtl"
      ? el.scrollLeft + el.scrollWidth - el.clientWidth
      : el.scrollLeft;
  return delta > 0
    ? fromLeft >= EDGE
    : delta < 0 && fromLeft + el.clientWidth <= el.scrollWidth - EDGE;
}

function isScrollable(
  overflow: string,
  scrollSize: number,
  clientSize: number,
): boolean {
  return (
    (overflow === "auto" || overflow === "scroll") && scrollSize > clientSize
  );
}

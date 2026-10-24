import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  createScrollLock,
  lockScroll,
  unlockScroll,
  isScrollLocked,
  clearAllScrollLocks,
} from "../src";

function scrollable(
  parent: ParentNode,
  {
    scrollTop = 0,
    scrollHeight = 200,
    clientHeight = 100,
    scrollLeft = 0,
    scrollWidth = 100,
    clientWidth = 100,
    overflowX = "visible",
  } = {},
) {
  const el = document.createElement("div");
  el.style.overflowY = "auto";
  el.style.overflowX = overflowX;
  Object.defineProperties(el, {
    scrollTop: { value: scrollTop, writable: true },
    scrollHeight: { value: scrollHeight },
    clientHeight: { value: clientHeight },
    scrollLeft: { value: scrollLeft, writable: true },
    scrollWidth: { value: scrollWidth },
    clientWidth: { value: clientWidth },
  });
  parent.append(el);
  return el;
}

/** Each point is a `clientY`, or `[clientX, clientY]`. */
function touch(
  type: "touchstart" | "touchmove",
  target: Element,
  points: (number | [number, number])[],
) {
  const event = new Event(type, {
    bubbles: true,
    cancelable: true,
    composed: true,
  });
  const touches = points.map((point) =>
    Array.isArray(point)
      ? { clientX: point[0], clientY: point[1] }
      : { clientX: 0, clientY: point },
  );
  Object.defineProperties(event, {
    touches: { value: touches },
    targetTouches: { value: touches },
  });
  target.dispatchEvent(event);
  return event;
}

/** jsdom does not expand the overflow shorthand into its longhands, so the lock is read from the longhands themselves. */
function overflowOf(el: HTMLElement) {
  return [el.style.overflowX, el.style.overflowY];
}
const LOCKED = ["hidden", "hidden"];
const UNLOCKED = ["", ""];

describe("scroll-lock", () => {
  beforeEach(() => {
    // Force clear all locks before each test to avoid interference
    clearAllScrollLocks();

    // Ensure body style is clean
    document.body.removeAttribute("style");
  });

  it("locks and unlocks body scroll", () => {
    expect(isScrollLocked(document.body)).toBe(false);
    expect(overflowOf(document.body)).toEqual(UNLOCKED);

    lockScroll(document.body);

    expect(isScrollLocked(document.body)).toBe(true);
    expect(overflowOf(document.body)).toEqual(LOCKED);

    unlockScroll(document.body);

    expect(isScrollLocked(document.body)).toBe(false);
    expect(overflowOf(document.body)).toEqual(UNLOCKED);
  });

  it("respects reference counting for the same target", () => {
    lockScroll(document.body);
    lockScroll(document.body);

    // After two locks, overflow is still just hidden
    expect(isScrollLocked(document.body)).toBe(true);
    expect(overflowOf(document.body)).toEqual(LOCKED);

    // First unlock doesn't restore style
    unlockScroll(document.body);
    expect(isScrollLocked(document.body)).toBe(true);
    expect(overflowOf(document.body)).toEqual(LOCKED);

    // Second unlock actually unlocks
    unlockScroll(document.body);
    expect(isScrollLocked(document.body)).toBe(false);
    expect(overflowOf(document.body)).toEqual(UNLOCKED);
  });

  it("force unlock ignores reference count", () => {
    lockScroll(document.body);
    lockScroll(document.body);
    expect(isScrollLocked(document.body)).toBe(true);

    unlockScroll(document.body, { force: true });

    expect(isScrollLocked(document.body)).toBe(false);
    expect(overflowOf(document.body)).toEqual(UNLOCKED);
  });

  it("handles multiple targets independently", () => {
    const panel = document.createElement("div");
    document.body.append(panel);

    lockScroll(document.body);
    lockScroll(panel);

    expect(isScrollLocked(document.body)).toBe(true);
    expect(isScrollLocked(panel)).toBe(true);
    expect(overflowOf(document.body)).toEqual(LOCKED);
    expect(overflowOf(panel)).toEqual(LOCKED);

    // Unlock panel, doesn't affect body
    unlockScroll(panel);
    expect(isScrollLocked(document.body)).toBe(true); // body still locked
    expect(isScrollLocked(panel)).toBe(false);
    expect(overflowOf(document.body)).toEqual(LOCKED);
    expect(overflowOf(panel)).toEqual(UNLOCKED);

    // Unlock body
    unlockScroll(document.body);
    expect(isScrollLocked(document.body)).toBe(false);
    expect(overflowOf(document.body)).toEqual(UNLOCKED);
  });

  it("clearAllScrollLocks restores all targets", () => {
    const panel = document.createElement("div");
    document.body.append(panel);

    lockScroll(document.body);
    lockScroll(panel);
    lockScroll(panel); // panel locked twice

    expect(isScrollLocked(document.body)).toBe(true);
    expect(isScrollLocked(panel)).toBe(true);

    clearAllScrollLocks();

    expect(isScrollLocked(document.body)).toBe(false);
    expect(isScrollLocked(panel)).toBe(false);
    expect(overflowOf(document.body)).toEqual(UNLOCKED);
    expect(overflowOf(panel)).toEqual(UNLOCKED);
  });

  it("gives back an inline overflow-y the target had", () => {
    document.body.style.overflowY = "auto";

    lockScroll(document.body);
    expect(overflowOf(document.body)).toEqual(LOCKED);

    unlockScroll(document.body);
    expect(overflowOf(document.body)).toEqual(["", "auto"]);
  });

  it("gives back inline overflow-x and overflow-y that differ", () => {
    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "scroll";

    lockScroll(document.body);
    expect(overflowOf(document.body)).toEqual(LOCKED);

    unlockScroll(document.body);
    expect(overflowOf(document.body)).toEqual(["hidden", "scroll"]);
  });

  it("installs no touch listeners off iOS", () => {
    lockScroll(document.body);

    expect(touch("touchmove", document.body, [10]).defaultPrevented).toBe(
      false,
    );
  });
});

describe("reserveScrollBarGap", () => {
  const gap = () =>
    globalThis.innerWidth - document.documentElement.clientWidth;

  beforeEach(() => {
    clearAllScrollLocks();
    document.body.removeAttribute("style");
  });

  it("widens the body padding by the scrollbar gap and restores it", () => {
    document.body.style.paddingRight = "10px";
    expect(gap()).toBeGreaterThan(0);

    lockScroll(document.body, { reserveScrollBarGap: true });
    expect(document.body.style.paddingRight).toBe(`${10 + gap()}px`);

    unlockScroll(document.body);
    expect(document.body.style.paddingRight).toBe("10px");
  });

  it("removes the padding it added when the body had none", () => {
    lockScroll(document.body, { reserveScrollBarGap: true });
    expect(document.body.style.paddingRight).toBe(`${gap()}px`);

    unlockScroll(document.body);
    expect(document.body.style.paddingRight).toBe("");
  });

  it("leaves the padding alone by default", () => {
    document.body.style.paddingRight = "10px";

    lockScroll(document.body);

    expect(document.body.style.paddingRight).toBe("10px");
  });

  it("measures the gap once for nested locks and restores it with the last unlock", () => {
    lockScroll(document.body, { reserveScrollBarGap: true });
    lockScroll(document.body, { reserveScrollBarGap: true });
    expect(document.body.style.paddingRight).toBe(`${gap()}px`);

    unlockScroll(document.body);
    expect(document.body.style.paddingRight).toBe(`${gap()}px`);

    unlockScroll(document.body);
    expect(document.body.style.paddingRight).toBe("");
  });

  it("uses the element's own scrollbar width for other targets", () => {
    const panel = document.createElement("div");
    Object.defineProperties(panel, {
      offsetWidth: { value: 220 },
      clientWidth: { value: 200 },
    });
    document.body.append(panel);

    lockScroll(panel, { reserveScrollBarGap: true });
    expect(panel.style.paddingRight).toBe("20px");

    unlockScroll(panel);
    expect(panel.style.paddingRight).toBe("");
  });

  it("adds nothing when the target shows no scrollbar", () => {
    const panel = document.createElement("div");
    document.body.append(panel);

    lockScroll(panel, { reserveScrollBarGap: true });

    expect(panel.style.paddingRight).toBe("");
  });

  describe("around the scrollbar gutter", () => {
    function panelWithScrollbar() {
      const panel = document.createElement("div");
      Object.defineProperties(panel, {
        offsetWidth: { value: 220 },
        clientWidth: { value: 200 },
      });
      document.body.append(panel);
      return panel;
    }

    afterEach(() => {
      document.documentElement.removeAttribute("style");
      vi.unstubAllGlobals();
    });

    it("adds nothing to a target that keeps a stable scrollbar gutter", () => {
      const panel = panelWithScrollbar();
      panel.style.setProperty("scrollbar-gutter", "stable");

      lockScroll(panel, { reserveScrollBarGap: true });

      expect(panel.style.paddingRight).toBe("");
    });

    it("adds nothing to the body when the page keeps a stable scrollbar gutter", () => {
      document.documentElement.style.setProperty("scrollbar-gutter", "stable");

      lockScroll(document.body, { reserveScrollBarGap: true });

      expect(document.body.style.paddingRight).toBe("");
    });

    it("pads the left of a right-to-left target, where its scrollbar is", () => {
      const panel = panelWithScrollbar();
      panel.style.direction = "rtl";

      lockScroll(panel, { reserveScrollBarGap: true });
      expect([panel.style.paddingLeft, panel.style.paddingRight]).toEqual([
        "20px",
        "",
      ]);

      unlockScroll(panel);
      expect(panel.style.paddingLeft).toBe("");
    });

    it("keeps the scrollbar gutter instead of padding where the browser supports it", () => {
      vi.stubGlobal("CSS", {
        supports: (property: string, value: string) =>
          property === "scrollbar-gutter" && value === "stable",
      });
      const panel = panelWithScrollbar();
      panel.style.boxSizing = "content-box";
      panel.style.width = "320px";

      lockScroll(panel, { reserveScrollBarGap: true });
      expect([
        panel.style.getPropertyValue("scrollbar-gutter"),
        panel.style.paddingRight,
      ]).toEqual(["stable", ""]);

      unlockScroll(panel);
      expect(panel.style.getPropertyValue("scrollbar-gutter")).toBe("");
    });
  });
});

describe("when the app rewrites the locked element's style", () => {
  const nextTask = () => new Promise((resolve) => setTimeout(resolve));

  beforeEach(() => {
    clearAllScrollLocks();
    document.body.removeAttribute("style");
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("locks again and gives back the app's latest overflow", async () => {
    const panel = document.createElement("div");
    panel.style.overflowY = "auto";
    document.body.append(panel);
    lockScroll(panel);

    panel.style.overflowY = "scroll";
    await nextTask();
    expect(overflowOf(panel)).toEqual(LOCKED);

    unlockScroll(panel);
    expect(overflowOf(panel)).toEqual(["", "scroll"]);
  });

  it("leaves alone the padding another lock reserved on the same element", async () => {
    const other = createScrollLock();
    const panel = document.createElement("div");
    Object.defineProperties(panel, {
      offsetWidth: { value: 220 },
      clientWidth: { value: 200 },
    });
    document.body.append(panel);
    try {
      lockScroll(panel, { reserveScrollBarGap: true });
      other.lockScroll(panel, { reserveScrollBarGap: true });
      for (let turn = 0; turn < 10; turn++) await Promise.resolve();

      expect(panel.style.paddingRight).toBe("40px");
    } finally {
      other.clearAllScrollLocks();
      clearAllScrollLocks();
    }
  });

  it("reserves the scrollbar gap again when the app replaces the whole style", async () => {
    const panel = document.createElement("div");
    Object.defineProperties(panel, {
      offsetWidth: { value: 220 },
      clientWidth: { value: 200 },
    });
    document.body.append(panel);
    lockScroll(panel, { reserveScrollBarGap: true });

    panel.style.cssText = "height: 10px; overflow-y: auto";
    await nextTask();
    expect([...overflowOf(panel), panel.style.paddingRight]).toEqual([
      "hidden",
      "hidden",
      "20px",
    ]);

    unlockScroll(panel);
    expect([
      panel.style.height,
      ...overflowOf(panel),
      panel.style.paddingRight,
    ]).toEqual(["10px", "", "auto", ""]);
  });
});

describe("iOS", () => {
  type ScrollLock = typeof import("../src");
  let ios: ScrollLock;

  beforeEach(async () => {
    vi.resetModules();
    Object.defineProperty(globalThis.navigator, "userAgent", {
      value: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      configurable: true,
    });
    ios = await import("../src");
  });

  afterEach(() => {
    ios.clearAllScrollLocks();
    document.body.innerHTML = "";
    document.body.removeAttribute("style");
  });

  it("cancels touchmove on the locked element", () => {
    ios.lockScroll(document.body);

    expect(touch("touchmove", document.body, [10]).defaultPrevented).toBe(true);
  });

  it("lets a multi-touch gesture through", () => {
    ios.lockScroll(document.body);

    expect(touch("touchmove", document.body, [10, 20]).defaultPrevented).toBe(
      false,
    );
  });

  it("lets a scrollable child scroll while it still can", () => {
    const list = scrollable(document.body, { scrollTop: 50 });
    const item = document.createElement("p");
    list.append(item);
    ios.lockScroll(document.body);

    touch("touchstart", item, [100]);
    expect(touch("touchmove", item, [150]).defaultPrevented).toBe(false);
    expect(touch("touchmove", item, [50]).defaultPrevented).toBe(false);
  });

  it("cancels pulling a scrollable child past its top or bottom", () => {
    const list = scrollable(document.body);
    ios.lockScroll(document.body);

    list.scrollTop = 0;
    touch("touchstart", list, [100]);
    expect(touch("touchmove", list, [150]).defaultPrevented).toBe(true);
    expect(touch("touchmove", list, [50]).defaultPrevented).toBe(false);

    list.scrollTop = 100;
    touch("touchstart", list, [100]);
    expect(touch("touchmove", list, [50]).defaultPrevented).toBe(true);
    expect(touch("touchmove", list, [150]).defaultPrevented).toBe(false);
  });

  it("cancels touchmove inside a child that cannot scroll at all", () => {
    const box = scrollable(document.body, {
      scrollHeight: 100,
      clientHeight: 100,
    });
    ios.lockScroll(document.body);

    touch("touchstart", box, [100]);
    expect(touch("touchmove", box, [150]).defaultPrevented).toBe(true);
  });

  it("does not let the locked element itself count as scrollable", () => {
    const panel = scrollable(document.body, { scrollTop: 50 });
    ios.lockScroll(panel);

    touch("touchstart", panel, [100]);
    expect(touch("touchmove", panel, [150]).defaultPrevented).toBe(true);
  });

  it("lets a horizontal scroller scroll while it still can", () => {
    const carousel = scrollable(document.body, {
      overflowX: "auto",
      scrollLeft: 50,
      scrollWidth: 400,
      clientWidth: 200,
      scrollHeight: 100,
    });
    ios.lockScroll(document.body);

    touch("touchstart", carousel, [[100, 100]]);
    expect(touch("touchmove", carousel, [[150, 102]]).defaultPrevented).toBe(
      false,
    );
    expect(touch("touchmove", carousel, [[50, 98]]).defaultPrevented).toBe(
      false,
    );
  });

  it("cancels pulling a horizontal scroller past its left or right edge", () => {
    const carousel = scrollable(document.body, {
      overflowX: "auto",
      scrollWidth: 400,
      clientWidth: 200,
      scrollHeight: 100,
    });
    ios.lockScroll(document.body);

    carousel.scrollLeft = 0;
    touch("touchstart", carousel, [[100, 100]]);
    expect(touch("touchmove", carousel, [[150, 100]]).defaultPrevented).toBe(
      true,
    );
    expect(touch("touchmove", carousel, [[50, 100]]).defaultPrevented).toBe(
      false,
    );

    carousel.scrollLeft = 200;
    touch("touchstart", carousel, [[100, 100]]);
    expect(touch("touchmove", carousel, [[50, 100]]).defaultPrevented).toBe(
      true,
    );
    expect(touch("touchmove", carousel, [[150, 100]]).defaultPrevented).toBe(
      false,
    );
  });

  it("judges a gesture by its dominant axis", () => {
    const carousel = scrollable(document.body, {
      overflowX: "auto",
      scrollLeft: 50,
      scrollWidth: 400,
      clientWidth: 200,
      scrollHeight: 100,
    });
    ios.lockScroll(document.body);

    touch("touchstart", carousel, [[100, 100]]);
    expect(touch("touchmove", carousel, [[110, 160]]).defaultPrevented).toBe(
      true,
    );
    expect(touch("touchmove", carousel, [[160, 110]]).defaultPrevented).toBe(
      false,
    );
  });

  it("treats a scroller less than a pixel from an edge as at that edge", () => {
    const list = scrollable(document.body, { scrollTop: 99.67 });
    const carousel = scrollable(document.body, {
      overflowX: "auto",
      scrollLeft: 199.6,
      scrollWidth: 400,
      clientWidth: 200,
      scrollHeight: 100,
    });
    ios.lockScroll(document.body);

    touch("touchstart", list, [100]);
    expect(touch("touchmove", list, [50]).defaultPrevented).toBe(true);

    list.scrollTop = 0.4;
    touch("touchstart", list, [100]);
    expect(touch("touchmove", list, [150]).defaultPrevented).toBe(true);

    touch("touchstart", carousel, [[100, 100]]);
    expect(touch("touchmove", carousel, [[50, 100]]).defaultPrevented).toBe(
      true,
    );
  });

  it("follows the finger when it turns back within one gesture", () => {
    const list = scrollable(document.body, { scrollTop: 100 });
    ios.lockScroll(document.body);

    touch("touchstart", list, [100]);
    expect(touch("touchmove", list, [300]).defaultPrevented).toBe(false);
    expect(touch("touchmove", list, [250]).defaultPrevented).toBe(true);
  });

  it("measures a right-to-left scroller from its right edge", () => {
    const carousel = scrollable(document.body, {
      overflowX: "auto",
      scrollWidth: 400,
      clientWidth: 200,
      scrollHeight: 100,
    });
    carousel.style.direction = "rtl";
    ios.lockScroll(document.body);

    carousel.scrollLeft = 0;
    touch("touchstart", carousel, [[100, 100]]);
    expect(touch("touchmove", carousel, [[150, 100]]).defaultPrevented).toBe(
      false,
    );
    touch("touchstart", carousel, [[100, 100]]);
    expect(touch("touchmove", carousel, [[50, 100]]).defaultPrevented).toBe(
      true,
    );

    carousel.scrollLeft = -200;
    touch("touchstart", carousel, [[100, 100]]);
    expect(touch("touchmove", carousel, [[150, 100]]).defaultPrevented).toBe(
      true,
    );
    touch("touchstart", carousel, [[100, 100]]);
    expect(touch("touchmove", carousel, [[50, 100]]).defaultPrevented).toBe(
      false,
    );
  });

  it("lets a scroller inside a shadow root scroll", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const list = scrollable(host.attachShadow({ mode: "open" }), {
      scrollTop: 50,
    });
    ios.lockScroll(document.body);

    touch("touchstart", list, [100]);
    expect(touch("touchmove", list, [150]).defaultPrevented).toBe(false);
  });

  it("stops cancelling once the last lock is released", () => {
    ios.lockScroll(document.body);
    ios.lockScroll(document.body);

    ios.unlockScroll(document.body);
    expect(touch("touchmove", document.body, [10]).defaultPrevented).toBe(true);

    ios.unlockScroll(document.body);
    expect(touch("touchmove", document.body, [10]).defaultPrevented).toBe(
      false,
    );
  });
});

export function useSwipeable(el: any, { threshold, onSwipeStart, onSwipe, onSwipeEnd, passive }: {
    threshold?: number | undefined;
    onSwipeStart: any;
    onSwipe: any;
    onSwipeEnd: any;
    passive?: boolean | undefined;
}): {
    isPassiveEventSupported: boolean;
    isSwiping: import("vue").Ref<boolean>;
    direction: import("vue").ComputedRef<string>;
    coordsStart: {
        x: number;
        y: number;
    };
    coordsEnd: {
        x: number;
        y: number;
    };
    lengthX: import("vue").ComputedRef<number>;
    lengthY: import("vue").ComputedRef<number>;
    stop: () => void;
};
//# sourceMappingURL=swipeable.d.ts.map
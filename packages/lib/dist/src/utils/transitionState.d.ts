export namespace TransitionState {
    const Enter: string;
    const Entering: string;
    const Leave: string;
    const Leaving: string;
}
export function useTransitionState(): {
    state: import("vue").Ref<null>;
    listeners: {
        beforeEnter(): void;
        afterEnter(): void;
        beforeLeave(): void;
        afterLeave(): void;
    };
};
//# sourceMappingURL=transitionState.d.ts.map
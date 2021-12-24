export function useDragResize({ props, visible, vfmContainer, vfmContent, vfmResize, modalTransitionState, onEvent }: {
    props: any;
    visible: any;
    vfmContainer: any;
    vfmContent: any;
    vfmResize: any;
    modalTransitionState: any;
    onEvent?: (() => void) | undefined;
}): {
    resizeVisible: import("vue").Ref<boolean>;
    state: import("vue").Ref<null>;
    dragResizeStyle: import("vue").Ref<{}>;
    removeDragDown: () => void;
    removeResizeDown: () => void;
};
export function setStyle(el: any, key: any, value: any): () => void;
export function capitalize(s: any): any;
export function clamp(min: any, num: any, max: any): number;
export function trimPx(distance: any): any;
export function validDragElement(e: any, el: any, dragSelector: any): boolean;
//# sourceMappingURL=dragResize.d.ts.map
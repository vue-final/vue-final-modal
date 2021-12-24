export function checkPassiveEventSupport(document: any): boolean;
export function looseFocus(): void;
export function getPosition(e: any): {
    x: any;
    y: any;
};
export namespace pointerType {
    namespace down {
        const pc: string;
        const m: string;
    }
    namespace move {
        const pc_1: string;
        export { pc_1 as pc };
        const m_1: string;
        export { m_1 as m };
    }
    namespace up {
        const pc_2: string;
        export { pc_2 as pc };
        const m_2: string;
        export { m_2 as m };
    }
}
export function addListener(type: any, el: any, callback: any): void;
export function removeListener(type: any, el: any, callback: any): void;
//# sourceMappingURL=dom.d.ts.map
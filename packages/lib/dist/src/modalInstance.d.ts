export class ModalInstance {
    modals: any[];
    openedModals: any[];
    VueFinalModal: any;
    dynamicModals: never[];
    ModalsContainer: any;
    show(modal: any, ...args: any[]): Promise<any> | undefined;
    hide(...names: any[]): Promise<PromiseSettledResult<any>[]>;
    hideAll(): Promise<PromiseSettledResult<any>[]>;
    toggle(name: any, ...args: any[]): Promise<PromiseSettledResult<any>[]>;
    get(...names: any[]): any[];
    existModal(options: any): boolean;
    useModal(_options: any): {
        show: () => Promise<any>;
        hide: () => Promise<any>;
        options: any;
    };
}
export function createModalInstance(): {
    $vfm: ModalInstance;
    VueFinalModal: any;
    ModalsContainer: any;
    useModal: (_options: any) => {
        show: () => Promise<any>;
        hide: () => Promise<any>;
        options: any;
    };
};
export const $vfm: ModalInstance;
export const VueFinalModal: any;
export const ModalsContainer: any;
export function useModal(_options: any): {
    show: () => Promise<any>;
    hide: () => Promise<any>;
    options: any;
};
//# sourceMappingURL=modalInstance.d.ts.map
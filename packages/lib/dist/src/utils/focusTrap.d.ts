/**
 * Get FocusTrap focusTrap
 *
 * @returns {FocusTrap} focusTrap
 */
export function useFocusTrap({ props, vfmContainer, modalTransitionState }: {
    props: any;
    vfmContainer: any;
    modalTransitionState: any;
}): FocusTrap;
declare class FocusTrap {
    root: HTMLElement | null;
    elements: any[];
    onKeyDown(event: any): void;
    /**
     * Get last Element on the trap
     *
     * @return {HTMLElement | null} element
     */
    get lastElement(): HTMLElement | null;
    /**
     * Get first Element on the trap
     *
     * @return {HTMLElement | null} element
     */
    get firstElement(): HTMLElement | null;
    /**
     * Get whether the trap is enabled
     *
     * @return {boolean} isEnabled
     */
    get isEnabled(): boolean;
    /**
     * Enable focus trap
     *
     * @param {HTMLElement} root - the focus trap root element
     */
    enable(root: HTMLElement): void;
    /**
     * Disable focus trap
     */
    disable(): void;
}
export {};
//# sourceMappingURL=focusTrap.d.ts.map
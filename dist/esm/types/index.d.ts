declare class StylableScrollbar {
    scrollbarId: any;
    scrollbarContainer: HTMLElement;
    contentContainer: HTMLElement;
    scrollbarDirection: String;
    scrollSpeed: Number;
    responsive: Boolean;
    constructor({ scrollbarId, scrollbarContainer, contentContainer, scrollbarDirection, scrollSpeed, responsive }: {
        scrollbarId: any;
        scrollbarContainer: any;
        contentContainer: any;
        scrollbarDirection: any;
        scrollSpeed: any;
        responsive: any;
    });
}
declare class StylableScrollbarSettings {
    keepContainerScrollbars: Boolean;
    constructor({ keepContainerScrollbars }: {
        keepContainerScrollbars: any;
    });
}
/**
 * Initialise stylable scrollbars on the appropriate HTMLElements.
 */
declare const initStylableScrollbars: (settings?: StylableScrollbarSettings) => StylableScrollbar[];
export default initStylableScrollbars;

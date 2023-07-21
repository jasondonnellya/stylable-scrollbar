let ATTRIBUTE_PREFIX = "stylable-scrollbar";

// We don't use this simpleScrollbars array when triggering events because scopes like this are not persistent.
let simpleScrollbars: SimpleScrollbar[] = [];
// This class is simply to provide a clear, type strict reference to all the variables used by the scrollbars.
class SimpleScrollbar {
  scrollbarId: any;
  scrollbarContainer: HTMLElement;
  contentContainer: HTMLElement;
  scrollbarDirection: String;
  constructor({
    scrollbarId,
    scrollbarContainer,
    contentContainer,
    scrollbarDirection,
  }) {
    this.scrollbarId = scrollbarId;
    this.scrollbarContainer = scrollbarContainer;
    this.contentContainer = contentContainer;
    // Direction can be either 'vertical' or 'horizontal'
    this.scrollbarDirection = scrollbarDirection || "vertical";
    if (this.scrollbarContainer)
      scrollbarContainer.setAttribute("direction", this.scrollbarDirection);
  }
}
class StylableScrollbarSettings {
  keepContainerScrollbars: Boolean
  constructor({ keepContainerScrollbars }) {
    this.keepContainerScrollbars = keepContainerScrollbars || false
  }
}

/**
 * Generate a stylesheet that hides the default browser scrollbars on scrollable elements.
 */
const hideDefaultScrollbars = (): void => {
  let css = `
    [stylable-scrollbar-scrollable]::-webkit-scrollbar{
      display: none;
    }
    [stylable-scrollbar-scrollable] {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `,
    head = document.head || document.getElementsByTagName('head')[0],
    style: HTMLElement = document.createElement('style');
  head.appendChild(style);
  style.setAttribute('type', 'text/css')

  /*
    For some reason style.styleSheet is not recognised in TS.
    if (style.styleSheet) {
      // This is required for IE8 and below.
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  */
  style.appendChild(document.createTextNode(css));
}

/**
 * Add default styling to scrollbars.
 */
const setupScrollbar = (scrollbarContainer: HTMLElement): void => {
  const scrollHandle = <HTMLElement>scrollbarContainer.querySelector(
    `[${ATTRIBUTE_PREFIX}-handle]`
  );
  if (!scrollHandle) return;
  scrollHandle.style.position = "absolute";
};

/**
 * Add default styling to scrollable containers.
 */
const setupContentContainer = (contentContainer: HTMLElement): void => {
  const scrollbarId = contentContainer.getAttribute(
    `${ATTRIBUTE_PREFIX}-scrollable`
  );
  const scrollbarContainer = <HTMLElement>document.querySelector(
    `[${ATTRIBUTE_PREFIX}="${scrollbarId}"]`
  );
  if (!scrollbarContainer) return;
  scrollbarContainer.style.position = "relative";
  const direction = scrollbarContainer.getAttribute("direction");
  if (direction === "horizontal") contentContainer.style.overflowX = "auto";
  if (direction === "vertical") contentContainer.style.overflowY = "scroll";
};

/**
 * We stop mouse events from working on the scrollbar's children, so the events only works when clicking the parent, as to avoid targeting the wrong child elements.
 */
const disableAllChildren = (element: HTMLElement): void => {
  for (let i = 0; i < element.children.length; i++) {
    let child = <HTMLElement>element.children[i];
    child.style.pointerEvents = "none";
    disableAllChildren(child);
  }
};

const scrollStart = (e: MouseEvent, scrollbarId: String): void => {
  e.preventDefault();
  e.stopPropagation();
  const scrollbar = document.querySelector(
    `[${ATTRIBUTE_PREFIX}="${scrollbarId}"]`
  );
  if (!scrollbar) return;
  scrollbar.setAttribute("scrolling", "true");
  scrollMove(e);
};

const scrollMove = (e: MouseEvent): void => {
  const scrollbarContainer = document.querySelector(`[scrolling]`);
  if (!scrollbarContainer) return;
  const scrollbarId = scrollbarContainer.getAttribute(`${ATTRIBUTE_PREFIX}`);
  const contentContainer = document.querySelector(
    `[${ATTRIBUTE_PREFIX}-scrollable="${scrollbarId}"]`
  );
  if (!contentContainer) return;
  e.preventDefault();
  e.stopPropagation();
  const scrollHandle: HTMLElement | null = scrollbarContainer.querySelector(
    `[${ATTRIBUTE_PREFIX}-handle]`
  );
  if (!scrollHandle) return;
  const direction = scrollbarContainer.getAttribute("direction");
  if (direction === "horizontal") {
    const handleWidth = scrollHandle.clientWidth;
    const containerWidth = scrollbarContainer.clientWidth;
    const min = 0;
    const max = containerWidth - handleWidth;
    const screenXOffset =
      window.scrollX + scrollbarContainer.getBoundingClientRect().left;
    let left = e.pageX - handleWidth / 2 - screenXOffset;
    if (left < min) left = min;
    if (left > max) left = max;
    scrollHandle.style.left = `${left}px`;
    let percentage = left / max;
    let scrollLeft =
      (contentContainer.scrollWidth - contentContainer.clientWidth) *
      percentage;
    if (scrollLeft < 0) scrollLeft = 0;
    contentContainer.scrollLeft = scrollLeft;
  } else if (direction === "vertical") {
    const handleHeight = scrollHandle.clientHeight;
    const containerHeight = scrollbarContainer.clientHeight;
    const min = 0;
    const max = containerHeight - handleHeight;
    const screenYOffset =
      window.scrollY + scrollbarContainer.getBoundingClientRect().top;
    let top = e.pageY - handleHeight / 2 - screenYOffset;
    if (top < min) top = min;
    if (top > max) top = max;
    scrollHandle.style.top = `${top}px`;
    let percentage = top / max;
    let scrollTop =
      (contentContainer.scrollHeight - contentContainer.clientHeight) *
      percentage;
    if (scrollTop < 0) scrollTop = 0;
    contentContainer.scrollTop = scrollTop;
  }
};

const scrollEnd = (e: MouseEvent): void => {
  e.preventDefault();
  e.stopPropagation();
  let elements = document.querySelectorAll(`[${ATTRIBUTE_PREFIX}]`);
  for (let i = 0; i < elements.length; i++) {
    elements[i].removeAttribute("scrolling");
  }
};

/**
 * Initialise stylable scrollbars on the appropriate HTMLElements.
 */
// TODO: Add debug messages with a settings flag for 'debugResponse' and error messages.
const initStylableScrollbars = (settings?: StylableScrollbarSettings): SimpleScrollbar[] => {
  if (settings) {
    if (!settings.keepContainerScrollbars) hideDefaultScrollbars()
  } else {
    hideDefaultScrollbars()
  }
  const scrollbars: HTMLElement[] = Array.from(document.querySelectorAll(
    `[${ATTRIBUTE_PREFIX}]`
  ));
  simpleScrollbars = [];
  for (let scrollbarContainer of scrollbars) {
    let scrollbarId = scrollbarContainer.getAttribute(`${ATTRIBUTE_PREFIX}`);
    let contentContainer = document.querySelector(
      `[${ATTRIBUTE_PREFIX}-scrollable="${scrollbarId}"]`
    );
    if(contentContainer) {
      let scrollbarDirection = scrollbarContainer.getAttribute(`direction`);
      simpleScrollbars.push(
        new SimpleScrollbar({
          scrollbarContainer,
          contentContainer,
          scrollbarId,
          scrollbarDirection,
        })
      );
    }
  }

  for (let simpleScrollbar of simpleScrollbars) {
    let scrollbarId = simpleScrollbar.scrollbarId;
    let scrollbarContainer = simpleScrollbar.scrollbarContainer;
    let contentContainer = simpleScrollbar.contentContainer;
    if (!scrollbarContainer || !contentContainer) return [];
    disableAllChildren(scrollbarContainer);
    setupScrollbar(scrollbarContainer);
    setupContentContainer(contentContainer);
    scrollbarContainer.setAttribute(
      "ondragstart",
      `(e) => {
      e.preventDefault();
    }`
    );
    scrollbarContainer.addEventListener("mousedown", (e) =>
      scrollStart(e, scrollbarId)
    );
  }
  window.addEventListener("mousemove", scrollMove);
  window.addEventListener("mouseup", scrollEnd);
  window.addEventListener("mouseleave", scrollEnd);
  return simpleScrollbars
};

export default initStylableScrollbars
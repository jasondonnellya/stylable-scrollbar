let ATTRIBUTE_PREFIX = "stylable-scrollbar";

// We don't use this stylableScrollbars array when triggering events because scopes like this are not persistent.
let stylableScrollbars: StylableScrollbar[] = [];
// This class is simply to provide a clear,  model of all the variables used by the scrollbars.
class StylableScrollbar {
  scrollbarId: any;
  scrollbarContainer: HTMLElement;
  contentContainer: HTMLElement;
  scrollbarDirection: String;
  scrollSpeed: Number;
  responsive: Boolean;
  constructor({
    scrollbarId,
    scrollbarContainer,
    contentContainer,
    scrollbarDirection,
    scrollSpeed,
    responsive
  }) {
    this.scrollbarId = scrollbarId;
    this.scrollbarContainer = scrollbarContainer;
    this.contentContainer = contentContainer;
    // Direction can be either 'vertical' or 'horizontal'
    this.scrollbarDirection = scrollbarDirection || "vertical";
    if (this.scrollbarContainer)
      scrollbarContainer.setAttribute("direction", this.scrollbarDirection);
    this.scrollSpeed = scrollSpeed || 1
    if (this.scrollbarContainer) scrollbarContainer.setAttribute("scrollspeed", this.scrollSpeed)
    this.responsive = responsive || true
    if (this.scrollbarContainer) scrollbarContainer.setAttribute("responsive", this.responsive)
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
  const scrollbarHandle = <HTMLElement>scrollbarContainer.querySelector(
    `[${ATTRIBUTE_PREFIX}-handle]`
  );
  if (!scrollbarHandle) return;
  scrollbarHandle.style.position = "absolute";
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

const constrain = (amount, min, max) => {
  if (amount <= min) amount = min
  if (amount >= max) amount = max
  return amount
}

const canScroll = (scrollbarContainer) => {
  if(!scrollbarContainer) return
  const scrollbarId = scrollbarContainer.getAttribute(`${ATTRIBUTE_PREFIX}`);
  const contentContainer = document.querySelector(
    `[${ATTRIBUTE_PREFIX}-scrollable="${scrollbarId}"]`
  );
  if (!contentContainer) return;
  const direction = scrollbarContainer.getAttribute("direction");
  const responsive = scrollbarContainer.getAttribute("responsive");
  let canScroll = true
  if (responsive) {
    if (direction === 'vertical') canScroll = contentContainer.scrollHeight > contentContainer.clientHeight
    else if (direction === 'horizontal') canScroll = contentContainer.scrollWidth > contentContainer.clientWidth
  }
  if(canScroll) scrollbarContainer.style.display = "block"
  else scrollbarContainer.style.display = "none"
}

const setScrollbarPosition = (scrollbarContainer, scrollAmount, { scrollbarOnly, adjustForHandleSize }): void => {
  if (!scrollbarContainer) return;
  const scrollbarId = scrollbarContainer.getAttribute(`${ATTRIBUTE_PREFIX}`);
  const contentContainer = document.querySelector(
    `[${ATTRIBUTE_PREFIX}-scrollable="${scrollbarId}"]`
  );
  if (!contentContainer) return;
  const scrollbarHandle: HTMLElement | null = scrollbarContainer.querySelector(
    `[${ATTRIBUTE_PREFIX}-handle]`
  );
  if (!scrollbarHandle) return;

  const direction = scrollbarContainer.getAttribute("direction");
  let handleSize = 0,
    min = 0,
    max = 0,
    percentage = 0;

  if (direction === 'vertical') handleSize = scrollbarHandle.clientHeight
  else if (direction === 'horizontal') handleSize = scrollbarHandle.clientWidth
  if (scrollbarContainer) {
    if (direction === 'vertical') max = scrollbarContainer.clientHeight
    else if (direction === 'horizontal') max = scrollbarContainer.clientWidth
    max -= handleSize

    if(adjustForHandleSize) scrollAmount -= handleSize / 2
    scrollAmount = constrain(scrollAmount, min, max)

    if (direction === 'vertical') scrollbarHandle.style.top = `${scrollAmount}px`
    else if (direction === 'horizontal') scrollbarHandle.style.left = `${scrollAmount}px`

    percentage = scrollAmount / max
  }
  if (contentContainer && !scrollbarOnly) {
    min = 0
    if (direction === 'vertical') max = contentContainer.scrollHeight - contentContainer.clientHeight
    else if (direction === 'horizontal') max = contentContainer.scrollWidth - contentContainer.clientWidth

    scrollAmount = max * percentage
    scrollAmount = constrain(scrollAmount, min, max)

    if (direction === 'vertical') contentContainer.scrollTop = scrollAmount
    else if (direction === 'horizontal') contentContainer.scrollLeft = scrollAmount
  }
}

const setScrolling = (scrollbarContainer) => {
  scrollbarContainer.setAttribute("scrolling", "true");
}

const scrollbarStart = (e: MouseEvent, scrollbarId: String): void => {
  e.preventDefault();
  e.stopPropagation();
  const scrollbarContainer = document.querySelector(
    `[${ATTRIBUTE_PREFIX}="${scrollbarId}"]`
  );
  if (!scrollbarContainer) return;
  setScrolling(scrollbarContainer);
  scrollbarMove(e);
};

const scrollbarMove = (e: MouseEvent): void => {
  const scrollbarContainer = document.querySelector(`[scrolling]`);
  if (!scrollbarContainer) return
  e.preventDefault();
  e.stopPropagation();
  const direction = scrollbarContainer.getAttribute("direction");

  let scrollAmount = 0

  if (direction === 'vertical') scrollAmount = e.pageY - (window.scrollY + scrollbarContainer?.getBoundingClientRect().top)
  if (direction === 'horizontal') scrollAmount = e.pageX - (window.scrollX + scrollbarContainer?.getBoundingClientRect().left)

  setScrollbarPosition(scrollbarContainer, scrollAmount, { scrollbarOnly: false, adjustForHandleSize: true })
};

const scrollbarEnd = (e: MouseEvent): void => {
  e.preventDefault();
  e.stopPropagation();
  let scrollbars = document.querySelectorAll(`[${ATTRIBUTE_PREFIX}]`);
  for (let i = 0; i < scrollbars.length; i++) {
    scrollbars[i].removeAttribute("scrolling");
  }
};

const containerScroll = (e: Event, scrollbarId: String) => {
  const scrollbarContainer = document.querySelector(
    `[${ATTRIBUTE_PREFIX}="${scrollbarId}"]`
  );
  if (!scrollbarContainer) return;
  if (scrollbarContainer.getAttribute('scrolling')) return
  const contentContainer = document.querySelector(
    `[${ATTRIBUTE_PREFIX}-scrollable="${scrollbarId}"]`
  );
  if (!contentContainer) return;
  const scrollbarHandle: HTMLElement | null = scrollbarContainer.querySelector(
    `[${ATTRIBUTE_PREFIX}-handle]`
  );
  if (!scrollbarHandle) return;
  const direction = scrollbarContainer.getAttribute("direction");
  let percentage = 0
  let scrollAmount = 0
  if(direction === 'vertical') {
    percentage = contentContainer.scrollTop / (contentContainer.scrollHeight - contentContainer.clientHeight)
    scrollAmount = (scrollbarContainer.clientHeight  - scrollbarHandle.clientHeight) * percentage
  }
  else if(direction === 'horizontal') {
    percentage = contentContainer.scrollLeft / (contentContainer.scrollWidth - contentContainer.clientWidth)
    scrollAmount = (scrollbarContainer.clientWidth - scrollbarHandle.clientWidth) * percentage
  }
  setScrollbarPosition(scrollbarContainer, scrollAmount, { scrollbarOnly: true, adjustForHandleSize: false })
}

const containerWheel = (e: WheelEvent, scrollbarId: String) => {
  const scrollbarContainer = document.querySelector(
    `[${ATTRIBUTE_PREFIX}="${scrollbarId}"]`
  );
  if (!scrollbarContainer) return;
  e.preventDefault();
  e.stopPropagation();
  const scrollbarHandle: HTMLElement | null = scrollbarContainer.querySelector(
    `[${ATTRIBUTE_PREFIX}-handle]`
  );
  if (!scrollbarHandle) return;
  setScrolling(scrollbarContainer);
  const direction = scrollbarContainer.getAttribute("direction");
  const scrollSpeed = Number(scrollbarContainer.getAttribute("scrollSpeed"));
  let current = 0,
      scrollAmount = 0;
  if(direction === 'vertical') current = parseInt(scrollbarHandle.style.top)
  else if(direction === 'horizontal') current = parseInt(scrollbarHandle.style.left)
  if(isNaN(current)) current = 0
  scrollAmount = e.deltaY * (scrollSpeed / 10)
  setScrollbarPosition(scrollbarContainer, current + scrollAmount, { scrollbarOnly: false, adjustForHandleSize: false })

  scrollbarEnd(e)
}

/**
 * Initialise stylable scrollbars on the appropriate HTMLElements.
 */
// TODO: Add debug messages with a settings flag for 'debugResponse' and error messages.
const initStylableScrollbars = (settings?: StylableScrollbarSettings): StylableScrollbar[] => {
  if (settings && !settings.keepContainerScrollbars) hideDefaultScrollbars()
  else hideDefaultScrollbars()

  const scrollbars: HTMLElement[] = Array.from(document.querySelectorAll(
    `[${ATTRIBUTE_PREFIX}]`
  ));
  stylableScrollbars = [];
  for (let scrollbarContainer of scrollbars) {
    let scrollbarId = scrollbarContainer.getAttribute(`${ATTRIBUTE_PREFIX}`);
    let contentContainer = document.querySelector(
      `[${ATTRIBUTE_PREFIX}-scrollable="${scrollbarId}"]`
    );
    if (contentContainer) {
      let scrollbarDirection = scrollbarContainer.getAttribute(`direction`);
      let scrollSpeed = scrollbarContainer.getAttribute(`scrollspeed`);
      let responsive = scrollbarContainer.getAttribute(`responsive`);
      stylableScrollbars.push(
        new StylableScrollbar({
          scrollbarContainer,
          contentContainer,
          scrollbarId,
          scrollbarDirection,
          scrollSpeed,
          responsive
        })
      );
    }
  }

  for (let simpleScrollbar of stylableScrollbars) {
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
      scrollbarStart(e, scrollbarId)
    );
    contentContainer.addEventListener("scroll", (e) =>
      containerScroll(e, scrollbarId)
    );
    contentContainer.addEventListener("wheel", (e) => containerWheel(e, scrollbarId))
    canScroll(scrollbarContainer)
  }
  window.addEventListener("mousemove", scrollbarMove);
  window.addEventListener("mouseup", scrollbarEnd);
  window.addEventListener("mouseleave", scrollbarEnd);
  window.addEventListener("resize", () => {
    for(let scrollbar of scrollbars) {
      canScroll(scrollbar)
    }
  })
  return stylableScrollbars
};

export default initStylableScrollbars
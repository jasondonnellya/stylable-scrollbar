let ATTRIBUTE_PREFIX = 'simple-scrollbar'

const setupScrollbar = (scrollbarContainer) => {
  const scrollHandle = scrollbarContainer.querySelector(`[${ATTRIBUTE_PREFIX}-handle]`)
  if(!scrollHandle) return
  scrollHandle.style.position = 'absolute'
}

const setupContentContainer = (contentContainer) => {
  const scrollbarId = contentContainer.getAttribute(`${ATTRIBUTE_PREFIX}-scroll`)
  const scrollbarContainer = document.querySelector(`[${ATTRIBUTE_PREFIX}="${scrollbarId}"]`)
  const scrollbarInner = scrollbarContainer.querySelector(`[${ATTRIBUTE_PREFIX}-inner]`)
  scrollbarInner.style.position = 'relative'
  const direction = scrollbarContainer.getAttribute('direction')
  if(direction === 'horizontal') contentContainer.style.overflowX = 'auto'
  if(direction === 'vertical') contentContainer.style.overflowY = 'scroll' 
}

const disableAllChildren = (element) => {
  for (let i = 0; i < element.children.length; i++) {
    let child = element.children[i]
    disableAllChildren(child)
    child.style.pointerEvents = "none"
  }
};

const scrollStart = (e, scrollbarId) => {
  e.preventDefault()
  e.stopPropagation()
  const scrollbar = document.querySelector(`[${ATTRIBUTE_PREFIX}="${scrollbarId}"]`)
  scrollbar.setAttribute("scrolling", true)
  scrollMove(e, scrollbarId)
};

const scrollMove = (e) => {
  const scrollbarContainer = document.querySelector(`[scrolling]`)
  if(!scrollbarContainer) return
  const scrollbarId = scrollbarContainer.getAttribute(`${ATTRIBUTE_PREFIX}`)
  const contentContainer = document.querySelector(`[${ATTRIBUTE_PREFIX}-scroll="${scrollbarId}"]`)
  if(!contentContainer) return
  e.preventDefault()
  e.stopPropagation()
  const scrollInner = scrollbarContainer.querySelector(`[${ATTRIBUTE_PREFIX}-inner]`)
  const scrollHandle = scrollbarContainer.querySelector(`[${ATTRIBUTE_PREFIX}-handle]`)
  if (!scrollInner || !scrollHandle) return
  const direction = scrollbarContainer.getAttribute('direction')
  if(direction === 'horizontal') {
    const handleWidth = scrollHandle.clientWidth
    const containerWidth = scrollInner.clientWidth
    const min = 0
    const max = containerWidth - handleWidth
    const screenXOffset = window.scrollX + scrollInner.getBoundingClientRect().left
    let left = e.pageX - handleWidth / 2 - screenXOffset
    if (left < min) left = min
    if (left > max) left = max
    scrollHandle.style.left = `${left}px`
    let percentage = left / max
    let scrollLeft = (contentContainer.scrollWidth - contentContainer.clientWidth) * percentage
    if (scrollLeft < 0) scrollLeft = 0
    contentContainer.scrollLeft = scrollLeft
  }
  else if(direction === 'vertical') {
    const handleHeight = scrollHandle.clientHeight
    const containerHeight = scrollInner.clientHeight
    const min = 0
    const max = containerHeight - handleHeight
    const screenYOffset = window.scrollY + scrollInner.getBoundingClientRect().top
    let top = e.pageY - handleHeight / 2 - screenYOffset
    if (top < min) top = min
    if (top > max) top = max
    scrollHandle.style.top = `${top}px`
    let percentage = top / max
    let scrollTop = (contentContainer.scrollHeight - contentContainer.clientHeight) * percentage
    if (scrollTop < 0) scrollTop = 0
    contentContainer.scrollTop = scrollTop
  }
};

const scrollEnd = (e) => {
  e.preventDefault()
  e.stopPropagation()
  let elements = document.querySelectorAll(`[${ATTRIBUTE_PREFIX}]`)
  for (let i = 0; i < elements.length; i++) {
    elements[i].removeAttribute("scrolling")
  }
};

// We don't use this simpleScrollbars array when triggering events because scopes like this are not persistent.
let simpleScrollbars = []
// This class is simply to provide a clear, type strict reference to all the variables use by the scrollbars.
class SimpleScrollbar {
  constructor({ scrollbarId, scrollbarContainer, contentContainer, scrollbarDirection }) {
    this.scrollbarId = scrollbarId
    this.scrollbarContainer = scrollbarContainer
    this.contentContainer = contentContainer
    // Direction can be either 'vertical' or 'horizontal'
    this.scrollbarDirection = scrollbarDirection || 'vertical'
    if(this.scrollbarContainer) scrollbarContainer.setAttribute('direction', this.scrollbarDirection)
  }
}

const initSimpleScrollbars = () => {
  const scrollbars = document.querySelectorAll(`[${ATTRIBUTE_PREFIX}]`)
  simpleScrollbars = []
  for(let scrollbarContainer of scrollbars) {
    let scrollbarId = scrollbarContainer.getAttribute(`${ATTRIBUTE_PREFIX}`)
    let contentContainer = document.querySelector(`[${ATTRIBUTE_PREFIX}-scroll="${scrollbarId}"]`)
    let scrollbarDirection = scrollbarContainer.getAttribute(`direction`)
    simpleScrollbars.push(new SimpleScrollbar({ scrollbarContainer, contentContainer, scrollbarId, scrollbarDirection }))
  }
  
  for(let simpleScrollbar of simpleScrollbars) {
    let scrollbarId = simpleScrollbar.scrollbarId
    let scrollbarContainer = simpleScrollbar.scrollbarContainer
    let contentContainer = simpleScrollbar.contentContainer
    if (!scrollbarContainer || !contentContainer) return;
    disableAllChildren(scrollbarContainer);
    setupScrollbar(scrollbarContainer)
    setupContentContainer(contentContainer)
    scrollbarContainer.setAttribute("ondragstart", (e) => {
      e.preventDefault();
    });
    scrollbarContainer.addEventListener("mousedown", (e) => scrollStart(e, scrollbarId));
  }
  window.addEventListener("mousemove", scrollMove);
  window.addEventListener("mouseup", scrollEnd);
  window.addEventListener("mouseleave", scrollEnd);
};
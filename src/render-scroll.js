// A render may temporarily shrink the page while replacing several panels.
// Preserve the current position for that synchronous render only, never a
// cached position from before a user's wheel, touch or keyboard navigation.
export function preserveRenderScroll(document, draw) {
  const nodes = new Set([document.scrollingElement,
    ...document.querySelectorAll('main, .sidebar, #expanded-work-dialog')]);
  const positions = [...nodes].filter(node => node?.isConnected).map(node =>
    ({node, top:node.scrollTop, left:node.scrollLeft}));
  try { return draw(); }
  finally {
    for (const {node, top, left} of positions) {
      if (!node.isConnected) continue;
      if (node.scrollTop !== top) node.scrollTop = top;
      if (node.scrollLeft !== left) node.scrollLeft = left;
    }
  }
}

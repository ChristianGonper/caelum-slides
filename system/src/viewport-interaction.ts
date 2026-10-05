const interactiveSelector = 'a, button, input, textarea, select, label, [contenteditable], [role="button"], [role="slider"]';

export function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(interactiveSelector) !== null;
}

/** Keep mouse navigation separate from camera gestures and content controls. */
export function bindViewportNavigation(element: HTMLElement, advance: () => void, retreat: () => void): () => void {
  const view = element.ownerDocument.defaultView!;
  let press: { id: number; x: number; y: number; moved: boolean } | null = null;
  let pendingAdvance: ReturnType<typeof setTimeout> | null = null;
  const cancelAdvance = () => {
    if (pendingAdvance !== null) clearTimeout(pendingAdvance);
    pendingAdvance = null;
  };
  const cancel = () => { press = null; cancelAdvance(); };
  const down = (event: PointerEvent) => {
    press = event.pointerType === 'mouse' && event.button === 0 &&
      !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey &&
      !isInteractiveTarget(event.target)
      ? { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false } : null;
    if (!press) cancelAdvance();
  };
  const move = (event: PointerEvent) => {
    if (press && event.pointerId === press.id &&
      Math.hypot(event.clientX - press.x, event.clientY - press.y) > 5) press.moved = true;
  };
  const click = (event: MouseEvent) => {
    const start = press;
    press = null;
    if (!start || start.moved || event.defaultPrevented || event.button !== 0 ||
      event.ctrlKey || event.metaKey || event.altKey || event.shiftKey ||
      isInteractiveTarget(event.target) ||
      Math.hypot(event.clientX - start.x, event.clientY - start.y) > 5) return;
    element.focus({ preventScroll: true });
    if (event.detail === 2) {
      cancelAdvance();
      retreat();
    } else {
      // Wait for the second click so a double click never briefly advances.
      if (pendingAdvance !== null) {
        cancelAdvance();
        advance();
      }
      pendingAdvance = setTimeout(() => {
        pendingAdvance = null;
        advance();
      }, 500);
    }
  };
  element.addEventListener('pointerdown', down, true);
  element.addEventListener('click', click);
  view.addEventListener('pointermove', move, true);
  view.addEventListener('pointercancel', cancel, true);
  view.addEventListener('blur', cancel);
  view.addEventListener('keydown', cancelAdvance, true);
  view.addEventListener('wheel', cancelAdvance, true);
  return () => {
    cancel();
    element.removeEventListener('pointerdown', down, true);
    element.removeEventListener('click', click);
    view.removeEventListener('pointermove', move, true);
    view.removeEventListener('pointercancel', cancel, true);
    view.removeEventListener('blur', cancel);
    view.removeEventListener('keydown', cancelAdvance, true);
    view.removeEventListener('wheel', cancelAdvance, true);
  };
}

const interactiveSelector = 'a, button, input, textarea, select, label, [contenteditable], [role="button"], [role="slider"]';

export function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(interactiveSelector) !== null;
}

/** Keep mouse navigation separate from camera gestures and content controls. */
export function bindViewportNavigation(element: HTMLElement, advance: () => void): () => void {
  const view = element.ownerDocument.defaultView!;
  let press: { id: number; x: number; y: number; moved: boolean } | null = null;
  const cancel = () => { press = null; };
  const down = (event: PointerEvent) => {
    press = event.pointerType === 'mouse' && event.button === 0 &&
      !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey &&
      !isInteractiveTarget(event.target)
      ? { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false } : null;
  };
  const move = (event: PointerEvent) => {
    if (press && event.pointerId === press.id &&
      Math.hypot(event.clientX - press.x, event.clientY - press.y) > 5) press.moved = true;
  };
  const click = (event: MouseEvent) => {
    const start = press;
    cancel();
    if (!start || start.moved || event.defaultPrevented || event.button !== 0 ||
      event.ctrlKey || event.metaKey || event.altKey || event.shiftKey ||
      isInteractiveTarget(event.target) ||
      Math.hypot(event.clientX - start.x, event.clientY - start.y) > 5) return;
    element.focus({ preventScroll: true });
    advance();
  };
  element.addEventListener('pointerdown', down, true);
  element.addEventListener('click', click);
  view.addEventListener('pointermove', move, true);
  view.addEventListener('pointercancel', cancel, true);
  view.addEventListener('blur', cancel);
  return () => {
    element.removeEventListener('pointerdown', down, true);
    element.removeEventListener('click', click);
    view.removeEventListener('pointermove', move, true);
    view.removeEventListener('pointercancel', cancel, true);
    view.removeEventListener('blur', cancel);
  };
}

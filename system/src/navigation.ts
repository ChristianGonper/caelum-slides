import type { Presentation } from './model';

export type Navigation = { index: number; previousIndex: number | null };

export function navigateTo(current: Navigation, next: number, count: number): Navigation {
  if (!Number.isInteger(next) || next < 0 || next >= count || next === current.index) return current;
  return { index: next, previousIndex: current.index };
}

export function contextIndex(presentation: Presentation): number {
  if (presentation.contextStopId) {
    return presentation.stops.findIndex((stop) => stop.id === presentation.contextStopId);
  }
  return presentation.stops.findIndex((stop) => stop.cameraTargetId === 'overview');
}

export function changesContentInPlace(
  presentation: Presentation, fromIndex: number | null, toIndex: number, elementId: string,
): boolean {
  if (fromIndex === null) return false;
  const from = presentation.stops[fromIndex];
  const to = presentation.stops[toIndex];
  return from.cameraTargetId === to.cameraTargetId &&
    from.visibleIds.includes(elementId) && to.visibleIds.includes(elementId) &&
    from.stateByElement?.[elementId] !== to.stateByElement?.[elementId];
}

import type { NarrativeStop, Presentation } from './model';

/** A positional narrative snapshot, also deterministic for direct jumps and static pages. */
export function resolveCanvasStop(presentation: Presentation, stop: NarrativeStop): NarrativeStop {
  // Explicit empty scenes (for example the black start) remain empty.
  if (stop.visibleIds.length === 0) return stop;
  const index = presentation.stops.findIndex(item => item.id === stop.id);
  const stateByElement: Record<string, string> = {};
  for (const element of presentation.elements) {
    const stateStops = presentation.stops.filter(item => item.stateByElement?.[element.id] !== undefined);
    const reached = stateStops.filter(item => presentation.stops.indexOf(item) <= index);
    const state = stop.stateByElement?.[element.id] ??
      reached.at(-1)?.stateByElement?.[element.id] ??
      stateStops[0]?.stateByElement?.[element.id] ?? element.states?.[0];
    if (state !== undefined) stateByElement[element.id] = state;
  }
  return { ...stop, visibleIds: presentation.elements.map(element => element.id), stateByElement };
}

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

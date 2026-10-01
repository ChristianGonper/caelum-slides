export type Rect = { x: number; y: number; width: number; height: number };
export type ElementKind = 'cover' | 'block' | 'slide';

export type SpatialElement = {
  id: string;
  kind: ElementKind;
  label: string;
  bounds: Rect;
  parentId?: string;
  states?: readonly string[];
};

export type NarrativeStop = {
  id: string;
  label: string;
  cameraTargetId: string;
  visibleIds: readonly string[];
  stateByElement?: Readonly<Record<string, string>>;
  padding?: number;
  /** Optional wide frame before the final fit when entering from another target. */
  cameraVia?: Rect;
  includeInStatic?: boolean;
  hideBadge?: boolean;
  hideControls?: boolean;
};

export type Presentation = {
  title: string;
  elements: readonly SpatialElement[];
  stops: readonly NarrativeStop[];
  overview: Rect;
  contextStopId?: string;
  cameraTransitionMs?: number;
};

export function validatePresentation(presentation: Presentation): void {
  if (presentation.stops.length === 0) throw new Error('El recorrido está vacío');
  if (presentation.cameraTransitionMs !== undefined &&
      (!Number.isFinite(presentation.cameraTransitionMs) || presentation.cameraTransitionMs <= 0)) {
    throw new Error('La duración del movimiento de cámara debe ser positiva');
  }
  const elements = new Map<string, SpatialElement>();
  for (const element of presentation.elements) {
    if (elements.has(element.id)) throw new Error(`Elemento duplicado: ${element.id}`);
    if (element.bounds.width <= 0 || element.bounds.height <= 0) {
      throw new Error(`Dimensiones inválidas: ${element.id}`);
    }
    elements.set(element.id, element);
  }
  for (const element of presentation.elements) {
    if (element.parentId && elements.get(element.parentId)?.kind !== 'block') {
      throw new Error(`Bloque padre inexistente: ${element.id}`);
    }
  }
  const stopIds = new Set<string>();
  for (const stop of presentation.stops) {
    if (stopIds.has(stop.id)) throw new Error(`Parada duplicada: ${stop.id}`);
    stopIds.add(stop.id);
    if (!elements.has(stop.cameraTargetId) && stop.cameraTargetId !== 'overview') {
      throw new Error(`Objetivo de cámara inexistente: ${stop.id}`);
    }
    const visible = new Set(stop.visibleIds);
    if (visible.size !== stop.visibleIds.length) throw new Error(`Visibilidad duplicada: ${stop.id}`);
    for (const id of visible) {
      if (!elements.has(id)) throw new Error(`Elemento visible inexistente: ${stop.id}/${id}`);
    }
    for (const [id, state] of Object.entries(stop.stateByElement ?? {})) {
      const element = elements.get(id);
      if (!visible.has(id) || !element?.states?.includes(state)) {
        throw new Error(`Estado inválido: ${stop.id}/${id}/${state}`);
      }
    }
    if (stop.padding !== undefined && (!Number.isFinite(stop.padding) || stop.padding < 0)) {
      throw new Error(`Margen de encuadre inválido en parada: ${stop.id}`);
    }
    if (stop.cameraVia && (![stop.cameraVia.x, stop.cameraVia.y, stop.cameraVia.width, stop.cameraVia.height].every(Number.isFinite) ||
        stop.cameraVia.width <= 0 || stop.cameraVia.height <= 0)) {
      throw new Error(`Encuadre intermedio inválido: ${stop.id}`);
    }
    if (stop.includeInStatic !== undefined && typeof stop.includeInStatic !== 'boolean') {
      throw new Error(`Configuración estática inválida en parada: ${stop.id}`);
    }
    if (stop.hideBadge !== undefined && typeof stop.hideBadge !== 'boolean') {
      throw new Error(`Configuración de indicador inválida en parada: ${stop.id}`);
    }
    if (stop.hideControls !== undefined && typeof stop.hideControls !== 'boolean') {
      throw new Error(`Configuración de controles inválida en parada: ${stop.id}`);
    }
  }
  if (presentation.contextStopId) {
    const context = presentation.stops.find((stop) => stop.id === presentation.contextStopId);
    if (!context || context.cameraTargetId !== 'overview') {
      throw new Error(`Parada de contexto inválida: ${presentation.contextStopId}`);
    }
  }
}

export function boundsOf(presentation: Presentation, targetId: string): Rect {
  if (targetId === 'overview') return presentation.overview;
  const element = presentation.elements.find((item) => item.id === targetId);
  if (!element) throw new Error(`Objetivo de cámara inexistente: ${targetId}`);
  return element.bounds;
}

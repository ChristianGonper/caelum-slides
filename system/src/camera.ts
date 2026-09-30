import type { Rect } from './model';

export type CameraTransform = { x: number; y: number; k: number };
export type Viewport = { width: number; height: number };

export function fitRect(bounds: Rect, viewport: Viewport, padding = 48): CameraTransform {
  if (bounds.width <= 0 || bounds.height <= 0 || viewport.width <= 0 || viewport.height <= 0) {
    throw new Error('El encuadre requiere dimensiones positivas');
  }
  if (!Number.isFinite(padding) || padding < 0) {
    throw new Error('El margen de encuadre debe ser no negativo');
  }
  const availableWidth = Math.max(1, viewport.width - padding * 2);
  const availableHeight = Math.max(1, viewport.height - padding * 2);
  const k = Math.min(availableWidth / bounds.width, availableHeight / bounds.height);
  return {
    x: (viewport.width - k * (bounds.x * 2 + bounds.width)) / 2,
    y: (viewport.height - k * (bounds.y * 2 + bounds.height)) / 2,
    k,
  };
}

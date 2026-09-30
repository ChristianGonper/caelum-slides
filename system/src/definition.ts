import type { ComponentType } from 'react';
import { validatePresentation, type NarrativeStop, type Presentation, type SpatialElement } from './model';
import { validateThemes, type Theme } from './theme';

export type ContentProps = {
  element: SpatialElement;
  state?: string;
  output?: 'interactive' | 'static';
};
export type PersistentProps = { stop: NarrativeStop; index: number; total: number };

export type PresentationDefinition = {
  id: string;
  model: Presentation;
  content: Readonly<Record<string, ComponentType<ContentProps>>>;
  themes: readonly Theme[];
  defaultThemeId: string;
  visual?: {
    canvasBackground?: string;
    elementBackgrounds?: Readonly<Record<string, string>>;
    decoration?: ComponentType;
    persistent?: {
      default?: ComponentType<PersistentProps>;
      byStop?: Readonly<Record<string, ComponentType<PersistentProps> | null>>;
    };
  };
};

export function validateDefinition(definition: PresentationDefinition): void {
  validatePresentation(definition.model);
  if (!/^[a-z][a-z0-9-]*$/.test(definition.id)) {
    throw new Error(`Identificador de presentación inválido: ${definition.id}`);
  }
  const elementIds = new Set(definition.model.elements.map((element) => element.id));
  for (const element of definition.model.elements) {
    if (!definition.content[element.id]) throw new Error(`Contenido inexistente: ${element.id}`);
  }
  for (const id of Object.keys(definition.content)) {
    if (!elementIds.has(id)) throw new Error(`Contenido sin elemento espacial: ${id}`);
  }
  validateThemes(definition.themes, definition.defaultThemeId);
  if (definition.visual?.canvasBackground !== undefined &&
      !definition.visual.canvasBackground.trim()) {
    throw new Error('Fondo del lienzo vacío');
  }
  for (const [id, background] of Object.entries(definition.visual?.elementBackgrounds ?? {})) {
    if (!elementIds.has(id) || !background.trim()) {
      throw new Error(`Fondo de elemento inválido: ${id}`);
    }
  }
  const stopIds = new Set(definition.model.stops.map((stop) => stop.id));
  for (const id of Object.keys(definition.visual?.persistent?.byStop ?? {})) {
    if (!stopIds.has(id)) throw new Error(`Elemento persistente para parada inexistente: ${id}`);
  }
}

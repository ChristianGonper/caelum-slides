import type { ComponentType } from 'react';
import { validatePresentation, type Presentation, type SpatialElement } from './model';

export type ContentProps = { element: SpatialElement; state?: string };

export type PresentationDefinition = {
  id: string;
  model: Presentation;
  content: Readonly<Record<string, ComponentType<ContentProps>>>;
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
}

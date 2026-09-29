import type { PresentationDefinition } from '../../system/src/definition';
import { Block, Cover, Slide } from './content';
import './styles.css';

const model: PresentationDefinition['model'] = {
  title: 'Ruta diagonal',
  cameraTransitionMs: 1100,
  overview: { x: -900, y: -680, width: 1950, height: 1820 },
  elements: [
    { id: 'cover', kind: 'cover', label: 'Inicio y cierre',
      bounds: { x: -390, y: -550, width: 780, height: 290 }, states: ['intro', 'closing'] },
    { id: 'block-north', kind: 'block', label: 'Norte',
      bounds: { x: -780, y: -115, width: 830, height: 510 } },
    { id: 'slide-north', kind: 'slide', label: 'Norte: detalle', parentId: 'block-north',
      bounds: { x: -690, y: 0, width: 650, height: 366 } },
    { id: 'block-south', kind: 'block', label: 'Sur',
      bounds: { x: 150, y: 510, width: 830, height: 510 } },
    { id: 'slide-south', kind: 'slide', label: 'Sur: detalle', parentId: 'block-south',
      bounds: { x: 240, y: 625, width: 650, height: 366 } },
  ],
  stops: [
    { id: 'intro', label: 'Vista general', cameraTargetId: 'overview',
      visibleIds: ['cover', 'block-north', 'block-south'], stateByElement: { cover: 'intro' } },
    { id: 'south-block', label: 'Bloque sur', cameraTargetId: 'block-south',
      visibleIds: ['block-south', 'slide-south'] },
    { id: 'south-slide', label: 'Detalle sur', cameraTargetId: 'slide-south',
      visibleIds: ['block-south', 'slide-south'] },
    { id: 'context', label: 'Volver al mapa', cameraTargetId: 'overview',
      visibleIds: ['cover', 'block-north', 'block-south'], stateByElement: { cover: 'intro' } },
    { id: 'north-block', label: 'Bloque norte', cameraTargetId: 'block-north',
      visibleIds: ['block-north', 'slide-north'] },
    { id: 'north-slide', label: 'Detalle norte', cameraTargetId: 'slide-north',
      visibleIds: ['block-north', 'slide-north'] },
    { id: 'closing', label: 'Cierre', cameraTargetId: 'overview',
      visibleIds: ['cover', 'block-north', 'block-south'], stateByElement: { cover: 'closing' } },
  ],
};

export const diagonalPresentation: PresentationDefinition = {
  id: 'ruta-diagonal',
  model,
  content: {
    cover: Cover,
    'block-north': Block,
    'slide-north': Slide,
    'block-south': Block,
    'slide-south': Slide,
  },
};

import type { PresentationDefinition } from '../../system/src/definition';
import { deepTeal, monochromeBlue, primarySpace } from '../../system/src/palettes';
import { Block, Cover, SlideA, SlideB } from './content';
import { ClosingMark, Decoration, Progress } from './visual';
import './styles.css';

const model: PresentationDefinition['model'] = {
  title: 'Prototipo espacial',
  cameraTransitionMs: 850,
  contextStopId: 'return',
  overview: { x: -1140, y: -570, width: 2280, height: 1140 },
  elements: [
    {
      id: 'cover', kind: 'cover', label: 'Centro',
      bounds: { x: -355, y: -425, width: 710, height: 290 },
      states: ['intro', 'closing'],
    },
    {
      id: 'block-a', kind: 'block', label: 'Bloque A',
      bounds: { x: -1010, y: -55, width: 900, height: 540 },
    },
    {
      id: 'slide-a', kind: 'slide', label: 'Diapositiva A', parentId: 'block-a',
      bounds: { x: -910, y: 60, width: 700, height: 394 },
      states: ['question', 'answer'],
    },
    {
      id: 'block-b', kind: 'block', label: 'Bloque B',
      bounds: { x: 110, y: -55, width: 900, height: 540 },
    },
    {
      id: 'slide-b', kind: 'slide', label: 'Diapositiva B', parentId: 'block-b',
      bounds: { x: 210, y: 60, width: 700, height: 394 },
      states: ['only'],
    },
  ],
  stops: [
    { id: 'intro', label: 'Vista general', cameraTargetId: 'overview',
      visibleIds: ['cover', 'block-a', 'block-b'], stateByElement: { cover: 'intro' } },
    { id: 'block-a', label: 'Entrar en A', cameraTargetId: 'block-a',
      visibleIds: ['block-a', 'slide-a'], stateByElement: { 'slide-a': 'question' } },
    { id: 'question', label: 'Pregunta', cameraTargetId: 'slide-a',
      visibleIds: ['block-a', 'slide-a'], stateByElement: { 'slide-a': 'question' } },
    { id: 'answer', label: 'Respuesta', cameraTargetId: 'slide-a',
      visibleIds: ['block-a', 'slide-a'], stateByElement: { 'slide-a': 'answer' } },
    { id: 'return', label: 'Volver al contexto', cameraTargetId: 'overview',
      visibleIds: ['cover', 'block-a', 'block-b'], stateByElement: { cover: 'intro' } },
    { id: 'block-b', label: 'Entrar en B', cameraTargetId: 'block-b',
      visibleIds: ['block-b', 'slide-b'], stateByElement: { 'slide-b': 'only' } },
    { id: 'second', label: 'Diapositiva B', cameraTargetId: 'slide-b',
      visibleIds: ['block-b', 'slide-b'], stateByElement: { 'slide-b': 'only' } },
    { id: 'closing', label: 'Cierre', cameraTargetId: 'overview',
      visibleIds: ['cover', 'block-a', 'block-b'], stateByElement: { cover: 'closing' } },
  ],
};

export const prototypePresentation: PresentationDefinition = {
  id: 'prototipo-espacial',
  model,
  themes: [deepTeal, primarySpace, monochromeBlue],
  defaultThemeId: 'deep-teal',
  visual: {
    decoration: Decoration,
    elementBackgrounds: {
      'block-b': 'linear-gradient(145deg, color-mix(in srgb, var(--graphic) 30%, var(--surface)), var(--background-secondary))',
      'slide-b': 'linear-gradient(135deg, color-mix(in srgb, var(--graphic) 38%, var(--surface)), var(--background-secondary))',
    },
    persistent: { default: Progress, byStop: { intro: null, closing: ClosingMark } },
  },
  content: {
    cover: Cover,
    'block-a': Block,
    'slide-a': SlideA,
    'block-b': Block,
    'slide-b': SlideB,
  },
};

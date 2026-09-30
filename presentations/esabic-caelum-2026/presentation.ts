import type { PresentationDefinition } from '../../system/src/definition';
import { deepTeal, monochromeBlue, primarySpace } from '../../system/src/palettes';
import {
  BlockAContent,
  BlockBContent,
  BlockCContent,
  BlockDContent,
  BlockEContent,
  BlockFContent,
  CenterContent,
  PersistentFooter,
} from './content';
import { ExperimentalSchema } from './illustrated-schema';
import { introFraming } from './experiments';
import { ExperimentControls } from './experiment-controls';
import './styles.css';

const model: PresentationDefinition['model'] = {
  title: 'Caelum Systems — ESA BIC Castilla y León 2026',
  cameraTransitionMs: 1000,
  contextStopId: 'overview',
  overview: introFraming,
  elements: [
    {
      id: 'center',
      kind: 'cover',
      label: 'Centro',
      bounds: { x: -480, y: -270, width: 960, height: 540 },
      states: ['intro', 'closing', 'contacts'],
    },
    {
      id: 'block-a',
      kind: 'block',
      label: 'Contexto',
      bounds: { x: -640, y: -1720, width: 1280, height: 720 },
      states: ['nuclear', 'space'],
    },
    {
      id: 'block-b',
      kind: 'block',
      label: 'La brecha de respuesta',
      bounds: { x: 590, y: -895, width: 1120, height: 630 },
    },
    {
      id: 'block-c',
      kind: 'block',
      label: 'Nuestra solución',
      bounds: { x: 590, y: 265, width: 1120, height: 630 },
    },
    {
      id: 'block-d',
      kind: 'block',
      label: 'Aplicación espacial y mercado',
      bounds: { x: -560, y: 785, width: 1120, height: 630 },
    },
    {
      id: 'block-e',
      kind: 'block',
      label: 'Modelo y viabilidad',
      bounds: { x: -1710, y: 265, width: 1120, height: 630 },
    },
    {
      id: 'block-f',
      kind: 'block',
      label: 'Equipo y red de apoyo',
      bounds: { x: -1710, y: -895, width: 1120, height: 630 },
      states: ['team', 'network'],
    },
  ],
  stops: [
    {
      id: 'black',
      label: 'Inicio en negro',
      cameraTargetId: 'block-a',
      visibleIds: [],
      includeInStatic: false,
      hideBadge: true,
      hideControls: true,
    },
    {
      id: 'opening-nuclear',
      label: 'Central nuclear',
      cameraTargetId: 'block-a',
      visibleIds: ['block-a'],
      stateByElement: { 'block-a': 'nuclear' },
      padding: 0,
      includeInStatic: true,
    },
    {
      id: 'opening-space',
      label: 'Antenas de espacio profundo',
      cameraTargetId: 'block-a',
      visibleIds: ['block-a'],
      stateByElement: { 'block-a': 'space' },
      padding: 0,
      includeInStatic: true,
    },
    {
      id: 'overview',
      label: 'Vista general del sistema',
      cameraTargetId: 'overview',
      visibleIds: ['center', 'block-a', 'block-b', 'block-c', 'block-d', 'block-e', 'block-f'],
      stateByElement: { center: 'intro' },
      includeInStatic: true,
    },
    {
      id: 'response-gap',
      label: 'La brecha de respuesta',
      cameraTargetId: 'block-b',
      visibleIds: ['block-b'],
      includeInStatic: true,
    },
    {
      id: 'solution',
      label: 'Nuestra solución: R.A.R.',
      cameraTargetId: 'block-c',
      visibleIds: ['block-c'],
      includeInStatic: true,
    },
    {
      id: 'space-market',
      label: 'Aplicación espacial y mercado',
      cameraTargetId: 'block-d',
      visibleIds: ['block-d'],
      includeInStatic: true,
    },
    {
      id: 'business',
      label: 'Modelo y viabilidad',
      cameraTargetId: 'block-e',
      visibleIds: ['block-e'],
      includeInStatic: true,
    },
    {
      id: 'team',
      label: 'Equipo Caelum',
      cameraTargetId: 'block-f',
      visibleIds: ['block-f'],
      stateByElement: { 'block-f': 'team' },
      includeInStatic: true,
    },
    {
      id: 'network',
      label: 'Red de apoyo institucional',
      cameraTargetId: 'block-f',
      visibleIds: ['block-f'],
      stateByElement: { 'block-f': 'network' },
      includeInStatic: true,
    },
    {
      id: 'closing',
      label: 'Cierre',
      cameraTargetId: 'center',
      visibleIds: ['center'],
      stateByElement: { center: 'closing' },
      includeInStatic: true,
    },
    {
      id: 'contacts',
      label: 'Contactos',
      cameraTargetId: 'center',
      visibleIds: ['center'],
      stateByElement: { center: 'contacts' },
      includeInStatic: true,
    },
  ],
};

export const esabicCaelum2026Presentation: PresentationDefinition = {
  id: 'esabic-caelum-2026',
  model,
  themes: [primarySpace, deepTeal, monochromeBlue],
  defaultThemeId: 'primary-space',
  visual: {
    reviewControls: ExperimentControls,
    decoration: ExperimentalSchema,
    decorationByStop: {
      black: false,
      'opening-nuclear': false,
      'opening-space': false,
      overview: true,
      'response-gap': true,
      solution: true,
      'space-market': true,
      business: true,
      team: true,
      network: true,
      closing: true,
      contacts: true,
    },
    canvasByStop: {
      black: '#000000',
    },
    canvasBackground:
      'radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--surface) 25%, var(--background-primary)), var(--background-primary))',
    elementBackgrounds: {
      'block-a': 'transparent',
      'block-b': 'transparent',
      'block-c': 'transparent',
      'block-d': 'transparent',
      'block-e': 'transparent',
      'block-f': 'transparent',
    },
    persistent: {
      default: PersistentFooter,
      byStop: {
        black: null,
        overview: null,
      },
    },
  },
  content: {
    center: CenterContent,
    'block-a': BlockAContent,
    'block-b': BlockBContent,
    'block-c': BlockCContent,
    'block-d': BlockDContent,
    'block-e': BlockEContent,
    'block-f': BlockFContent,
  },
};

export const presentation = esabicCaelum2026Presentation;
export default esabicCaelum2026Presentation;

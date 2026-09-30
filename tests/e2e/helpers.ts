import fs from 'node:fs';
import path from 'node:path';
import type { PresentationDefinition } from '../../system/src/definition';
import type { Rect } from '../../system/src/model';

export const CAELUM_DECK_ID = 'esabic-caelum-2026';
export const CAELUM_DECK_TITLE = 'Caelum Systems — ESA BIC Castilla y León 2026';

export type ExpectedStopSpec = {
  id: string;
  label: string;
  cameraTargetId: string;
  stateByElement?: Record<string, string>;
  contentNumber?: string | null;
  padding?: number;
  includeInStatic?: boolean;
  hideBadge?: boolean;
  hideControls?: boolean;
};

export const EXPECTED_NOMINAL_STOPS: readonly ExpectedStopSpec[] = [
  {
    id: 'black',
    label: 'Inicio en negro',
    cameraTargetId: 'block-a',
    contentNumber: null,
    includeInStatic: false,
    hideBadge: true,
    hideControls: true,
  },
  {
    id: 'opening-nuclear',
    label: 'Central nuclear',
    cameraTargetId: 'block-a',
    stateByElement: { 'block-a': 'nuclear' },
    contentNumber: '01',
    padding: 0,
    includeInStatic: true,
  },
  {
    id: 'opening-space',
    label: 'Antenas de espacio profundo',
    cameraTargetId: 'block-a',
    stateByElement: { 'block-a': 'space' },
    contentNumber: '02',
    padding: 0,
    includeInStatic: true,
  },
  {
    id: 'overview',
    label: 'Vista general del sistema',
    cameraTargetId: 'overview',
    stateByElement: { center: 'intro' },
    contentNumber: null,
    includeInStatic: true,
  },
  {
    id: 'response-gap',
    label: 'La brecha de respuesta',
    cameraTargetId: 'block-b',
    contentNumber: '03',
    includeInStatic: true,
  },
  {
    id: 'solution',
    label: 'Nuestra solución: R.A.R.',
    cameraTargetId: 'block-c',
    contentNumber: '04',
    includeInStatic: true,
  },
  {
    id: 'space-market',
    label: 'Aplicación espacial y mercado',
    cameraTargetId: 'block-d',
    contentNumber: '05',
    includeInStatic: true,
  },
  {
    id: 'business',
    label: 'Modelo y viabilidad',
    cameraTargetId: 'block-e',
    contentNumber: '06',
    includeInStatic: true,
  },
  {
    id: 'team',
    label: 'Equipo Caelum',
    cameraTargetId: 'block-f',
    stateByElement: { 'block-f': 'team' },
    contentNumber: '07',
    includeInStatic: true,
  },
  {
    id: 'network',
    label: 'Red de apoyo institucional',
    cameraTargetId: 'block-f',
    stateByElement: { 'block-f': 'network' },
    contentNumber: '08',
    includeInStatic: true,
  },
  {
    id: 'closing',
    label: 'Cierre y contactos',
    cameraTargetId: 'center',
    stateByElement: { center: 'closing' },
    contentNumber: '09',
    includeInStatic: true,
  },
];

export const REQUIRED_LOCAL_IMAGES = [
  'nuclear-station.jpeg',
  'two-antennas-deep.jpg',
  'Cebreros_station_pillars.jpg',
  'drone-mounting-clean.png',
  'Foto Equipazo Bolas.JPG',
  'Foto SC Guapa - Cara.jpg',
  'Alejandro_foto_perfil.jpg',
  'Christian-picture.jpg',
  'logotipo-universidad-de-leon-01.jpg',
  'intaa.jpg',
  'aee.jpg',
  'ESA_Logo_pillars.jpg',
  'drone-defending.png',
  'multi-drone-mounting.png',
  'system-views.png',
  'Centro_para_el_Desarrollo_Tecnologico_Industrial_CDTI_pillars.jpg',
] as const;

export const TEAM_MEMBERS = [
  {
    name: 'Guillermo Alba Buitrón',
    rawUrl: 'https://www.linkedin.com/in/guillermo-alba-buitrón-07366b254/',
    encodedUrl: 'https://www.linkedin.com/in/guillermo-alba-buitr%C3%B3n-07366b254/',
    roleSlide8: 'Project management · Systems architecture · Business development',
    roleSlide10: 'Project Management & Business',
  },
  {
    name: 'Alejandro Gil Getino',
    rawUrl: 'https://www.linkedin.com/in/alejandro-gil-getino-6b94733b8/?isSelfProfile=false',
    encodedUrl: 'https://www.linkedin.com/in/alejandro-gil-getino-6b94733b8/?isSelfProfile=false',
    roleSlide8: 'Electronics · Avionics · Power systems · Control and software',
    roleSlide10: 'Electronics, Avionics & Control',
  },
  {
    name: 'Christian González Pérez',
    rawUrl: 'https://www.linkedin.com/in/christiangonzalezperez/?isSelfProfile=true',
    encodedUrl: 'https://www.linkedin.com/in/christiangonzalezperez/?isSelfProfile=true',
    roleSlide8: 'Acoustics · Data analysis · Financing · Aeroelastic and structural modelling and simulation',
    roleSlide10: 'Acoustics & Simulation',
  },
] as const;

export const PERSISTENT_FOOTER_TEXT = 'Caelum Systems · ESA BIC CYL 2026';

export const SCIENTIFIC_CITATION =
  '* Scientific context, conceptual study : A. I. Toropov, “Acoustic Resonance Weapons for Drone Interdiction”, Drones and Autonomous Vehicles, 2026.';

export const MISSION_SLOGAN =
  'Protecting Europe’s space ground infrastructure with disruptive sound technologies.';

export function getProjectRoot(): string {
  return process.cwd();
}

export function isCaelumDeckAvailable(): boolean {
  const filePath = path.join(getProjectRoot(), 'presentations/esabic-caelum-2026/presentation.ts');
  return fs.existsSync(filePath);
}

export async function loadCaelumDeck(): Promise<PresentationDefinition | null> {
  const filePath = path.join(getProjectRoot(), 'presentations/esabic-caelum-2026/presentation.ts');
  if (!fs.existsSync(filePath)) return null;
  try {
    const mod = await import(/* @vite-ignore */ filePath);
    return mod.esabicCaelum2026Presentation ?? mod.default ?? mod.presentation ?? null;
  } catch (err) {
    console.warn('Could not load Caelum presentation module:', err);
    return null;
  }
}

export function loadExportedHtml(): string | null {
  const htmlPath = path.join(getProjectRoot(), 'output/html/caelum-slides.html');
  if (!fs.existsSync(htmlPath)) return null;
  return fs.readFileSync(htmlPath, 'utf8');
}

export function isPdfAvailable(): boolean {
  const pdfPath = path.join(getProjectRoot(), 'output/pdf/esabic-caelum-2026.pdf');
  return fs.existsSync(pdfPath);
}

export function loadExportedPdf(): Uint8Array | null {
  const pdfPath = path.join(getProjectRoot(), 'output/pdf/esabic-caelum-2026.pdf');
  if (!fs.existsSync(pdfPath)) return null;
  return fs.readFileSync(pdfPath);
}

export function calculateClockPolarAngle(center: { x: number; y: number }, target: { x: number; y: number }): number {
  const dx = target.x - center.x;
  const dy = target.y - center.y;
  let angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
  let clockDeg = (angleDeg + 90 + 360) % 360;
  return clockDeg;
}

export function calculateRadius(center: { x: number; y: number }, target: { x: number; y: number }): number {
  const dx = target.x - center.x;
  const dy = target.y - center.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function elementCenter(bounds: Rect): { x: number; y: number } {
  return {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2,
  };
}

export function calculateRelativeLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function calculateContrastRatio(foregroundHex: string, backgroundHex: string): number {
  const l1 = calculateRelativeLuminance(foregroundHex);
  const l2 = calculateRelativeLuminance(backgroundHex);
  const brighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (brighter + 0.05) / (darker + 0.05);
}

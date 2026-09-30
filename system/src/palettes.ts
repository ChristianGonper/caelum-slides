import primary from '../themes/primary-space.json';
import teal from '../themes/deep-teal.json';
import blue from '../themes/monochrome-blue.json';
import deepSpaceJson from '../themes/deep-space.json';
import whitePaperJson from '../themes/white-paper.json';
import type { Theme } from './theme';

export const primarySpace: Theme = { id: 'primary-space', label: primary.name, tokens: primary.tokens };
export const deepTeal: Theme = { id: 'deep-teal', label: teal.name, tokens: teal.tokens };
export const monochromeBlue: Theme = { id: 'monochrome-blue', label: blue.name, tokens: blue.tokens };

export const deepSpace: Theme = { id: 'deep-space', label: deepSpaceJson.name, tokens: deepSpaceJson.tokens };
export const whitePaper: Theme = { id: 'white-paper', label: whitePaperJson.name, tokens: whitePaperJson.tokens };

/**
 * Tabla de alias y resolución para los temas del sistema.
 * Soporta de forma directa consultas como ?theme=white-paper o ?theme=deep-space (R4).
 */
export const themeAliases: Record<string, string> = {
  'deep-space': 'deep-space',
  'white-paper': 'white-paper',
  'primary-space': 'primary-space',
  'deep-teal': 'deep-teal',
  'monochrome-blue': 'monochrome-blue',
};

export const defaultThemes: readonly Theme[] = [primarySpace, deepTeal, monochromeBlue];
export const allThemes: readonly Theme[] = [primarySpace, deepTeal, monochromeBlue, deepSpace, whitePaper];


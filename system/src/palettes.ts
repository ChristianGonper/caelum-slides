import primary from '../themes/primary-space.json';
import teal from '../themes/deep-teal.json';
import blue from '../themes/monochrome-blue.json';
import type { Theme } from './theme';

export const primarySpace: Theme = { id: 'primary-space', label: primary.name, tokens: primary.tokens };
export const deepTeal: Theme = { id: 'deep-teal', label: teal.name, tokens: teal.tokens };
export const monochromeBlue: Theme = { id: 'monochrome-blue', label: blue.name, tokens: blue.tokens };

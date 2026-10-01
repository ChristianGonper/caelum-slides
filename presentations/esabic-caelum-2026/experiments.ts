// Independent visual trials. Change each default or compare via URL parameters.
export const experimentDefaults = { intro: 'focus' } as const;
const query = typeof window === 'undefined' ? new URLSearchParams() : new URLSearchParams(window.location.search);
export const introVariant = query.get('intro') === 'map' ? 'map' : experimentDefaults.intro;
export const introFraming = introVariant === 'map'
  ? { x: -2100, y: -1880, width: 4200, height: 3480 }
  : { x: -480, y: -270, width: 960, height: 540 };

export const highlightColors = { blue: '#4DA3FF', cyan: '#67E8F9', amber: '#FCD34D', lavender: '#C4B5FD' } as const;
const requestedHighlight = query.get('highlight') ?? 'blue';
export const highlightVariant = (Object.hasOwn(highlightColors, requestedHighlight) ? requestedHighlight : 'blue') as keyof typeof highlightColors;
if (typeof document !== 'undefined') document.documentElement.style.setProperty('--keyword-color', highlightColors[highlightVariant]);

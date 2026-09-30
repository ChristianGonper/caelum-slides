// Independent visual trials. Change each default or compare via URL parameters.
export const experimentDefaults = { intro: 'focus', diagram: 'illustrated' } as const;
const query = typeof window === 'undefined' ? new URLSearchParams() : new URLSearchParams(window.location.search);
export const introVariant = query.get('intro') === 'map' ? 'map' : experimentDefaults.intro;
const exported = typeof window !== 'undefined' &&
  (window as Window & { __CAELUM_EXPORT__?: boolean }).__CAELUM_EXPORT__ === true;
export const diagramVariant = query.get('diagram') === 'illustrated' ? 'illustrated'
  : query.get('diagram') === 'blueprint' || query.get('view') === 'static' || exported
    ? 'blueprint' : experimentDefaults.diagram;

export const introFraming = introVariant === 'map'
  ? { x: -2100, y: -1880, width: 4200, height: 3480 }
  : { x: -850, y: -500, width: 1700, height: 1000 };

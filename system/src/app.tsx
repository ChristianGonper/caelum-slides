import React from 'react';
import { select } from 'd3-selection';
import 'd3-transition';
import { zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom';
import { fitRect, type CameraTransform } from './camera';
import type { PresentationDefinition } from './definition';
import { boundsOf } from './model';
import { changesContentInPlace, contextIndex, navigateTo, type Navigation } from './navigation';
import { Scene } from './scene';
import { themeVariables } from './theme';
import { bindViewportNavigation, isInteractiveTarget } from './viewport-interaction';
import './styles.css';

export type AppMode = 'review' | 'present';

export function App({ definition, available }: {
  definition: PresentationDefinition;
  available: readonly Pick<PresentationDefinition, 'id' | 'model'>[];
}) {
  const presentation = definition.model;
  const [mode, setMode] = React.useState<AppMode>(() => {
    if (typeof window === 'undefined') return 'review';
    const requested = new URLSearchParams(window.location.search).get('mode');
    return requested === 'present' ? 'present' : 'review';
  });
  const [navigation, setNavigation] = React.useState<Navigation>(() => {
    const requested = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('stop');
    const index = presentation.stops.findIndex(item => item.id === requested);
    return { index: Math.max(0, index), previousIndex: null };
  });
  const [themeId, setThemeId] = React.useState(() => {
    if (typeof window === 'undefined') return definition.defaultThemeId;
    const requested = new URLSearchParams(window.location.search).get('theme');
    return definition.themes.some((item) => item.id === requested)
      ? requested! : definition.defaultThemeId;
  });
  const [refitCount, setRefitCount] = React.useState(0);
  const [viewport, setViewport] = React.useState({ width: 0, height: 0 });
  const [camera, setCamera] = React.useState<CameraTransform>({ x: 0, y: 0, k: 1 });
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [fullscreenError, setFullscreenError] = React.useState('');
  // Local preview can opt into animation even when the host OS requests less motion.
  const previewFullMotion = import.meta.env.DEV &&
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('motion') === 'full';
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const zoomRef = React.useRef<ZoomBehavior<HTMLDivElement, unknown> | null>(null);
  const cameraTargetRef = React.useRef<string | null>(null);
  const fittedViewportRef = React.useRef<{ width: number; height: number } | null>(null);
  const lastFitRef = React.useRef<string | null>(null);
  const index = navigation.index;
  const stop = presentation.stops[index];
  const theme = definition.themes.find((item) => item.id === themeId) ?? definition.themes[0];
  const persistentOverrides = definition.visual?.persistent?.byStop;
  const Persistent = persistentOverrides && Object.prototype.hasOwnProperty.call(persistentOverrides, stop.id)
    ? persistentOverrides[stop.id] : definition.visual?.persistent?.default;
  const context = contextIndex(presentation);
  const ReviewControls = definition.visual?.reviewControls;
  const goTo = React.useCallback((next: number) => {
    setNavigation((current) => navigateTo(current, next, presentation.stops.length));
  }, [presentation]);
  const step = React.useCallback((delta: number) => {
    setNavigation((current) => navigateTo(current, current.index + delta, presentation.stops.length));
  }, [presentation]);
  const toggleMode = React.useCallback(() => {
    const next = mode === 'present' ? 'review' : 'present';
    setMode(next);
    const url = new URL(window.location.href);
    if (next === 'present') url.searchParams.set('mode', 'present');
    else url.searchParams.delete('mode');
    window.history.replaceState(null, '', url.toString());
    viewportRef.current?.focus({ preventScroll: true });
  }, [mode]);

  const startPresentation = async () => {
    setFullscreenError('');
    // Request within the click gesture; browsers cannot synthesize trusted F11.
    try {
      if (!document.fullscreenElement) {
        if (!document.documentElement.requestFullscreen) throw new Error('Fullscreen unavailable');
        await document.documentElement.requestFullscreen();
      }
      if (!document.fullscreenElement) throw new Error('Fullscreen denied');
    }
    catch { setFullscreenError('El navegador no ha permitido pantalla completa. Puedes usar F11.'); }
    setMode('present');
    const url = new URL(window.location.href);
    url.searchParams.set('mode', 'present');
    window.history.replaceState(null, '', url);
    viewportRef.current?.focus({ preventScroll: true });
  };

  React.useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  React.useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    return bindViewportNavigation(element, () => step(1));
  }, [step]);

  React.useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const behavior = zoom<HTMLDivElement, unknown>()
      .scaleExtent([0.05, 8])
      .filter((event) => {
        if (isInteractiveTarget(event.target)) return false;
        if (event.type === 'mousedown') return event.button === 0 && event.ctrlKey;
        // Double clicks belong to slide navigation; wheel and touch retain zoom.
        return event.type !== 'dblclick';
      })
      .on('zoom', (event) => setCamera(event.transform));
    zoomRef.current = behavior;
    select(element).call(behavior);
    return () => {
      select(element).on('.zoom', null).interrupt();
      zoomRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      const height = entry.contentRect.height;
      setViewport({ width, height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const element = viewportRef.current;
    const behavior = zoomRef.current;
    if (!element || !behavior || !viewport.width || !viewport.height) return;
    const defaultPadding = Math.min(64, viewport.width * 0.06);
    const padding = stop.padding !== undefined ? stop.padding : defaultPadding;
    const fitKey = `${stop.cameraTargetId}:${viewport.width}:${viewport.height}:${refitCount}:${padding}`;
    if (lastFitRef.current === fitKey) return;
    const target = fitRect(boundsOf(presentation, stop.cameraTargetId), viewport, padding);
    const transform = zoomIdentity.translate(target.x, target.y).scale(target.k);
    const selection = select(element);
    selection.interrupt();
    const sameViewport = fittedViewportRef.current?.width === viewport.width &&
      fittedViewportRef.current?.height === viewport.height;
    if (cameraTargetRef.current === null || !sameViewport || (reducedMotion && !previewFullMotion)) {
      selection.call(behavior.transform, transform);
    } else if (stop.cameraVia && cameraTargetRef.current !== stop.cameraTargetId) {
      const wide = fitRect(stop.cameraVia, viewport, padding);
      selection.transition().duration(presentation.cameraTransitionMs ?? 850)
        .call(behavior.transform, zoomIdentity.translate(wide.x, wide.y).scale(wide.k))
        .transition().duration(480).call(behavior.transform, transform);
    } else {
      selection.transition().duration(presentation.cameraTransitionMs ?? 850).call(behavior.transform, transform);
    }
    cameraTargetRef.current = stop.cameraTargetId;
    fittedViewportRef.current = viewport;
    lastFitRef.current = fitKey;
  }, [stop.cameraTargetId, stop.cameraVia, stop.padding, viewport.width, viewport.height, refitCount, reducedMotion, previewFullMotion, presentation]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const target = event.composedPath()[0];
      if (target instanceof Element && target.closest('input, textarea, select, [contenteditable], [role="slider"]')) return;
      if (event.key === ' ' && target instanceof Element && target.closest('button, a')) return;
      if (event.key.toLowerCase() === 'p') {
        event.preventDefault();
        toggleMode();
        return;
      }
      if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
        if (navigation.index < presentation.stops.length - 1) {
          event.preventDefault();
          step(1);
        }
      } else if (['ArrowLeft', 'PageUp'].includes(event.key)) {
        if (navigation.index > 0) {
          event.preventDefault();
          step(-1);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigation.index, presentation, step, toggleMode]);

  const formatCamera = `${camera.x.toFixed(1)}, ${camera.y.toFixed(1)}, ${camera.k.toFixed(4)}`;
  const changingIds = new Set(presentation.elements.filter((element) =>
    changesContentInPlace(presentation, navigation.previousIndex, index, element.id)).map((element) => element.id));
  const showBadge = mode !== 'present' && !stop.hideBadge;
  const showControls = mode !== 'present' && !stop.hideControls;
  const staticParams = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
  staticParams.set('deck', definition.id);
  staticParams.set('view', 'static');
  staticParams.set('theme', theme.id);
  staticParams.delete('mode');
  staticParams.delete('stop');

  return (
    <div className="app-shell" data-presentation-id={definition.id} data-theme-id={theme.id}
      data-mode={mode}
      style={themeVariables(theme)}>
      <header className="app-header">
        <div className="brand"><span className="brand-symbol">✦</span><span>CAELUM <b>SLIDES</b></span></div>
        <span className="header-note">Prototipo del núcleo espacial</span>
      </header>
      {mode === 'present' && fullscreenError && <div className="fullscreen-notice" role="status">
        {fullscreenError} <button type="button" aria-label="Cerrar aviso de pantalla completa"
          onClick={() => setFullscreenError('')}>×</button>
      </div>}
      <main className="workspace">
        <section className="viewer" aria-label="Presentación espacial"
          data-camera-target={stop.cameraTargetId}
          data-stop-id={stop.id}>
          <div className="viewport" ref={viewportRef} tabIndex={0} role="group"
            aria-label="Lienzo espacial. Haz clic para avanzar, Ctrl + arrastre para desplazar y usa la rueda para ampliar."
            data-camera-target={stop.cameraTargetId} data-camera={formatCamera}>
            <Scene definition={definition} stop={stop} camera={camera}
              output="interactive" changingIds={changingIds} />
          </div>
          {showBadge && <div className="viewer-badge" aria-live="polite" aria-atomic="true">
            {stop.label}<span>{index + 1} / {presentation.stops.length}</span>
          </div>}
          {mode !== 'present' && Persistent && <div className="presentation-overlay" data-persistent="true">
            <Persistent stop={stop} index={index} total={presentation.stops.length} />
          </div>}
          {showControls && <div className="viewer-controls">
            <button type="button" onClick={() => step(-1)} disabled={index === 0}>← Anterior</button>
            <button type="button" disabled={context < 0} onClick={() => {
              if (context === index) setRefitCount((count) => count + 1);
              else goTo(context);
            }}>Vista general</button>
            <button type="button" onClick={() => setRefitCount((count) => count + 1)}
              aria-label="Reencuadrar la vista actual">Centrar</button>
            <button type="button" onClick={() => step(1)}
              disabled={index === presentation.stops.length - 1}>Siguiente →</button>
          </div>}
        </section>
        <aside className="sidebar" aria-label="Recorrido narrativo">
          <div className="sidebar-intro">
            <span className="eyebrow">PRUEBA DE CONCEPTO</span>
            <h1>{presentation.title}</h1>
            <p>Selecciona una parada o avanza con un clic izquierdo o las flechas. Usa Ctrl + arrastre para desplazar con ratón, o arrastra con el dedo. Amplía con la rueda o un pellizco y usa Centrar para recuperar el encuadre.</p>
          </div>
          <button className="presentation-mode-button" type="button" onClick={toggleMode}
            aria-keyshortcuts="P">Ocultar HUD · P</button>
          <button className="presentation-mode-button" type="button" onClick={startPresentation}>Presentar</button>
          {fullscreenError && <p role="status">{fullscreenError}</p>}
          <p className="presentation-mode-hint">Pulsa P para mostrar u ocultar el HUD. Con el HUD oculto, avanza con un clic izquierdo o las flechas.</p>
          {ReviewControls && <ReviewControls />}
          <nav className="deck-picker" aria-label="Presentaciones de prueba">
            {available.map((item) => (
              <a key={item.id} href={`?deck=${encodeURIComponent(item.id)}`}
                aria-current={item.id === definition.id ? 'page' : undefined}>{item.model.title}</a>
            ))}
          </nav>
          <label className="palette-picker">Paleta
            <select value={theme.id} onChange={(event) => setThemeId(event.target.value)}>
              {definition.themes.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          <a className="static-link" href={`?${staticParams}`}>
            Ver secuencia estática / PDF
          </a>
          <ol className="stop-list">
            {presentation.stops.map((item, i) => (
              <li key={item.id}>
                <button type="button" className={i === index ? 'active' : ''}
                  aria-current={i === index ? 'step' : undefined} onClick={() => goTo(i)}>
                  <span className="stop-number">{String(i + 1).padStart(2, '0')}</span>
                  <span>{item.label}</span>
                  <small>{item.cameraTargetId === 'overview' ? 'general' : item.cameraTargetId}</small>
                </button>
              </li>
            ))}
          </ol>
          <div className="camera-readout"><span>CÁMARA</span><code>{formatCamera}</code></div>
        </aside>
      </main>
    </div>
  );
}

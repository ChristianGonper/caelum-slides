import React from 'react';
import { select } from 'd3-selection';
import 'd3-transition';
import { zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom';
import { fitRect, type CameraTransform } from './camera';
import type { PresentationDefinition } from './definition';
import { boundsOf } from './model';
import { changesContentInPlace, contextIndex, navigateTo, type Navigation } from './navigation';
import { themeVariables } from './theme';
import './styles.css';

export function App({ definition, available }: {
  definition: PresentationDefinition;
  available: readonly Pick<PresentationDefinition, 'id' | 'model'>[];
}) {
  const presentation = definition.model;
  const [navigation, setNavigation] = React.useState<Navigation>({ index: 0, previousIndex: null });
  const [themeId, setThemeId] = React.useState(definition.defaultThemeId);
  const [refitCount, setRefitCount] = React.useState(0);
  const [viewport, setViewport] = React.useState({ width: 0, height: 0 });
  const [camera, setCamera] = React.useState<CameraTransform>({ x: 0, y: 0, k: 1 });
  const [reducedMotion, setReducedMotion] = React.useState(false);
  // Local preview can opt into animation even when the host OS requests less motion.
  const previewFullMotion = import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get('motion') === 'full';
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const zoomRef = React.useRef<ZoomBehavior<HTMLDivElement, unknown> | null>(null);
  const cameraTargetRef = React.useRef<string | null>(null);
  const fittedViewportRef = React.useRef<{ width: number; height: number } | null>(null);
  const lastFitRef = React.useRef<string | null>(null);
  const index = navigation.index;
  const stop = presentation.stops[index];
  const theme = definition.themes.find((item) => item.id === themeId) ?? definition.themes[0];
  const visual = definition.visual;
  const Decoration = visual?.decoration;
  const persistentOverrides = visual?.persistent?.byStop;
  const Persistent = persistentOverrides && Object.prototype.hasOwnProperty.call(persistentOverrides, stop.id)
    ? persistentOverrides[stop.id] : visual?.persistent?.default;
  const context = contextIndex(presentation);
  const goTo = React.useCallback((next: number) => {
    setNavigation((current) => navigateTo(current, next, presentation.stops.length));
  }, [presentation]);
  const step = React.useCallback((delta: number) => {
    setNavigation((current) => navigateTo(current, current.index + delta, presentation.stops.length));
  }, [presentation]);

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
    const behavior = zoom<HTMLDivElement, unknown>()
      .scaleExtent([0.05, 8])
      .filter((event) => {
        const target = event.target;
        return !(target instanceof Element && target.closest('button, a')) &&
          (event.type !== 'mousedown' || event.button === 0);
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
    const fitKey = `${stop.cameraTargetId}:${viewport.width}:${viewport.height}:${refitCount}`;
    if (lastFitRef.current === fitKey) return;
    const target = fitRect(boundsOf(presentation, stop.cameraTargetId), viewport,
      Math.min(64, viewport.width * 0.06));
    const transform = zoomIdentity.translate(target.x, target.y).scale(target.k);
    const selection = select(element);
    selection.interrupt();
    const sameViewport = fittedViewportRef.current?.width === viewport.width &&
      fittedViewportRef.current?.height === viewport.height;
    if (cameraTargetRef.current === null || !sameViewport || (reducedMotion && !previewFullMotion)) {
      selection.call(behavior.transform, transform);
    } else {
      selection.transition().duration(presentation.cameraTransitionMs ?? 850).call(behavior.transform, transform);
    }
    cameraTargetRef.current = stop.cameraTargetId;
    fittedViewportRef.current = viewport;
    lastFitRef.current = fitKey;
  }, [stop.cameraTargetId, viewport.width, viewport.height, refitCount, reducedMotion, previewFullMotion, presentation]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const target = event.composedPath()[0];
      if (target instanceof Element && target.closest('input, textarea, select, [contenteditable], [role="slider"]')) return;
      if (event.key === ' ' && target instanceof Element && target.closest('button, a')) return;
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
  }, [navigation.index, presentation, step]);

  const visible = new Set(stop.visibleIds);
  const formatCamera = `${camera.x.toFixed(1)}, ${camera.y.toFixed(1)}, ${camera.k.toFixed(4)}`;

  return (
    <div className="app-shell" data-presentation-id={definition.id} data-theme-id={theme.id}
      style={themeVariables(theme)}>
      <header className="app-header">
        <div className="brand"><span className="brand-symbol">✦</span><span>CAELUM <b>SLIDES</b></span></div>
        <span className="header-note">Prototipo del núcleo espacial</span>
      </header>
      <main className="workspace">
        <section className="viewer" aria-label="Presentación espacial">
          <div className="viewport" ref={viewportRef} tabIndex={0} role="group"
            aria-label="Lienzo espacial. Arrastra para desplazar y usa la rueda para ampliar."
            data-camera-target={stop.cameraTargetId} data-camera={formatCamera}>
            <div className="world" style={{ transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.k})` }}>
              <div className="world-canvas" aria-hidden="true" style={{
                left: presentation.overview.x - 1000, top: presentation.overview.y - 1000,
                width: presentation.overview.width + 2000, height: presentation.overview.height + 2000,
                background: visual?.canvasBackground ?? 'var(--canvas-bg)',
              }} />
              {Decoration && <div className="world-decoration" aria-hidden="true"><Decoration /></div>}
              {presentation.elements.filter((element) => visible.has(element.id)).map((element) => {
                const Content = definition.content[element.id];
                return <div className={`spatial-element ${element.kind}`} key={element.id}
                  style={{ left: element.bounds.x, top: element.bounds.y,
                    width: element.bounds.width, height: element.bounds.height,
                    background: visual?.elementBackgrounds?.[element.id] }}
                  data-element-id={element.id} data-state={stop.stateByElement?.[element.id] ?? ''}>
                  <div key={stop.stateByElement?.[element.id] ?? 'default'}
                    className={`state-content${changesContentInPlace(presentation, navigation.previousIndex, index, element.id) ? ' content-changing' : ''}`}>
                    <Content element={element} state={stop.stateByElement?.[element.id]} />
                  </div>
                </div>;
              })}
            </div>
          </div>
          <div className="viewer-badge" aria-live="polite" aria-atomic="true">{stop.label}<span>{index + 1} / {presentation.stops.length}</span></div>
          {Persistent && <div className="presentation-overlay" data-persistent="true">
            <Persistent stop={stop} index={index} total={presentation.stops.length} />
          </div>}
          <div className="viewer-controls">
            <button type="button" onClick={() => step(-1)} disabled={index === 0}>← Anterior</button>
            <button type="button" disabled={context < 0} onClick={() => {
              if (context === index) setRefitCount((count) => count + 1);
              else goTo(context);
            }}>Vista general</button>
            <button type="button" onClick={() => setRefitCount((count) => count + 1)}
              aria-label="Reencuadrar la vista actual">Centrar</button>
            <button type="button" onClick={() => step(1)}
              disabled={index === presentation.stops.length - 1}>Siguiente →</button>
          </div>
        </section>
        <aside className="sidebar" aria-label="Recorrido narrativo">
          <div className="sidebar-intro">
            <span className="eyebrow">PRUEBA DE CONCEPTO</span>
            <h1>{presentation.title}</h1>
            <p>Selecciona una parada o avanza con las flechas. Arrastra con ratón o dedo, pellizca para ampliar y usa Centrar para recuperar el encuadre.</p>
          </div>
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

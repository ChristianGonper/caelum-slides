import React from 'react';
import { select } from 'd3-selection';
import 'd3-transition';
import { zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom';
import { fitRect, type CameraTransform } from './camera';
import type { PresentationDefinition } from './definition';
import { boundsOf } from './model';
import './styles.css';

export function App({ definition, available }: {
  definition: PresentationDefinition;
  available: readonly Pick<PresentationDefinition, 'id' | 'model'>[];
}) {
  const presentation = definition.model;
  const [index, setIndex] = React.useState(0);
  const [viewport, setViewport] = React.useState({ width: 0, height: 0 });
  const [camera, setCamera] = React.useState<CameraTransform>({ x: 0, y: 0, k: 1 });
  const [reducedMotion, setReducedMotion] = React.useState(false);
  // Local preview can opt into animation even when the host OS requests less motion.
  const previewFullMotion = import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get('motion') === 'full';
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const zoomRef = React.useRef<ZoomBehavior<HTMLDivElement, unknown> | null>(null);
  const cameraTargetRef = React.useRef<string | null>(null);
  const lastFitRef = React.useRef<string | null>(null);
  const stop = presentation.stops[index];

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
    const fitKey = `${stop.cameraTargetId}:${viewport.width}:${viewport.height}`;
    if (lastFitRef.current === fitKey) return;
    const target = fitRect(boundsOf(presentation, stop.cameraTargetId), viewport,
      Math.min(64, viewport.width * 0.06));
    const transform = zoomIdentity.translate(target.x, target.y).scale(target.k);
    const selection = select(element);
    selection.interrupt();
    if (cameraTargetRef.current === null || (reducedMotion && !previewFullMotion)) {
      selection.call(behavior.transform, transform);
    } else {
      selection.transition().duration(presentation.cameraTransitionMs ?? 850).call(behavior.transform, transform);
    }
    cameraTargetRef.current = stop.cameraTargetId;
    lastFitRef.current = fitKey;
  }, [stop.cameraTargetId, viewport.width, viewport.height, reducedMotion, previewFullMotion]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.composedPath()[0];
      if (target instanceof Element && target.matches('input, textarea, select, [contenteditable], [role="slider"]')) return;
      if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
        if (index < presentation.stops.length - 1) {
          event.preventDefault();
          setIndex(index + 1);
        }
      } else if (['ArrowLeft', 'PageUp'].includes(event.key)) {
        if (index > 0) {
          event.preventDefault();
          setIndex(index - 1);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [index]);

  const visible = new Set(stop.visibleIds);
  const formatCamera = `${camera.x.toFixed(1)}, ${camera.y.toFixed(1)}, ${camera.k.toFixed(4)}`;

  return (
    <div className="app-shell" data-presentation-id={definition.id}>
      <header className="app-header">
        <div className="brand"><span className="brand-symbol">✦</span><span>CAELUM <b>SLIDES</b></span></div>
        <span className="header-note">Prototipo del núcleo espacial</span>
      </header>
      <main className="workspace">
        <section className="viewer" aria-label="Presentación espacial">
          <div className="viewport" ref={viewportRef} tabIndex={0}
            aria-label="Lienzo espacial. Arrastra para desplazar y usa la rueda para ampliar."
            data-camera-target={stop.cameraTargetId} data-camera={formatCamera}>
            <div className="world" style={{ transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.k})` }}>
              <div className="world-grid" aria-hidden="true" />
              <div className="world-axis world-axis-x" aria-hidden="true" />
              <div className="world-axis world-axis-y" aria-hidden="true" />
              {presentation.elements.filter((element) => visible.has(element.id)).map((element) => {
                const Content = definition.content[element.id];
                return <div className={`spatial-element ${element.kind}`} key={element.id}
                  style={{ left: element.bounds.x, top: element.bounds.y,
                    width: element.bounds.width, height: element.bounds.height }}
                  data-element-id={element.id} data-state={stop.stateByElement?.[element.id] ?? ''}>
                  <Content element={element} state={stop.stateByElement?.[element.id]} />
                </div>;
              })}
            </div>
          </div>
          <div className="viewer-badge">{stop.label}<span>{index + 1} / {presentation.stops.length}</span></div>
          <div className="viewer-controls">
            <button type="button" onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0}>← Anterior</button>
            <button type="button" onClick={() => {
              const overviewIndex = presentation.stops.findIndex((item, i) =>
                i >= index && item.cameraTargetId === 'overview');
              setIndex(overviewIndex >= 0 ? overviewIndex :
                presentation.stops.findIndex((item) => item.cameraTargetId === 'overview'));
            }}>Vista general</button>
            <button type="button" onClick={() => setIndex(Math.min(presentation.stops.length - 1, index + 1))}
              disabled={index === presentation.stops.length - 1}>Siguiente →</button>
          </div>
        </section>
        <aside className="sidebar" aria-label="Recorrido narrativo">
          <div className="sidebar-intro">
            <span className="eyebrow">PRUEBA DE CONCEPTO</span>
            <h1>{presentation.title}</h1>
            <p>Selecciona una parada o avanza con las flechas. Puedes mover y ampliar el lienzo con ratón o tacto.</p>
          </div>
          <nav className="deck-picker" aria-label="Presentaciones de prueba">
            {available.map((item) => (
              <a key={item.id} href={`?deck=${encodeURIComponent(item.id)}`}
                aria-current={item.id === definition.id ? 'page' : undefined}>{item.model.title}</a>
            ))}
          </nav>
          <ol className="stop-list">
            {presentation.stops.map((item, i) => (
              <li key={item.id}>
                <button type="button" className={i === index ? 'active' : ''}
                  aria-current={i === index ? 'step' : undefined} onClick={() => setIndex(i)}>
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

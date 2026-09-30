import type { CameraTransform } from './camera';
import type { PresentationDefinition } from './definition';
import type { NarrativeStop } from './model';

export function Scene({ definition, stop, camera, output, changingIds }: {
  definition: PresentationDefinition;
  stop: NarrativeStop;
  camera: CameraTransform;
  output: 'interactive' | 'static';
  changingIds?: ReadonlySet<string>;
}) {
  const { model: presentation, visual } = definition;
  const Decoration = visual?.decoration;
  const visible = new Set(stop.visibleIds);

  const showDecoration = Boolean(Decoration && (visual?.decorationByStop?.[stop.id] ?? true));
  const stopCanvas = visual?.canvasByStop?.[stop.id];
  const showCanvas = stopCanvas !== null;
  const canvasBackground = typeof stopCanvas === 'string'
    ? stopCanvas
    : (visual?.canvasBackground ?? 'var(--canvas-bg)');

  return <div className="world" style={{ transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.k})` }}>
    {showCanvas && <div className="world-canvas" aria-hidden="true" style={{
      left: presentation.overview.x - 1000, top: presentation.overview.y - 1000,
      width: presentation.overview.width + 2000, height: presentation.overview.height + 2000,
      background: canvasBackground,
    }} />}
    {showDecoration && Decoration && <div className="world-decoration" aria-hidden="true"><Decoration /></div>}
    {presentation.elements.filter((element) => visible.has(element.id)).map((element) => {
      const Content = definition.content[element.id];
      const state = stop.stateByElement?.[element.id];
      return <div className={`spatial-element ${element.kind}`} key={element.id}
        style={{ left: element.bounds.x, top: element.bounds.y,
          width: element.bounds.width, height: element.bounds.height,
          background: visual?.elementBackgrounds?.[element.id] }}
        data-element-id={element.id} data-state={state ?? ''}>
        <div key={state ?? 'default'}
          className={`state-content${changingIds?.has(element.id) ? ' content-changing' : ''}`}>
          <Content element={element} state={state} output={output} />
        </div>
      </div>;
    })}
  </div>;
}

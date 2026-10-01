import type { CameraTransform } from './camera';
import type { PresentationDefinition } from './definition';
import type { NarrativeStop } from './model';
import { resolveCanvasStop } from './navigation';

export function Scene({ definition, stop, camera, output, changingIds }: {
  definition: PresentationDefinition;
  stop: NarrativeStop;
  camera: CameraTransform;
  output: 'interactive' | 'static';
  changingIds?: ReadonlySet<string>;
}) {
  const { model: presentation, visual } = definition;
  const Decoration = visual?.decoration;
  const canvasStop = visual?.keepElementsVisible ? resolveCanvasStop(presentation, stop) : stop;
  const visible = new Set(canvasStop.visibleIds);

  const showDecoration = Boolean(Decoration && (visual?.decorationByStop?.[stop.id] ?? true));
  const stopCanvas = visual?.canvasByStop?.[stop.id];
  const showCanvas = stopCanvas !== null;
  const canvasBackground = typeof stopCanvas === 'string'
    ? stopCanvas
    : (visual?.canvasBackground ?? 'var(--canvas-bg)');

  return <>
    {showCanvas && <div className="world-canvas" aria-hidden="true" style={{
      inset: 0,
      background: canvasBackground,
    }} />}
    <div className="world" style={{ transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.k})` }}>
    {showDecoration && Decoration && <div className="world-decoration" aria-hidden="true"><Decoration /></div>}
    {presentation.elements.filter((element) => visible.has(element.id)).map((element) => {
      const Content = definition.content[element.id];
      const state = canvasStop.stateByElement?.[element.id];
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
    </div>
  </>;
}

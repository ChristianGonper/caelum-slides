import React from 'react';
import { fitRect } from './camera';
import type { PresentationDefinition } from './definition';
import { boundsOf } from './model';
import { Scene } from './scene';
import { themeVariables } from './theme';
import './styles.css';
import './static.css';

const PAGE = { width: 1280, height: 720 };

export function StaticDeck({ definition, initialThemeId }: {
  definition: PresentationDefinition;
  initialThemeId?: string;
}) {
  const [themeId, setThemeId] = React.useState(
    definition.themes.some((item) => item.id === initialThemeId)
      ? initialThemeId! : definition.defaultThemeId,
  );
  const [scale, setScale] = React.useState(1);
  const listRef = React.useRef<HTMLElement>(null);
  const theme = definition.themes.find((item) => item.id === themeId) ?? definition.themes[0];
  const { model: presentation, visual } = definition;

  React.useEffect(() => {
    const element = listRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / PAGE.width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const exportStops = presentation.stops.filter((stop) => stop.includeInStatic !== false);

  return <div className="static-shell" data-presentation-id={definition.id}
    data-theme-id={theme.id} style={themeVariables(theme)}>
    <header className="static-toolbar">
      <div>
        <span className="eyebrow">SECUENCIA ESTÁTICA</span>
        <h1>{presentation.title}</h1>
        <p>{exportStops.length} páginas en el orden narrativo. Usa Imprimir para guardar un PDF.</p>
      </div>
      <div className="static-actions">
        <label>Paleta
          <select value={theme.id} onChange={(event) => setThemeId(event.target.value)}>
            {definition.themes.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
        <a href={`?deck=${encodeURIComponent(definition.id)}&theme=${encodeURIComponent(theme.id)}`}>
          Volver al recorrido
        </a>
        <button type="button" onClick={() => window.print()}>Imprimir / Guardar PDF</button>
      </div>
    </header>
    <main className="static-deck" ref={listRef} aria-label="Presentación en orden narrativo">
      {exportStops.map((stop, index) => {
        const padding = stop.padding !== undefined ? stop.padding : 64;
        const camera = fitRect(boundsOf(presentation, stop.cameraTargetId), PAGE, padding);
        const overrides = visual?.persistent?.byStop;
        const Persistent = overrides && Object.prototype.hasOwnProperty.call(overrides, stop.id)
          ? overrides[stop.id] : visual?.persistent?.default;
        return <article className="static-page" key={stop.id} data-stop-id={stop.id}
          aria-label={`${index + 1}. ${stop.label}`}
          style={{ width: PAGE.width * scale, height: PAGE.height * scale }}>
          <div className="static-frame" style={{ transform: `scale(${scale})` }}>
            <Scene definition={definition} stop={stop} camera={camera} output="static" />
            {Persistent && <div className="presentation-overlay" data-persistent="true">
              <Persistent stop={stop} index={index} total={exportStops.length} />
            </div>}
          </div>
        </article>;
      })}
    </main>
  </div>;
}

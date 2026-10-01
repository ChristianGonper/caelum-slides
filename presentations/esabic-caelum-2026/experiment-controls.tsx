import React from 'react';
import { highlightColors, highlightVariant } from './experiments';
export function ExperimentControls() {
  const [highlight, setHighlight] = React.useState(highlightVariant);
  return <div className="experiment-controls" aria-label="Pruebas visuales independientes">
    <label>Color de resaltado
      <select value={highlight} onChange={event => {
        const value = event.target.value as keyof typeof highlightColors;
        setHighlight(value);
        document.querySelector<HTMLElement>('[data-presentation-id="esabic-caelum-2026"]')?.style.setProperty('--keyword-color', highlightColors[value]);
        const url = new URL(window.location.href);
        url.searchParams.set('highlight', value);
        window.history.replaceState(null, '', url);
        document.querySelectorAll<HTMLAnchorElement>('.static-link, .static-actions a').forEach(link => {
          const target = new URL(link.href); target.searchParams.set('highlight', value); link.href = target.toString();
        });
      }}>
        <option value="blue">Azul</option><option value="cyan">Cian</option><option value="amber">Ámbar</option><option value="lavender">Lavanda</option>
      </select>
    </label>
  </div>;
}

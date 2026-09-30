import { introVariant, diagramVariant } from './experiments';

function compare(parameter: string, value: string) {
  const url = new URL(window.location.href);
  url.searchParams.set(parameter, value);
  if (url.searchParams.get('view') !== 'static') url.searchParams.set('stop', 'overview');
  window.location.assign(url.toString());
}

export function ExperimentControls() {
  return <div className="experiment-controls" aria-label="Pruebas visuales independientes">
    <label>Entrada central
      <select value={introVariant} onChange={event => compare('intro', event.target.value)}>
        <option value="focus">Portada ampliada</option>
        <option value="map">Mapa completo</option>
      </select>
    </label>
    <label>Diagrama
      <select value={diagramVariant} onChange={event => compare('diagram', event.target.value)}>
        <option value="illustrated">Hexacóptero ilustrado</option>
        <option value="blueprint">Esquema original</option>
      </select>
    </label>
  </div>;
}

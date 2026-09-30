import React from 'react';
import type { ContentProps } from '../../system/src/definition';

export function Cover({ state }: ContentProps) {
  return <div className="cover-content" key={state}>
    <span className="eyebrow">SEGUNDA PRESENTACIÓN · RUTA DIAGONAL</span>
    <h2>{state === 'closing' ? 'Otra ruta. El mismo motor.' : 'El orden no sigue el mapa.'}</h2>
    <p>{state === 'closing'
      ? 'Volvemos al punto de partida con otro contenido.'
      : 'Visitamos primero el bloque situado al sur y después el del norte.'}</p>
  </div>;
}

export function Block({ element }: ContentProps) {
  return <div className="block-content">
    <span className="eyebrow">BLOQUE · RUTA DIAGONAL</span>
    <strong>{element.label}</strong>
    <span className="block-hint">Encuadre de grupo independiente del recorrido</span>
  </div>;
}

const sampleValues = [
  { label: 'Ruta A', value: 32 },
  { label: 'Ruta B', value: 58 },
  { label: 'Ruta C', value: 84 },
];

export function SouthSlide() {
  const chartTitleId = React.useId();
  const chartDescId = React.useId();
  return <div className="slide-content data-slide">
    <span className="eyebrow">TABLA + GRÁFICO</span>
    <h2>Datos en la diapositiva.</h2>
    <div className="data-layout">
      <div className="sample-table-wrap">
        <table>
          <caption>Valores ilustrativos, sin unidad</caption>
          <thead><tr><th scope="col">Ruta</th><th scope="col">Valor</th></tr></thead>
          <tbody>{sampleValues.map(({ label, value }) => <tr key={label}>
            <th scope="row">{label}</th><td>{value}</td>
          </tr>)}</tbody>
        </table>
      </div>
      <svg className="sample-chart" viewBox="0 0 240 170" role="img" aria-labelledby={`${chartTitleId} ${chartDescId}`}>
        <title id={chartTitleId}>Comparación de tres rutas</title>
        <desc id={chartDescId}>Ruta A 32, ruta B 58 y ruta C 84; los mismos valores aparecen en la tabla.</desc>
        {sampleValues.map(({ label, value }, index) => <g key={label}>
          <text x="0" y={33 + index * 49} fill="var(--ink)" fontSize="16">{label}</text>
          <rect x="74" y={16 + index * 49} width="154" height="22" rx="5" fill="var(--surface)" />
          <rect x="74" y={16 + index * 49} width={value * 1.54} height="22" rx="5"
            fill={index === 2 ? 'var(--graphic)' : 'var(--accent)'} />
        </g>)}
      </svg>
    </div>
  </div>;
}

export function NorthSlide({ output }: ContentProps) {
  const [interactiveConnections, setInteractiveConnections] = React.useState(false);
  const showConnections = output === 'static' || interactiveConnections;
  const networkTitleId = React.useId();
  const networkDescId = React.useId();
  return <div className="slide-content interactive-slide">
    <span className="eyebrow">COMPONENTE INTERACTIVO</span>
    <h2>Una capa que se puede explorar.</h2>
    <div className="interactive-layout">
      <svg className="network-diagram" viewBox="0 0 270 170" role="img" aria-labelledby={`${networkTitleId} ${networkDescId}`}>
        <title id={networkTitleId}>Diagrama de tres nodos</title>
        <desc id={networkDescId}>{showConnections
          ? 'Tres nodos conectados por dos líneas.' : 'Tres nodos sin conexiones visibles.'}</desc>
        {showConnections && <path d="M 34 130 L 135 35 L 238 130" fill="none"
          stroke="var(--accent)" strokeWidth="5" />}
        {[[34, 130], [135, 35], [238, 130]].map(([cx, cy]) => <circle key={cx}
          cx={cx} cy={cy} r="15" fill="var(--graphic)" stroke="var(--ink)" strokeWidth="2" />)}
      </svg>
      <div className="interactive-controls">
        <p>{showConnections ? 'Las conexiones están visibles.' : 'Los nodos se muestran por separado.'}</p>
        {output !== 'static' && <button type="button" data-active={showConnections}
          onClick={() => setInteractiveConnections((current) => !current)}>
          {showConnections ? 'Ocultar conexiones' : 'Mostrar conexiones'}
        </button>}
      </div>
    </div>
  </div>;
}

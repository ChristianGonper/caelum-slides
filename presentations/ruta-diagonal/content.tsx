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

export function Slide({ element }: ContentProps) {
  const south = element.id === 'slide-south';
  return <div className="slide-content">
    <span className="eyebrow">{south ? 'PARADA 1 · SUR' : 'PARADA 2 · NORTE'}</span>
    <h2>{south ? 'Primero viajamos hacia el sur.' : 'Después subimos al norte.'}</h2>
    <p>La cámara se desplaza de forma animada entre posiciones del mismo lienzo.</p>
    <span className="state-mark">{south ? 'S' : 'N'}</span>
  </div>;
}

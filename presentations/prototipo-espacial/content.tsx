import type { ContentProps } from '../../system/src/definition';
import routesImage from './assets/rutas-espaciales.png';

export function Cover({ state }: ContentProps) {
  return state === 'closing' ? (
    <div className="cover-content" key="closing">
      <span className="eyebrow">MISMO LUGAR · OTRO ESTADO</span>
      <h2>El recorrido termina aquí.</h2>
      <p>La posición inicial vuelve a usarse con una composición de cierre.</p>
    </div>
  ) : (
    <div className="cover-content" key="intro">
      <span className="eyebrow">CAELUM SLIDES · PROTOTIPO</span>
      <h2>Un espacio.<br />Varios recorridos.</h2>
      <p>La vista general tiene contenido propio y permite orientarse.</p>
    </div>
  );
}

export function Block({ element }: ContentProps) {
  const first = element.id === 'block-a';
  return (
    <div className="block-content">
      <span className="eyebrow">SECCIÓN / {first ? '01' : '02'}</span>
      <strong>{element.label}</strong>
      <span className="block-hint">{first ? 'Dos estados en una posición' : 'Otra región del lienzo'}</span>
    </div>
  );
}

export function SlideA({ state }: ContentProps) {
  return state === 'answer' ? (
    <div className="slide-content" key="answer">
      <span className="eyebrow">BLOQUE A · ESTADO 2/2</span>
      <h2>La cámara se queda.</h2>
      <p>Solo cambia el contenido en esta posición espacial.</p>
      <span className="state-mark">B</span>
    </div>
  ) : (
    <div className="slide-content" key="question">
      <span className="eyebrow">BLOQUE A · ESTADO 1/2</span>
      <h2>¿Puede cambiar una diapositiva sin mover la cámara?</h2>
      <p>Avanza una parada para comprobarlo.</p>
      <span className="state-mark">A</span>
    </div>
  );
}

export function SlideB() {
  return (
    <div className="slide-content media-slide">
      <figure className="media-figure">
        <img src={routesImage} alt="Nodos luminosos unidos por varias trayectorias en un espacio oscuro"
          width="1672" height="941" />
        <figcaption>Ilustración conceptual para esta presentación de prueba.</figcaption>
      </figure>
      <div className="media-copy">
        <span className="eyebrow">IMAGEN + SVG</span>
        <h2>Contenido libre en una posición.</h2>
        <p>El motor encuadra la diapositiva; su contenido puede mezclar recursos.</p>
        <svg className="route-symbol" viewBox="0 0 220 52" role="img" aria-labelledby="route-symbol-title">
          <title id="route-symbol-title">Dos rutas posibles entre tres puntos</title>
          <path d="M 12 38 Q 82 4 110 26 T 208 14 M 12 38 Q 98 56 208 14"
            fill="none" stroke="var(--accent)" strokeWidth="3" />
          <circle cx="12" cy="38" r="6" fill="var(--accent)" />
          <circle cx="110" cy="26" r="6" fill="var(--graphic)" />
          <circle cx="208" cy="14" r="6" fill="var(--accent)" />
        </svg>
      </div>
    </div>
  );
}

import type { ContentProps } from '../../system/src/definition';

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
    <div className="slide-content">
      <span className="eyebrow">BLOQUE B · DIAPOSITIVA</span>
      <h2>El recorrido visita otra región.</h2>
      <p>Su orden narrativo está definido aparte de las coordenadas.</p>
      <span className="state-mark">02</span>
    </div>
  );
}

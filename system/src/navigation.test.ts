import { describe, expect, it } from 'vitest';
import { prototypePresentation } from '../../presentations/prototipo-espacial/presentation';
import { diagonalPresentation } from '../../presentations/ruta-diagonal/presentation';
import { changesContentInPlace, contextIndex, navigateTo } from './navigation';
import { validatePresentation } from './model';

describe('navegación del recorrido', () => {
  it('conserva el origen de una navegación rápida y evita índices fuera de rango', () => {
    const initial = { index: 0, previousIndex: null };
    const first = navigateTo(initial, 1, 8);
    const second = navigateTo(first, 3, 8);
    expect(second).toEqual({ index: 3, previousIndex: 1 });
    expect(navigateTo(second, 8, 8)).toBe(second);
    expect(navigateTo(second, 3, 8)).toBe(second);
  });

  it('elige el contexto declarado, sin confundir el cierre con otra vista general', () => {
    expect(contextIndex(prototypePresentation.model)).toBe(4);
    expect(contextIndex(diagonalPresentation.model)).toBe(3);
    expect(() => validatePresentation({
      ...prototypePresentation.model,
      contextStopId: 'closing',
      stops: prototypePresentation.model.stops.map((stop) => stop.id === 'closing'
        ? { ...stop, cameraTargetId: 'slide-b' } : stop),
    })).toThrow('Parada de contexto inválida');
  });

  it('solo anima contenido si cambia un estado en la misma posición', () => {
    const model = prototypePresentation.model;
    expect(changesContentInPlace(model, 2, 3, 'slide-a')).toBe(true);
    expect(changesContentInPlace(model, 1, 2, 'slide-a')).toBe(false);
    expect(changesContentInPlace(model, 6, 7, 'cover')).toBe(false);
  });
});

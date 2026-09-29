import { describe, expect, it } from 'vitest';
import { prototypePresentation } from '../../presentations/prototipo-espacial/presentation';
import { diagonalPresentation } from '../../presentations/ruta-diagonal/presentation';
import { fitRect } from './camera';
import { validateDefinition } from './definition';
import { boundsOf, validatePresentation } from './model';

describe('recorrido espacial del prototipo', () => {
  it('mantiene el objetivo de cámara mientras cambia de estado', () => {
    const model = prototypePresentation.model;
    validateDefinition(prototypePresentation);
    const question = model.stops.find((stop) => stop.id === 'question')!;
    const answer = model.stops.find((stop) => stop.id === 'answer')!;
    expect(question.cameraTargetId).toBe(answer.cameraTargetId);
    expect(question.stateByElement?.['slide-a']).toBe('question');
    expect(answer.stateByElement?.['slide-a']).toBe('answer');
    const viewport = { width: 1280, height: 720 };
    expect(fitRect(boundsOf(model, question.cameraTargetId), viewport))
      .toEqual(fitRect(boundsOf(model, answer.cameraTargetId), viewport));
  });

  it('separa el retorno y el cierre del contenido inicial', () => {
    const model = prototypePresentation.model;
    const intro = model.stops[0];
    const closing = model.stops.at(-1)!;
    expect(intro.cameraTargetId).toBe(closing.cameraTargetId);
    expect(intro.stateByElement?.cover).toBe('intro');
    expect(closing.stateByElement?.cover).toBe('closing');
    expect(model.stops.map((stop) => stop.cameraTargetId)).toEqual([
      'overview', 'block-a', 'slide-a', 'slide-a', 'overview', 'block-b', 'slide-b', 'overview',
    ]);
  });

  it('acepta otra presentación con distinta geometría, recorrido y duración de cámara', () => {
    validateDefinition(diagonalPresentation);
    const first = prototypePresentation.model;
    const second = diagonalPresentation.model;
    expect(second.stops[1].cameraTargetId).toBe('block-south');
    expect(second.elements.find((element) => element.id === 'block-south')!.bounds.y)
      .toBeGreaterThan(second.elements.find((element) => element.id === 'block-north')!.bounds.y);
    expect(first.cameraTransitionMs).not.toBe(second.cameraTransitionMs);
    expect(second.stops.at(-1)?.stateByElement?.cover).toBe('closing');
  });

  it('detecta referencias de contenido y estados inválidos', () => {
    expect(() => validateDefinition({
      ...prototypePresentation,
      content: { cover: prototypePresentation.content.cover },
    })).toThrow('Contenido inexistente');
    const model = prototypePresentation.model;
    expect(() => validatePresentation({
      ...model,
      stops: [{ ...model.stops[0], stateByElement: { cover: 'no-existe' } }],
    })).toThrow('Estado inválido');
    expect(() => validatePresentation({ ...model, cameraTransitionMs: 0 }))
      .toThrow('duración del movimiento');
  });

  it('encuadra rectángulos no centrados con margen', () => {
    const bounds = { x: 200, y: -100, width: 700, height: 400 };
    const viewport = { width: 1280, height: 720 };
    const target = fitRect(bounds, viewport, 48);
    const left = bounds.x * target.k + target.x;
    const right = (bounds.x + bounds.width) * target.k + target.x;
    const top = bounds.y * target.k + target.y;
    const bottom = (bounds.y + bounds.height) * target.k + target.y;
    expect(left).toBeGreaterThanOrEqual(48);
    expect(right).toBeLessThanOrEqual(1280 - 48);
    expect(top).toBeGreaterThanOrEqual(48);
    expect(bottom).toBeLessThanOrEqual(720 - 48);
    expect((left + right) / 2).toBeCloseTo(640);
    expect((top + bottom) / 2).toBeCloseTo(360);
  });
});

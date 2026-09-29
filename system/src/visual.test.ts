import { describe, expect, it } from 'vitest';
import { prototypePresentation } from '../../presentations/prototipo-espacial/presentation';
import { diagonalPresentation } from '../../presentations/ruta-diagonal/presentation';
import { validateDefinition } from './definition';
import { themeVariables } from './theme';

describe('composición configurable', () => {
  it('usa las mismas posiciones y contenido al intercambiar paletas', () => {
    validateDefinition(prototypePresentation);
    validateDefinition(diagonalPresentation);
    const [first, second] = prototypePresentation.themes;
    expect(themeVariables(first)['--canvas-bg' as keyof ReturnType<typeof themeVariables>])
      .not.toEqual(themeVariables(second)['--canvas-bg' as keyof ReturnType<typeof themeVariables>]);
    expect(prototypePresentation.model.stops[2].cameraTargetId).toBe('slide-a');
    expect(prototypePresentation.content['slide-a']).toBeDefined();
  });

  it('rechaza paletas y referencias visuales inválidas', () => {
    expect(() => validateDefinition({
      ...prototypePresentation, defaultThemeId: 'inexistente',
    })).toThrow('Paleta inicial inexistente');
    expect(() => validateDefinition({
      ...prototypePresentation,
      themes: [{ ...prototypePresentation.themes[0], tokens: {
        ...prototypePresentation.themes[0].tokens,
        fonts: { ...prototypePresentation.themes[0].tokens.fonts, bodyFamily: '' },
      } }],
    })).toThrow('Paleta incompleta');
    expect(() => validateDefinition({
      ...prototypePresentation,
      visual: { elementBackgrounds: { 'otro-elemento': 'red' } },
    })).toThrow('Fondo de elemento inválido');
    expect(() => validateDefinition({
      ...prototypePresentation,
      visual: { persistent: { byStop: { 'otro-paso': null } } },
    })).toThrow('Elemento persistente para parada inexistente');
  });

  it('permite decoración y marcas distintas por presentación y parada', () => {
    expect(prototypePresentation.visual?.decoration).not.toBe(diagonalPresentation.visual?.decoration);
    expect(prototypePresentation.visual?.persistent?.byStop?.intro).toBeNull();
    expect(prototypePresentation.visual?.persistent?.byStop?.closing).toBeDefined();
    expect(diagonalPresentation.visual?.elementBackgrounds?.['slide-south']).toContain('radial-gradient');
  });
});

import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { prototypePresentation } from '../../presentations/prototipo-espacial/presentation';
import { fitRect } from './camera';
import { validateDefinition, type PresentationDefinition } from './definition';
import { boundsOf, validatePresentation, type NarrativeStop, type Presentation } from './model';
import { Scene } from './scene';
import { StaticDeck } from './static';
import { App } from './app';

describe('extensiones genéricas del motor espacial (F1-F5)', () => {
  it('valida encuadres intermedios y rechaza dimensiones no utilizables', () => {
    const model = prototypePresentation.model;
    const withVia = (cameraVia: NarrativeStop['cameraVia']) => ({ ...model,
      stops: model.stops.map((stop, i) => i === 0 ? { ...stop, cameraVia } : stop),
    });
    expect(() => validatePresentation(withVia({ x: -100, y: -100, width: 400, height: 300 }))).not.toThrow();
    expect(() => validatePresentation(withVia({ x: 0, y: 0, width: 0, height: 300 }))).toThrow('Encuadre intermedio inválido');
    expect(() => validatePresentation(withVia({ x: NaN, y: 0, width: 400, height: 300 }))).toThrow('Encuadre intermedio inválido');
  });
  // F1: Clean black start screen support
  describe('F1: Soporte para pantalla de inicio limpia', () => {
    it('valida las propiedades hideBadge y hideControls en validatePresentation', () => {
      const model = prototypePresentation.model;
      const validStop: NarrativeStop = {
        ...model.stops[0],
        hideBadge: true,
        hideControls: true,
      };
      expect(() => validatePresentation({
        ...model,
        stops: model.stops.map((s, i) => i === 0 ? validStop : s),
      })).not.toThrow();

      expect(() => validatePresentation({
        ...model,
        stops: model.stops.map((s, i) => i === 0 ? { ...validStop, hideBadge: 'si' as unknown as boolean } : s),
      })).toThrow('Configuración de indicador inválida en parada');

      expect(() => validatePresentation({
        ...model,
        stops: model.stops.map((s, i) => i === 0 ? { ...validStop, hideControls: 1 as unknown as boolean } : s),
      })).toThrow('Configuración de controles inválida en parada');
    });

    it('suprime el indicador de parada y los controles cuando hideBadge y hideControls son verdaderos', () => {
      const testDef: PresentationDefinition = {
        ...prototypePresentation,
        model: {
          ...prototypePresentation.model,
          contextStopId: undefined,
          stops: [
            {
              ...prototypePresentation.model.stops[0],
              id: 'clean-start',
              hideBadge: true,
              hideControls: true,
            },
          ],
        },
      };

      const html = renderToStaticMarkup(<App definition={testDef} available={[testDef]} />);
      expect(html).not.toContain('viewer-badge');
      expect(html).not.toContain('viewer-controls');
    });

    it('muestra el indicador y los controles por defecto cuando no se especifican', () => {
      const html = renderToStaticMarkup(
        <App definition={prototypePresentation} available={[prototypePresentation]} />,
      );
      expect(html).toContain('viewer-badge');
      expect(html).toContain('viewer-controls');
    });

    it('incluye data-stop-id y data-camera-target en el contenedor del visor', () => {
      const html = renderToStaticMarkup(
        <App definition={prototypePresentation} available={[prototypePresentation]} />,
      );
      expect(html).toContain('data-stop-id="intro"');
      expect(html).toContain('data-camera-target="overview"');
    });
  });

  // F2: Configurable view margins
  describe('F2: Márgenes de encuadre configurables por parada', () => {
    it('valida la propiedad padding en validatePresentation', () => {
      const model = prototypePresentation.model;
      expect(() => validatePresentation({
        ...model,
        stops: model.stops.map((s, i) => i === 0 ? { ...s, padding: 0 } : s),
      })).not.toThrow();

      expect(() => validatePresentation({
        ...model,
        stops: model.stops.map((s, i) => i === 0 ? { ...s, padding: 120 } : s),
      })).not.toThrow();

      expect(() => validatePresentation({
        ...model,
        stops: model.stops.map((s, i) => i === 0 ? { ...s, padding: -5 } : s),
      })).toThrow('Margen de encuadre inválido en parada');

      expect(() => validatePresentation({
        ...model,
        stops: model.stops.map((s, i) => i === 0 ? { ...s, padding: NaN } : s),
      })).toThrow('Margen de encuadre inválido en parada');
    });

    it('calcula encuadre a sangre completa con padding 0 en fitRect', () => {
      const bounds = { x: 0, y: 0, width: 1280, height: 720 };
      const viewport = { width: 1280, height: 720 };
      const fullBleed = fitRect(bounds, viewport, 0);

      expect(fullBleed.k).toBe(1);
      expect(fullBleed.x).toBe(0);
      expect(fullBleed.y).toBe(0);

      const standard = fitRect(bounds, viewport, 48);
      expect(standard.k).toBeLessThan(1);
      expect(standard.x).toBeGreaterThan(0);
      expect(standard.y).toBeGreaterThan(0);
    });

    it('rechaza márgenes negativos o no finitos en fitRect', () => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      const viewport = { width: 500, height: 500 };
      expect(() => fitRect(bounds, viewport, -10)).toThrow('El margen de encuadre debe ser no negativo');
      expect(() => fitRect(bounds, viewport, Infinity)).toThrow('El margen de encuadre debe ser no negativo');
    });

    it('aplica el padding personalizado en la vista estática StaticDeck', () => {
      const targetStop = prototypePresentation.model.stops[0];
      const bounds = boundsOf(prototypePresentation.model, targetStop.cameraTargetId);
      const testDef: PresentationDefinition = {
        ...prototypePresentation,
        model: {
          ...prototypePresentation.model,
          contextStopId: undefined,
          stops: [
            {
              ...targetStop,
              padding: 0,
            },
          ],
        },
      };

      const html = renderToStaticMarkup(<StaticDeck definition={testDef} />);
      const PAGE = { width: 1280, height: 720 };
      const expectedTransform = fitRect(bounds, PAGE, 0);
      expect(html).toContain(`scale(${expectedTransform.k})`);
    });
  });

  // F3: Static export stop filtering
  describe('F3: Filtrado de paradas en salida estática', () => {
    it('valida la propiedad includeInStatic en validatePresentation', () => {
      const model = prototypePresentation.model;
      expect(() => validatePresentation({
        ...model,
        stops: model.stops.map((s, i) => i === 0 ? { ...s, includeInStatic: false } : s),
      })).not.toThrow();

      expect(() => validatePresentation({
        ...model,
        stops: model.stops.map((s, i) => i === 0 ? { ...s, includeInStatic: 'no' as unknown as boolean } : s),
      })).toThrow('Configuración estática inválida en parada');
    });

    it('excluye de StaticDeck las paradas marcadas con includeInStatic: false', () => {
      const testDef: PresentationDefinition = {
        ...prototypePresentation,
        model: {
          ...prototypePresentation.model,
          stops: [
            { ...prototypePresentation.model.stops[0], id: 'omitted-intro', includeInStatic: false },
            { ...prototypePresentation.model.stops[1], id: 'included-block', includeInStatic: true },
            { ...prototypePresentation.model.stops[2], id: 'default-included' },
          ],
        },
      };

      const html = renderToStaticMarkup(<StaticDeck definition={testDef} />);
      const pages = html.split('<article').slice(1);

      expect(pages).toHaveLength(2);
      expect(html).not.toContain('data-stop-id="omitted-intro"');
      expect(html).toContain('data-stop-id="included-block"');
      expect(html).toContain('data-stop-id="default-included"');
      expect(html).toContain('2 páginas en el orden narrativo');
    });
  });

  // F4: Per-stop decoration/canvas suppression
  describe('F4: Control de visibilidad de decoración y lienzo por parada', () => {
    const DummyDecoration = () => <svg data-testid="dummy-decoration" />;

    it('valida decorationByStop y canvasByStop en validateDefinition', () => {
      const validDef: PresentationDefinition = {
        ...prototypePresentation,
        visual: {
          ...prototypePresentation.visual,
          decoration: DummyDecoration,
          decorationByStop: { intro: false },
          canvasByStop: { intro: null, question: '#000000' },
        },
      };
      expect(() => validateDefinition(validDef)).not.toThrow();

      expect(() => validateDefinition({
        ...validDef,
        visual: { ...validDef.visual, decorationByStop: { 'parada-fantasma': false } },
      })).toThrow('Decoración para parada inexistente');

      expect(() => validateDefinition({
        ...validDef,
        visual: { ...validDef.visual, decorationByStop: { intro: 'no' as unknown as boolean } },
      })).toThrow('Valor de decoración inválido');

      expect(() => validateDefinition({
        ...validDef,
        visual: { ...validDef.visual, canvasByStop: { 'parada-fantasma': null } },
      })).toThrow('Fondo para parada inexistente');

      expect(() => validateDefinition({
        ...validDef,
        visual: { ...validDef.visual, canvasByStop: { intro: '   ' } },
      })).toThrow('Fondo de lienzo inválido para parada');
    });

    it('suprime la decoración cuando decorationByStop es false para esa parada', () => {
      const defWithDecoration: PresentationDefinition = {
        ...prototypePresentation,
        visual: {
          ...prototypePresentation.visual,
          decoration: DummyDecoration,
          decorationByStop: { intro: false, 'block-a': true },
        },
      };

      const stopIntro = defWithDecoration.model.stops[0];
      const stopBlockA = defWithDecoration.model.stops[1];
      const camera = { x: 0, y: 0, k: 1 };

      const htmlIntro = renderToStaticMarkup(
        <Scene definition={defWithDecoration} stop={stopIntro} camera={camera} output="interactive" />,
      );
      expect(htmlIntro).not.toContain('world-decoration');
      expect(htmlIntro).not.toContain('dummy-decoration');

      const htmlBlockA = renderToStaticMarkup(
        <Scene definition={defWithDecoration} stop={stopBlockA} camera={camera} output="interactive" />,
      );
      expect(htmlBlockA).toContain('world-decoration');
      expect(htmlBlockA).toContain('dummy-decoration');
    });

    it('suprime el lienzo cuando canvasByStop es null y usa fondo personalizado si es cadena', () => {
      const defWithCanvas: PresentationDefinition = {
        ...prototypePresentation,
        visual: {
          ...prototypePresentation.visual,
          canvasByStop: { intro: null, 'block-a': '#ff00aa' },
        },
      };

      const stopIntro = defWithCanvas.model.stops[0];
      const stopBlockA = defWithCanvas.model.stops[1];
      const camera = { x: 0, y: 0, k: 1 };

      const htmlIntro = renderToStaticMarkup(
        <Scene definition={defWithCanvas} stop={stopIntro} camera={camera} output="interactive" />,
      );
      expect(htmlIntro).not.toContain('world-canvas');

      const htmlBlockA = renderToStaticMarkup(
        <Scene definition={defWithCanvas} stop={stopBlockA} camera={camera} output="interactive" />,
      );
      expect(htmlBlockA).toContain('world-canvas');
      expect(htmlBlockA).toContain('background:#ff00aa');
    });
  });

  // F5: Presentation mode
  describe('F5: Modo presentación', () => {
    it('renderiza data-mode="review" por defecto y soporta data-mode="present"', () => {
      const htmlDefault = renderToStaticMarkup(
        <App definition={prototypePresentation} available={[prototypePresentation]} />,
      );
      expect(htmlDefault).toContain('data-mode="review"');
      expect(htmlDefault).toContain('viewer-badge');
    });

    it('suprime el badge en modo present independientemente de hideBadge', () => {
      // Simular URLSearchParams con mode=present
      const originalWindow = globalThis.window;
      try {
        globalThis.window = {
          ...originalWindow,
          location: {
            ...originalWindow?.location,
            search: '?mode=present',
            href: 'http://localhost/?mode=present',
          } as Location,
        } as unknown as Window & typeof globalThis;

        const htmlPresent = renderToStaticMarkup(
          <App definition={prototypePresentation} available={[prototypePresentation]} />,
        );
        expect(htmlPresent).toContain('data-mode="present"');
        expect(htmlPresent).not.toContain('viewer-badge');
      } finally {
        globalThis.window = originalWindow;
      }
    });
  });
});

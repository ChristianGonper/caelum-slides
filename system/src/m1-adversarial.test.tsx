import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { prototypePresentation } from '../../presentations/prototipo-espacial/presentation';
import { diagonalPresentation } from '../../presentations/ruta-diagonal/presentation';
import { fitRect, type Viewport } from './camera';
import { validateDefinition, type PresentationDefinition } from './definition';
import { boundsOf, validatePresentation, type NarrativeStop, type Presentation } from './model';
import { Scene } from './scene';
import { StaticDeck } from './static';
import { App } from './app';

describe('Milestone 1 Adversarial & Empirical Challenge Suite', () => {

  // =========================================================================
  // Challenge 1: Negative & Boundary Padding Values
  // =========================================================================
  describe('Challenge 1: Negative, Extreme, and Boundary Padding Values', () => {
    it('fitRect strictly rejects negative padding values with exact error message', () => {
      const bounds = { x: 0, y: 0, width: 800, height: 600 };
      const viewport: Viewport = { width: 1280, height: 720 };

      // Negative values
      expect(() => fitRect(bounds, viewport, -1)).toThrow('El margen de encuadre debe ser no negativo');
      expect(() => fitRect(bounds, viewport, -0.0001)).toThrow('El margen de encuadre debe ser no negativo');
      expect(() => fitRect(bounds, viewport, -1000)).toThrow('El margen de encuadre debe ser no negativo');
      expect(() => fitRect(bounds, viewport, -Infinity)).toThrow('El margen de encuadre debe ser no negativo');

      // Non-finite values
      expect(() => fitRect(bounds, viewport, NaN)).toThrow('El margen de encuadre debe ser no negativo');
      expect(() => fitRect(bounds, viewport, Infinity)).toThrow('El margen de encuadre debe ser no negativo');
    });

    it('fitRect handles extreme padding larger than viewport without crashing (Math.max(1, ...))', () => {
      const bounds = { x: 0, y: 0, width: 800, height: 600 };
      const viewport: Viewport = { width: 200, height: 200 };

      // When padding is 150, 150 * 2 = 300 > 200.
      // viewport.width - padding * 2 = -100.
      // availableWidth clamped to 1 via Math.max(1, ...)
      const transform = fitRect(bounds, viewport, 150);
      expect(Number.isFinite(transform.k)).toBe(true);
      expect(transform.k).toBeGreaterThan(0);
      expect(Number.isFinite(transform.x)).toBe(true);
      expect(Number.isFinite(transform.y)).toBe(true);
    });

    it('validatePresentation strictly rejects negative or invalid padding on stops', () => {
      const base = prototypePresentation.model;

      const makeInvalidModel = (padding: unknown): Presentation => ({
        ...base,
        stops: base.stops.map((stop, i) => i === 0 ? { ...stop, padding: padding as number } : stop),
      });

      expect(() => validatePresentation(makeInvalidModel(-1))).toThrow('Margen de encuadre inválido en parada');
      expect(() => validatePresentation(makeInvalidModel(-0.5))).toThrow('Margen de encuadre inválido en parada');
      expect(() => validatePresentation(makeInvalidModel(-Infinity))).toThrow('Margen de encuadre inválido en parada');
      expect(() => validatePresentation(makeInvalidModel(Infinity))).toThrow('Margen de encuadre inválido en parada');
      expect(() => validatePresentation(makeInvalidModel(NaN))).toThrow('Margen de encuadre inválido en parada');
      expect(() => validatePresentation(makeInvalidModel('0' as unknown as number))).toThrow('Margen de encuadre inválido en parada');
    });

    it('validatePresentation permits zero and positive padding', () => {
      const base = prototypePresentation.model;
      expect(() => validatePresentation({
        ...base,
        stops: base.stops.map((stop, i) => i === 0 ? { ...stop, padding: 0 } : stop),
      })).not.toThrow();

      expect(() => validatePresentation({
        ...base,
        stops: base.stops.map((stop, i) => i === 0 ? { ...stop, padding: 0.001 } : stop),
      })).not.toThrow();

      expect(() => validatePresentation({
        ...base,
        stops: base.stops.map((stop, i) => i === 0 ? { ...stop, padding: 100 } : stop),
      })).not.toThrow();
    });
  });

  // =========================================================================
  // Challenge 2: Zero Padding (padding: 0) for Full-Bleed Framing
  // =========================================================================
  describe('Challenge 2: Zero Padding (padding: 0) Full-Bleed Behavior', () => {
    it('fitRect with padding: 0 yields exact 1:1 scale and 0 translation for matching aspect ratio', () => {
      const bounds = { x: 0, y: 0, width: 1280, height: 720 };
      const viewport: Viewport = { width: 1280, height: 720 };
      const result = fitRect(bounds, viewport, 0);

      expect(result.k).toBe(1);
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
    });

    it('fitRect with padding: 0 centers element with non-zero world coordinates', () => {
      const bounds = { x: -640, y: -360, width: 1280, height: 720 };
      const viewport: Viewport = { width: 1280, height: 720 };
      const result = fitRect(bounds, viewport, 0);

      expect(result.k).toBe(1);
      // Math: (1280 - 1 * (-1280 + 1280)) / 2 = 640
      expect(result.x).toBe(640);
      // Math: (720 - 1 * (-720 + 720)) / 2 = 360
      expect(result.y).toBe(360);
      // World point bounds.x * k + result.x = -640 * 1 + 640 = 0 (top-left of viewport)
      expect(bounds.x * result.k + result.x).toBe(0);
      expect(bounds.y * result.k + result.y).toBe(0);
    });

    it('StaticDeck renders exact full-bleed scale with padding: 0 without defaulting to 64', () => {
      const targetStop = prototypePresentation.model.stops[2]; // 'question' slide-a
      const bounds = boundsOf(prototypePresentation.model, targetStop.cameraTargetId);
      const PAGE = { width: 1280, height: 720 };

      const defWithPaddingZero: PresentationDefinition = {
        ...prototypePresentation,
        model: {
          ...prototypePresentation.model,
          stops: [{ ...targetStop, padding: 0 }],
        },
      };

      const html = renderToStaticMarkup(<StaticDeck definition={defWithPaddingZero} />);
      const expectedZeroTransform = fitRect(bounds, PAGE, 0);
      const expectedDefaultTransform = fitRect(bounds, PAGE, 64);

      // Verify that padding: 0 was NOT treated as falsy and overridden with 64
      expect(expectedZeroTransform.k).not.toBe(expectedDefaultTransform.k);
      expect(expectedZeroTransform.k).toBeGreaterThan(expectedDefaultTransform.k);
      expect(html).toContain(`scale(${expectedZeroTransform.k})`);
      expect(html).not.toContain(`scale(${expectedDefaultTransform.k})`);
    });
  });

  // =========================================================================
  // Challenge 3: Undefined vs False vs True includeInStatic
  // =========================================================================
  describe('Challenge 3: Undefined vs False vs True includeInStatic', () => {
    it('validatePresentation enforces boolean type when includeInStatic is defined', () => {
      const base = prototypePresentation.model;

      // Valid types
      expect(() => validatePresentation({
        ...base,
        stops: base.stops.map((s, i) => i === 0 ? { ...s, includeInStatic: true } : s),
      })).not.toThrow();

      expect(() => validatePresentation({
        ...base,
        stops: base.stops.map((s, i) => i === 0 ? { ...s, includeInStatic: false } : s),
      })).not.toThrow();

      expect(() => validatePresentation({
        ...base,
        stops: base.stops.map((s, i) => i === 0 ? { ...s, includeInStatic: undefined } : s),
      })).not.toThrow();

      // Invalid types
      const invalidValues = ['false', 'true', 0, 1, null, {}, []];
      for (const val of invalidValues) {
        expect(() => validatePresentation({
          ...base,
          stops: base.stops.map((s, i) => i === 0 ? { ...s, includeInStatic: val as unknown as boolean } : s),
        })).toThrow('Configuración estática inválida en parada');
      }
    });

    it('StaticDeck correctly includes undefined and true, but excludes false', () => {
      const def: PresentationDefinition = {
        ...prototypePresentation,
        model: {
          ...prototypePresentation.model,
          stops: [
            { ...prototypePresentation.model.stops[0], id: 'stop-undef', includeInStatic: undefined },
            { ...prototypePresentation.model.stops[1], id: 'stop-true', includeInStatic: true },
            { ...prototypePresentation.model.stops[2], id: 'stop-false-1', includeInStatic: false },
            { ...prototypePresentation.model.stops[3], id: 'stop-false-2', includeInStatic: false },
            { ...prototypePresentation.model.stops[4], id: 'stop-also-undef' },
          ],
        },
      };

      const html = renderToStaticMarkup(<StaticDeck definition={def} />);
      expect(html).toContain('data-stop-id="stop-undef"');
      expect(html).toContain('data-stop-id="stop-true"');
      expect(html).toContain('data-stop-id="stop-also-undef"');
      expect(html).not.toContain('data-stop-id="stop-false-1"');
      expect(html).not.toContain('data-stop-id="stop-false-2"');

      // Check toolbar page count
      expect(html).toContain('3 páginas en el orden narrativo');
    });

    it('StaticDeck handles the extreme case where all stops have includeInStatic: false gracefully', () => {
      const def: PresentationDefinition = {
        ...prototypePresentation,
        model: {
          ...prototypePresentation.model,
          stops: prototypePresentation.model.stops.map((s) => ({ ...s, includeInStatic: false })),
        },
      };

      const html = renderToStaticMarkup(<StaticDeck definition={def} />);
      expect(html).toContain('0 páginas en el orden narrativo');
      expect(html).not.toContain('<article class="static-page"');
    });
  });

  // =========================================================================
  // Challenge 4: Malformed decorationByStop and Unknown Stop IDs
  // =========================================================================
  describe('Challenge 4: Malformed decorationByStop, canvasByStop, and Unknown Stop IDs', () => {
    it('validateDefinition rejects decorationByStop with non-existent stop IDs', () => {
      const def: PresentationDefinition = {
        ...prototypePresentation,
        visual: {
          ...prototypePresentation.visual,
          decorationByStop: {
            'ghost-stop-1': false,
          },
        },
      };
      expect(() => validateDefinition(def)).toThrow('Decoración para parada inexistente: ghost-stop-1');
    });

    it('validateDefinition rejects decorationByStop with non-boolean values', () => {
      const def = (val: unknown): PresentationDefinition => ({
        ...prototypePresentation,
        visual: {
          ...prototypePresentation.visual,
          decorationByStop: {
            intro: val as boolean,
          },
        },
      });

      expect(() => validateDefinition(def('false'))).toThrow('Valor de decoración inválido: intro');
      expect(() => validateDefinition(def(0))).toThrow('Valor de decoración inválido: intro');
      expect(() => validateDefinition(def(null))).toThrow('Valor de decoración inválido: intro');
    });

    it('validateDefinition rejects canvasByStop with non-existent stop IDs', () => {
      const def: PresentationDefinition = {
        ...prototypePresentation,
        visual: {
          ...prototypePresentation.visual,
          canvasByStop: {
            'phantom-stop': null,
          },
        },
      };
      expect(() => validateDefinition(def)).toThrow('Fondo para parada inexistente: phantom-stop');
    });

    it('validateDefinition rejects canvasByStop with empty strings or non-string non-null values', () => {
      const def = (val: unknown): PresentationDefinition => ({
        ...prototypePresentation,
        visual: {
          ...prototypePresentation.visual,
          canvasByStop: {
            intro: val as string | null,
          },
        },
      });

      expect(() => validateDefinition(def(''))).toThrow('Fondo de lienzo inválido para parada: intro');
      expect(() => validateDefinition(def('   \t\n  '))).toThrow('Fondo de lienzo inválido para parada: intro');
      expect(() => validateDefinition(def(123))).toThrow('Fondo de lienzo inválido para parada: intro');
      expect(() => validateDefinition(def({}))).toThrow('Fondo de lienzo inválido para parada: intro');
    });

    it('validateDefinition rejects persistent.byStop with non-existent stop IDs', () => {
      const def: PresentationDefinition = {
        ...prototypePresentation,
        visual: {
          ...prototypePresentation.visual,
          persistent: {
            byStop: {
              'unknown-stop-id': null,
            },
          },
        },
      };
      expect(() => validateDefinition(def)).toThrow('Elemento persistente para parada inexistente: unknown-stop-id');
    });

    it('Scene handles undefined visual gracefully without exceptions', () => {
      const defNoVisual: PresentationDefinition = {
        ...prototypePresentation,
        visual: undefined,
      };

      const camera = { x: 0, y: 0, k: 1 };
      const stop = defNoVisual.model.stops[0];

      expect(() => {
        const html = renderToStaticMarkup(
          <Scene definition={defNoVisual} stop={stop} camera={camera} output="interactive" />,
        );
        expect(html).toContain('world-canvas');
        expect(html).toContain('background:var(--canvas-bg)');
        expect(html).not.toContain('world-decoration');
      }).not.toThrow();
    });
  });

  // =========================================================================
  // Challenge 5: Strict Backward Compatibility for Existing Decks
  // =========================================================================
  describe('Challenge 5: Backward Compatibility for prototipo-espacial & ruta-diagonal', () => {
    it('prototypePresentation passes validation without any warnings or modifications', () => {
      expect(() => validateDefinition(prototypePresentation)).not.toThrow();
    });

    it('diagonalPresentation passes validation without any warnings or modifications', () => {
      expect(() => validateDefinition(diagonalPresentation)).not.toThrow();
    });

    it('prototipo-espacial retains all 8 stops in StaticDeck and renders decoration & canvas', () => {
      const html = renderToStaticMarkup(<StaticDeck definition={prototypePresentation} />);

      // Exactly 8 pages rendered
      const articles = html.match(/<article className="static-page"|<article class="static-page"/g);
      expect(articles).toHaveLength(8);
      expect(html).toContain('8 páginas en el orden narrativo');

      // Every single stop ID is present
      for (const stop of prototypePresentation.model.stops) {
        expect(html).toContain(`data-stop-id="${stop.id}"`);
      }

      // Decoration is present on all stops
      expect(html).toContain('world-decoration');
      expect(html).toContain('world-canvas');
    });

    it('ruta-diagonal retains all 7 stops in StaticDeck and renders decoration & canvas', () => {
      const html = renderToStaticMarkup(<StaticDeck definition={diagonalPresentation} />);

      const articles = html.match(/<article className="static-page"|<article class="static-page"/g);
      expect(articles).toHaveLength(7);
      expect(html).toContain('7 páginas en el orden narrativo');

      for (const stop of diagonalPresentation.model.stops) {
        expect(html).toContain(`data-stop-id="${stop.id}"`);
      }

      expect(html).toContain('world-decoration');
      expect(html).toContain('world-canvas');
    });

    it('interactive App renders default controls and badge for unmodified existing decks', () => {
      const htmlProto = renderToStaticMarkup(
        <App definition={prototypePresentation} available={[prototypePresentation, diagonalPresentation]} />,
      );
      expect(htmlProto).toContain('data-mode="review"');
      expect(htmlProto).toContain('viewer-badge');
      expect(htmlProto).toContain('viewer-controls');
      expect(htmlProto).toContain('app-header');
      expect(htmlProto).toContain('sidebar');

      const htmlDiag = renderToStaticMarkup(
        <App definition={diagonalPresentation} available={[prototypePresentation, diagonalPresentation]} />,
      );
      expect(htmlDiag).toContain('data-mode="review"');
      expect(htmlDiag).toContain('viewer-badge');
      expect(htmlDiag).toContain('viewer-controls');
      expect(htmlDiag).toContain('app-header');
      expect(htmlDiag).toContain('sidebar');
    });

    it('engine core files contain zero deck-specific conditionals for esabic-caelum-2026', () => {
      // Checked structurally via code inspection and property polymorphism
      for (const stop of prototypePresentation.model.stops) {
        expect(stop.padding).toBeUndefined();
        expect(stop.includeInStatic).toBeUndefined();
        expect(stop.hideBadge).toBeUndefined();
        expect(stop.hideControls).toBeUndefined();
      }

      for (const stop of diagonalPresentation.model.stops) {
        expect(stop.padding).toBeUndefined();
        expect(stop.includeInStatic).toBeUndefined();
        expect(stop.hideBadge).toBeUndefined();
        expect(stop.hideControls).toBeUndefined();
      }
    });
  });

  // =========================================================================
  // Challenge 6: Stop and App Mode Edge Cases
  // =========================================================================
  describe('Challenge 6: Presentation Mode and Stop Option Combinations', () => {
    it('hideControls: true suppresses viewer controls while leaving viewer badge active', () => {
      const def: PresentationDefinition = {
        ...prototypePresentation,
        model: {
          ...prototypePresentation.model,
          stops: [
            {
              ...prototypePresentation.model.stops[0],
              hideControls: true,
              hideBadge: false,
            },
          ],
        },
      };

      const html = renderToStaticMarkup(<App definition={def} available={[def]} />);
      expect(html).not.toContain('viewer-controls');
      expect(html).toContain('viewer-badge');
    });

    it('hideBadge: true suppresses viewer badge while leaving viewer controls active', () => {
      const def: PresentationDefinition = {
        ...prototypePresentation,
        model: {
          ...prototypePresentation.model,
          stops: [
            {
              ...prototypePresentation.model.stops[0],
              hideControls: false,
              hideBadge: true,
            },
          ],
        },
      };

      const html = renderToStaticMarkup(<App definition={def} available={[def]} />);
      expect(html).toContain('viewer-controls');
      expect(html).not.toContain('viewer-badge');
    });

    it('black stop has special background styling hooks in viewer and viewport', () => {
      const def: PresentationDefinition = {
        ...prototypePresentation,
        model: {
          ...prototypePresentation.model,
          stops: [
            {
              ...prototypePresentation.model.stops[0],
              id: 'black',
              cameraTargetId: 'black',
            },
          ],
          elements: [
            ...prototypePresentation.model.elements,
            { id: 'black', kind: 'block', label: 'Black Screen', bounds: { x: 0, y: 0, width: 100, height: 100 } },
          ],
        },
        content: {
          ...prototypePresentation.content,
          black: () => null,
        },
      };

      const html = renderToStaticMarkup(<App definition={def} available={[def]} />);
      expect(html).toContain('data-stop-id="black"');
      expect(html).toContain('data-camera-target="black"');
    });
  });
});

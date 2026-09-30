import { describe, expect, it, afterEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';
import { fitRect } from '../../system/src/camera';
import { validateDefinition, type PresentationDefinition } from '../../system/src/definition';
import { boundsOf, validatePresentation, type NarrativeStop, type Presentation } from '../../system/src/model';
import { prototypePresentation } from '../../presentations/prototipo-espacial/presentation';
import { diagonalPresentation } from '../../presentations/ruta-diagonal/presentation';
import { App } from '../../system/src/app';
import { StaticDeck } from '../../system/src/static';
import { Scene } from '../../system/src/scene';

const originalWindow = globalThis.window;

afterEach(() => {
  globalThis.window = originalWindow;
});

function setupMockWindow(search: string = '') {
  globalThis.window = {
    ...originalWindow,
    location: {
      ...originalWindow?.location,
      search,
      href: `http://localhost/${search}`,
    } as Location,
    history: {
      ...originalWindow?.history,
      replaceState: () => {},
    } as History,
    addEventListener: () => {},
    removeEventListener: () => {},
    matchMedia: () => ({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
    }) as unknown as MediaQueryList,
  } as unknown as Window & typeof globalThis;
}

describe('Empirical Verification: Milestone 1 Generic Core Engine Extensions', () => {

  // =========================================================================
  // TASK 1: ?mode=present hides headers and sidebars
  // =========================================================================
  describe('Task 1: ?mode=present hides headers and sidebars', () => {
    it('sets data-mode="present" on .app-shell when URL has ?mode=present', () => {
      setupMockWindow('?mode=present');
      const html = renderToStaticMarkup(
        <App definition={prototypePresentation} available={[prototypePresentation]} />,
      );
      expect(html).toContain('data-mode="present"');
      expect(html).not.toContain('data-mode="review"');
    });

    it('sets data-mode="present" when URL has multiple query params in any position', () => {
      setupMockWindow('?deck=prototipo-espacial&mode=present&theme=deep-teal');
      const html = renderToStaticMarkup(
        <App definition={prototypePresentation} available={[prototypePresentation]} />,
      );
      expect(html).toContain('data-mode="present"');
    });

    it('falls back to data-mode="review" for missing, invalid, or uppercase mode param', () => {
      // Missing
      setupMockWindow('');
      let html = renderToStaticMarkup(<App definition={prototypePresentation} available={[prototypePresentation]} />);
      expect(html).toContain('data-mode="review"');

      // Invalid
      setupMockWindow('?mode=overview');
      html = renderToStaticMarkup(<App definition={prototypePresentation} available={[prototypePresentation]} />);
      expect(html).toContain('data-mode="review"');

      // Empty value
      setupMockWindow('?mode=');
      html = renderToStaticMarkup(<App definition={prototypePresentation} available={[prototypePresentation]} />);
      expect(html).toContain('data-mode="review"');

      // Case sensitivity: ?mode=PRESENT should default to review unless normalized
      setupMockWindow('?mode=PRESENT');
      html = renderToStaticMarkup(<App definition={prototypePresentation} available={[prototypePresentation]} />);
      expect(html).toContain('data-mode="review"');
    });

    it('verifies CSS rules in styles.css hide .app-header and .sidebar under data-mode="present"', () => {
      const stylesPath = path.join(process.cwd(), 'system/src/styles.css');
      const css = fs.readFileSync(stylesPath, 'utf8');

      // Verify exact selector and display: none
      const presentHeaderRule = /\.app-shell\[data-mode="present"\]\s+\.app-header\s*,\s*\.app-shell\[data-mode="present"\]\s+\.sidebar\s*\{\s*display:\s*none;\s*\}/;
      expect(css).toMatch(presentHeaderRule);

      // Verify workspace grid single-column rule
      const presentWorkspaceRule = /\.app-shell\[data-mode="present"\]\s+\.workspace\s*\{\s*grid-template-columns:\s*1fr;\s*\}/;
      expect(css).toMatch(presentWorkspaceRule);
    });

    it('verifies no subsequent CSS rule overrides display: none for header and sidebar', () => {
      const stylesPath = path.join(process.cwd(), 'system/src/styles.css');
      const css = fs.readFileSync(stylesPath, 'utf8');

      // Check media queries do not set display on .sidebar or .app-header with higher specificity
      const mediaQueryMatch = css.match(/@media\s*\([^)]+\)\s*\{([^}]+(\{[^}]*\}[^}]*)*)\}/g);
      expect(mediaQueryMatch).not.toBeNull();

      for (const mq of mediaQueryMatch!) {
        // Ensure no rule within media query forces display: flex or display: block on .sidebar in present mode
        expect(mq).not.toMatch(/\.app-shell\[data-mode="present"\]\s+\.sidebar\s*\{\s*display:\s*(?!none)/);
        expect(mq).not.toMatch(/\.app-shell\[data-mode="present"\]\s+\.app-header\s*\{\s*display:\s*(?!none)/);
      }
    });

    it('suppresses the narrative stop badge in mode="present" even if hideBadge is false', () => {
      setupMockWindow('?mode=present');
      const testDef: PresentationDefinition = {
        ...prototypePresentation,
        model: {
          ...prototypePresentation.model,
          stops: [
            {
              ...prototypePresentation.model.stops[0],
              hideBadge: false, // Explicitly false
            },
          ],
        },
      };
      const html = renderToStaticMarkup(<App definition={testDef} available={[testDef]} />);
      expect(html).not.toContain('viewer-badge');
    });

    it('retains narrative stop badge in mode="review" when hideBadge is false or undefined', () => {
      setupMockWindow('');
      const html = renderToStaticMarkup(
        <App definition={prototypePresentation} available={[prototypePresentation]} />,
      );
      expect(html).toContain('viewer-badge');
    });
  });

  // =========================================================================
  // TASK 2: hideBadge: true & hideControls: true produce clean black start screen
  // =========================================================================
  describe('Task 2: hideBadge: true & hideControls: true produce clean black screen without UI overlays', () => {
    const cleanBlackStop: NarrativeStop = {
      id: 'black',
      label: 'Inicio en negro',
      cameraTargetId: 'block-a',
      visibleIds: [],
      hideBadge: true,
      hideControls: true,
      includeInStatic: false,
    };

    const DummyPersistent = ({ stop }: { stop: NarrativeStop }) => (
      <div className="test-persistent">Persistent Overlay for {stop.id}</div>
    );

    const cleanBlackDeck: PresentationDefinition = {
      ...prototypePresentation,
      model: {
        ...prototypePresentation.model,
        contextStopId: undefined,
        stops: [
          cleanBlackStop,
          ...prototypePresentation.model.stops,
        ],
      },
      visual: {
        ...prototypePresentation.visual,
        decorationByStop: { black: false },
        canvasByStop: { black: null },
        persistent: {
          default: DummyPersistent,
          byStop: { black: null }, // Nullifies persistent overlay for black stop
        },
      },
    };

    it('suppresses both viewer-badge and viewer-controls in review mode when stop flags are set', () => {
      setupMockWindow('');
      const html = renderToStaticMarkup(<App definition={cleanBlackDeck} available={[cleanBlackDeck]} />);

      expect(html).not.toContain('viewer-badge');
      expect(html).not.toContain('viewer-controls');
      expect(html).not.toContain('test-persistent');
      expect(html).not.toContain('presentation-overlay');
    });

    it('suppresses both viewer-badge and viewer-controls in presentation mode', () => {
      setupMockWindow('?mode=present');
      const html = renderToStaticMarkup(<App definition={cleanBlackDeck} available={[cleanBlackDeck]} />);

      expect(html).not.toContain('viewer-badge');
      expect(html).not.toContain('viewer-controls');
      expect(html).not.toContain('test-persistent');
      expect(html).not.toContain('presentation-overlay');
      expect(html).toContain('data-mode="present"');
    });

    it('verifies that in present mode, controls ARE rendered unless hideControls: true is explicitly set', () => {
      setupMockWindow('?mode=present');
      // If hideControls is false, controls still render in present mode!
      const deckWithControls: PresentationDefinition = {
        ...cleanBlackDeck,
        model: {
          ...cleanBlackDeck.model,
          stops: [
            {
              ...cleanBlackStop,
              hideControls: false, // Controls NOT hidden
            },
          ],
        },
      };
      const html = renderToStaticMarkup(<App definition={deckWithControls} available={[deckWithControls]} />);
      expect(html).toContain('viewer-controls');
    });

    it('verifies that in review mode, badge IS rendered unless hideBadge: true is explicitly set', () => {
      setupMockWindow('');
      const deckWithBadge: PresentationDefinition = {
        ...cleanBlackDeck,
        model: {
          ...cleanBlackDeck.model,
          stops: [
            {
              ...cleanBlackStop,
              hideBadge: false, // Badge NOT hidden
            },
          ],
        },
      };
      const html = renderToStaticMarkup(<App definition={deckWithBadge} available={[deckWithBadge]} />);
      expect(html).toContain('viewer-badge');
    });

    it('renders zero spatial elements, zero canvas, and zero decoration on clean black stop', () => {
      const camera = { x: 0, y: 0, k: 1 };
      const html = renderToStaticMarkup(
        <Scene definition={cleanBlackDeck} stop={cleanBlackStop} camera={camera} output="interactive" />,
      );

      // No spatial elements since visibleIds: []
      expect(html).not.toContain('spatial-element');
      // No world canvas since canvasByStop[black] is null
      expect(html).not.toContain('world-canvas');
      // No world decoration since decorationByStop[black] is false
      expect(html).not.toContain('world-decoration');
      // Contains world container
      expect(html).toContain('class="world"');
    });

    it('verifies CSS applies #000000 black background to viewer and viewport for stop "black"', () => {
      const stylesPath = path.join(process.cwd(), 'system/src/styles.css');
      const css = fs.readFileSync(stylesPath, 'utf8');

      // CSS must style .viewer[data-stop-id="black"], .viewer[data-camera-target="black"], .viewport[data-camera-target="black"]
      const blackRule = /\.viewer\[data-camera-target="black"\],\s*\.viewer\[data-stop-id="black"\],\s*\.viewport\[data-camera-target="black"\]\s*\{\s*background:\s*#000000;\s*\}/;
      expect(css).toMatch(blackRule);

      // Verify that App renders data-stop-id="black" on .viewer
      setupMockWindow('?mode=present');
      const html = renderToStaticMarkup(<App definition={cleanBlackDeck} available={[cleanBlackDeck]} />);
      expect(html).toContain('data-stop-id="black"');
    });
  });

  // =========================================================================
  // TASK 3: StaticDeck accurately omits stops marked includeInStatic: false
  // =========================================================================
  describe('Task 3: StaticDeck accurately omits stops marked includeInStatic: false and calculates page counts correctly', () => {
    // Construct 11-stop test deck mimicking Caelum nominal specification
    const stops11: NarrativeStop[] = [
      { id: 'black', label: 'Inicio en negro', cameraTargetId: 'block-a', visibleIds: [], includeInStatic: false, hideBadge: true, hideControls: true },
      { id: 'opening-nuclear', label: 'Central nuclear', cameraTargetId: 'block-a', visibleIds: ['block-a'], padding: 0, includeInStatic: true },
      { id: 'opening-space', label: 'Antenas de espacio profundo', cameraTargetId: 'block-a', visibleIds: ['block-a'], padding: 0, includeInStatic: true },
      { id: 'overview', label: 'Vista general del sistema', cameraTargetId: 'overview', visibleIds: ['overview'], includeInStatic: true },
      { id: 'response-gap', label: 'La brecha de respuesta', cameraTargetId: 'block-b', visibleIds: ['block-b'], includeInStatic: true },
      { id: 'solution', label: 'Nuestra solución: R.A.R.', cameraTargetId: 'block-c', visibleIds: ['block-c'], includeInStatic: true },
      { id: 'space-market', label: 'Aplicación espacial y mercado', cameraTargetId: 'block-d', visibleIds: ['block-d'], includeInStatic: true },
      { id: 'business', label: 'Modelo y viabilidad', cameraTargetId: 'block-e', visibleIds: ['block-e'], includeInStatic: true },
      { id: 'team', label: 'Equipo Caelum', cameraTargetId: 'block-f', visibleIds: ['block-f'], includeInStatic: true },
      { id: 'network', label: 'Red de apoyo institucional', cameraTargetId: 'block-f', visibleIds: ['block-f'], includeInStatic: true },
      { id: 'closing', label: 'Cierre y contactos', cameraTargetId: 'center', visibleIds: ['center'], includeInStatic: true },
    ];

    const elements11 = [
      { id: 'overview', kind: 'cover' as const, label: 'Overview', bounds: { x: 0, y: 0, width: 1280, height: 720 } },
      { id: 'center', kind: 'cover' as const, label: 'Center', bounds: { x: 0, y: 0, width: 600, height: 400 } },
      { id: 'block-a', kind: 'slide' as const, label: 'Block A', bounds: { x: 0, y: -1100, width: 1280, height: 720 } },
      { id: 'block-b', kind: 'slide' as const, label: 'Block B', bounds: { x: 1150, y: -580, width: 1280, height: 720 } },
      { id: 'block-c', kind: 'slide' as const, label: 'Block C', bounds: { x: 1150, y: 580, width: 1280, height: 720 } },
      { id: 'block-d', kind: 'slide' as const, label: 'Block D', bounds: { x: 0, y: 1100, width: 1280, height: 720 } },
      { id: 'block-e', kind: 'slide' as const, label: 'Block E', bounds: { x: -1150, y: 580, width: 1280, height: 720 } },
      { id: 'block-f', kind: 'slide' as const, label: 'Block F', bounds: { x: -1150, y: -580, width: 1280, height: 720 } },
    ];

    const content11: Record<string, () => React.JSX.Element> = {
      overview: () => <div>Overview Content</div>,
      center: () => <div>Center Content</div>,
      'block-a': () => <div>Block A Content</div>,
      'block-b': () => <div>Block B Content</div>,
      'block-c': () => <div>Block C Content</div>,
      'block-d': () => <div>Block D Content</div>,
      'block-e': () => <div>Block E Content</div>,
      'block-f': () => <div>Block F Content</div>,
    };

    let persistentInvocations: { stopId: string; index: number; total: number }[] = [];
    const TrackingPersistent = ({ stop, index, total }: { stop: NarrativeStop; index: number; total: number }) => {
      persistentInvocations.push({ stopId: stop.id, index, total });
      return <div className="tracking-badge">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</div>;
    };

    const mock11Presentation: PresentationDefinition = {
      id: 'mock-esabic-caelum-2026',
      model: {
        title: 'Caelum Systems Mock Deck',
        elements: elements11,
        stops: stops11,
        overview: { x: -1500, y: -1500, width: 3000, height: 3000 },
        contextStopId: 'overview',
      },
      content: content11,
      themes: prototypePresentation.themes,
      defaultThemeId: prototypePresentation.defaultThemeId,
      visual: {
        persistent: {
          default: TrackingPersistent,
        },
      },
    };

    it('renders exactly 10 static pages from an 11-stop deck with 1 stop omitted', () => {
      persistentInvocations = [];
      const html = renderToStaticMarkup(<StaticDeck definition={mock11Presentation} />);
      const pages = html.split('<article').slice(1);

      expect(pages).toHaveLength(10);
      expect(html).not.toContain('data-stop-id="black"');
      expect(html).toContain('data-stop-id="opening-nuclear"');
      expect(html).toContain('data-stop-id="closing"');
    });

    it('calculates the exact static page count in toolbar text', () => {
      const html = renderToStaticMarkup(<StaticDeck definition={mock11Presentation} />);
      expect(html).toContain('10 páginas en el orden narrativo. Usa Imprimir para guardar un PDF.');
      expect(html).not.toContain('11 páginas en el orden narrativo');
    });

    it('passes exact sequential index (0..9) and total (10) to Persistent overlay', () => {
      persistentInvocations = [];
      renderToStaticMarkup(<StaticDeck definition={mock11Presentation} />);

      expect(persistentInvocations).toHaveLength(10);
      persistentInvocations.forEach((inv, i) => {
        expect(inv.total).toBe(10); // NOT 11!
        expect(inv.index).toBe(i);   // Sequential 0..9!
      });

      // First exported stop must be opening-nuclear with index 0
      expect(persistentInvocations[0].stopId).toBe('opening-nuclear');
      expect(persistentInvocations[0].index).toBe(0);

      // Last exported stop must be closing with index 9
      expect(persistentInvocations[9].stopId).toBe('closing');
      expect(persistentInvocations[9].index).toBe(9);
    });

    it('assigns contiguous 1-indexed aria-labels to static pages', () => {
      const html = renderToStaticMarkup(<StaticDeck definition={mock11Presentation} />);

      expect(html).toContain('aria-label="1. Central nuclear"');
      expect(html).toContain('aria-label="2. Antenas de espacio profundo"');
      expect(html).toContain('aria-label="3. Vista general del sistema"');
      expect(html).toContain('aria-label="10. Cierre y contactos"');
      expect(html).not.toContain('aria-label="11.');
      expect(html).not.toContain('aria-label="0.');
    });

    it('handles multiple omitted stops correctly and preserves continuous numbering', () => {
      const multiOmitDeck: PresentationDefinition = {
        ...mock11Presentation,
        model: {
          ...mock11Presentation.model,
          stops: stops11.map((s, idx) => (idx === 0 || idx === 3 || idx === 7 ? { ...s, includeInStatic: false } : s)),
        },
      };

      const html = renderToStaticMarkup(<StaticDeck definition={multiOmitDeck} />);
      const pages = html.split('<article').slice(1);

      // 11 - 3 = 8 pages
      expect(pages).toHaveLength(8);
      expect(html).toContain('8 páginas en el orden narrativo.');
      expect(html).not.toContain('data-stop-id="black"');
      expect(html).not.toContain('data-stop-id="overview"');
      expect(html).not.toContain('data-stop-id="business"');
      expect(html).toContain('aria-label="1. Central nuclear"');
      expect(html).toContain('aria-label="8. Cierre y contactos"');
    });

    it('maintains 100% backward compatibility when includeInStatic is undefined', () => {
      // prototypePresentation has 8 stops, all undefined includeInStatic
      const htmlProto = renderToStaticMarkup(<StaticDeck definition={prototypePresentation} />);
      const protoPages = htmlProto.split('<article').slice(1);
      expect(protoPages).toHaveLength(prototypePresentation.model.stops.length);
      expect(htmlProto).toContain(`${prototypePresentation.model.stops.length} páginas en el orden narrativo.`);

      // diagonalPresentation has 7 stops, all undefined includeInStatic
      const htmlDiag = renderToStaticMarkup(<StaticDeck definition={diagonalPresentation} />);
      const diagPages = htmlDiag.split('<article').slice(1);
      expect(diagPages).toHaveLength(diagonalPresentation.model.stops.length);
      expect(htmlDiag).toContain(`${diagonalPresentation.model.stops.length} páginas en el orden narrativo.`);
    });

    it('handles extreme edge case where all stops have includeInStatic: false without throwing', () => {
      const allOmittedDeck: PresentationDefinition = {
        ...mock11Presentation,
        model: {
          ...mock11Presentation.model,
          stops: stops11.map((s) => ({ ...s, includeInStatic: false })),
        },
      };

      let html = '';
      expect(() => {
        html = renderToStaticMarkup(<StaticDeck definition={allOmittedDeck} />);
      }).not.toThrow();

      const pages = html.split('<article').slice(1);
      expect(pages).toHaveLength(0);
      expect(html).toContain('0 páginas en el orden narrativo.');
    });

    it('applies custom padding (padding: 0) to full-bleed stops in StaticDeck', () => {
      const html = renderToStaticMarkup(<StaticDeck definition={mock11Presentation} />);
      const PAGE = { width: 1280, height: 720 };

      // Stop opening-nuclear has padding: 0
      const blockABounds = elements11.find((e) => e.id === 'block-a')!.bounds;
      const expectedZeroTransform = fitRect(blockABounds, PAGE, 0);

      // Stop response-gap has default padding (falls back to 64 in static.tsx)
      const blockBBounds = elements11.find((e) => e.id === 'block-b')!.bounds;
      const expectedDefaultTransform = fitRect(blockBBounds, PAGE, 64);

      // opening-nuclear page transform should use k from expectedZeroTransform
      expect(html).toContain(`scale(${expectedZeroTransform.k})`);
      expect(html).toContain(`scale(${expectedDefaultTransform.k})`);
      expect(expectedZeroTransform.k).toBeGreaterThan(expectedDefaultTransform.k);
    });
  });
});

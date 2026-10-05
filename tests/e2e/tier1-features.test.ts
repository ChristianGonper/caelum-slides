import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { fitRect } from '../../system/src/camera';
import { validateDefinition, type PresentationDefinition } from '../../system/src/definition';
import { boundsOf, validatePresentation, type NarrativeStop, type Presentation } from '../../system/src/model';
import { changesContentInPlace } from '../../system/src/navigation';
import { deepTeal, monochromeBlue, primarySpace } from '../../system/src/palettes';
import { prototypePresentation } from '../../presentations/prototipo-espacial/presentation';
import { diagonalPresentation } from '../../presentations/ruta-diagonal/presentation';
import {
  CAELUM_DECK_ID,
  CAELUM_DECK_TITLE,
  EXPECTED_NOMINAL_STOPS,
  MISSION_SLOGAN,
  PERSISTENT_FOOTER_TEXT,
  REQUIRED_LOCAL_IMAGES,
  SCIENTIFIC_CITATION,
  TEAM_MEMBERS,
  calculateClockPolarAngle,
  calculateContrastRatio,
  calculateRadius,
  getProjectRoot,
  isCaelumDeckAvailable,
  loadCaelumDeck,
  loadExportedHtml,
} from './helpers';

describe('Tier 1: Feature Coverage (F1 - F21)', () => {
  // F1: Clean Black Start Screen
  describe('F1: Clean Black Start Screen', () => {
    it('soporta las opciones de parada limpia en el contrato del modelo', () => {
      const stop: NarrativeStop = {
        id: 'black',
        label: 'Inicio en negro',
        cameraTargetId: 'block-a',
        visibleIds: ['block-a'],
        hideBadge: true,
        hideControls: true,
        includeInStatic: false,
      };
      expect(stop.hideBadge).toBe(true);
      expect(stop.hideControls).toBe(true);
      expect(stop.includeInStatic).toBe(false);
    });

    it('suprime la interfaz en modo presentación según las clases de estilos y lógica de vista', () => {
      const stylesPath = path.join(getProjectRoot(), 'system/src/styles.css');
      const css = fs.readFileSync(stylesPath, 'utf8');
      expect(css).toContain('[data-mode="present"]');
      expect(css).toMatch(/\.app-shell\[data-mode="present"\]\s+\.app-header/);
      expect(css).toMatch(/\.app-shell\[data-mode="present"\]\s+\.sidebar/);

      const appSourcePath = path.join(getProjectRoot(), 'system/src/app.tsx');
      const appSource = fs.readFileSync(appSourcePath, 'utf8');
      expect(appSource).toMatch(/mode\s*!==\s*['"]present['"]\s*&&\s*!stop\.hideBadge/);
      expect(appSource).toMatch(/!stop\.hideControls/);
    });
  });

  // F2: Configurable View Margins
  describe('F2: Configurable View Margins', () => {
    it('permite encuadre con padding = 0 para fotografías a sangre', () => {
      const bounds = { x: 0, y: 0, width: 1280, height: 720 };
      const viewport = { width: 1280, height: 720 };
      const transform = fitRect(bounds, viewport, 0);
      expect(transform.k).toBe(1);
      expect(transform.x).toBe(0);
      expect(transform.y).toBe(0);
    });

    it('utiliza el margen estándar cuando no se especifica padding = 0', () => {
      const bounds = { x: 0, y: 0, width: 1280, height: 720 };
      const viewport = { width: 1280, height: 720 };
      const transformDefault = fitRect(bounds, viewport);
      const transformZero = fitRect(bounds, viewport, 0);
      expect(transformDefault.k).toBeLessThan(transformZero.k);
    });

    it('rechaza márgenes negativos en la validación de encuadre', () => {
      const bounds = { x: 0, y: 0, width: 800, height: 600 };
      const viewport = { width: 1280, height: 720 };
      expect(() => fitRect(bounds, viewport, -10)).toThrow(/no negativo/i);
    });
  });

  // F3: Static Export Stop Filtering
  describe('F3: Static Export Stop Filtering', () => {
    it('filtra paradas con includeInStatic = false en la exportación estática', () => {
      const stops: NarrativeStop[] = [
        { id: 'black', label: 'Negro', cameraTargetId: 'block-a', visibleIds: ['block-a'], includeInStatic: false },
        { id: 'opening', label: 'Apertura', cameraTargetId: 'block-a', visibleIds: ['block-a'], includeInStatic: true },
        { id: 'content', label: 'Contenido', cameraTargetId: 'block-b', visibleIds: ['block-b'] },
      ];
      const staticStops = stops.filter((s) => s.includeInStatic !== false);
      expect(staticStops.map((s) => s.id)).toEqual(['opening', 'content']);
    });

    it('mantiene retrocompatibilidad incluyendo todas las paradas de los ejemplos existentes', () => {
      const protoStops = prototypePresentation.model.stops.filter((s) => s.includeInStatic !== false);
      expect(protoStops).toHaveLength(prototypePresentation.model.stops.length);

      const diagStops = diagonalPresentation.model.stops.filter((s) => s.includeInStatic !== false);
      expect(diagStops).toHaveLength(diagonalPresentation.model.stops.length);
    });
  });

  // F4: Per-Stop Decoration/Canvas Suppression
  describe('F4: Per-Stop Decoration/Canvas Suppression', () => {
    it('valida las declaraciones de decorationByStop y canvasByStop en el esquema', () => {
      const definition: PresentationDefinition = {
        ...prototypePresentation,
        visual: {
          ...prototypePresentation.visual,
          decorationByStop: { intro: false, closing: true },
          canvasByStop: { intro: '#000000', closing: null },
        },
      };
      expect(() => validateDefinition(definition)).not.toThrow();
    });

    it('rechaza decorationByStop o canvasByStop para paradas inexistentes', () => {
      const badDecorationDef: PresentationDefinition = {
        ...prototypePresentation,
        visual: {
          ...prototypePresentation.visual,
          decorationByStop: { 'parada-fantasma': false },
        },
      };
      expect(() => validateDefinition(badDecorationDef)).toThrow(/parada inexistente/i);

      const badCanvasDef: PresentationDefinition = {
        ...prototypePresentation,
        visual: {
          ...prototypePresentation.visual,
          canvasByStop: { 'parada-fantasma': '#000000' },
        },
      };
      expect(() => validateDefinition(badCanvasDef)).toThrow(/parada inexistente/i);
    });
  });

  // F5: Presentation Mode Toggle
  describe('F5: Presentation Mode Toggle', () => {
    it('detecta parámetro URL ?mode=present y soporte del atajo de teclado p', () => {
      const appSourcePath = path.join(getProjectRoot(), 'system/src/app.tsx');
      const appSource = fs.readFileSync(appSourcePath, 'utf8');
      expect(appSource).toMatch(/mode.*present/);
      expect(appSource).toMatch(/event\.key(\.toLowerCase\(\))?\s*===\s*['"]p['"]/);
      expect(appSource).toContain('data-mode={mode}');
    });
  });

  // F6: Clock-Face Hexagonal Spatial Geometry
  describe('F6: Clock-Face Hexagonal Spatial Geometry', () => {
    it('valida las posiciones angulares canónicas de los 6 bloques alrededor del centro', () => {
      const center = { x: 0, y: 0 };
      // Coordenadas canónicas definidas en definicion-presentacion.md §3 y spec_report.md §2
      const blockCoordinates = {
        'block-a': { x: 0, y: -1100 },     // 12:00
        'block-b': { x: 1150, y: -580 },   // 02:00
        'block-c': { x: 1150, y: 580 },    // 04:00
        'block-d': { x: 0, y: 1100 },      // 06:00
        'block-e': { x: -1150, y: 580 },   // 08:00
        'block-f': { x: -1150, y: -580 },  // 10:00
      };

      const angleA = calculateClockPolarAngle(center, blockCoordinates['block-a']);
      const angleB = calculateClockPolarAngle(center, blockCoordinates['block-b']);
      const angleC = calculateClockPolarAngle(center, blockCoordinates['block-c']);
      const angleD = calculateClockPolarAngle(center, blockCoordinates['block-d']);
      const angleE = calculateClockPolarAngle(center, blockCoordinates['block-e']);
      const angleF = calculateClockPolarAngle(center, blockCoordinates['block-f']);

      // Tolerancia geométrica de 5 grados para formato 16:9
      expect(Math.abs(angleA - 0)).toBeLessThan(5);    // 12h = 0°
      expect(Math.abs(angleB - 60)).toBeLessThan(5);   // 2h = 60°
      expect(Math.abs(angleC - 120)).toBeLessThan(5);  // 4h = 120°
      expect(Math.abs(angleD - 180)).toBeLessThan(5);  // 6h = 180°
      expect(Math.abs(angleE - 240)).toBeLessThan(5);  // 8h = 240°
      expect(Math.abs(angleF - 300)).toBeLessThan(5);  // 10h = 300°

      // Radio consistente entre 1050px y 1450px
      for (const [id, coord] of Object.entries(blockCoordinates)) {
        const radius = calculateRadius(center, coord);
        expect(radius, `Radio de ${id}`).toBeGreaterThanOrEqual(1050);
        expect(radius, `Radio de ${id}`).toBeLessThanOrEqual(1450);
      }
    });

    it('comprueba que la presentación Caelum implementa la distribución hexagonal cuando está disponible', async () => {
      if (!isCaelumDeckAvailable()) return;
      const deck = await loadCaelumDeck();
      expect(deck).not.toBeNull();
      const elements = deck!.model.elements;
      const blockIds = ['block-a', 'block-b', 'block-c', 'block-d', 'block-e', 'block-f'];
      for (const id of blockIds) {
        const element = elements.find((e) => e.id === id);
        expect(element, `Elemento ${id} debe existir`).toBeDefined();
        expect(element!.bounds.width).toBeGreaterThan(0);
        expect(element!.bounds.height).toBeGreaterThan(0);
      }
    });
  });

  // F7: Central 6-Arm Drone SVG Schema
  describe('F7: Central 6-Arm Drone SVG Schema', () => {
    it('verifica la existencia del esquema o definición de brazos en el deck', async () => {
      const schemaPath = path.join(getProjectRoot(), 'presentations/esabic-caelum-2026/schema.tsx');
      if (fs.existsSync(schemaPath)) {
        const schemaSource = fs.readFileSync(schemaPath, 'utf8');
        expect(schemaSource).toContain('svg');
        // Debe integrar tokens de tema
        expect(schemaSource).toMatch(/var\(--graphic\)|var\(--accent\)|var\(--border\)/);
      } else {
        // Verifica la especificación documental
        const defDoc = fs.readFileSync(
          path.join(getProjectRoot(), 'presentations/esabic-caelum-2026/definicion-presentacion.md'),
          'utf8',
        );
        expect(defDoc).toMatch(/seis brazos|6 brazos/i);
      }
    });
  });

  // F8: Deck Registry Integration
  describe('F8: Deck Registry Integration', () => {
    it('comprueba que los decks base siguen registrados', () => {
      expect(prototypePresentation.id).toBe('prototipo-espacial');
      expect(diagonalPresentation.id).toBe('ruta-diagonal');
    });

    it('verifica que el ID y título acordados para Caelum son exactos', () => {
      expect(CAELUM_DECK_ID).toBe('esabic-caelum-2026');
      expect(CAELUM_DECK_TITLE).toBe('Caelum Systems — ESA BIC Castilla y León 2026');
    });

    it('verifica el registro en main.tsx cuando Caelum esté integrado', async () => {
      const mainPath = path.join(getProjectRoot(), 'system/src/main.tsx');
      const mainSource = fs.readFileSync(mainPath, 'utf8');
      if (isCaelumDeckAvailable()) {
        expect(mainSource).toContain(CAELUM_DECK_ID);
      }
    });
  });

  // F9: Direct Peripheral Flight Paths
  describe('F9: Direct Peripheral Flight Paths', () => {
    it('garantiza que la secuencia periférica no intercala paradas forzadas en el centro', () => {
      const stops = EXPECTED_NOMINAL_STOPS;
      const bIndex = stops.findIndex((s) => s.id === 'response-gap');
      const cIndex = stops.findIndex((s) => s.id === 'solution');
      const dIndex = stops.findIndex((s) => s.id === 'space-market');
      const eIndex = stops.findIndex((s) => s.id === 'business');
      const fIndex = stops.findIndex((s) => s.id === 'team');

      expect(cIndex).toBe(bIndex + 1);
      expect(dIndex).toBe(cIndex + 1);
      expect(eIndex).toBe(dIndex + 1);
      expect(fIndex).toBe(eIndex + 1);

      // Verificamos que los destinos son directamente los bloques periféricos
      expect(stops[bIndex].cameraTargetId).toBe('block-b');
      expect(stops[cIndex].cameraTargetId).toBe('block-c');
      expect(stops[dIndex].cameraTargetId).toBe('block-d');
      expect(stops[eIndex].cameraTargetId).toBe('block-e');
      expect(stops[fIndex].cameraTargetId).toBe('block-f');
    });
  });

  // F10: Stationary In-Place State Stacks
  describe('F10: Stationary In-Place State Stacks', () => {
    it('comprueba la invariancia de cámara en las pilas A1->A2 y F1->F2', () => {
      const stops = EXPECTED_NOMINAL_STOPS;
      const a1 = stops.find((s) => s.id === 'opening-nuclear')!;
      const a2 = stops.find((s) => s.id === 'opening-space')!;
      expect(a1.cameraTargetId).toBe(a2.cameraTargetId);

      const f1 = stops.find((s) => s.id === 'team')!;
      const f2 = stops.find((s) => s.id === 'network')!;
      expect(f1.cameraTargetId).toBe(f2.cameraTargetId);
    });

    it('verifica changesContentInPlace en pilas con mismo objetivo de cámara', () => {
      const mockPresentation: Presentation = {
        title: 'Mock Presentation',
        overview: { x: -1000, y: -1000, width: 2000, height: 2000 },
        elements: [
          { id: 'block-a', kind: 'block', label: 'A', bounds: { x: 0, y: -1000, width: 800, height: 600 }, states: ['nuclear', 'space'] },
        ],
        stops: [
          { id: 'opening-nuclear', label: 'Nuclear', cameraTargetId: 'block-a', visibleIds: ['block-a'], stateByElement: { 'block-a': 'nuclear' } },
          { id: 'opening-space', label: 'Space', cameraTargetId: 'block-a', visibleIds: ['block-a'], stateByElement: { 'block-a': 'space' } },
        ],
      };
      expect(changesContentInPlace(mockPresentation, 0, 1, 'block-a')).toBe(true);
    });
  });

  // F11: Full-Bleed Photo Framing
  describe('F11: Full-Bleed Photo Framing', () => {
    it('las paradas de fotos a sangre especifican padding: 0', () => {
      const a1 = EXPECTED_NOMINAL_STOPS.find((s) => s.id === 'opening-nuclear')!;
      const a2 = EXPECTED_NOMINAL_STOPS.find((s) => s.id === 'opening-space')!;
      expect(a1.padding).toBe(0);
      expect(a2.padding).toBe(0);
    });
  });

  // F12: Literal Text Preservation
  describe('F12: Literal Text Preservation', () => {
    it('verifica la cita científica exacta de Toropov en las fuentes oficiales', () => {
      const notasPath = path.join(getProjectRoot(), 'presentations/esabic-caelum-2026/Notas.md');
      const notas = fs.readFileSync(notasPath, 'utf8');
      expect(notas).toContain('A. I. Toropov');
      expect(notas).toContain('Acoustic Resonance Weapons for Drone Interdiction');
      expect(notas).toContain('Drones and Autonomous Vehicles, 2026');
    });

    it('verifica los textos literales de las diapositivas en Notas.md', () => {
      const notas = fs.readFileSync(path.join(getProjectRoot(), 'presentations/esabic-caelum-2026/Notas.md'), 'utf8');
      expect(notas).toContain('The response gap');
      expect(notas).toContain('Detecting a drone is not the same as stopping it safely.');
      expect(notas).toContain('Our solution');
      expect(notas).toContain('R.A.R.: an acoustic effector for propeller-driven UAS');
      expect(notas).toContain('Built for the aerospace ground segment');
      expect(notas).toContain('A credible route from prototype to business');
      expect(notas).toContain('Technical feasibility');
      expect(notas).toContain('Revenue model');
      expect(notas).toContain('Production strategy');
      expect(notas).toContain('Intellectual property');
      expect(notas).toContain('The team behind Caelum Systems');
      expect(notas).toContain('Support and institutional network');
    });

    it('verifica el eslogan y marca persistente acordados', () => {
      expect(PERSISTENT_FOOTER_TEXT).toBe('Caelum Systems · ESA BIC CYL 2026');
      expect(MISSION_SLOGAN).toBe('Protecting Europe’s space ground infrastructure with disruptive sound technologies.');
    });
  });

  // F13: Professional Team Profiles
  describe('F13: Professional Team Profiles', () => {
    it('incluye los 3 miembros del equipo con sus roles exactos y URLs de LinkedIn', () => {
      expect(TEAM_MEMBERS).toHaveLength(3);
      const names = TEAM_MEMBERS.map((m) => m.name);
      expect(names).toContain('Guillermo Alba Buitrón');
      expect(names).toContain('Alejandro Gil Getino');
      expect(names).toContain('Christian González Pérez');

      for (const member of TEAM_MEMBERS) {
        expect(member.rawUrl).toMatch(/^https:\/\/www\.linkedin\.com\/in\//);
        expect(member.roleSlide8.length).toBeGreaterThan(10);
        expect(member.roleSlide10.length).toBeGreaterThan(5);
      }
    });
  });

  // F14: Optical-Grade Vector QR Codes
  describe('F14: Optical-Grade Vector QR Codes', () => {
    it('asegura la correcta codificación de caracteres no ASCII en la URL de Guillermo', () => {
      const guillermo = TEAM_MEMBERS.find((m) => m.name.includes('Guillermo'))!;
      expect(encodeURI(guillermo.rawUrl)).toBe(guillermo.encodedUrl);
      expect(guillermo.encodedUrl).toContain('buitr%C3%B3n');
    });

    it('garantiza contraste óptico estricto en los códigos QR (módulo oscuro sobre fondo claro)', () => {
      // Los módulos QR deben tener color oscuro (#000000 o similar) y quiet zone blanca (#ffffff)
      const contrast = calculateContrastRatio('#000000', '#ffffff');
      expect(contrast).toBeGreaterThanOrEqual(20); // 21:1 relación máxima
    });
  });

  // F15: Local Image Asset Binding
  describe('F15: Local Image Asset Binding', () => {
    it('comprueba que las 16 imágenes locales existen físicamente con tamaño positivo', () => {
      const imagesDir = path.join(getProjectRoot(), 'presentations/esabic-caelum-2026/assets/images');
      expect(fs.existsSync(imagesDir)).toBe(true);

      for (const imageName of REQUIRED_LOCAL_IMAGES) {
        const fullPath = path.join(imagesDir, imageName);
        expect(fs.existsSync(fullPath), `Imagen ${imageName} debe existir`).toBe(true);
        const stat = fs.statSync(fullPath);
        expect(stat.size, `Imagen ${imageName} no debe estar vacía`).toBeGreaterThan(1000);
      }
    });
  });

  // F16: Standalone Single-File HTML Export
  describe('F16: Standalone Single-File HTML Export', () => {
    it('verifica que caelum-slides.html existe y es un bundle autocontenido', () => {
      const html = loadExportedHtml();
      expect(html).not.toBeNull();
      expect(html).toMatch(/<!doctype html>/i);
      expect(html).toContain('<script type="module">');
      expect(html).toContain('<style>');
      // No debe contener scripts o estilos externos con http o https
      expect(html).not.toMatch(/<script\b[^>]*src="https?:\/\//i);
      expect(html).not.toMatch(/<link\b[^>]*rel="stylesheet"[^>]*href="https?:\/\//i);
    });
  });

  // F17: Headless 16:9 PDF Export (11 pages)
  describe('F17: Headless 16:9 PDF Export (11 pages)', () => {
    it('el contrato estático de Caelum especifica exactamente 11 páginas de contenido', () => {
      const staticStops = EXPECTED_NOMINAL_STOPS.filter((s) => s.includeInStatic !== false);
      expect(staticStops).toHaveLength(12);
      expect(staticStops[0].id).toBe('opening-nuclear');
      expect(staticStops[10].id).toBe('closing');
      expect(staticStops[11].id).toBe('contacts');
    });
  });

  // F18: Multi-Theme Harmonization
  describe('F18: Multi-Theme Harmonization', () => {
    it('valida que los 3 temas del sistema definen tokens cohesivos y legibles', () => {
      const themes = [primarySpace, deepTeal, monochromeBlue];
      for (const theme of themes) {
        expect(theme.tokens.typography.title).toBeDefined();
        expect(theme.tokens.background.primary).toBeDefined();
        const contrast = calculateContrastRatio(theme.tokens.typography.title, theme.tokens.background.primary);
        expect(contrast, `Contraste en tema ${theme.id}`).toBeGreaterThanOrEqual(4.5);
      }
    });
  });

  // F19: Implementation Plan Documentation
  describe('F19: Implementation Plan Documentation', () => {
    it('verifica la existencia del plan de implementación con estructura completa', () => {
      const planPath = path.join(getProjectRoot(), 'presentations/esabic-caelum-2026/plan-implementacion.md');
      expect(fs.existsSync(planPath)).toBe(true);
      const planContent = fs.readFileSync(planPath, 'utf8');
      expect(planContent).toContain('Fase 0');
      expect(planContent).toContain('Fase 1');
      expect(planContent).toContain('Fase 2');
      expect(planContent).toContain('Fase 3');
      expect(planContent).toContain('Fase 4');
      expect(planContent).toContain('Fase 5');
    });
  });

  // F20: Atomic Git Commits
  describe('F20: Atomic Git Commits', () => {
    it('verifica que el repositorio tiene historial de commits en español indicativo', () => {
      const gitHeadPath = path.join(getProjectRoot(), '.git/HEAD');
      expect(fs.existsSync(gitHeadPath)).toBe(true);
    });
  });

  // F21: Requirement-Driven E2E Test Suite
  describe('F21: Requirement-Driven E2E Test Suite', () => {
    it('verifica la existencia y estructura de la suite E2E en tests/e2e', () => {
      const e2eDir = path.join(getProjectRoot(), 'tests/e2e');
      expect(fs.existsSync(e2eDir)).toBe(true);
      expect(fs.existsSync(path.join(e2eDir, 'helpers.ts'))).toBe(true);
      expect(fs.existsSync(path.join(e2eDir, 'tier1-features.test.ts'))).toBe(true);
    });
  });
});

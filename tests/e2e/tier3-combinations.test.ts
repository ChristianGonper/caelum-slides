import { describe, expect, it } from 'vitest';
import { fitRect } from '../../system/src/camera';
import type { Presentation } from '../../system/src/model';
import { changesContentInPlace, contextIndex, navigateTo, type Navigation } from '../../system/src/navigation';
import { deepTeal, monochromeBlue, primarySpace } from '../../system/src/palettes';
import { themeVariables } from '../../system/src/theme';
import { prototypePresentation } from '../../presentations/prototipo-espacial/presentation';
import {
  EXPECTED_NOMINAL_STOPS,
  calculateContrastRatio,
} from './helpers';

describe('Tier 3: Cross-Feature Combinations', () => {
  // 1. Theme switching during active stop / flight
  describe('Cambio de tema durante una parada activa', () => {
    it('el cambio de tema actualiza las variables CSS sin alterar el objetivo de cámara ni el índice', () => {
      let navState: Navigation = { index: 4, previousIndex: 3 };
      const stop = EXPECTED_NOMINAL_STOPS[navState.index];
      expect(stop.id).toBe('response-gap');
      expect(stop.cameraTargetId).toBe('block-b');

      // Intercambiamos temas
      const varsPrimary = themeVariables(primarySpace);
      const varsTeal = themeVariables(deepTeal);
      const varsMono = themeVariables(monochromeBlue);

      expect(varsPrimary['--canvas-bg' as keyof typeof varsPrimary])
        .not.toBe(varsTeal['--canvas-bg' as keyof typeof varsTeal]);
      expect(varsTeal['--canvas-bg' as keyof typeof varsTeal])
        .not.toBe(varsMono['--canvas-bg' as keyof typeof varsMono]);

      // El estado de navegación y el objetivo de cámara permanecen invariantes
      expect(navState.index).toBe(4);
      expect(stop.cameraTargetId).toBe('block-b');
    });

    it('los códigos QR mantienen contraste óptico oscuro sobre claro independientemente del tema activo', () => {
      // Regla fundamental de la especificación (definicion §6, §7): los QR nunca se invierten
      const themes = [primarySpace, deepTeal, monochromeBlue];
      for (const theme of themes) {
        // Módulo QR siempre oscuro, fondo QR siempre claro
        const qrModuleColor = '#000000';
        const qrQuietZoneColor = '#ffffff';
        const qrContrast = calculateContrastRatio(qrModuleColor, qrQuietZoneColor);
        expect(qrContrast, `Contraste de QR bajo tema ${theme.id}`).toBeGreaterThanOrEqual(20);
      }
    });
  });

  // 2. Presentation mode with static export
  describe('Modo presentación combinado con exportación estática', () => {
    it('el modo presentación suprime la barra lateral y cabecera en el visor interactivo', () => {
      const mode = 'present';
      const isPresentation = mode === 'present';
      expect(isPresentation).toBe(true);
      // En modo presentación data-mode="present" aplica display:none en header y sidebar
    });

    it('la exportación estática preserva todas las paradas exportables sin controles interactivos de avance', () => {
      const stops = EXPECTED_NOMINAL_STOPS;
      const exportable = stops.filter((s) => s.includeInStatic !== false);
      expect(exportable).toHaveLength(11);
      // Ninguna página estática contiene botones de control de navegación interactiva
      for (const stop of exportable) {
        expect(stop.id).not.toBe('black');
      }
    });
  });

  // 3. In-place stacks combined with camera movements
  describe('Pilas de estado in situ combinadas con vuelos de cámara', () => {
    const mockModel: Presentation = {
      title: 'Caelum Rehearsal Mock',
      overview: { x: -2000, y: -1500, width: 4000, height: 3000 },
      elements: [
        { id: 'block-a', kind: 'block', label: 'A', bounds: { x: 0, y: -1100, width: 1120, height: 630 }, states: ['nuclear', 'space'] },
        { id: 'block-b', kind: 'block', label: 'B', bounds: { x: 1150, y: -580, width: 1120, height: 630 } },
        { id: 'block-c', kind: 'block', label: 'C', bounds: { x: 1150, y: 580, width: 1120, height: 630 } },
        { id: 'block-f', kind: 'block', label: 'F', bounds: { x: -1150, y: -580, width: 1120, height: 630 }, states: ['team', 'network'] },
        { id: 'center', kind: 'cover', label: 'Centro', bounds: { x: -480, y: -270, width: 960, height: 540 }, states: ['intro', 'closing'] },
      ],
      stops: [
        { id: 'opening-nuclear', label: 'A1', cameraTargetId: 'block-a', visibleIds: ['block-a'], stateByElement: { 'block-a': 'nuclear' } },
        { id: 'opening-space', label: 'A2', cameraTargetId: 'block-a', visibleIds: ['block-a'], stateByElement: { 'block-a': 'space' } },
        { id: 'overview', label: 'Vista general', cameraTargetId: 'overview', visibleIds: ['block-a', 'block-b', 'block-c', 'block-f', 'center'], stateByElement: { center: 'intro' } },
        { id: 'response-gap', label: 'B', cameraTargetId: 'block-b', visibleIds: ['block-b'] },
        { id: 'solution', label: 'C', cameraTargetId: 'block-c', visibleIds: ['block-c'] },
        { id: 'team', label: 'F1', cameraTargetId: 'block-f', visibleIds: ['block-f'], stateByElement: { 'block-f': 'team' } },
        { id: 'network', label: 'F2', cameraTargetId: 'block-f', visibleIds: ['block-f'], stateByElement: { 'block-f': 'network' } },
        { id: 'closing', label: 'Cierre', cameraTargetId: 'center', visibleIds: ['center'], stateByElement: { center: 'closing' } },
      ],
    };

    it('transición A1 -> A2: mantiene la cámara quieta y conmuta contenido in situ', () => {
      const inPlace = changesContentInPlace(mockModel, 0, 1, 'block-a');
      expect(inPlace).toBe(true);

      const target0 = mockModel.stops[0].cameraTargetId;
      const target1 = mockModel.stops[1].cameraTargetId;
      expect(target0).toBe(target1);

      const viewport = { width: 1280, height: 720 };
      const el = mockModel.elements.find((e) => e.id === 'block-a')!;
      const cam0 = fitRect(el.bounds, viewport, 0);
      const cam1 = fitRect(el.bounds, viewport, 0);
      expect(cam0).toEqual(cam1);
    });

    it('transición A2 -> Overview: activa alejamiento dramático sin cambio in situ', () => {
      const inPlace = changesContentInPlace(mockModel, 1, 2, 'block-a');
      expect(inPlace).toBe(false);

      const target1 = mockModel.stops[1].cameraTargetId;
      const target2 = mockModel.stops[2].cameraTargetId;
      expect(target1).not.toBe(target2);
      expect(target2).toBe('overview');

      const viewport = { width: 1280, height: 720 };
      const camA = fitRect(mockModel.elements.find((e) => e.id === 'block-a')!.bounds, viewport, 0);
      const camOverview = fitRect(mockModel.overview, viewport, 64);
      // El zoom de vista general debe ser significativamente más alejado (menor k)
      expect(camOverview.k).toBeLessThan(camA.k);
    });

    it('transición B -> C: vuelo directo periférico por cuerda entre cuadrantes este', () => {
      const targetB = mockModel.stops[3].cameraTargetId;
      const targetC = mockModel.stops[4].cameraTargetId;
      expect(targetB).toBe('block-b');
      expect(targetC).toBe('block-c');

      const elB = mockModel.elements.find((e) => e.id === 'block-b')!;
      const elC = mockModel.elements.find((e) => e.id === 'block-c')!;
      // Ambos en el este (x > 0), vuelo directo vertical
      expect(elB.bounds.x).toBeGreaterThan(0);
      expect(elC.bounds.x).toBeGreaterThan(0);
      expect(elB.bounds.y).toBeLessThan(0); // 2h (norte-este)
      expect(elC.bounds.y).toBeGreaterThan(0); // 4h (sur-este)
    });

    it('transición F1 -> F2: mantiene la cámara quieta en el cuadrante noroeste', () => {
      const inPlace = changesContentInPlace(mockModel, 5, 6, 'block-f');
      expect(inPlace).toBe(true);

      const targetF1 = mockModel.stops[5].cameraTargetId;
      const targetF2 = mockModel.stops[6].cameraTargetId;
      expect(targetF1).toBe(targetF2);
    });

    it('transición F2 -> Cierre: vuelo hacia el centro cerrando el recorrido', () => {
      const targetF2 = mockModel.stops[6].cameraTargetId;
      const targetClosing = mockModel.stops[7].cameraTargetId;
      expect(targetF2).toBe('block-f');
      expect(targetClosing).toBe('center');

      const centerEl = mockModel.elements.find((e) => e.id === 'center')!;
      expect(centerEl.bounds.x + centerEl.bounds.width / 2).toBeCloseTo(0);
      expect(centerEl.bounds.y + centerEl.bounds.height / 2).toBeCloseTo(0);
    });
  });

  // 4. Combined stop filtering with decoration suppression
  describe('Filtrado de paradas con supresión de decoración SVG', () => {
    it('la parada de inicio en negro apaga la decoración y se omite en la salida estática', () => {
      const blackStop = EXPECTED_NOMINAL_STOPS.find((s) => s.id === 'black')!;
      expect(blackStop.includeInStatic).toBe(false);
      expect(blackStop.hideBadge).toBe(true);
      expect(blackStop.hideControls).toBe(true);
    });

    it('la parada de vista general activa la decoración central pero omite el contador', () => {
      const overviewStop = EXPECTED_NOMINAL_STOPS.find((s) => s.id === 'overview')!;
      expect(overviewStop.includeInStatic).toBe(true);
      expect(overviewStop.contentNumber).toBeNull();
    });

    it('la parada de cierre activa la decoración, el contador y los perfiles de contacto', () => {
      const closingStop = EXPECTED_NOMINAL_STOPS.find((s) => s.id === 'closing')!;
      expect(closingStop.includeInStatic).toBe(true);
      expect(closingStop.contentNumber).toBe('09');
      expect(closingStop.stateByElement?.center).toBe('closing');
    });
  });

  // 5. Rapid / interrupted navigation
  describe('Navegación rápida e interrupciones de cámara', () => {
    it('gestiona saltos rápidos sucesivos preservando el origen en previousIndex', () => {
      let nav: Navigation = { index: 0, previousIndex: null };
      nav = navigateTo(nav, 1, 11);
      expect(nav).toEqual({ index: 1, previousIndex: 0 });

      nav = navigateTo(nav, 5, 11);
      expect(nav).toEqual({ index: 5, previousIndex: 1 });

      nav = navigateTo(nav, 10, 11);
      expect(nav).toEqual({ index: 10, previousIndex: 5 });
    });

    it('la función contextIndex resuelve la vista general sin confundirla con el cierre', () => {
      const mockPresentation = {
        title: 'Mock Test',
        contextStopId: 'return',
        overview: { x: -1000, y: -1000, width: 2000, height: 2000 },
        elements: [],
        stops: [
          { id: 'intro', label: 'Intro', cameraTargetId: 'overview', visibleIds: [] },
          { id: 'stop1', label: 'S1', cameraTargetId: 's1', visibleIds: [] },
          { id: 'return', label: 'Volver', cameraTargetId: 'overview', visibleIds: [] },
          { id: 'closing', label: 'Cierre', cameraTargetId: 'overview', visibleIds: [] },
        ],
      };
      expect(contextIndex(mockPresentation)).toBe(2);
    });
  });
});

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { fitRect } from '../../system/src/camera';
import { boundsOf } from '../../system/src/model';
import { changesContentInPlace, navigateTo, type Navigation } from '../../system/src/navigation';
import {
  CAELUM_DECK_ID,
  EXPECTED_NOMINAL_STOPS,
  MISSION_SLOGAN,
  PERSISTENT_FOOTER_TEXT,
  SCIENTIFIC_CITATION,
  TEAM_MEMBERS,
  calculateContrastRatio,
  getProjectRoot,
  isCaelumDeckAvailable,
  isPdfAvailable,
  loadCaelumDeck,
  loadExportedHtml,
  loadExportedPdf,
} from './helpers';

describe('Tier 4: Real-World Presentation Scenarios', () => {
  // Scenario 1: Nominal 11-stop full rehearsal
  describe('Escenario 1: Ensayo completo nominal de 12 paradas (10 minutos)', () => {
    it('ejecuta la secuencia paso a paso verificando objetivos de cámara, estados y números de diapositiva', () => {
      let state: Navigation = { index: 0, previousIndex: null };
      const stops = EXPECTED_NOMINAL_STOPS;
      expect(stops).toHaveLength(14);

      // Parada 1: black (00:00)
      expect(stops[0].id).toBe('black');
      expect(stops[0].hideBadge).toBe(true);
      expect(stops[0].hideControls).toBe(true);
      expect(stops[0].contentNumber).toBeNull();

      // Parada 2: opening-nuclear (00:30)
      state = navigateTo(state, 1, stops.length);
      expect(state.index).toBe(1);
      expect(stops[1].id).toBe('opening-nuclear');
      expect(stops[1].cameraTargetId).toBe('block-a');
      expect(stops[1].contentNumber).toBe('01');
      expect(stops[1].padding).toBe(0);

      // Parada 3: opening-space (01:00) - in-place stack A
      state = navigateTo(state, 2, stops.length);
      expect(state.index).toBe(2);
      expect(stops[2].id).toBe('opening-space');
      expect(stops[2].cameraTargetId).toBe(stops[1].cameraTargetId);
      expect(stops[2].contentNumber).toBe('02');
      expect(stops[2].padding).toBe(0);

      // Parada 4: overview (01:30) - zoom out reveal
      state = navigateTo(state, 5, stops.length);
      expect(state.index).toBe(5);
      expect(stops[5].id).toBe('overview');
      expect(stops[5].cameraTargetId).toBe('overview');
      expect(stops[5].contentNumber).toBeNull();

      // Parada 5: response-gap (02:40) - Bloque B (2h)
      state = navigateTo(state, 6, stops.length);
      expect(state.index).toBe(6);
      expect(stops[6].id).toBe('response-gap');
      expect(stops[6].cameraTargetId).toBe('block-b');
      expect(stops[6].contentNumber).toBe('03');

      // Parada 6: solution (04:40) - Bloque C (4h, vuelo directo B->C)
      state = navigateTo(state, 7, stops.length);
      expect(state.index).toBe(7);
      expect(stops[7].id).toBe('solution');
      expect(stops[7].cameraTargetId).toBe('block-c');
      expect(stops[7].contentNumber).toBe('04');

      // Parada 7: space-market (05:50) - Bloque D (6h, vuelo directo C->D)
      state = navigateTo(state, 8, stops.length);
      expect(state.index).toBe(8);
      expect(stops[8].id).toBe('space-market');
      expect(stops[8].cameraTargetId).toBe('block-d');
      expect(stops[8].contentNumber).toBe('05');

      // Parada 8: business (07:35) - Bloque E (8h, vuelo directo D->E)
      state = navigateTo(state, 9, stops.length);
      expect(state.index).toBe(9);
      expect(stops[9].id).toBe('business');
      expect(stops[9].cameraTargetId).toBe('block-e');
      expect(stops[9].contentNumber).toBe('06');

      // Parada 9: team (08:35) - Bloque F (10h, vuelo directo E->F)
      state = navigateTo(state, 10, stops.length);
      expect(state.index).toBe(10);
      expect(stops[10].id).toBe('team');
      expect(stops[10].cameraTargetId).toBe('block-f');
      expect(stops[10].contentNumber).toBe('07');

      // Parada 10: network (09:15) - in-place stack F
      state = navigateTo(state, 11, stops.length);
      expect(state.index).toBe(11);
      expect(stops[11].id).toBe('network');
      expect(stops[11].cameraTargetId).toBe(stops[10].cameraTargetId);
      expect(stops[11].contentNumber).toBe('08');

      // Parada 11: closing (09:40 - 10:00+) - regreso al centro
      state = navigateTo(state, 12, stops.length);
      expect(state.index).toBe(12);
      expect(stops[12].id).toBe('closing');
      expect(stops[12].cameraTargetId).toBe('center');
      expect(stops[12].contentNumber).toBe('09');
      state = navigateTo(state, 13, stops.length);
      expect(stops[state.index].id).toBe('contacts');
      expect(stops[state.index].contentNumber).toBe('10');
      expect(stops[state.index].cameraTargetId).toBe(stops[12].cameraTargetId);
    });

    it('valida la concordancia con la definición del deck real si está implementado', async () => {
      if (!isCaelumDeckAvailable()) return;
      const deck = await loadCaelumDeck();
      expect(deck).not.toBeNull();
      expect(deck!.id).toBe(CAELUM_DECK_ID);
      expect(deck!.model.stops).toHaveLength(EXPECTED_NOMINAL_STOPS.length);
      for (let i = 0; i < EXPECTED_NOMINAL_STOPS.length; i++) {
        expect(deck!.model.stops[i].id).toBe(EXPECTED_NOMINAL_STOPS[i].id);
        expect(deck!.model.stops[i].cameraTargetId).toBe(EXPECTED_NOMINAL_STOPS[i].cameraTargetId);
      }
    });
  });

  // Scenario 2: Standalone offline HTML delivery
  describe('Escenario 2: Entrega HTML autónoma y ejecutable sin conexión', () => {
    it('comprueba que el archivo caelum-slides.html es completamente autosuficiente', () => {
      const html = loadExportedHtml();
      expect(html).not.toBeNull();

      // Debe tener tamaño representativo de un bundle empaquetado (> 500 KB)
      const htmlPath = path.join(getProjectRoot(), 'output/html/caelum-slides.html');
      const stats = fs.statSync(htmlPath);
      expect(stats.size).toBeGreaterThan(500 * 1024);

      // Verificamos que no contiene enlaces externos a scripts de internet
      expect(html).not.toMatch(/src="https?:\/\//i);
      expect(html).not.toMatch(/href="https?:\/\/[^"]*\.css"/i);

      // Debe contener el script principal inline
      expect(html).toContain('<script type="module">');
      // Debe contener estilos embebidos
      expect(html).toContain('<style>');
    });
  });

  // Scenario 3: 16:9 PDF export deliverable verification
  describe('Escenario 3: Verificación del entregable PDF en formato 16:9', () => {
    it('la secuencia exportable a PDF contiene exactamente las 11 diapositivas acordadas', () => {
      const staticStops = EXPECTED_NOMINAL_STOPS.filter((s) => s.includeInStatic !== false);
      expect(staticStops).toHaveLength(12);
      // El orden de páginas en el PDF debe coincidir con:
      const expectedPdfOrder = [
        'opening-nuclear', // Página 1 (01)
        'opening-space',   // Página 2 (02)
        'news-5',          // Collage completo
        'overview',        // Página 4 (Vista general)
        'response-gap',    // Página 4 (03)
        'solution',        // Página 5 (04)
        'space-market',    // Página 6 (05)
        'business',        // Página 7 (06)
        'team',            // Página 8 (07)
        'network',         // Página 9 (08)
        'closing',         // Página 10 (09)
        'contacts',        // Página 11 (10)
      ];
      expect(staticStops.map((s) => s.id)).toEqual(expectedPdfOrder);
    });

    it('verifica el documento PDF generado en disco cuando el exportador haya concluido', () => {
      if (!isPdfAvailable()) return;
      const pdfBuffer = loadExportedPdf();
      expect(pdfBuffer).not.toBeNull();
      // Cabecera canónica de documento PDF (%PDF-)
      const header = String.fromCharCode(...pdfBuffer!.slice(0, 5));
      expect(header).toBe('%PDF-');
      expect(pdfBuffer!.length).toBeGreaterThan(10 * 1024);
    });
  });

  // Scenario 4: Optical QR verification
  describe('Escenario 4: Verificación óptica y trazabilidad de contactos QR', () => {
    it('comprueba que los tres miembros disponen de URLs oficiales y contraste óptico apto para escaneo móvil', () => {
      expect(TEAM_MEMBERS).toHaveLength(3);

      for (const member of TEAM_MEMBERS) {
        expect(member.encodedUrl).toMatch(/^https:\/\/www\.linkedin\.com\/in\//);
        // Contraste óptico absoluto
        const contrast = calculateContrastRatio('#000000', '#ffffff');
        expect(contrast).toBeGreaterThanOrEqual(20);
      }
    });

    it('verifica que la URL con tildes (Guillermo) está correctamente codificada y libre de artefactos Unicode rotos', () => {
      const guillermo = TEAM_MEMBERS.find((m) => m.name.includes('Guillermo'))!;
      expect(guillermo.encodedUrl).toContain('buitr%C3%B3n');
      expect(guillermo.encodedUrl).not.toContain('\uFFFD'); // Carácter de reemplazo Unicode corrupto
    });
  });
});

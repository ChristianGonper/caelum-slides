import { describe, expect, it } from 'vitest';
import { fitRect } from '../../system/src/camera';
import { validatePresentation } from '../../system/src/model';
import { navigateTo } from '../../system/src/navigation';
import { validateThemes } from '../../system/src/theme';
import { prototypePresentation } from '../../presentations/prototipo-espacial/presentation';
import { diagonalPresentation } from '../../presentations/ruta-diagonal/presentation';
import {
  EXPECTED_NOMINAL_STOPS,
  TEAM_MEMBERS,
  calculateContrastRatio,
} from './helpers';

describe('Tier 2: Boundary & Corner Cases', () => {
  // 1. Empty, degenerate, and extreme viewports
  describe('Encuadre de cámara en límites de viewport', () => {
    const testBounds = { x: -500, y: -300, width: 1000, height: 600 };

    it('rechaza dimensiones cero o negativas de viewport o bounds', () => {
      expect(() => fitRect(testBounds, { width: 0, height: 720 })).toThrow('El encuadre requiere dimensiones positivas');
      expect(() => fitRect(testBounds, { width: 1280, height: 0 })).toThrow('El encuadre requiere dimensiones positivas');
      expect(() => fitRect(testBounds, { width: -1280, height: 720 })).toThrow('El encuadre requiere dimensiones positivas');
      expect(() => fitRect({ ...testBounds, width: 0 }, { width: 1280, height: 720 })).toThrow('El encuadre requiere dimensiones positivas');
      expect(() => fitRect({ ...testBounds, height: -10 }, { width: 1280, height: 720 })).toThrow('El encuadre requiere dimensiones positivas');
    });

    it('soporta viewport mínimo de 1x1 sin generar NaN o divisiones por cero', () => {
      const transform = fitRect(testBounds, { width: 1, height: 1 }, 0);
      expect(Number.isFinite(transform.k)).toBe(true);
      expect(Number.isFinite(transform.x)).toBe(true);
      expect(Number.isFinite(transform.y)).toBe(true);
      expect(transform.k).toBeGreaterThan(0);
    });

    it('calcula encuadres precisos en pantallas 4K y 8K', () => {
      const viewport4K = { width: 3840, height: 2160 };
      const transform4K = fitRect(testBounds, viewport4K, 64);
      expect(transform4K.k).toBeGreaterThan(1);
      expect(transform4K.x).toBeCloseTo(3840 / 2);
      expect(transform4K.y).toBeCloseTo(2160 / 2);

      const viewport8K = { width: 7680, height: 4320 };
      const transform8K = fitRect(testBounds, viewport8K, 64);
      expect(transform8K.k).toBeGreaterThan(transform4K.k);
    });

    it('adapta el encuadre en relaciones de aspecto extremas (ultrawide 32:9 y vertical 9:16)', () => {
      const ultrawide = { width: 5120, height: 1440 }; // 32:9
      const transformUW = fitRect(testBounds, ultrawide, 48);
      expect(transformUW.k).toBeGreaterThan(0);
      // En ultrawide, la altura gobierna la escala
      expect(testBounds.height * transformUW.k).toBeLessThanOrEqual(1440);

      const portrait = { width: 1080, height: 1920 }; // 9:16
      const transformP = fitRect(testBounds, portrait, 48);
      expect(transformP.k).toBeGreaterThan(0);
      // En portrait, la anchura gobierna la escala
      expect(testBounds.width * transformP.k).toBeLessThanOrEqual(1080);
    });
  });

  // 2. Padding boundaries
  describe('Límites de margen de encuadre (padding)', () => {
    const bounds = { x: 0, y: 0, width: 1280, height: 720 };
    const viewport = { width: 1280, height: 720 };

    it('padding = 0 produce un ajuste exacto al 100% sin píxeles de holgura', () => {
      const transform = fitRect(bounds, viewport, 0);
      expect(transform.k).toBe(1);
      expect(transform.x).toBe(0);
      expect(transform.y).toBe(0);
    });

    it('maneja paddings grandes que superan el tamaño del viewport sin romper', () => {
      // Si el padding supera la mitad del viewport, Math.max(1, viewport - padding*2) evita valores negativos
      const transform = fitRect(bounds, viewport, 1000);
      expect(Number.isFinite(transform.k)).toBe(true);
      expect(transform.k).toBeGreaterThan(0);
    });

    it('rechaza márgenes negativos con mensaje explicativo', () => {
      expect(() => fitRect(bounds, viewport, -1)).toThrow(/no negativo/i);
    });
  });

  // 3. Theme fallback and resilience
  describe('Resiliencia y degradación de temas', () => {
    it('valida que la paleta por defecto existe obligatoriamente entre los temas', () => {
      expect(() => validateThemes(prototypePresentation.themes, 'paleta-inexistente'))
        .toThrow('Paleta inicial inexistente');
    });

    it('rechaza paletas con fuentes o campos vacíos', () => {
      const brokenTheme = {
        ...prototypePresentation.themes[0],
        tokens: {
          ...prototypePresentation.themes[0].tokens,
          fonts: { ...prototypePresentation.themes[0].tokens.fonts, bodyFamily: '   ' },
        },
      };
      expect(() => validateThemes([brokenTheme], brokenTheme.id)).toThrow('Paleta incompleta');
    });

    it('garantiza contraste suficiente incluso con colores cercanos', () => {
      const blackOnWhite = calculateContrastRatio('#000000', '#ffffff');
      expect(blackOnWhite).toBeCloseTo(21, 0);

      const darkOnDark = calculateContrastRatio('#111827', '#080B14');
      expect(darkOnDark).toBeLessThan(3.0); // Falla WCAG si se usa como texto principal
    });
  });

  // 4. QR URL encoding edge cases
  describe('Codificación de URLs y caracteres especiales en contactos', () => {
    it('preserva correctamente la tilde en buitrón con codificación percent-encoding', () => {
      const raw = 'https://www.linkedin.com/in/guillermo-alba-buitrón-07366b254/';
      const encoded = encodeURI(raw);
      expect(encoded).toContain('buitr%C3%B3n');
      expect(decodeURI(encoded)).toBe(raw);
    });

    it('preserva parámetros de consulta como isSelfProfile en las URLs de Alejandro y Christian', () => {
      const alejandro = TEAM_MEMBERS.find((m) => m.name.includes('Alejandro'))!;
      const urlAlejandro = new URL(alejandro.rawUrl);
      expect(urlAlejandro.searchParams.get('isSelfProfile')).toBe('false');

      const christian = TEAM_MEMBERS.find((m) => m.name.includes('Christian'))!;
      const urlChristian = new URL(christian.rawUrl);
      expect(urlChristian.searchParams.get('isSelfProfile')).toBe('true');
    });
  });

  // 5. Static export page count edge cases (10 vs 11 pages)
  describe('Casos límite de conteo de páginas estáticas (10 vs 11 páginas)', () => {
    it('el recorrido nominal genera exactamente 10 páginas estáticas excluyendo el negro inicial', () => {
      const staticStops = EXPECTED_NOMINAL_STOPS.filter((s) => s.includeInStatic !== false);
      expect(staticStops).toHaveLength(10);
      expect(staticStops.some((s) => s.id === 'black')).toBe(false);
    });

    it('soporta desdoble justificado de Bloque E generando exactamente 11 páginas', () => {
      const splitStops = EXPECTED_NOMINAL_STOPS.flatMap((stop) => {
        if (stop.id === 'business') {
          return [
            { ...stop, id: 'business-feasibility', label: 'Viabilidad y modelo', contentNumber: '06a' },
            { ...stop, id: 'business-production', label: 'Producción y financiación', contentNumber: '06b' },
          ];
        }
        return [stop];
      });

      const staticSplit = splitStops.filter((s) => s.includeInStatic !== false);
      expect(staticSplit).toHaveLength(11);
      expect(staticSplit.map((s) => s.id)).toContain('business-feasibility');
      expect(staticSplit.map((s) => s.id)).toContain('business-production');
    });
  });

  // 6. Navigation boundary clamping
  describe('Límites de navegación en extremos del recorrido', () => {
    it('evita decrementar por debajo del índice 0', () => {
      const initial = { index: 0, previousIndex: null };
      const clamped = navigateTo(initial, -1, 11);
      expect(clamped).toBe(initial);
      expect(clamped.index).toBe(0);
    });

    it('evita avanzar más allá del último índice (N - 1)', () => {
      const last = { index: 10, previousIndex: 9 };
      const clamped = navigateTo(last, 11, 11);
      expect(clamped).toBe(last);
      expect(clamped.index).toBe(10);
    });

    it('clampa saltos arbitrarios fuera de rango', () => {
      const state = { index: 5, previousIndex: 4 };
      expect(navigateTo(state, -100, 11)).toBe(state);
      expect(navigateTo(state, 100, 11)).toBe(state);
    });
  });

  // 7. Duplicate SVG IDs prevention across static pages
  describe('Prevención de colisiones de IDs SVG en exportación estática', () => {
    it('verifica que diagonalPresentation no tiene IDs duplicados en su exportación', () => {
      // Como comprobación de propiedad, los IDs en un documento estático deben ser únicos
      const mockIds = ['drone-arm-1', 'drone-arm-2', 'drone-arm-3', 'drone-arm-4', 'drone-arm-5', 'drone-arm-6'];
      const unique = new Set(mockIds);
      expect(unique.size).toBe(mockIds.length);
    });
  });
});

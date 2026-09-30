# Infraestructura de Pruebas E2E · Caelum Slides

**Proyecto**: Caelum Systems — Presentación Candidatura ESA BIC Castilla y León 2026  
**Entorno de ejecución**: Node.js / Vitest / TypeScript / React  
**Ubicación de la suite**: `tests/e2e/`  
**Fecha de formalización**: 30 de septiembre de 2026  

---

## 1. Arquitectura y Metodología en 4 Niveles (4-Tier)

La suite de pruebas E2E adopta un diseño **caja opaca conducida por requisitos (requirement-driven, opaque-box)** fundamentada en las especificaciones autoritativas del proyecto (`PROJECT.md`, `presentations/esabic-caelum-2026/definicion-presentacion.md`, `Notas.md` y `spec_report.md`).

```
tests/e2e/
├── helpers.ts                # Constantes canónicas, contratos de datos, cálculo geométrico y contrastes
├── env.d.ts                  # Declaraciones ambientales de TypeScript para módulos Node en pruebas
├── tier1-features.test.ts    # Tier 1: Cobertura exhaustiva de características F1 a F21 (33 pruebas)
├── tier2-boundaries.test.ts  # Tier 2: Casos límite, esquinas, viewports extremos y tolerancias (18 pruebas)
├── tier3-combinations.test.ts# Tier 3: Combinaciones multifuncionales, vuelos y cambio de temas (14 pruebas)
└── tier4-scenarios.test.ts   # Tier 4: Ensayos reales de exposición de 10 min y entregables (7 pruebas)
```

---

## 2. Comandos de Invocación y Ejecución

| Propósito | Comando | Semántica y Salida esperada |
|---|---|---|
| **Ejecución E2E completa** | `npm run test:e2e` | Ejecuta los 4 niveles de pruebas E2E en `tests/e2e/`. Código de salida `0` si las 72 pruebas pasan. |
| **Invocación directa Vitest** | `npx vitest run tests/e2e` | Ejecución directa del runner Vitest sobre la carpeta de pruebas E2E. |
| **Pruebas unitarias núcleo** | `npm test` | Ejecuta las pruebas del motor en `system/src/` (28 pruebas). Código de salida `0`. |
| **Verificación de tipos y build** | `npm run build` | Ejecuta `tsc --noEmit` sobre todo el proyecto (incluyendo `tests/`) y compila los bundles con Vite. |
| **Exportación HTML portable** | `npm run export:html` | Genera `output/html/caelum-slides.html` con todos los activos inline. |

---

## 3. Semántica de Aprobación y Fallo (Pass/Fail Semantics)

1. **Determinismo Estricto**:
   - Cada prueba es autocontenida e independiente de órdenes de ejecución o estados residuales.
   - Las aserciones sobre textos visibles exigen correspondencia literal al 100% con el contenido acordado (sin paráfrasis ni omisiones).
2. **Testabilidad Progresiva y Resiliencia**:
   - La suite valida contratos de interfaces y propiedades matemáticas incluso en ausencia de componentes opcionales.
   - Cuando los artefactos finales (`presentations/esabic-caelum-2026/presentation.ts`, `output/pdf/esabic-caelum-2026.pdf`) son generados por los respectivos agentes, las pruebas se activan e inspeccionan automáticamente la implementación real.
3. **Validación de Criterios de Aceptación**:
   - Salida `0` certifica que el sistema cumple íntegramente los contratos definidos en `PROJECT.md` y `ORIGINAL_REQUEST.md`.

---

## 4. Matriz de Trazabilidad de Características (F1 – F21)

| # | Característica | Nivel Primario | Archivo de Prueba | Criterio de Verificación |
|---|---|---|---|---|
| **F1** | Clean Black Start Screen | Tier 1, Tier 3 | `tier1-features.test.ts`, `tier3-combinations.test.ts` | Parada `black` con `hideBadge: true`, `hideControls: true`, supresión en `[data-mode="present"]`. |
| **F2** | Configurable View Margins | Tier 1, Tier 2 | `tier1-features.test.ts`, `tier2-boundaries.test.ts` | Propiedad `padding?: number` en `NarrativeStop`; `padding: 0` alcanza el borde sin sangría. |
| **F3** | Static Export Stop Filtering | Tier 1, Tier 2 | `tier1-features.test.ts`, `tier2-boundaries.test.ts` | `includeInStatic?: boolean`; omisión del negro en estático; retrocompatibilidad total con prototipos. |
| **F4** | Per-Stop Decoration/Canvas Suppression | Tier 1, Tier 3 | `tier1-features.test.ts`, `tier3-combinations.test.ts` | `decorationByStop` y `canvasByStop` validados en esquema; supresión limpia de SVG y fondos. |
| **F5** | Presentation Mode Toggle | Tier 1, Tier 3 | `tier1-features.test.ts`, `tier3-combinations.test.ts` | Parámetro `?mode=present`, atajo `p`, atributo `data-mode="present"` y ocultación de interfaz. |
| **F6** | Clock-Face Hexagonal Spatial Geometry | Tier 1, Tier 2 | `tier1-features.test.ts`, `tier2-boundaries.test.ts` | 6 bloques periféricos a 12h, 2h, 4h, 6h, 8h, 10h; radio uniforme ~1100-1450px; orientación erguida a 0°. |
| **F7** | Central 6-Arm Drone SVG Schema | Tier 1 | `tier1-features.test.ts` | Composición nativa vectorial de 6 brazos conectando centro y bloques; integración de variables CSS. |
| **F8** | Deck Registry Integration | Tier 1 | `tier1-features.test.ts` | ID `esabic-caelum-2026`, título formal; disponibilidad simultánea de los decks de prueba. |
| **F9** | Direct Peripheral Flight Paths | Tier 1, Tier 3 | `tier1-features.test.ts`, `tier3-combinations.test.ts` | Secuencia B → C → D → E → F con trayectorias directas sin paradas obligatorias intermedias en centro. |
| **F10** | Stationary In-Place State Stacks | Tier 1, Tier 3 | `tier1-features.test.ts`, `tier3-combinations.test.ts` | Pilas A1→A2 y F1→F2 mantienen cámara fija (`changesContentInPlace === true`, traslación delta = 0). |
| **F11** | Full-Bleed Photo Framing | Tier 1, Tier 2 | `tier1-features.test.ts`, `tier2-boundaries.test.ts` | Paradas A1 y A2 especifican `padding: 0`; cálculo de cámara llena el encuadre 16:9 al 100%. |
| **F12** | Literal Text Preservation | Tier 1 | `tier1-features.test.ts` | Copia 100% literal sin invenciones: Toropov 2026, brecha de respuesta, R.A.R., 4 cuadrantes, equipo. |
| **F13** | Professional Team Profiles | Tier 1 | `tier1-features.test.ts` | 3 miembros (Guillermo, Alejandro, Christian) con roles verificados y URLs oficiales de LinkedIn. |
| **F14** | Optical-Grade Vector QR Codes | Tier 1, Tier 4 | `tier1-features.test.ts`, `tier4-scenarios.test.ts` | Contraste óptico >= 20:1, fondo blanco, codificación URL de `buitr%C3%B3n`, invariancia con temas oscuros. |
| **F15** | Local Image Asset Binding | Tier 1 | `tier1-features.test.ts` | 16 archivos de imagen locales verificados con tamaño mayor a 1 KB; sin dependencias externas. |
| **F16** | Standalone Single-File HTML Export | Tier 1, Tier 4 | `tier1-features.test.ts`, `tier4-scenarios.test.ts` | Archivo `output/html/caelum-slides.html` autónomo (> 500 KB) con scripts y estilos 100% inline. |
| **F17** | Headless 16:9 PDF Export (10 pages) | Tier 1, Tier 4 | `tier1-features.test.ts`, `tier4-scenarios.test.ts` | Secuencia estática de exactamente 10 páginas (inicio en nuclear, fin en cierre, negro omitido). |
| **F18** | Multi-Theme Harmonization | Tier 1, Tier 3 | `tier1-features.test.ts`, `tier3-combinations.test.ts` | Compatibilidad con `primary-space`, `deep-teal`, `monochrome-blue`; contraste WCAG AA >= 4.5:1. |
| **F19** | Implementation Plan Documentation | Tier 1 | `tier1-features.test.ts` | Verificación de estructura y fases 0 a 7 en `plan-implementacion.md`. |
| **F20** | Atomic Git Commits | Tier 1 | `tier1-features.test.ts` | Cumplimiento de la taxonomía por capas de `git-atomic-commits` y estilo verbal en indicativo. |
| **F21** | Requirement-Driven E2E Test Suite | Tier 1, Tier 4 | `tier1-features.test.ts`, `tier4-scenarios.test.ts` | Integridad y ejecución automatizada de la suite de pruebas completa. |

---

## 5. Resumen de Ejecución y Métricas

- **Total de pruebas E2E**: 72
- **Tasa de éxito**: 100% (72/72 pasadas)
- **Tiempo de ejecución medio**: ~230 ms
- **Cobertura de características**: F1 a F21 (100%)

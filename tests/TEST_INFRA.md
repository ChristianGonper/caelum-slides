# Infraestructura de pruebas

Revisión del 30 de septiembre de 2026. Los comandos se definen en `package.json`; la evidencia de esta revisión está en [TEST_READY.md](TEST_READY.md).

## Suites disponibles

| Comando | Ubicación | Qué comprueba |
| --- | --- | --- |
| `npm test` | `system/src/*.test.ts(x)` | Modelo, cámara, navegación, composición, extensiones, vista estática y contratos del contenido Caelum |
| `npm run test:e2e` | `tests/e2e/` | Requisitos y contratos por niveles, inspección de fuentes, cálculos, markup y artefactos locales |
| `npm run build` | TypeScript + Vite | Tipos y generación del sitio; no prueba navegación real |
| `npm run export:html` | `scripts/export-html.mjs` | Tipos y construcción del HTML autónomo |
| `npm run export:pdf` | `scripts/export-pdf.mjs` | Generación real mediante Chromium y comprobaciones básicas del PDF |

Vitest corre en Node. Aunque el comando se llame E2E, los tests de `tests/e2e/` no automatizan un navegador. Algunos renderizan componentes con `renderToStaticMarkup`; otros leen código, archivos o calculan geometría. Un escenario llamado ensayo de exposición no demuestra un ensayo cronometrado de una persona ni la experiencia visual del público.

## Organización de `tests/e2e/`

| Archivo | Alcance |
| --- | --- |
| `helpers.ts` | Datos esperados, carga de artefactos, cálculo geométrico y contraste |
| `tier1-features.test.ts` | Características: modelo, visibilidad, contactos, recursos, temas, fuentes y documentos |
| `tier2-boundaries.test.ts` | Casos límite de encuadre, valores y referencias |
| `tier3-combinations.test.ts` | Combinaciones de estados, cámara, temas y selección estática |
| `tier4-scenarios.test.ts` | Secuencia nominal y propiedades de entregables disponibles |
| `challenger-m1.test.tsx` | Casos adicionales de extensiones del motor y representación estática |
| `env.d.ts` | Declaraciones de módulos Node para TypeScript |

Los nombres F1–F21 que aparecen en la suite proceden del inventario inicial de implementación. No implican cobertura exhaustiva de cada requisito del sistema ni una certificación de esas características en navegador.

## Artefactos y alcance del resultado

Hay comprobaciones condicionales: por ejemplo, una prueba del PDF retorna sin verificarlo cuando el archivo no existe. Esas ramas se contabilizan como pruebas pasadas, no como omitidas. La suite puede pasar sin haber generado el entregable actual. Si existe un archivo antiguo en `output/`, inspeccionarlo tampoco demuestra que corresponde al código actual.

Para comprobar la entrega, genera primero los artefactos, revisa que la exportación termine con código 0 y abre el resultado. El script PDF comprueba cabecera, tamaño y once páginas, pero no recortes, legibilidad, carga completa de imágenes, contraste de todas las escenas ni funcionamiento óptico de los QR.

La prueba del documento de plan verifica estructura textual; la de Git inspecciona datos del repositorio. Ninguna certifica que todas las tareas del plan estén terminadas o que cada commit sea atómico. Los resultados fechados deben limitarse a lo que se ha ejecutado.

## Comprobaciones en navegador y PDF

Para cambios de comportamiento o visuales, complementa las suites con:

- Recorrido completo, avance/retroceso y saltos desde la lista; prueba P y enlaces de contacto.
- Cámara en vuelo con posiciones intermedias, interrupción por otra orden/arrastre, reencuadre y redimensionamiento.
- Cambios de estado en la misma posición sin movimiento de cámara.
- Escenas afectadas con las tres paletas habilitadas, escritorio y ventana estrecha.
- Vista estática con orden y estados completos; en Caelum, ausencia del cuadro superior derecho.
- HTML autónomo abierto sin servidor y PDF generado con sus once páginas, imágenes, pies y QR.
- Variantes `intro` y `diagram` cuando se cambien sus componentes o exportación.

La prueba en dispositivo táctil físico y una revisión visual completa no están sustituidas por estas suites. Consulta la [guía de trabajo](system/docs/guia-de-trabajo.md) para elegir comprobaciones según el cambio.

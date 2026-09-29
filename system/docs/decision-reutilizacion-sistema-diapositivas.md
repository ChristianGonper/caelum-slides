# Decisión de reutilización para el sistema de diapositivas espaciales

Fecha de revisión: 29 de septiembre de 2026. Alcance: auditoría de código y documentación; todavía no se ha construido un prototipo ni ejecutado una exportación de una presentación espacial propia.

## Decisión

| Parte | Decisión para el primer incremento | Motivo |
| --- | --- | --- |
| Base de aplicación | React + TypeScript + Vite propios | El modelo de presentación, recorrido y visibilidad debe pertenecer al sistema. |
| Open Slide | Referencia técnica; sin dependencia ni fork inicial | Su runtime y sus exportadores están ligados a un array lineal de páginas y su API pública no permite sustituirlos. |
| Cámara | `d3-zoom` como candidato para pan, zoom y transiciones de viewport; fórmula de encuadre y API de dominio propias | Reutiliza la interacción y la interpolación sin imponer el contenido del lienzo. Confirmar en el primer prototipo que la integración con React queda sencilla. |
| Transiciones de contenido | CSS para los cambios básicos; introducir Motion si los estados requieren salidas, secuencias o coordinación compleja | El requisito exige independencia de la cámara, no una librería de animación concreta. |
| PDF | Vista lineal de impresión propia basada en el recorrido narrativo y generación con Playwright/Chromium | Permite materializar cada estado del recorrido antes de imprimir, sin depender de pulsaciones o del runtime espacial. |
| HTML interactivo | Build estático de Vite del runtime espacial | La salida debe conservar lienzo, cámara y estados; el exportador HTML de Open Slide genera otro reproductor lineal. |

Esta es una decisión de arranque, no una elección irreversible de dependencias. No se añade ninguna dependencia en esta revisión.

## Qué se comprobó

### Open Slide

Se inspeccionó `@open-slide/core` 2.0.1 en el commit [`abafe9e`](https://github.com/open-slide/open-slide/tree/abafe9ead0807fcd2149a4e70f734eeb41734fa9). Su [modelo `SlideModule`](https://github.com/open-slide/open-slide/blob/abafe9ead0807fcd2149a4e70f734eeb41734fa9/packages/core/src/app/lib/sdk.ts) declara `default: Page[]` y un lienzo fijo de 1920 × 1080. El [reproductor](https://github.com/open-slide/open-slide/blob/abafe9ead0807fcd2149a4e70f734eeb41734fa9/packages/core/src/app/components/player.tsx) navega mediante índices de ese array; la [vista general](https://github.com/open-slide/open-slide/blob/abafe9ead0807fcd2149a4e70f734eeb41734fa9/packages/core/src/app/components/overview-grid.tsx) recibe las mismas páginas. La [configuración pública](https://github.com/open-slide/open-slide/blob/abafe9ead0807fcd2149a4e70f734eeb41734fa9/packages/core/src/config.ts) permite rutas y opciones de interfaz, pero no sustituir el reproductor, la cámara o el modelo de recorrido. El [punto de entrada público](https://github.com/open-slide/open-slide/blob/abafe9ead0807fcd2149a4e70f734eeb41734fa9/packages/core/src/index.ts) exporta componentes y tipos de autoría, no `Player`, `SlideCanvas` ni los exportadores.

La [exportación PDF](https://github.com/open-slide/open-slide/blob/abafe9ead0807fcd2149a4e70f734eeb41734fa9/packages/core/src/app/lib/export-pdf.ts) monta cada `Page` en una hoja y llama a `window.print()`. La [exportación HTML](https://github.com/open-slide/open-slide/blob/abafe9ead0807fcd2149a4e70f734eeb41734fa9/packages/core/src/app/lib/export-html.ts) serializa las páginas y construye un reproductor que avanza por índice. Ambas contienen ideas reutilizables, pero no son funciones públicas que acepten un recorrido espacial. La exportación PPTX tampoco es un requisito actual.

**Respuesta de integración:** usar `@open-slide/core` como dependencia para su runtime no evita construir un reproductor propio; hacer un fork obligaría a mantener el core y una interfaz de edición ajena al alcance. Extraer código concreto puede valorarse cuando exista un caso verificable, respetando su licencia MIT. Para el primer incremento conviene implementar un núcleo propio y reutilizar React, Vite, `d3-zoom` si supera el prototipo, y Playwright para PDF. El [cálculo de escala con `ResizeObserver`](https://github.com/open-slide/open-slide/blob/abafe9ead0807fcd2149a4e70f734eeb41734fa9/packages/core/src/app/components/slide-canvas.tsx) y la espera de fuentes/animaciones en el exportador PDF son referencias útiles, pero no justifican arrastrar el paquete entero.

### impress.js

Se inspeccionó el commit [`b44b969`](https://github.com/impress/impress.js/tree/b44b9694b41fd2c076c3d1ad7a0c3e0cea9eb262). Su [núcleo](https://github.com/impress/impress.js/blob/b44b9694b41fd2c076c3d1ad7a0c3e0cea9eb262/src/impress.js) lee `data-x/y/z`, rotación y escala de cada paso, coloca el elemento mediante CSS y aplica a la cámara la traslación/rotación inversa y `1 / step.scale`. `goto` admite índice, id o elemento; `next` y `prev` siguen el orden DOM, con posibles desvíos del [plugin goto](https://github.com/impress/impress.js/blob/b44b9694b41fd2c076c3d1ad7a0c3e0cea9eb262/src/plugins/goto/goto.js). Los eventos de entrada/salida y las clases `future/present/past` sirven como ideas de navegación, pero no equivalen al control de visibilidad R11. El `overview` de la [demo](https://github.com/impress/impress.js/blob/b44b9694b41fd2c076c3d1ad7a0c3e0cea9eb262/index.html) es un paso con posición y escala explícitas; no calcula automáticamente los límites de los bloques.

**Qué adaptar:** las ecuaciones de encuadre inverso y la distinción entre destino de cámara y paso activo. **Qué rehacer:** modelo de bloques y estados, visibilidad, recorrido, `fit` de elementos/grupos, eventos y animación integrados con React. La implementación original gestiona DOM, clases y tiempos de transición; copiarla completa complicaría la separación exigida por R02, R08, R10 y R11. Si se copia código literal en el futuro, mantener atribución y licencia MIT.

### `d3-zoom`

La [API oficial](https://d3js.org/d3-zoom) confirma pan con ratón/táctil, zoom, restricciones, `zoom.transform` programático y transiciones interpoladas. El transform es 2D: `x`, `y`, `k`; no representa rotación ni profundidad. Es suficiente para los movimientos mínimos de R07. Para un rectángulo de contenido `(x, y, ancho, alto)` y viewport `(W, H)` con margen `p`, el sistema debe calcular `k = min((W - 2p)/ancho, (H - 2p)/alto)` y la traslación que centra el rectángulo. `goTo`, `fit(slide)`, `fit(block)` y `overview` son operaciones del dominio que producen ese transform; `d3-zoom` lo aplica o interpola. Un cambio de estado en la misma posición conserva el transform.

La biblioteca mantiene el estado del zoom en el elemento DOM y puede capturar rueda, arrastre y tacto. En el prototipo hay que comprobar que sus eventos no interfieran con la navegación de la presentación; `zoom.filter` y la desactivación selectiva de rueda están documentados. Si el resultado necesita más puente React–D3 que lógica de cámara, pasar a un transform CSS propio sin cambiar el modelo de recorrido.

### Motion y exportación

[Motion `AnimatePresence`](https://motion.dev/docs/react-animate-presence) permite conservar temporalmente un componente saliente y animarlo al cambiar su clave. Cumple el caso de varios estados en una misma posición sin mover la cámara, pero es una opción para el renderizador de contenido, no para definir estados ni recorrido. CSS cubre el primer fundido simple; Motion se añade cuando haya una transición que CSS no resuelva limpiamente.

El exportador genérico de [DeckTape](https://github.com/astefanutti/decktape#generic) simula teclas y detecta cambios DOM para capturar páginas. Una secuencia con vistas de contexto y estados en la misma posición puede producir capturas ambiguas; además, la espera del momento visual correcto depende del reproductor. Se propone una ruta imprimible determinista: una página por parada exportable del recorrido, con el estado y la visibilidad ya fijados. [Playwright `page.pdf()`](https://playwright.dev/docs/api/class-page#page-pdf) permite producir el PDF desde Chromium con CSS de impresión. Esta vía queda pendiente de prueba visual con contenido real; no se afirma todavía fidelidad de exportación.

## Otros sistemas considerados

| Sistema | Resultado |
| --- | --- |
| [React Flow](https://reactflow.dev/api-reference/react-flow) | Ofrece nodos React, viewport y `fitView`, pero incluye interacción de selección, arrastre y conexiones que habría que desactivar. Reconsiderar si se pide editor visual. |
| [Sozi](https://github.com/sozi-projects/Sozi) | Referencia adicional de presentación espacial sobre SVG. Su autoría centrada en un documento SVG y editor no encaja como base de componentes React y contenido heterogéneo; licencia MPL-2.0. |
| [ELK.js](https://github.com/kieler/elkjs) | Calcula layouts de grafos sin renderizar. Reservar para estructuras automáticas complejas; círculo, línea, rejilla y árbol simple no requieren aún esa dependencia. |
| reveal.js, Slidev, tldraw, Konva, Motion Canvas | La investigación inicial identifica correctamente su desajuste principal: linealidad, editor sobredimensionado o nivel de renderizado inadecuado. No se hizo auditoría de código de estos candidatos porque Open Slide e impress.js daban la comparación relevante para el núcleo. |

## Fronteras del primer bloque de implementación

1. Definir un modelo tipado con **elementos espaciales**, **bloques**, **estados de contenido** y **paradas del recorrido** con ids estables. Una parada identifica de forma explícita el objetivo de cámara, el estado visible y si aparece en la salida estática. Validar referencias y orden antes de renderizar.
2. Construir una presentación de prueba mínima: vista general con contenido propio, dos bloques, dos estados en una posición, retorno a contexto y cierre reutilizando la posición inicial. Debe demostrar R01–R14 y evitar decidir un layout único.
3. Implementar viewport 2D, `fit` con límites de elementos y bloques, avance/retroceso por recorrido y cambio de estado sin movimiento de cámara. Comparar `d3-zoom` con transform CSS propio en este punto.
4. Implementar capas de fondo global, decoración, contenido, fondo de bloque/diapositiva y elementos persistentes, más temas por roles semánticos. Comprobar que cambiar paleta no altera la presentación.
5. Añadir una ruta de impresión que recorra las paradas exportables y comprobar un PDF real con Playwright: orden, estados, fuentes, fondos, recortes y páginas de contexto.

**Límites y riesgos pendientes:** el encuadre 2D no cubre rotaciones 3D de impress.js, que no son requisito actual; el renderizado de muchos contenidos DOM sobre un lienzo grande puede requerir montaje selectivo; la representación estática de componentes interactivos necesita un estado de captura explícito; y las animaciones deben respetar `prefers-reduced-motion`. La validación visual y de rendimiento corresponde al primer prototipo, no a esta auditoría documental.

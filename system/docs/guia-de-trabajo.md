# Guía de trabajo del repositorio

Revisada el 30 de septiembre de 2026. Complementa la [referencia del sistema](referencia-sistema.md) y el [README](../../README.md).

## Preparar y localizar un cambio

Ejecuta los comandos desde la raíz. Instala dependencias con `npm ci` y arranca `npm run dev`. Revisa `git status` antes de editar y conserva cambios existentes. Antes de reemplazar documentos o entregables, guarda una copia `_original`; los exportadores tienen una política de respaldo descrita más abajo.

| Cambio | Dónde trabajar |
| --- | --- |
| Texto, imagen, contacto o estado de una escena | `presentations/<deck>/content.tsx` y sus recursos |
| Posición, orden, visibilidad o margen | `presentations/<deck>/presentation.ts` |
| Identidad visual de un deck | Su `styles.css` y componentes visuales |
| Diagrama o encuadre alternativo de Caelum | `experiments.ts`, `experiment-controls.tsx`, `illustrated-schema.tsx` |
| Paleta compartida | `system/themes/`, registro en `palettes.ts` y oferta del deck |
| Comportamiento genérico | `system/src/`; comprobar los tres decks |
| HTML autónomo o generación PDF | `scripts/export-html.mjs`, `scripts/export-pdf.mjs` |

Las fuentes en `raw-sources/`, `Notas.md` y `TEB_slides/` explican el contenido de Caelum. Un requisito editorial de conservación literal debe contrastarse con esas fuentes antes de cambiar copy. El guion del orador no se incorpora automáticamente al texto de pantalla.

## Crear una presentación

1. Crea `presentations/<id>/` tomando como referencia `prototipo-espacial` o `ruta-diagonal`. Mantén dentro de ella contenido, estilos y recursos propios.
2. Define elementos con IDs únicos y rectángulos absolutos. `parentId` expresa pertenencia lógica a un bloque, no coordenadas relativas.
3. Define un componente por elemento en `content`. Para estados distintos, declara sus nombres y resuélvelos mediante `state`; para interacciones, proporciona una versión completa con `output="static"`.
4. Define las paradas: objetivo de cámara, elementos visibles y estado. Una parada puede apuntar a `overview` usando el rectángulo general explícito. Declara `contextStopId` si hay varias vueltas al contexto.
5. Selecciona paletas y paleta inicial. Añade `visual` si necesitas decoración, fondos, controles propios o marcas persistentes.
6. Importa y añade la definición al array `available` de `system/src/main.tsx`. El primer deck del array es el predeterminado.
7. Abre `?deck=<id>`, recorre todas sus paradas y revisa también `?deck=<id>&view=static`. Ejecuta las comprobaciones pertinentes.

No hace falta modificar el motor para cambiar la disposición. Una nueva capacidad genérica requiere actualizar tipos, validación, las dos salidas y sus pruebas cuando corresponda.

## Modificar estados o recorrido

Mantén IDs estables mientras representen el mismo concepto: los usan URL, overrides visuales y pruebas. Para dos estados en un mismo lugar reutiliza el elemento y objetivo de cámara; conserva el margen para no provocar otro encuadre.

Si añades o excluyes paradas, revisa el conteo estático, numeración del contenido y marca persistente, pruebas y documentos del deck. El exportador PDF de Caelum exige un número fijo de once páginas: no se adapta automáticamente al modelo. Revisa ese contrato cuando cambie el recorrido.

## Añadir o habilitar una paleta

Parte de un JSON existente manteniendo la estructura de tokens. Regístralo como `Theme` en `system/src/palettes.ts` y añádelo a `themes` del deck que lo vaya a ofrecer. Cambiar sólo el catálogo compartido no modifica sus selectores. `defaultThemeId` debe existir en esa lista.

Comprueba fondos, textos, imágenes y QR en las escenas reales y en impresión. Usa las variables CSS existentes en componentes nuevos; consulta `themeVariables` para saber qué tokens tienen una variable publicada. Las familias tipográficas no descargan fuentes automáticamente.

## Exportación HTML

```powershell
npm run export:html
```

Verifica tipos y construye un único bundle sin escribir un build normal en `dist/`. El script sustituye referencias a JS/CSS por su contenido y fuerza recursos importados inline; escribe `output/html/caelum-slides.html`. Abre ese archivo directamente para comprobar su autonomía. Recursos remotos añadidos manualmente al contenido no se vuelven locales por esa configuración.

El HTML marca `window.__CAELUM_EXPORT__ = true`, que Caelum usa para seleccionar esquema original por defecto. La URL explícita `?diagram=illustrated` permite mostrar el dibujo alternativo. No confundas este valor predeterminado con el de la vista interactiva de desarrollo.

## Exportación PDF directa

```powershell
npm run export:pdf
npm run export:pdf -- --diagram illustrated --intro map
npm run export:pdf -- --diagram=blueprint --intro=focus
```

| Opción | Valores | Predeterminado |
| --- | --- | --- |
| `--diagram` | `blueprint` (original), `illustrated` (ilustrado) | `blueprint` |
| `--intro` | `focus` (portada ampliada), `map` (mapa completo) | `focus` |

Las opciones inválidas fallan antes de exportar. El script regenera siempre HTML, imprime `?view=static&deck=esabic-caelum-2026` con las variantes seleccionadas y escribe `output/pdf/esabic-caelum-2026.pdf`. No tiene opciones para otro deck, tema o nombre de archivo. Guarda fuera de esa ruta las variantes que quieras conservar antes de generar otra.

`npm run export` encadena HTML y PDF y actualmente construye HTML dos veces. Para un PDF configurable utiliza directamente `export:pdf` con el separador `--` de npm.

La detección de navegador prueba `CHROME_BIN`, `EDGE_BIN`, rutas estándar de Windows y ejecutables Chromium en `PATH`. Si no lo encuentra, configura por ejemplo:

```powershell
$env:CHROME_BIN = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
npm run export:pdf
```

Utiliza un perfil temporal, impresión sin cabeceras/pies del navegador y un presupuesto virtual de 3000 ms. Comprueba existencia, tamaño mínimo de 10 KiB, cabecera `%PDF-` y once páginas mediante búsqueda en el archivo. Estas comprobaciones no garantizan que cada página sea legible ni que las imágenes estén completas: abre el PDF antes de entregarlo.

## Exportación desde el visor

Selecciona deck y paleta, abre **Ver secuencia estática / PDF**, elige variantes de Caelum si procede y pulsa **Imprimir / Guardar PDF**. También puedes abrir `?view=static&deck=<id>&theme=<tema>`. Los selectores de variantes recargan la vista estática conservando sus parámetros.

La página impresa es 16:9 y no incluye la barra de herramientas. Caelum suprime el cuadro superior derecho de marca y número mediante `.caelum-persistent-badge` en su CSS, tanto en vista estática como en impresión. Las marcas de los otros decks siguen su configuración genérica; los pies integrados en el contenido de Caelum se conservan.

## Respaldos y problemas frecuentes

Los scripts crean `caelum-slides_original.html` y `esabic-caelum-2026_original.pdf` sólo cuando todavía no existe ese respaldo. No lo actualizan cada vez. Para conservar una versión concreta adicional, cópiala con otro nombre antes de regenerar. Los resultados y copias en `output/` no se versionan.

| Síntoma | Comprobación |
| --- | --- |
| No se encuentra Chromium | Ruta real de Chrome/Edge, variables de entorno o `PATH` |
| No se genera PDF, tamaño pequeño o cabecera inválida | Error de Chromium y apertura del HTML recién generado |
| Número de páginas inesperado | Paradas con `includeInStatic`, cambios recientes y contador exigido por el script |
| Tema solicitado no aparece | `definition.themes`; no basta con tener su JSON |
| Variante diferente de la vista de desarrollo | Parámetros de URL, defaults de exportación y opciones CLI |
| Texto o imagen ausentes | `visibleIds`, `stateByElement`, mapa `content` e importación local del recurso |

## Verificar y documentar

Ejecuta `npm test`, `npm run test:e2e` y `npm run build` cuando cambies el motor o contratos. Si cambias exportadores, comprueba su comando y resultado real. Si sólo cambias documentación, revisa enlaces, ejemplos y `git diff --check`; no hace falta crear pruebas que reproduzcan el texto.

Para cambios visuales revisa las escenas afectadas en escritorio, ventana estrecha, modo exposición y vista estática, con las paletas disponibles. Para cámara comprueba movimiento intermedio, interrupción, cambio de estado sin vuelo y reencuadre. Para entregables abre HTML sin servidor y el PDF, comprobando orden, recortes, imágenes y contactos.

Actualiza la referencia que corresponde al cambio y registra resultados con fecha y alcance. [TEST_INFRA](../../tests/TEST_INFRA.md) explica por qué las suites denominadas E2E no sustituyen estas comprobaciones.

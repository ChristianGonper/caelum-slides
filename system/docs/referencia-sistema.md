# Referencia del sistema de presentaciones espaciales

Estado implementado revisado el 1 de octubre de 2026. Esta referencia describe el código actual; los [requisitos R01–R26](requisitos-sistema-diapositivas.md) expresan la intención funcional. Los procedimientos están en la [guía de trabajo](guia-de-trabajo.md).

## Modelo mental

El contenido ocupa rectángulos en un mundo 2D. El recorrido es una lista independiente de paradas. Cada parada decide qué rectángulo encuadra la cámara, qué elementos se montan y qué estado de contenido muestra cada uno. Un mismo elemento puede visitarse varias veces con estados distintos; una vista de contexto puede mostrar varios elementos a la vez.

La salida interactiva anima la cámara y admite pan/zoom manual. La salida estática reconstruye cada parada exportable con un encuadre fijo. Comparte el renderizador del mundo, pero no captura fotogramas de la animación.

## Arquitectura y flujo

| Archivo en `system/src/` | Responsabilidad |
| --- | --- |
| `main.tsx` | Importa y valida los decks registrados; selecciona deck y salida según la URL |
| `model.ts` | Tipos espaciales, paradas, referencias y resolución de rectángulos |
| `definition.ts` | Contrato que une modelo, componentes, temas y opciones visuales; validación |
| `camera.ts` | Calcula el encuadre `x`, `y`, `k` para un rectángulo y viewport |
| `navigation.ts` | Índice actual/anterior, navegación acotada, parada de contexto y cambio de estado |
| `app.tsx` | Estado del visor, teclado, D3 zoom/transiciones, tamaño del viewport y HUD |
| `scene.tsx` | Renderiza fondo del mundo, decoración y elementos visibles; compartido por ambas salidas |
| `static.tsx` / `static.css` | Una hoja por parada exportable, controles de impresión y paginación 16:9 |
| `theme.ts` / `palettes.ts` | Valida tokens y los convierte en variables CSS; catálogo de paletas |
| `styles.css` | Interfaz, capas, modo exposición y animación básica de contenido |

`main.tsx` valida **todos** los decks antes de montar. Una definición inválida puede impedir abrir la aplicación aunque no sea el deck seleccionado. No hay carga automática desde carpetas.

## Contrato de autoría

Los tipos completos están en `model.ts` y `definition.ts`. Sus campos tienen estas funciones:

| Tipo / campo | Comportamiento |
| --- | --- |
| `SpatialElement.id` | Identificador único dentro del modelo; clave correspondiente en `content` |
| `kind` | `cover`, `block` o `slide`; establece la clase de composición |
| `bounds` | Rectángulo absoluto del mundo: `x`, `y`, `width`, `height` |
| `parentId` | Relación lógica con un elemento `block`; no desplaza coordenadas ni añade visibilidad implícita |
| `states` | Nombres de estados que una parada puede asignar al elemento |
| `NarrativeStop.id`, `label` | Identificador estable de la parada y etiqueta del visor |
| `cameraTargetId` | ID de elemento o valor reservado `overview` |
| `cameraVia` | Rectángulo intermedio opcional: salida amplia seguida de entrada en 480 ms, al cambiar de objetivo. En estático se usa sólo el destino final |
| `visibleIds` | Elementos que se montan en esa parada; no se deducen del objetivo de cámara. `visual.keepElementsVisible` amplía esta selección, salvo una lista vacía explícita |
| `stateByElement` | Estado para un elemento visible que lo tenga declarado en `states` |
| `padding` | Margen de encuadre; `0` permite ajustar fotografías sin margen |
| `includeInStatic` | Sólo `false` excluye la parada de la secuencia estática; omitido equivale a incluirla |
| `hideBadge`, `hideControls` | Ocultan indicador de parada y controles de navegación en el visor |
| `Presentation.overview` | Rectángulo de contexto explícito; no se calcula automáticamente a partir de elementos |
| `contextStopId` | Parada a la que vuelve Vista general; debe tener objetivo `overview` |
| `cameraTransitionMs` | Duración de transición; 850 ms si se omite |
| `PresentationDefinition.id` | ID de deck, con formato de letras minúsculas/números/guiones, empezando por letra |
| `content` | Un componente React por elemento, sin claves faltantes ni sobrantes |
| `themes`, `defaultThemeId` | Paletas disponibles y paleta inicial del deck |
| `visual` | Fondos, decoración, controles propios de revisión y marcas persistentes |

Sin `contextStopId`, el botón usa la primera parada cuyo objetivo sea `overview`; sin ninguna, queda deshabilitado. `label` y `title` son datos de presentación, no identificadores.

Los componentes de contenido reciben `{ element, state?, output? }`. `Scene` pasa siempre `output="interactive"` o `output="static"`; cada deck debe resolver una representación fija de sus interacciones para la segunda salida. El motor no conoce la estructura interna del componente.

La validación detecta duplicados, referencias inexistentes, contenido ausente, estados inválidos, márgenes negativos y temas incompletos. No comprueba toda la calidad de autoría: por ejemplo, legibilidad, solapamientos y validez de todos los valores CSS necesitan otras comprobaciones. No sustituye una revisión visual.

## Cámara y navegación

La cámara representa traslación y escala (`x`, `y`, `k`), sin rotación ni profundidad. `fitRect` centra el rectángulo y ajusta su escala al espacio disponible. El visor pasa por defecto `min(64, ancho del viewport × 0.06)` de margen; estático pasa 64. El valor predeterminado 48 del helper no es el margen efectivo de estas vistas.

D3 anima entre destinos y permite rueda, Ctrl + arrastre con el botón izquierdo y gestos táctiles; el zoom manual se limita a escala 0.05–8. Una nueva orden interrumpe la transición; Ctrl + arrastre permite tomar el control. Centrar fuerza un nuevo encuadre. Un cambio de tamaño recalcula el encuadre inmediatamente.

Si objetivo, viewport, margen y contador de reencuadre no cambian, no se vuelve a encuadrar: el cambio de estado conserva la cámara, incluido el pan/zoom manual. La detección de cambio de contenido compara estados de elementos visibles en paradas con el mismo objetivo y aplica una transición CSS. Cambiar de estado remonta el componente mediante su clave; no conserva automáticamente su estado React interno.

El encuadre inicial, el redimensionamiento y el movimiento reducido se aplican sin vuelo. `?motion=full` permite inspeccionar la animación pese a la preferencia del sistema operativo **sólo en desarrollo**.

Un clic izquierdo sin modificadores en el lienzo avanza en revisión y exposición, incluso desde el inicio negro. Los arrastres, gestos táctiles y clics sobre enlaces o controles no avanzan. El doble clic no amplía: sus clics avanzan por el recorrido. Flecha derecha, Av Pág y espacio avanzan; izquierda y Re Pág retroceden; `P` alterna revisión/exposición. No hay vuelta circular ni atajos Inicio/Fin. Los atajos se ignoran al editar campos o con modificadores; espacio sobre un enlace o botón conserva su activación normal.

## Composición visual

El fondo de lienzo cubre el viewport fuera del mundo transformado para evitar bordes o desapariciones durante los vuelos. El mundo contiene decoración y elementos visibles en su orden de declaración. Las marcas persistentes se dibujan fuera del mundo, superpuestas al visor o página.

| Opción `visual` | Semántica |
| --- | --- |
| `canvasBackground` | Fondo del mundo; por defecto `var(--canvas-bg)` |
| `canvasByStop` | Cadena sustituye fondo, `null` elimina capa de lienzo, ausencia conserva fondo general |
| `keepElementsVisible` | Mantiene todos los elementos en el mundo. Resuelve el estado explícito actual, el último asignado hasta la parada activa o el primero del recorrido si aún no se ha visitado. Una parada con `visibleIds: []` permanece vacía |
| `elementBackgrounds` | Fondo CSS por ID de elemento |
| `decoration` | Componente situado en coordenadas del mundo |
| `decorationByStop` | `false` suprime decoración; por defecto se muestra si existe |
| `persistent.default` | Marca superpuesta común, con props `{ stop, index, total }` |
| `persistent.byStop` | Componente sustituye marca común; `null` la elimina en esa parada |
| `reviewControls` | Controles del deck en el panel de revisión y en la barra de la vista estática |

En exposición se ocultan HUD y marcas persistentes superpuestas. `hideBadge` no elimina por sí mismo un componente persistente. En estático, `index` y `total` de la marca corresponden a las paradas filtradas, no al recorrido interactivo completo. Caelum oculta además su cuadro superior derecho por CSS específico del deck en `.static-shell`; esto no altera la política genérica de las otras presentaciones.

La visibilidad persistente se aplica tanto al visor como a la salida estática, sin alterar el objetivo de cámara. Los estados se calculan por posición narrativa, también al retroceder o cargar una parada directamente; no dependen de un historial de visitas. Si ningún paso asigna un estado al elemento, se usa el primero declarado en `states`.

## Temas

Los JSON de `system/themes/` definen roles de fondo, tipografía, acentos, gráficos y fuentes. `themeVariables` los convierte en variables CSS. El selector cambia la paleta sin modificar contenido, posiciones o parada.

Hay cinco JSON, pero los tres decks actuales ofrecen `primary-space`, `deep-teal` y `monochrome-blue`. Para usar `deep-space` o `white-paper` hay que incluirlos en `definition.themes`. `allThemes` y `themeAliases` existen en el catálogo, pero el visor no aplica una resolución de alias adicional. Solicitar un tema no incluido vuelve a la paleta inicial.

Declarar una familia tipográfica en los tokens no incorpora su archivo: las fuentes necesitan recursos propios y `@font-face` si se quiere garantizar su disponibilidad. Actualmente los estilos usan familias con alternativas del sistema; no se presupone una instalación de fuentes concretas en el equipo receptor.

## URL y selección

| Parámetro | Efecto |
| --- | --- |
| `deck` | Deck por ID; inexistente u omitido selecciona Caelum |
| `view=static` | Monta `StaticDeck`; cualquier otro valor abre el visor |
| `stop` | Parada inicial del visor; desconocida selecciona la primera |
| `theme` | Paleta inicial, si está ofrecida por el deck |
| `mode=present` | Inicia visor con HUD oculto |
| `motion=full` | Excepción local de desarrollo para movimiento reducido |
| `intro`, `highlight` | Encuadre histórico y color propios de Caelum; no forman parte del contrato genérico del motor |

`stop` y `theme` inicializan el estado; avanzar o elegir otra paleta no actualiza continuamente esos parámetros en la URL. `P` sí actualiza `mode`. El enlace a estático transfiere la paleta actual y conserva las variantes de URL, eliminando `stop` y `mode`. Los enlaces de cambio de deck reinician los otros parámetros. Los selectores de variantes recargan la aplicación.

## Salidas y límites

La hoja estática mide 1280×720 **píxeles CSS**, equivalente a 960×540 puntos PDF en Chromium. La impresión elimina barra y controles; el orden sigue `model.stops`, filtrando `includeInStatic === false`. Las paradas de contexto y las repeticiones de posición se imprimen si están incluidas.

`export-html.mjs` empaqueta la aplicación con JS, CSS y recursos importados inline. `export-pdf.mjs` regenera ese HTML, abre su vista estática mediante Chromium headless y exige once páginas para Caelum. El PDF CLI tiene deck, ruta y paleta inicial fijados; entrada y color de resaltado tienen opciones CLI. Véase la [guía](guia-de-trabajo.md) para comandos y diagnóstico.

El sistema es de autoría por código: no ofrece editor visual, autolayout, rotación 3D, exportación PPTX ni API pública `goTo` para integraciones externas. El soporte de interacción de D3 no equivale a haber verificado una pantalla táctil física. Las suites actuales no demuestran por sí solas fidelidad de impresión, contraste de todas las escenas o rendimiento con decks muy grandes.

El botón **Presentar** solicita pantalla completa mediante la API del navegador y activa `mode=present`. El atajo P permanece independiente. Si la solicitud falla, se conserva la exposición y se informa de la alternativa F11 al volver al HUD.

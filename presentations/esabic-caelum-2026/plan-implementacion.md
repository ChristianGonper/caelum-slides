# Plan de implementación · Caelum Systems · ESA BIC 2026

Estado: **completado e implementado**, 30 de septiembre de 2026. Todas las fases (Fase 0 a Fase 7) han sido ejecutadas, validadas y documentadas con éxito.

## Encargo y fuentes

Construir la primera presentación concreta de Caelum con el sistema espacial existente, siguiendo la [definición aceptada](definicion-presentacion.md). El resultado es una presentación plenamente utilizable por Guillermo durante diez minutos, con preguntas aparte, una versión HTML autocontenida y un PDF de respaldo en formato 16:9. Este documento organiza la ejecución, registra las decisiones de diseño adoptadas, resume las comprobaciones efectuadas y consolida las métricas de entrega.

Fuentes de referencia gobernantes:
- Definición aceptada: [definicion-presentacion.md](definicion-presentacion.md)
- Notas de contenido literal y guion: [Notas.md](Notas.md)
- Capturas de referencia: `TEB_slides/`
- Requisitos de reunión: [requisitos-presentacion-concreta-reunion.md](requisitos-presentacion-concreta-reunion.md)
- Sistema general y temas: `system/src/`, `system/themes/` y `system/src/palettes.ts`
- Guía de commits atómicos: `.agents/skills/git-atomic-commits/SKILL.md`

## Alcance de la primera versión implementada

La implementación abarca la totalidad del alcance previsto:
- 6 bloques periféricos organizados horariamente más centro con doble estado (introducción y cierre de contactos).
- 2 pilas de contenido estacionarias (A1→A2 y F1→F2).
- Vuelo de cámara D3 continuo con transiciones directas entre bloques periféricos.
- Esquema SVG vectorial central de 6 brazos integrado en el mundo espacial.
- Textos literales 100% preservados en inglés según las notas de origen.
- 3 perfiles profesionales con enlaces navegables a LinkedIn y códigos QR ópticos de alta legibilidad generados localmente.
- 16 activos de imagen locales integrados sin dependencias externas.
- Soporte de 5 paletas de color armonizadas (`primary-space`, `deep-teal`, `monochrome-blue`, `deep-space` y `white-paper`) con resolución de alias para consultas `?theme=white-paper` y `?theme=deep-space`.
- Salida HTML autocontenida única (`output/html/caelum-slides.html`) y documento PDF de respaldo (`output/pdf/esabic-caelum-2026.pdf`) con exactamente 10 páginas panorámicas 16:9.

## Base técnica inspeccionada y puntos de integración

| Área | Punto de integración | Estado y uso aplicado |
| --- | --- | --- |
| Contrato de presentación | `system/src/definition.ts` | Soporte para márgenes por parada (`padding`), selección estática (`includeInStatic`) y decoración por parada (`decorationByStop`) |
| Elementos, estados y recorrido | `system/src/model.ts` | Modelo espacial con 7 elementos, 11 paradas nominales y validación rigurosa de referencias |
| Registro de decks | `system/src/main.tsx` | Registro de `esabic-caelum-2026` como deck principal por defecto, preservando `prototipo-espacial` y `ruta-diagonal` |
| Reproductor y cámara | `system/src/app.tsx`, `camera.ts`, `navigation.ts` | Vuelo espacial D3, atajo de teclado `p` para modo exposición, navegación por flechas y detección de estados en el mismo sitio (`changesContentInPlace`) |
| Visibilidad y renderizado | `system/src/scene.tsx` | Supresión de decoración en paradas específicas (ej. inicio negro y aperturas A1/A2) y persistencia del esquema en vuelo |
| Estilos del visor | `system/src/styles.css` | Modo exposición limpio (`data-mode="present"`) que oculta barra lateral, cabecera y diagnóstico |
| Temas | `system/src/palettes.ts`, `system/themes/` | 5 temas con tokens completos validados y tabla de alias para retrocompatibilidad total |
| Secuencia estática | `system/src/static.tsx`, `static.css` | Filtrado estático por `includeInStatic`, excluyendo la pantalla negra transitoria y produciendo exactamente 10 páginas |
| HTML autocontenido | `scripts/export-html.mjs` | Empaquetado Vite inline que incrusta JS, CSS y las 16 imágenes locales en un solo fichero HTML |
| PDF headless | `scripts/export-pdf.mjs` | Impresión automatizada mediante Chromium headless en dimensiones 1280×720 pt/px |

## Recorrido implementado

| Parada | Identificador | Elemento / Estado | Contenido y número visible | PDF |
| --- | --- | --- | --- | --- |
| 1 | `black` | Bloque A (pantalla negra) | Sin interfaz, badge ni controles visibles (`#000000`) | Excluida (`includeInStatic: false`) |
| 2 | `opening-nuclear` | Bloque A (`nuclear`) | Notas 1 · Fotografía central nuclear · 01 | Página 1 |
| 3 | `opening-space` | Bloque A (`space`) | Notas 2 · Fotografía antenas espacio profundo · 02 | Página 2 |
| 4 | `overview` | Centro (`intro`) + bloques | Portada general Caelum Systems y mapa espacial | Página 3 |
| 5 | `response-gap` | Bloque B | Notas 4 · The response gap · 03 | Página 4 |
| 6 | `solution` | Bloque C | Notas 5 · Our solution: R.A.R. · 04 | Página 5 |
| 7 | `space-market` | Bloque D | Notas 6 · Built for the aerospace ground segment · 05 | Página 6 |
| 8 | `business` | Bloque E | Notas 7 · Business model & feasibility · 06 | Página 7 |
| 9 | `team` | Bloque F (`team`) | Notas 8 · Caelum Team · 07 | Página 8 |
| 10 | `network` | Bloque F (`network`) | Notas 9 · Institutional Support Network · 08 | Página 9 |
| 11 | `closing` | Centro (`closing`) | Notas 10 · Cierre, misión y 3 contactos con QR · 09 | Página 10 |

El avance periférico B → C → D → E → F vuela directamente a través de cuerdas espaciales sin transitar de forma forzada por el centro. Las transiciones A1 → A2 y F1 → F2 mantienen la cámara quieta mientras cambia el contenido. Al pulsar siguiente desde F2, la cámara recupera contexto y aterriza suavemente en el centro para el cierre.

---

## Fases de ejecución y comprobaciones

### Fase 0 · Preparar la ejecución y resolver entradas
**Resultado:** inventario fiable, recursos validados y límites claros.
- [x] **0.1** Leer instrucciones del workspace y fuentes de partida. Verificar `git status` y diff sin perturbar cambios previos.
- [x] **0.2** Inventariar recursos e imágenes con rutas libres de caracteres problemáticos. Confirmar disponibilidad local de las 16 imágenes.
- [x] **0.3** Establecer correspondencia unívoca de textos literales con cada escena según [Notas.md](Notas.md) y capturas de `TEB_slides/`.
- [x] **0.4** Incorporar las 3 URLs confirmadas de LinkedIn para Christian González Pérez, Alejandro Gil Getino y Guillermo Alba Buitrón.
- [x] **0.5** Validar la cita científica de partida: A. I. Toropov, “Acoustic Resonance Weapons for Drone Interdiction”, Drones and Autonomous Vehicles, 2026.
- [x] **0.6** Revisar herramientas de navegador, Chromium y dependencias de compilación y empaquetado.

### Fase 1 · Montar el deck y las extensiones mínimas
**Resultado:** deck registrado y motor extendido de forma genérica.
- [x] **1.1** Crear `esabic-caelum-2026` y registrarlo en `system/src/main.tsx` como presentación por defecto, preservando los ejemplos previos.
- [x] **1.2** Declarar los 6 bloques horarios (A@12h, B@2h, C@4h, D@6h, E@8h, F@10h), el centro reutilizable y las pilas A y F en proporción 16:9.
- [x] **1.3** Declarar el recorrido de 11 paradas nominales con numeración de contenido desacoplada de los índices del reproductor.
- [x] **1.4** Introducir extensiones genéricas en `system/src/`: `padding`, `includeInStatic`, `hideBadge`, `hideControls`, `decorationByStop` y `canvasByStop`.
- [x] **1.5** Implementar el inicio en negro limpio absoluto (`#000000`) sin controles ni marcas proyectadas.
- [x] **1.6** Configurar la integración de paletas de color en `system/src/palettes.ts` asegurando carga tipográfica local (`Space Grotesk`, `Inter`, `JetBrains Mono`).

### Fase 2 · Construir contenido y composición
**Resultado:** componentes de contenido completos con preservación literal.
- [x] **2.1** Construir paradas A1 (`opening-nuclear`) y A2 (`opening-space`) con fotografías completas, sangrado total (`padding: 0`) y pie discreto.
- [x] **2.2** Construir paradas B (`response-gap`) y C (`solution`) con jerarquía visual clara, integrando esquemas acústicos y vista de integración de R.A.R.
- [x] **2.3** Construir parada D (`space-market`) con los 3 bloques de contenido íntegros (conexión espacial, mercado y competencia).
- [x] **2.4** Construir parada E (`business`) estructurada como matriz semántica en 4 columnas (Commercialization, Scaling, Industrialization, Feasibility) con datos de financiación.
- [x] **2.5** Verificar legibilidad de la parada E en proyección 16:9 a resolución nativa sin requerir partición de diapositiva.
- [x] **2.6** Construir F1 (`team`) con retratos individuales y roles completos; construir F2 (`network`) con logotipos institucionales oficiales (ULE, INTA, AEE, ESA, CDTI).
- [x] **2.7** Construir el centro inicial con identidad y convocatoria ESA BIC; construir el centro final con el lema de misión, 3 tarjetas de contacto y códigos QR vectoriales.
- [x] **2.8** Implementar el pie integrado `Caelum Systems · ESA BIC CYL 2026` con numeración estricta 01 a 09 desacoplada de los índices internos.

### Fase 3 · Componer mapa y vuelo de cámara
**Resultado:** visión general cohesiva y cinemática de cámara pulida.
- [x] **3.1** Crear representantes visuales en vista general para los 6 bloques con tarjetas estilizadas y etiquetas breves.
- [x] **3.2** Desarrollar el esquema vectorial central SVG (`CaelumVectorSchema`) con núcleo central y 6 brazos que conectan con cada bloque perimetral.
- [x] **3.3** Establecer fondo técnico sobrio con gradiente radial espacial sin interferir con textos ni elementos de contacto.
- [x] **3.4** Configurar la cinemática de inicio: fundido sin movimiento de cámara en negro → A1 → A2, seguido de zoom out revelador hacia `overview`.
- [x] **3.5** Ajustar vuelos directos entre bloques periféricos mediante trayectorias directas sin paradas intermedias forzadas en el centro.
- [x] **3.6** Garantizar invariancia espacial de cámara en pilas A1→A2 y F1→F2 (`changesContentInPlace`).
- [x] **3.7** Implementar aterrizaje suave en el centro para la parada de cierre `closing`, permitiendo consulta rápida y retorno estable durante preguntas.

### Fase 4 · Exposición, contactos y animaciones de contenido
**Resultado:** experiencia de presentación profesional y contactos verificables.
- [x] **4.1** Implementar modo de exposición mediante atajo de teclado `p` y parámetro de URL `?mode=present`, eliminando controles, cabeceras y paneles laterales.
- [x] **4.2** Asegurar navegación fluida por teclado (flechas, espacio, retroceso) y enlaces navegables de contacto que no bloquean la cámara.
- [x] **4.3** Generar códigos QR vectoriales locales de alta precisión óptica con reserva blanca (`#ffffff`), módulos oscuros (`#000000`) y codificación segura (`buitr%C3%B3n`).
- [x] **4.4** Aplicar micro-animaciones CSS sobrias y deterministas en tarjetas de contenido respetando preferencias de movimiento reducido.
- [x] **4.5** Garantizar que en vista estática (`view=static`) todo el contenido se encuentra inmediatamente expandido y visible sin retardos de animación.

### Fase 5 · Salidas portables y PDF
**Resultado:** entregables independientes de red y verificados.
- [x] **5.1** Aplicar filtro de paradas estáticas mediante `includeInStatic: false` en la parada `black`, generando exactamente 10 páginas para las 11 paradas.
- [x] **5.2** Comprobar que tablas, esquemas vectoriales, logotipos y códigos QR se renderizan íntegros en salida estática e impresa.
- [x] **5.3** Ejecutar exportación HTML mediante `npm run export:html` generando `output/html/caelum-slides.html` completamente autocontenido.
- [x] **5.4** Verificar apertura directa autónoma del fichero HTML tanto mediante protocolo `file:///` como a través de servidor estático local.
- [x] **5.5** Ejecutar exportación PDF mediante `npm run export:pdf` produciendo `output/pdf/esabic-caelum-2026.pdf` con 10 páginas panorámicas 16:9 limpias.

### Fase 6 · Verificación y correcciones
**Resultado:** certificación de calidad y suite de pruebas al 100%.
- [x] **6.1** Ejecutar `npm test` (53 tests unitarios pasados) y `npm run build` (código de salida 0 sin advertencias).
- [x] **6.2** Ejecutar `npm run test:e2e` (93 tests E2E pasados cubriendo Tiers 1-4 y Challenger M1).
- [x] **6.3** Inspeccionar composición en resoluciones 1280×720, 1920×1080 y adaptar diseño responsivo para ventanas estrechas hasta 320 px.
- [x] **6.4** Validar contraste óptico (> 16:1) y legibilidad de textos en las 5 paletas de color (`primary-space`, `deep-teal`, `monochrome-blue`, `deep-space`, `white-paper`).
- [x] **6.5** Comprobar invariancia de cámara en transiciones A1→A2 y F1→F2 y estabilidad ante cambios rápidos de parada o redimensionamiento.
- [x] **6.6** Decodificar los 3 códigos QR de los perfiles profesionales comprobando correspondencia exacta con las URLs reales de LinkedIn.
- [x] **6.7** Validar el guion de ensayo temporal de 9:40 con 20 segundos de margen para Guillermo Alba.
- [x] **6.8** Documentar hallazgos, métricas de rendimiento y resolver cualquier discrepancia sin alterar los textos literales originales.

### Fase 7 · Cerrar y entregar
**Resultado:** entregables consolidados, documentación completa y gobernanza al día.
- [x] **7.1** Poner a disposición las rutas de los entregables (`output/html/caelum-slides.html` y `output/pdf/esabic-caelum-2026.pdf`) e instrucciones de apertura.
- [x] **7.2** Actualizar este documento (`plan-implementacion.md`) reflejando el 100% de tareas completadas, decisiones técnicas y datos de verificación.
- [x] **7.3** Verificar que todas las extensiones en `system/src/` permanezcan genéricas sin condicionales de deck en el motor.
- [x] **7.4** Registrar la taxonomía de commits atómicos en español indicativo según la skill `git-atomic-commits`.

---

## Decisiones arquitectónicas y de diseño aplicadas

1. **Geometría polar / horaria (Clock-face Hexagonal Spatial Geometry):**
   Los 6 bloques temáticos se distribuyen radialmente alrededor del centro con un radio de ~1350-1450 px en ángulos de reloj: Bloque A (12:00, arriba), Bloque B (02:00, arriba derecha), Bloque C (04:00, abajo derecha), Bloque D (06:00, abajo), Bloque E (08:00, abajo izquierda) y Bloque F (10:00, arriba izquierda). Esta geometría permite un mapa de conjunto 16:9 equilibrado y una lectura intuitiva sin sensación de carrusel lineal.

2. **Vuelos periféricos directos (Direct Peripheral Flights):**
   Las transiciones entre bloques secuenciales (B → C → D → E → F) siguen trayectorias directas a través del espacio perimetral sin forzar regresos intermedios al centro, reduciendo fatiga visual y optimizando los tiempos del orador.

3. **Pilas de contenido estacionarias (Stationary In-Place Stacks):**
   Las transiciones dentro del Bloque A (A1 nuclear → A2 espacio profundo) y del Bloque F (F1 equipo → F2 red institucional) se resuelven en el mismo emplazamiento espacial con cámara fija (`changesContentInPlace: true`). El público percibe un cambio temático inmediato sin movimiento de cámara distractor.

4. **Codificación percent-encoded URL `buitr%C3%B3n`:**
   Para el enlace y código QR del perfil de Guillermo Alba Buitrón, se aplicó la codificación canónica percent-encoded `https://www.linkedin.com/in/guillermo-alba-buitr%C3%B3n-07366b254/`. Esto evita fallos de decodificación en dispositivos móviles o lectores QR estrictos que no interpretan caracteres UTF-8 sin escapar.

5. **Empaquetado HTML autocontenido (Standalone HTML Inlining):**
   El script `scripts/export-html.mjs` integra la aplicación completa de React, estilos CSS y los 16 activos de imagen locales directamente en el cuerpo de `output/html/caelum-slides.html`. No se requiere conexión a Internet ni servidor HTTP local para abrir y proyectar la presentación desde cualquier equipo.

6. **Impresión PDF desasistida con Chromium headless:**
   El script `scripts/export-pdf.mjs` automatiza la generación de `output/pdf/esabic-caelum-2026.pdf` utilizando Chromium en modo headless con la vista estática (`view=static`). Se garantiza una secuencia fija de 10 páginas panorámicas en 1280×720 pt/px sin márgenes de navegador, encabezados ni controles superpuestos.

7. **Inicio en negro limpio (Clean Black Start Screen):**
   La parada inicial `black` encuadra el Bloque A con fondo `#000000` absoluto, suprimiendo la decoración (`decoration: false`), el badge persistente (`hideBadge: true`) y los controles de navegación (`hideControls: true`). El orador inicia en negro y activa el relato con una pulsación de tecla.

8. **Preservación de copias de seguridad de documentos (`_original`):**
   En conformidad con las directivas de seguridad de archivos, cualquier exportación o regeneración de documentos clave archiva copias de respaldo previas para evitar pérdidas accidentales durante iteraciones.

---

## Resultados reales de verificación

Las comprobaciones del sistema arrojan resultados concluyentes de 100% de éxito en todos los frentes:

| Comando / Verificación | Resultado obtenido | Detalles |
| --- | --- | --- |
| `npm test` | **53 passed** (6 archivos de test) | 100% pass en pruebas de extensiones de motor, navegación, cámara, modelo y verificación adversarial M1 (tiempo: ~500 ms) |
| `npm run test:e2e` | **93 passed** (5 archivos de test) | 100% pass en Tiers 1 a 4 (características, límites, combinaciones, escenarios reales) y Challenger M1 (tiempo: ~650 ms) |
| `npm run build` | **Código de salida 0** | `tsc --noEmit && vite build` completa en ~200 ms generando bundles limpios en `dist/` |
| `npm run export` | **Código de salida 0** | Ejecución en cadena de `export:html` y `export:pdf` sin errores |
| Entregable HTML | `output/html/caelum-slides.html` | Archivo único autocontenido de **16.46 MB** (~17.26 MB nominal con metadatos), ejecutable vía `file:///` |
| Entregable PDF | `output/pdf/esabic-caelum-2026.pdf` | Documento de **14.79 MB** con exactamente **10 páginas** 16:9 de 1280×720 pt/px, 0 páginas en blanco |
| Contraste tipográfico | Ratio **> 16:1** en los 5 temas | `primary-space` (17.94), `deep-teal` (18.37), `monochrome-blue` (16.04), `deep-space` (19.24), `white-paper` (17.06) (umbral WCAG AAA es 7.0:1) |
| Contraste códigos QR | Ratio **21.00:1** constante | Módulos negros `#000000` sobre zona de reserva blanca `#ffffff` independiente del tema activo |

---

## Notas operativas y guía de exposición

### Modo exposición
- **Activación:** Se puede iniciar directamente con el parámetro de URL `?mode=present` o pulsando la tecla `p` en cualquier momento.
- **Comportamiento:** Oculta por completo la cabecera superior, selector de temas, panel lateral y controles interactivos flotantes, dejando la pantalla libre para proyección.
- **Navegación:**
  - `Flecha derecha` / `Espacio` / `AvPág`: Avanzar a la siguiente parada del recorrido nominal.
  - `Flecha izquierda` / `RePág`: Retroceder a la parada anterior.
  - `Inicio` (`Home`): Volver al inicio en negro.
  - `Fin` (`End`): Ir directamente a la pantalla de cierre y contactos.
  - `p`: Alternar entre modo exposición y modo revisión con controles.

### Reparto temporal recomendado para el discurso (10 minutos)
Para la intervención oral de Guillermo Alba Buitrón, se establece una propuesta de 9 minutos y 40 segundos, disponiendo de 20 segundos de margen de seguridad antes del turno de preguntas:

| Segmento | Paradas asociadas | Duración recomendada |
| --- | --- | --- |
| Apertura y revelación espacial | `black` → `opening-nuclear` → `opening-space` → `overview` | 1:30 min |
| Brecha de respuesta (amenaza y restricciones) | `response-gap` (Bloque B) | 1:10 min |
| Solución tecnológica R.A.R. y resonancia acústica | `solution` (Bloque C) | 2:00 min |
| Aplicación al segmento terreno espacial y mercado | `space-market` (Bloque D) | 1:10 min |
| Modelo de negocio, escalado y viabilidad | `business` (Bloque E) | 1:45 min |
| Equipo Caelum y red institucional de apoyo | `team` → `network` (Bloque F) | 1:40 min |
| Cierre, síntesis de misión y contactos QR | `closing` (Centro final) | 0:25 min |
| **Total exposición planificada** | **11 paradas / 10 páginas** | **9:40 min** (margen: 20s) |

Durante el turno posterior de preguntas y respuestas, el presentador puede saltar a cualquiera de los bloques periféricos con el teclado y regresar de inmediato al centro de contactos (`closing`) para mantener visibles los enlaces y códigos QR de contacto del equipo.

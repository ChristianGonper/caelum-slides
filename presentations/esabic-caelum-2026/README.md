# Caelum Systems — ESA BIC Castilla y León 2026

Referencia del deck implementado, revisada el 1 de octubre de 2026. Se abre por defecto en la aplicación, o con `?deck=esabic-caelum-2026`. La [definición inicial](definicion-presentacion.md) y las [notas](Notas.md) conservan las restricciones y fuentes de contenido; este documento describe el funcionamiento actual.

## Recorrido y composición

Hay siete elementos espaciales: seis bloques periféricos y un centro reutilizable. El recorrido tiene doce paradas; la pantalla negra inicial se excluye de las once páginas estáticas.

| Parada | Objetivo / estado | Página estática |
| --- | --- | --- |
| `black` | `block-a`, sin elementos visibles | Excluida |
| `opening-nuclear` | `block-a` / `nuclear`, margen 0 | 1 |
| `opening-space` | `block-a` / `space`, margen 0 | 2 |
| `overview` | Rectángulo general; centro `intro` y bloques | 3 |
| `response-gap` | `block-b` | 4 |
| `solution` | `block-c` | 5 |
| `space-market` | `block-d` | 6 |
| `business` | `block-e` | 7 |
| `team` | `block-f` / `team` | 8 |
| `network` | `block-f` / `network` | 9 |
| `closing` | `center` / `closing` | 10 |
| `contacts` | `center` / `contacts` | 11 |

Las aperturas A, equipo/red F y cierre/contactos cambian de estado en el mismo objetivo. La cámara usa transiciones de 1000 ms; la entrada al centro pasa primero por el mapa y después amplía el centro en 480 ms. Vista general vuelve a `overview`; su encuadre depende de la variante de entrada.

Los siete elementos permanecen visibles en el canvas durante el recorrido. Los elementos con varios estados muestran el estado actual en su parada, el final cuando quedan atrás y el inicial cuando aún están por delante. Retroceder recalcula los estados según la posición del recorrido. La pantalla negra inicial sigue vacía. Los cambios de estado en el mismo objetivo animan el contenido verticalmente, respetando movimiento reducido.

Las tres paletas habilitadas son `primary-space`, `deep-teal` y `monochrome-blue`; la primera es inicial. Los otros dos JSON del sistema no están ofrecidos por este deck.

## Archivos y fuentes

| Archivo o carpeta | Función |
| --- | --- |
| `presentation.ts` | Modelo, recorrido, coordenadas, temas y opciones visuales |
| `content.tsx` | Escenas, estados, perfiles, pies y marca superpuesta |
| `styles.css` | Estilos específicos y exclusión de la marca superior derecha en estático/PDF |
| `schema.tsx` | Sketch vectorial de hexacóptero activo en el mapa |
| `illustrated-schema.tsx` | Entrada dormida al esquema, sin recursos ni configuración activa |
| `experiments.ts` / `experiment-controls.tsx` | Encuadre histórico y selector de color de resaltado |
| `assets/images/` / `qr/` | Imágenes locales y QR SVG importados por el contenido |
| `assets/experiments/` | Registro de la ilustración independiente retirada y su procedencia |
| `Notas.md`, `TEB_slides/`, `raw-sources/` | Contenido, capturas y antecedentes de la presentación |
| `requisitos-presentacion-concreta-reunion.md` | Acuerdos y propuestas procedentes de la reunión |
| `plan-implementacion.md` | Registro de implementación de la versión inicial |

La autoría de contenido debe respetar las restricciones de conservación literal de las fuentes. La posición de un texto puede cambiar sin convertir su guion hablado en contenido nuevo de pantalla.

## Variantes y exportación

La ilustración independiente del dron y sus selectores están retirados; se conserva el sketch vectorial original del hexacóptero. Hay cuatro colores de resaltado, conservados en `highlight`. El encuadre histórico `intro=focus|map` sigue disponible por URL y CLI. [Detalle](experimentos-visuales.md).

El botón **Presentar** solicita pantalla completa y activa la exposición. **P** alterna el HUD. Todas las escenas llevan fecha **9 October 2026**. Las imágenes HPM/Sting y su procedencia están en [competition-sources.md](assets/images/competition-sources.md).

Desde la raíz del repositorio:

```powershell
npm run export:pdf
npm run export:pdf -- --intro map --highlight amber
```

El comando regenera el HTML y escribe once páginas en `output/pdf/esabic-caelum-2026.pdf`; cada variante sobrescribe la misma ruta. En la barra estática también puedes elegir variantes y paleta antes de imprimir. Se excluyen los controles y el cuadro de marca/número superior derecho; los pies integrados en cada escena permanecen.

Para regenerar los QR, el script auxiliar contiene dependencias PEP 723 y se ejecuta **desde la raíz** con:

```powershell
uv run scripts/generate-qr.py
```

Escribe en `presentations/esabic-caelum-2026/qr/`. Conserva primero los SVG que vayas a reemplazar y comprueba que las URLs del generador y del contenido coincidan. El script no incorpora automáticamente backups. La codificación y el contraste de los SVG no sustituyen una comprobación con lector QR.

## Comprobar cambios

Revisa las doce paradas, sus paletas y la versión estática. Si cambia el recorrido, actualiza el contador de páginas del exportador y las pruebas pertinentes. Los registros antiguos con once paradas o diez páginas describen una versión anterior. La [guía común](../../system/docs/guia-de-trabajo.md) y [pruebas](../../TEST_INFRA.md) detallan los procedimientos y límites.

## Modificaciones del 1 de octubre de 2026

Cambios aplicados sobre el árbol de trabajo existente, conservando fotografías, perfiles y QR anteriores: sigla RAR, descriptor counter-UAS, subtítulos sin punto final, énfasis selectivo, sublista RF/GNSS y HPM, alturas de imagen fijas, contenido centrado, seis cajas de negocio con dos riesgos y soluciones, cuatro filas institucionales y jerarquía de cierre. El fondo del lienzo queda fuera de la transformación de cámara para mantener cobertura durante los vuelos. La fecha de exposición procede del documento de reunión; sus notas de agenda no se han incorporado al deck.

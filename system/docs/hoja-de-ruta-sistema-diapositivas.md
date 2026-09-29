# Hoja de ruta del sistema de diapositivas espaciales

Estado: viva · iniciada el 29 de septiembre de 2026.

## Meta y fuentes

Llegar a un sistema reutilizable con el que se puedan definir presentaciones espaciales distintas, recorrerlas en una salida interactiva y obtener una secuencia estática fiel. La referencia funcional es [R01–R26](requisitos-sistema-diapositivas.md); la [decisión de reutilización](decision-reutilizacion-sistema-diapositivas.md) orienta la base técnica y puede revisarse si una prueba la contradice.

Las fuentes de la llamada están en `presentations/esabic-caelum-2026/raw-sources/`: la transcripción de la reunión y la petición de Guillermo. De ellas se recogen para **el sistema** los bloques, la visión general, los cambios de contenido en una misma posición, los movimientos de cámara con zoom y desplazamiento, la separación entre ambos tipos de transición, las paletas y la salida HTML/PDF. La disposición circular, el fondo, el estilo blueprint, los QR y el contenido ESA-BIC pertenecen a **presentaciones concretas**. Las fechas y acuerdos de entrega mencionados en la llamada no son un calendario para este sistema.

## Invariante visual que no se puede perder

La cámara debe **desplazarse y cambiar de escala de forma animada** al pasar entre objetivos espaciales. Deben verse posiciones intermedias entre origen y destino; un salto instantáneo solo es aceptable al iniciar la aplicación, en una salida estática o cuando el usuario solicite reducir movimiento. Al cambiar entre estados situados en la misma posición, la cámara debe permanecer quieta. El recorrido puede volver a una vista de contexto sin imponer salida y entrada de zoom tras cada diapositiva.

Este comportamiento se comprobará en el navegador, no solo por inspección de datos o compilación. La duración y el estilo del movimiento podrán variar por presentación sin alterar el modelo espacial.

## Pasos hacia el sistema final

| Paso | Resultado que debe poder mostrarse | Requisitos principales | Estado |
| --- | --- | --- | --- |
| 0. Prueba del núcleo | Vista general, bloques, dos estados superpuestos, retorno y cierre; cámara 2D con movimiento visible. | R01–R14, parcialmente R24 | Demostrado en prototipo; el cumplimiento completo de estos requisitos se revisará al final. |
| 1. Reutilización real | Dos presentaciones de prueba con estructuras distintas usan el mismo motor; cada una declara contenido, posiciones y recorrido sin editar el núcleo. | R01–R05, R10–R11, R23, R26 | Demostrado con los dos casos de prueba; R23 y R26 aún requieren ampliación para todos los tipos de contenido y opciones. |
| 2. Navegación y transiciones | Encuadres, movimiento animado, interrupción, regreso al contexto y cambios internos se comportan de modo predecible con ratón, teclado y tacto. | R07–R09, R10–R12, R24 | Pendiente. |
| 3. Composición visual | Fondos de lienzo y de elementos, decoración, vista general con contenido, temas intercambiables y elementos persistentes funcionan en más de una presentación. | R13–R22, R26 | Pendiente. |
| 4. Contenido variado | Diapositivas con texto, imagen, SVG y otros recursos demostrativos, sin que el motor necesite conocer su estructura interna. | R23 | Pendiente. |
| 5. Salidas | La versión interactiva conserva el recorrido espacial y una versión estática sigue el orden narrativo, incluidos los estados que deban aparecer. | R24–R25 | Pendiente. |
| 6. Validación final | Revisión requisito por requisito en dos presentaciones distintas, con comprobación visual y funcional de ambas salidas. Se resuelven los fallos antes de considerar completo el sistema. | R01–R26 | Pendiente. |

Los pasos indican **capacidades comprobables**, no paquetes de tareas cerrados. Se pueden adelantar pruebas de un paso posterior cuando despejen una duda del paso actual. Al terminar cada paso, se anota aquí qué se ha demostrado, qué sigue abierto y si alguna decisión técnica debe cambiar.

## Criterio de cierre del paso 1

El paso 1 queda demostrado cuando la presentación actual y una segunda con otra disposición y otra secuencia se ejecutan con el mismo reproductor, se cambian desde la aplicación y conservan la cámara animada. El contenido, las coordenadas, los bloques y los estados deben vivir en cada presentación. El motor solo recibe su definición y representa los componentes. Se validarán referencias inválidas para que los errores de autoría sean comprensibles.

**Evidencia del 29 de septiembre:** `prototipo-espacial` y `ruta-diagonal` declaran sus propios elementos, contenido, estados, orden y duración de cámara. El mismo reproductor muestra ambas. En navegador se observó un transform inicial, otro intermedio y uno final al entrar en un bloque; después de alcanzar una posición, el cambio de estado conservó exactamente el transform. La configuración de movimiento reducido del sistema operativo provoca un salto, como corresponde; para inspeccionar la animación completa durante el desarrollo se puede usar `?motion=full` solo en el servidor local. Pasaron compilación y pruebas de validación del modelo. No se han auditado aún todos los requisitos ni la salida estática.

## Comprobación final prevista

- Estructura, agrupación, patrones y recorrido: R01–R05, R26.
- Lienzo, cámara **animada**, transiciones separadas y vistas de contexto: R06–R09, R24.
- Superposición, visibilidad, inicio, vista general y cierre: R10–R14.
- Fondos, decoración, temas, paletas y elementos persistentes: R15–R22.
- Contenido heterogéneo y salidas interactiva/estática: R23–R25.

La presentación ESA-BIC podrá utilizarse más adelante como caso real de validación, sin cambiar el alcance general del motor ni dar por cumplidos los requisitos solo porque un caso concreto funcione.

# Mapa del proyecto

Referencia documental revisada el 30 de septiembre de 2026 contra el árbol de trabajo, incluidos sus cambios sin commit. El repositorio contiene un motor reutilizable y tres presentaciones; la principal es Caelum ESA BIC. La entrada operativa es el [README](README.md).

## Documentos y responsabilidades

| Documento | Para qué sirve |
| --- | --- |
| [Referencia del sistema](system/docs/referencia-sistema.md) | Especificación descriptiva del comportamiento implementado y sus contratos |
| [Guía de trabajo](system/docs/guia-de-trabajo.md) | Procedimientos de autoría, desarrollo, exportación y verificación |
| [Requisitos del sistema](system/docs/requisitos-sistema-diapositivas.md) | Capacidades deseadas R01–R26; no inventario de capacidades certificadas |
| [Referencia de Caelum](presentations/esabic-caelum-2026/README.md) | Estado implementado del deck, recorrido y fuentes |
| [Definición de Caelum](presentations/esabic-caelum-2026/definicion-presentacion.md) | Diseño de partida y restricciones editoriales; contiene propuestas históricas |
| [Notas de contenido](presentations/esabic-caelum-2026/Notas.md) | Material de origen, textos y guion; no descripción del runtime |
| [Variantes visuales](presentations/esabic-caelum-2026/experimentos-visuales.md) | Opciones de diagrama y encuadre, con diferencias entre desarrollo y exportación |
| [Infraestructura de pruebas](tests/TEST_INFRA.md) | Qué verifica cada suite y qué requiere revisión en navegador |
| [Estado de pruebas](tests/TEST_READY.md) | Evidencia fechada, comandos ejecutados y límites de esa comprobación |
| [Hoja de ruta](system/docs/hoja-de-ruta-sistema-diapositivas.md) | Evolución y evidencias de los incrementos del sistema |
| [Decisión inicial](system/docs/archive/decision-reutilizacion-sistema-diapositivas.md) y [investigación](system/docs/archive/investigacion-reutilizacion-sistema-diapositivas.md) | Antecedentes de la elección técnica; no manual de uso actual |
| [Plan de implementación](presentations/esabic-caelum-2026/plan-implementacion.md) | Registro de la primera versión de Caelum; métricas históricas |

## Fronteras de responsabilidad

`system/` define el modelo espacial, validación, cámara, navegación, composición y representación estática. `presentations/` define textos, posiciones, recorrido, componentes, identidad visual y recursos de cada deck. `scripts/` empaqueta la aplicación y produce los entregables.

Una modificación de Caelum debe quedarse en su carpeta salvo que requiera ampliar una capacidad genérica. Los otros dos decks son ejemplos de reutilización y sirven para detectar regresiones del motor. No hay editor visual, descubrimiento automático de decks ni exportador PPTX.

## Inventario y límites actuales

- React, TypeScript y Vite; cámara D3 con desplazamiento y zoom 2D.
- Tres decks registrados manualmente en `system/src/main.tsx`.
- Cinco archivos de paleta; los decks actuales ofrecen tres: `primary-space`, `deep-teal` y `monochrome-blue`. `deep-space` y `white-paper` existen como recursos pero no están habilitados en sus definiciones.
- Caelum contiene siete elementos, doce paradas y once páginas estáticas. Cierre y contactos son paradas distintas.
- HTML autónomo con todos los decks; PDF CLI específico de Caelum, con diagrama y encuadre configurables. La impresión desde el visor admite el deck y paleta elegidos.
- Pruebas automatizadas de contratos y representación; la validación visual completa y la prueba en dispositivo táctil físico requieren comprobación aparte.

## Mantener la documentación

Cuando cambies una función, actualiza su referencia y los ejemplos de uso afectados. Si cambia un contrato, ajusta también las pruebas pertinentes. Los recuentos del recorrido se obtienen de la definición del deck y del filtro `includeInStatic`; al cambiarlos revisa el contador exigido por `scripts/export-pdf.mjs`.

Registra comprobaciones con fecha y alcance. No conviertas una compilación o una prueba de markup en una certificación de legibilidad, contraste, navegación en navegador o fidelidad del PDF. Conserva las fuentes y decisiones antiguas como antecedentes identificados, evitando que compitan con el manual actual.

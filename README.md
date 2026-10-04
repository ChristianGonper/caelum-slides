# Caelum Slides

Sistema de presentaciones espaciales definido mediante código. Separa las posiciones del contenido del orden narrativo: una cámara 2D recorre el lienzo, y varias paradas pueden cambiar el contenido sin cambiar de posición. Ofrece un visor interactivo, HTML autónomo y una secuencia estática imprimible en PDF.

## Empezar

Necesitas Node.js y npm. Vite instalado declara Node `^20.19.0 || >=22.12.0`; la revisión del 30 de septiembre de 2026 se ejecutó con Node 24.12.0 y npm 11.7.0. Para exportar PDF directamente necesitas además Chrome, Edge o Chromium.

Desde la raíz del repositorio:

```powershell
npm ci
npm run dev
```

Abre la dirección que indique Vite. Se carga **Caelum Systems — ESA BIC Castilla y León 2026**. El panel permite cambiar de presentación, paleta, parada y variantes visuales. `npm ci` instala las versiones de `package-lock.json`; al cambiar dependencias, utiliza `npm install` y conserva actualizado ese archivo.

| Presentación | Identificador | Paradas / páginas estáticas |
| --- | --- | --- |
| Caelum ESA BIC | `esabic-caelum-2026` | 12 / 11; el inicio negro no se imprime |
| Prototipo espacial | `prototipo-espacial` | 8 / 8 |
| Ruta diagonal | `ruta-diagonal` | 7 / 7 |

## Navegar y presentar

| Acción | Control |
| --- | --- |
| Avanzar | Clic izquierdo en el lienzo, flecha derecha, Av Pág o espacio |
| Retroceder | Flecha izquierda o Re Pág |
| Mostrar u ocultar el HUD | `P` |
| Ir a una parada | Lista del panel lateral |
| Volver al contexto | Vista general |
| Recuperar el encuadre tras desplazar o ampliar | Centrar |
| Mover manualmente | Ctrl + arrastre con el botón izquierdo, o arrastre con el dedo |
| Ampliar manualmente | Rueda del ratón o pellizco táctil |

La navegación se detiene en los extremos. `Inicio` y `Fin` no tienen atajos implementados. En modo exposición se ocultan cabecera, panel, controles, indicador y marca superpuesta; la navegación por teclado sigue activa. No activa automáticamente la pantalla completa del navegador.

Puedes abrir directamente una configuración añadiendo parámetros a la dirección de Vite o al HTML exportado:

```text
?deck=esabic-caelum-2026&mode=present
?deck=ruta-diagonal
?deck=esabic-caelum-2026&stop=overview&intro=map&diagram=blueprint
?deck=esabic-caelum-2026&view=static&diagram=illustrated&intro=focus
```

En Caelum, desarrollo interactivo usa por defecto portada ampliada (`intro=focus`) y hexacóptero ilustrado (`diagram=illustrated`). El HTML autónomo y la vista estática usan esquema original (`diagram=blueprint`); puedes elegir la variante con los selectores o la URL. [Variantes visuales](presentations/esabic-caelum-2026/experimentos-visuales.md).

## Exportar HTML y PDF

```powershell
npm run export
```

Genera `output/html/caelum-slides.html` y `output/pdf/esabic-caelum-2026.pdf`. También puedes generar cada salida:

```powershell
npm run export:html
npm run export:pdf
npm run export:pdf -- --diagram illustrated --intro map
```

El HTML contiene aplicación, estilos y recursos importados en un único archivo que puedes abrir sin servidor. Conserva las tres presentaciones y la navegación espacial. Los enlaces externos de contacto y créditos necesitan conexión para visitar sus destinos.

El PDF automático **regenera siempre el HTML**, usa la vista estática de Caelum y genera **11 páginas 16:9**. Permite `--diagram blueprint|illustrated` y `--intro focus|map`; los valores predeterminados son `blueprint` y `focus`. Todas las variantes escriben el mismo PDF. Para seleccionar opciones utiliza `export:pdf`, como en el ejemplo anterior. `npm run export` ejecuta primero HTML y después PDF, por lo que actualmente construye el HTML dos veces.

Para imprimir otra presentación o elegir su paleta, abre **Ver secuencia estática / PDF**, configura los selectores y pulsa **Imprimir / Guardar PDF**. La barra de opciones no se imprime. En Caelum también se oculta el cuadro de marca y numeración superior derecho, tanto en la vista estática como en el PDF; los pies que forman parte del contenido permanecen.

Ambos scripts crean una copia `_original` si existe una salida anterior y aún no existe ese respaldo. **Conservan la primera copia, no un historial ni la versión inmediatamente anterior en cada ejecución.** `output/` y `dist/` están excluidos de Git. [Detalles de exportación y mantenimiento](system/docs/guia-de-trabajo.md).

## Comprobar cambios

```powershell
npm test
npm run test:e2e
npm run build
```

`npm test` revisa el motor y contenido en `system/src/`. La suite llamada `test:e2e` comprueba contratos, código, cálculos y artefactos desde Vitest; no abre un navegador ni sustituye una revisión visual. `build` verifica tipos y genera el sitio en `dist/`; `npm run preview` sirve ese build. Para entregar un PDF, ejecuta también la exportación y abre el resultado. [Pruebas y límites](tests/TEST_INFRA.md).

## Dónde está cada cosa

```text
system/src/                       Motor, cámara, visor y representación estática
system/themes/                    Tokens JSON de las paletas
system/docs/                      Referencia, guía y requisitos del sistema
presentations/esabic-caelum-2026/  Definición, contenido, estilos y recursos de Caelum
presentations/prototipo-espacial/  Ejemplo de bloques y estados en una posición
presentations/ruta-diagonal/      Segundo ejemplo con disposición diferente
scripts/                          Exportadores HTML/PDF y generador de QR
tests/e2e/                        Pruebas de contratos y artefactos
output/                           Entregables y respaldos locales, sin versionar
```

## Documentación para trabajar

- [Mapa del proyecto](PROJECT.md): inventario y responsabilidad de cada documento.
- [Referencia del sistema](system/docs/referencia-sistema.md): arquitectura, contratos, comportamiento y límites implementados.
- [Guía de trabajo](system/docs/guia-de-trabajo.md): crear presentaciones, modificar contenido o temas, exportar y verificar.
- [Referencia de Caelum](presentations/esabic-caelum-2026/README.md): recorrido, fuentes, recursos y variantes de esta presentación.
- [Requisitos del sistema](system/docs/requisitos-sistema-diapositivas.md): intención funcional; no equivale a una declaración de cumplimiento completo.
- [Estado de verificación](tests/TEST_READY.md): resultados fechados de la revisión documental.

Los documentos de investigación, decisión inicial, hoja de ruta y plan de implementación conservan sus antecedentes. Sus notas de estado explican cómo leerlos junto a la referencia actual.

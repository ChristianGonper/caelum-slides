# Estado de verificación

Comprobaciones realizadas durante la revisión documental del **30 de septiembre de 2026**, sobre el árbol de trabajo con cambios sin commit. Son evidencia de esa revisión, no una garantía para versiones futuras.

| Comprobación | Resultado |
| --- | --- |
| `npm test` | 63 pruebas pasadas en 7 archivos |
| `npm run test:e2e` | 93 pruebas pasadas en 5 archivos |
| `npm run build` | Tipos y build correctos |
| `npm run export:pdf` | HTML regenerado y PDF de 11 páginas, `blueprint` + `focus`, código 0 |
| `npm run export:pdf -- --diagram illustrated --intro map` | PDF de 11 páginas con la combinación alternativa, código 0 |
| Enlaces documentales locales | 71 enlaces comprobados en 14 documentos, sin destinos ausentes |
| `git diff --check` | Sin errores de whitespace |

La primera exportación de esta revisión detectó la discrepancia entre once páginas reales y el contador antiguo de diez. Los cambios posteriores del usuario actualizaron el contador a once, añadieron opciones CLI de variantes y regeneración automática del HTML, y ocultaron la marca superior derecha en estático. La exportación se repitió contra esa versión.

La revisión documental no certifica legibilidad de todas las escenas, inspección visual completa del PDF, decodificación de QR, un ensayo humano de diez minutos ni interacción en dispositivo táctil. Las suites llamadas E2E corren en Node; sus comprobaciones condicionales pueden pasar sin validar un artefacto ausente. [Alcance detallado](TEST_INFRA.md).

## Repetir la comprobación

Desde la raíz:

```powershell
npm test
npm run test:e2e
npm run build
npm run export:pdf
```

Para otra variante:

```powershell
npm run export:pdf -- --diagram illustrated --intro map
```

Revisa también el resultado abierto y registra la fecha y el alcance comprobado. La versión actual de Caelum tiene doce paradas, once páginas estáticas y cierre/contactos separados; los registros iniciales de 72 pruebas E2E o diez páginas pertenecen a versiones anteriores.

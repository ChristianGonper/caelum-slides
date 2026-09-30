# Variantes visuales de Caelum

Estado revisado el 30 de septiembre de 2026. Las dos variantes se controlan de manera independiente; sus componentes pertenecen al deck, no al motor genérico.

| Opción | Valores | Desarrollo interactivo | HTML exportado / estático / PDF CLI |
| --- | --- | --- | --- |
| Encuadre de entrada | `focus`: portada ampliada; `map`: mapa completo | `focus` | `focus` |
| Diagrama | `illustrated`: hexacóptero ilustrado; `blueprint`: esquema original | `illustrated` | `blueprint` |

## Elegir y comparar

Los selectores están en el panel de revisión y en la barra estática. Cambiarlos recarga la URL; en el visor abre `stop=overview` para comparar la portada, y en estático conserva la secuencia completa. `mode=present` oculta el HUD.

```text
?deck=esabic-caelum-2026&stop=overview&intro=map&diagram=illustrated
?deck=esabic-caelum-2026&view=static&intro=focus&diagram=blueprint
```

Los valores explícitos válidos tienen prioridad. `experiments.ts` define los defaults y detecta el marcador `window.__CAELUM_EXPORT__` que incorpora el HTML autónomo: por ello el mismo código usa el esquema original al exportar. La vista estática también lo elige aunque se abra desde desarrollo.

La portada mantiene identidad y convocatoria; el encuadre cambia cuánto contexto periférico se ve, sin alterar el número de paradas. El dibujo se compone en `illustrated-schema.tsx`; su recurso, procedencia y licencia están en [assets/experiments/README.md](assets/experiments/README.md). El esquema original permanece en `schema.tsx`.

## PDF y controles de salida

Desde la raíz:

```powershell
npm run export:pdf
npm run export:pdf -- --diagram illustrated --intro map
```

El primer comando usa `blueprint` y `focus`; el segundo elige ambas alternativas. Se regenera HTML y se escribe la misma ruta `output/pdf/esabic-caelum-2026.pdf` con once páginas. Para conservar varias salidas, copia la anterior antes de regenerar. No hay nombres distintos automáticos por variante.

También puedes seleccionar diagrama, encuadre y paleta en la vista estática y usar **Imprimir / Guardar PDF**. Los selectores no se imprimen. El cuadro superior derecho de marca/número de Caelum se oculta mediante `.caelum-persistent-badge` en la vista estática, incluidos sus PDF, mientras se conservan los pies internos del contenido.

Para cambiar defaults, revisa separadamente desarrollo (`experimentDefaults`), reglas de exportación en `experiments.ts` y opciones iniciales de `scripts/export-pdf.mjs`. Cambiar sólo el default interactivo no cambia necesariamente el PDF CLI.

## Antecedente

El commit `93e5c5f` se citó como punto anterior al ensayo visual. Es una referencia histórica, no una instrucción para restaurar el repositorio ni una afirmación sobre qué cambios están actualmente confirmados. Antes de editar o guardar cambios, consulta el estado real de Git y conserva modificaciones existentes.

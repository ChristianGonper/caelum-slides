---
name: git-atomic-commits
description: >
  Organiza y ejecuta commits pequeños, atómicos y ordenados adaptados a cada caso.
  Use when the user asks to commit, guardar cambios en git, o pide commits pequeños/atómicos.
---

# Git Atomic Commits

Esta skill define el procedimiento para auditar, desagregar, empaquetar y redactar commits, garantizando un historial limpio, atómico y legible fundamentado en la **separación de responsabilidades**.

---

## 1. Principios fundamentales

1. **Separación de responsabilidades**:
   - Aunque un conjunto amplio de modificaciones provenga de una misma sesión de trabajo o requerimiento transversal, **no deben colapsarse en un único commit masivo** si abarcan capas arquitectónicas, módulos o intenciones desacopladas.
   - Cada commit representa una **unidad lógica mínima completa**: un cambio autocontenido que resuelve una responsabilidad técnica o funcional concreta y deja el repositorio en un estado íntegro, coherente y funcional.
   - La cantidad de commits no está prefijada: surge de evaluar cuántas responsabilidades independientes conviven en el árbol de cambios.

2. **Taxonomía universal de capas lógicas**:
   Al evaluar un árbol con múltiples cambios acumulados, los commits se ordenan secuencialmente de menor a mayor dependencia arquitectónica:
   - **Capa 0: Cimientos, configuración y entorno:** Dependencias del proyecto, herramientas de compilación/ejecución, variables de entorno tipadas, linters o configuraciones base.
   - **Capa 1: Dominio, contratos y datos:** Definición de esquemas, tipos, interfaces, modelos de datos, migraciones o entidades nucleares.
   - **Capa 2: Lógica de negocio y servicios:** Algoritmos, librerías internas, servicios, casos de uso o utilidades de soporte.
   - **Capa 3: Superficies, interfaces y presentación:** Endpoints de API, controladores, vistas, componentes visuales o rutas de usuario, junto a sus activos directamente asociados.
   - **Capa 4: Pruebas y verificación:** Suites de pruebas (unitarias, integración, e2e) o scripts de verificación (si aplican exclusivamente a una capa anterior, pueden integrarse en ella; si son transversales, conforman su propio hito).
   - **Capa 5: Gobernanza y documentación:** Especificaciones técnicas, guías, bitácoras o planes de seguimiento (si un documento gobierna de forma exclusiva a una capa previa, se incluye en ella; si documenta el cierre global de una etapa, se confirma en su propio commit).

3. **Tratamiento de activos y recursos estáticos pesados**:
   - Cuando se incorporen o modifiquen recursos no textuales o binarios (imágenes, iconos, tipografías, clips multimedia, datasets o activos gráficos auxiliares), es preferible empaquetarlos en un commit específico de activos.
   - Aislar los activos binarios del código fuente evita inflar los diffs de programación, simplifica la revisión técnica y preserva la ligereza y claridad del historial.

4. **Gobernanza y trazabilidad asociadas**:
   - Si una actualización en la documentación o especificación pertenece de forma directa y exclusiva a un módulo o capa concreta, se incluye en el mismo commit para mantener unidas la intención y su realización.
   - Las actualizaciones transversales o de cierre general se aíslan en su respectivo commit de gobernanza.

5. **Estilo canónico de los mensajes**:
   - **Idioma:** Siempre en español.
   - **Tiempo y modo verbal:** Tercera persona del presente de indicativo (por ejemplo: *«Añade»*, *«Configura»*, *«Actualiza»*, *«Refactoriza»*, *«Implementa»*, *«Corrige»*, *«Elimina»*).
   - **Sin prefijos artificiales:** Prohibido usar `feat:`, `fix:`, `chore:` o emojis.
   - **Claridad y concisión:** Línea principal de menos de 72 caracteres, específica, sin punto final, expresando con exactitud la responsabilidad resuelta.

6. **Staging explícito y selectivo**:
   - Preparar deliberadamente las rutas exactas de cada unidad lógica mediante `git add <ruta1> <ruta2> ...`.
   - Prohibido usar comandos indiscriminados (`git add -A`, `git add .`) cuando coexistan múltiples responsabilidades en el área de trabajo.

---

## 2. Protocolo de ejecución paso a paso

### Paso 1: Auditoría del árbol y desarme preventivo
1. Inspeccionar el estado de los archivos:
   ```bash
   git status -u
   ```
2. **Desarme de preparación masiva**: Si existen archivos previamente agregados al área de preparación (`Changes to be committed`) que mezclan varias intenciones, devolverlos al área de trabajo sin perder los cambios:
   ```bash
   git restore --staged .
   ```
   Asegurar que el área de preparación queda vacía antes de clasificar los cambios.

### Paso 2: Triaje y mapeo de responsabilidades
1. Revisar los archivos modificados y nuevos listados en `git status` y examinar el contenido de los cambios con `git diff`.
2. Identificar las responsabilidades independientes presentes en el árbol de trabajo.
3. Clasificarlas según la taxonomía de capas lógicas y definir el orden secuencial de confirmación (de cimientos a superficies y gobernanza).

### Paso 3: Empaquetado y confirmación secuencial
Por cada responsabilidad identificada, ejecutar ordenadamente:
1. **Preparación selectiva**:
   ```bash
   git add <ruta-1> <ruta-2> ...
   ```
2. **Validación del área de preparación**:
   Confirmar con `git status` que únicamente están listos los archivos que forman parte de esa unidad lógica concreta.
3. **Confirmación del commit atómico**:
   ```bash
   git commit -m "Describe la responsabilidad resuelta en presente de indicativo"
   ```

Repetir este ciclo por cada grupo hasta que todo el trabajo pendiente quede registrado.

### Paso 4: Verificación final del historial
Una vez limpio el árbol de trabajo (`working tree clean`):
1. Inspeccionar la secuencia de commits generada:
   ```bash
   git log -n 10 --oneline
   ```
2. Comprobar que cada hito refleja un avance técnico autocontenido, comprensible e independiente.

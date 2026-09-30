# Caelum Slides Workspace

Repositorio organizado para el desarrollo del **sistema de presentaciones espaciales (estilo Prezi)** y la gestión de presentaciones específicas.

---

## 📁 Estructura del repositorio

```text
caelum-slides/
├── system/                                  # Motor y recursos genéricos del sistema de diapositivas
│   ├── docs/
│   │   └── requisitos-sistema-diapositivas.md  # Especificación funcional de requisitos del sistema
│   └── themes/                              # Definiciones de temas y paletas (tokens JSON)
│       ├── deep-teal.json
│       ├── monochrome-blue.json
│       └── primary-space.json
│
└── presentations/                           # Presentaciones concretas
    └── esabic-caelum-2026/                  # Presentación para candidatura ESA-BIC
        ├── assets/
        │   └── images/                      # Recursos gráficos y fotografías de la presentación
        └── raw-sources/                     # Documentación original y notas de reuniones
            ├── Peticion-version-1-guillermo.txt
            └── Reunion-pptx-ESA-BIC.md
```

---

## 🎯 Separación de conceptos

- **`system/`**: Diseñado de forma agnóstica al contenido. Contiene los requisitos del motor espacial (recorrido no lineal, transiciones de cámara, vistas generales/bloques) y los temas de estilo reutilizables.
- **`presentations/`**: Aloja presentaciones individuales aisladas con sus propios recursos, fuentes y configuraciones.

## Prototipo mínimo

La primera prueba del núcleo espacial está en `system/src/` y su contenido de ejemplo en `presentations/prototipo-espacial/`. No utiliza los materiales de la presentación ESA-BIC.

```powershell
npm install
npm run dev
```

Abre la dirección local que indique Vite. El recorrido incluye vista general, dos bloques, dos estados en una misma posición, regreso al contexto y cierre sobre la posición inicial. Usa los botones o las flechas izquierda/derecha para avanzar; arrastra el lienzo y usa la rueda para cambiar el encuadre manualmente. El panel muestra el transform de la cámara para comprobar que no cambia entre «Pregunta» y «Respuesta».

```powershell
npm test
npm run build
```

El sistema incluye dos presentaciones de prueba, cámara animada, estados de contenido, temas, decoración y marcas propias de cada presentación. La decisión técnica y sus límites están en `system/docs/decision-reutilizacion-sistema-diapositivas.md`.

## HTML exportable y PDF

```powershell
npm run export:html
```

Genera `output/html/caelum-slides.html`: un único archivo con toda la aplicación, sus estilos y sus imágenes incluidos. Se puede abrir en el navegador y conserva el selector de presentaciones, los controles, las paletas y la navegación espacial. No necesita el servidor de desarrollo. Al regenerarlo se conserva la copia anterior en `caelum-slides_original.html`.

Para obtener el PDF de la presentación elegida, abre **Ver secuencia estática / PDF** y pulsa **Imprimir / Guardar PDF**. Selecciona guardar como PDF en el diálogo del navegador. Cada hoja tiene proporción 16:9 y corresponde a una parada del recorrido, incluidos los cambios de estado en la misma posición y las vueltas al contexto. Solo contiene el fondo y el contenido de la presentación, con sus marcas propias; se excluyen el panel lateral, los controles y las etiquetas del visor. No se capturan fotogramas de la animación.

Los componentes reciben `output="static"` para poder representar de forma fija su contenido interactivo. En Ruta diagonal se muestran las conexiones sin el botón. Los recursos y la decisión sobre su representación siguen perteneciendo a cada presentación. Las exportaciones generadas no se versionan en Git.

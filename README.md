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

Este prototipo valida el modelo, el recorrido y la cámara 2D. Temas, capas persistentes, exportación PDF y contenido de producción quedan para los siguientes incrementos. La decisión técnica y sus límites están en `system/docs/decision-reutilizacion-sistema-diapositivas.md`.

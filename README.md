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

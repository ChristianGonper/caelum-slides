# Requisitos del sistema de diapositivas — primera definición

## Propósito

Definir los requisitos funcionales iniciales de un sistema de presentaciones espaciales concebido desde cero.

El sistema no se diseña para una presentación concreta. Casos como una disposición circular, una estética blueprint, un fondo determinado o una presentación específica deben entenderse como configuraciones posibles construidas sobre un sistema general.

En esta fase se definen capacidades del sistema, no decisiones de arquitectura, framework, formato de archivos ni implementación.

---

## 1. Modelo de presentación

### R01 — Estructura no exclusivamente lineal

La presentación no debe modelarse únicamente como una secuencia lineal de diapositivas.

Debe existir una estructura espacial en la que puedan situarse diapositivas, grupos y otros elementos de contexto.

### R02 — Separación entre estructura espacial y recorrido narrativo

La posición espacial de los elementos y el orden en que se presentan deben ser conceptos independientes.

Una diapositiva puede ocupar una posición determinada dentro del lienzo sin que esa posición determine necesariamente cuándo se visita.

El sistema debe distinguir, por tanto, entre:

- **estructura espacial**: dónde se encuentran los elementos;
- **recorrido narrativo**: en qué orden se muestran.

---

## 2. Organización por grupos o bloques

### R03 — Agrupación de diapositivas

Las diapositivas deben poder agruparse en bloques o secciones.

Un bloque puede contener una o varias diapositivas y debe poder percibirse como una unidad dentro de la organización general.

### R04 — Representación propia de los bloques

Un bloque debe poder disponer de una representación propia en una vista general.

La vista global no debe estar obligada a mostrar siempre todas las diapositivas individualmente. Según la presentación, podrá mostrar:

- diapositivas individuales;
- bloques;
- una combinación de ambos;
- un elemento representativo del bloque.

### R05 — Patrones configurables de disposición

La disposición espacial de bloques y diapositivas debe poder definirse mediante patrones configurables.

Entre los patrones posibles pueden existir, sin limitarse a ellos:

- circular;
- radial;
- lineal;
- árbol o ramificaciones;
- rejilla.

Ningún patrón concreto debe constituir una restricción estructural del sistema.

---

## 3. Lienzo espacial y cámara

### R06 — Lienzo espacial

Debe existir un lienzo espacial mayor que una diapositiva individual.

Las diapositivas, bloques y otros elementos deben poder ocupar posiciones dentro de ese espacio.

### R07 — Cámara navegable

La visualización debe realizarse mediante una cámara capaz, como mínimo, de:

- acercarse;
- alejarse;
- desplazarse entre elementos;
- encuadrar una diapositiva;
- encuadrar un bloque;
- encuadrar una vista general.

### R08 — Separación entre movimiento de cámara y transición de contenido

El movimiento de cámara y el cambio de contenido deben ser mecanismos independientes.

El sistema debe diferenciar entre:

- **transiciones espaciales**, basadas en el movimiento, escala o encuadre de la cámara;
- **transiciones de contenido**, que cambian, sustituyen, revelan o transforman contenido sin requerir movimiento de cámara.

### R09 — Retorno a vistas de contexto

El recorrido debe poder volver desde una diapositiva o bloque a una vista de contexto más amplia.

Debe ser posible, por ejemplo:

1. entrar en un bloque;
2. recorrer varias diapositivas del mismo;
3. volver a una vista general;
4. entrar en otro bloque.

El sistema no debe imponer un zoom de entrada y salida entre cada diapositiva.

---

## 4. Estados y superposición

### R10 — Varios estados en una misma posición espacial

Varias diapositivas o estados de contenido deben poder compartir una misma posición espacial.

Esto permitirá recorrer distintos pasos sin mover la cámara cuando conceptualmente pertenezcan al mismo lugar del lienzo.

Una misma posición podría contener, por ejemplo:

```text
posición A
├── estado 1
├── estado 2
└── estado 3
```

### R11 — Control de visibilidad por estado

Debe poder controlarse qué elementos están visibles en cada momento del recorrido.

La visibilidad no debe depender únicamente de la posición espacial.

Un elemento puede existir en el lienzo y, aun así, permanecer oculto en determinadas vistas, estados o momentos de la presentación.

---

## 5. Inicio, vista general y cierre

### R12 — Inicio configurable

La presentación no debe estar obligada a comenzar mostrando el lienzo completo.

El estado inicial debe poder configurarse para comenzar, por ejemplo:

- en negro;
- en una diapositiva;
- en una imagen;
- en una vista general;
- en una región concreta del lienzo.

### R13 — Contenido propio en la vista general

La vista general debe poder contener contenido propio.

El centro o cualquier otra región de la composición puede incluir, entre otros:

- título;
- portada;
- identidad del proyecto;
- imagen;
- gráfico;
- elemento visual de contexto.

La vista general no debe considerarse únicamente un espacio de navegación.

### R14 — Reutilización de posiciones espaciales

Una misma posición espacial debe poder reutilizarse en diferentes momentos del recorrido mostrando estados o contenidos distintos.

Esto debe permitir, por ejemplo, regresar al punto inicial al final de la presentación y mostrar una composición de cierre diferente.

La posición espacial y el contenido mostrado deben ser entidades independientes.

---

## 6. Fondos y entorno visual

### R15 — Fondo global del lienzo

El lienzo debe poder disponer de un fondo global configurable.

Este fondo podrá ser, entre otros:

- un color;
- un degradado;
- una imagen;
- un gráfico;
- una composición visual.

### R16 — Fondos específicos

Las diapositivas o bloques deben poder disponer de fondos propios independientemente del fondo global.

El fondo del lienzo y el fondo del contenido mostrado deben tratarse como conceptos distintos.

### R17 — Capa decorativa independiente

Los elementos decorativos o ambientales del lienzo deben poder formar una capa independiente del contenido principal.

En ella podrían situarse, por ejemplo:

- líneas;
- rejillas;
- ilustraciones;
- formas;
- elementos gráficos de ambientación.

Estos elementos no deben confundirse con el contenido estructural de las diapositivas.

---

## 7. Sistema de temas y paletas

### R18 — Tema visual configurable

La presentación debe disponer de un tema visual configurable independientemente de su contenido.

Cambiar la identidad visual no debe requerir modificar individualmente cada diapositiva.

### R19 — Colores definidos mediante roles semánticos

Los colores del tema deben definirse principalmente por su función y no únicamente como una lista de valores.

El sistema debe poder expresar roles equivalentes a conceptos como:

- fondos;
- superficies;
- títulos;
- texto;
- texto secundario;
- acentos;
- estados;
- líneas;
- gráficos;
- elementos destacados.

El formato concreto en que se representen estos roles no queda definido en esta fase.

### R20 — Propiedades configurables del tema

El tema debe poder definir, al menos:

- fondos y superficies;
- colores de texto según jerarquía;
- colores de énfasis;
- colores para gráficos y líneas;
- familias tipográficas;
- pesos tipográficos;
- tamaños relevantes;
- propiedades visuales como degradados.

### R21 — Paletas intercambiables

Una misma presentación debe poder utilizar distintas paletas o variantes de tema sin modificar su estructura ni su contenido.

Debe ser posible comparar o sustituir una identidad visual de forma sencilla.

---

## 8. Elementos globales de presentación

### R22 — Elementos persistentes

Debe ser posible definir elementos globales o persistentes independientes del contenido de cada diapositiva.

Entre ellos pueden existir:

- numeración;
- encabezado;
- pie de página;
- identidad de la presentación;
- logotipo;
- indicador de sección;
- indicador de progreso.

Estos elementos deben poder desactivarse o sustituirse en diapositivas concretas cuando la composición lo requiera.

---

## 9. Contenido y recursos

### R23 — Contenido heterogéneo

Una diapositiva debe poder contener distintos tipos de recursos sin que el motor espacial dependa de sus detalles internos.

El sistema debe poder admitir contenidos como:

- texto;
- imágenes;
- SVG;
- tablas;
- gráficos;
- diagramas;
- códigos QR;
- componentes interactivos;
- otros elementos embebibles que se incorporen en el futuro.

El motor espacial debe ocuparse de la posición y navegación de la diapositiva, no de imponer una combinación concreta de contenido.

---

## 10. Salidas

### R24 — Salida interactiva

La presentación debe poder ejecutarse en una versión interactiva que conserve:

- la estructura espacial;
- el recorrido narrativo;
- el movimiento de cámara;
- las transiciones;
- los estados de contenido.

El formato técnico concreto de esta salida no se fija todavía.

### R25 — Representación estática

Debe existir una representación estática alternativa de la presentación.

La estructura espacial debe poder transformarse en una secuencia lineal adecuada para un formato estático, como PDF.

Esto implica que toda presentación debe disponer de un orden narrativo explícito aunque su organización principal sea espacial.

---

## 11. Configuración y reutilización

### R26 — Presentaciones definidas mediante configuración

Las características específicas de una presentación no deben estar codificadas directamente en el núcleo del sistema.

Una nueva presentación debe poder cambiar, sin modificar el motor:

- contenido;
- diapositivas;
- bloques;
- orden narrativo;
- posiciones;
- disposición espacial;
- recorrido;
- transiciones;
- tema;
- fondos;
- elementos globales.

El objetivo es que el sistema sea reutilizable para presentaciones con estructuras, estilos y necesidades diferentes.

---

## Principio conceptual

El sistema se entiende como un **lienzo espacial con elementos y grupos sobre el que se define un recorrido narrativo independiente**.

La cámara navega por ese lienzo, mientras que una misma posición puede contener uno o varios estados de contenido.

La apariencia se controla mediante un tema intercambiable y la presentación mantiene un orden narrativo que permite generar también una representación lineal y estática.

---

## Aspectos que no son requisitos actuales

Los siguientes puntos no se consideran requisitos del sistema en esta fase:

- importación de PowerPoint;
- editor visual completo;
- colaboración en tiempo real;
- sistema de comentarios;
- notas de presentador;
- compatibilidad con Google Slides;
- uso obligatorio de Three.js;
- uso obligatorio de un formato JSON concreto para las paletas;
- disposición circular obligatoria;
- estética blueprint obligatoria;
- imagen de fondo obligatoria;
- códigos QR obligatorios;
- cualquier recurso visual específico de una presentación concreta.

Estos elementos podrán reconsiderarse más adelante si aparecen necesidades que justifiquen incorporarlos.

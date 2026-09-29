# Investigación inicial de reutilización — sistema de diapositivas espaciales

## Objetivo del documento

Este documento recoge la investigación inicial sobre proyectos y frameworks existentes que podrían reutilizarse para construir el nuevo sistema de diapositivas espaciales.

El sistema se desarrollará con un flujo de trabajo **code-first**, trabajando sobre un repositorio.

La intención no es seleccionar aquí una arquitectura definitiva. Este documento deja una **hipótesis técnica inicial**, las razones que llevaron a destacar determinados proyectos y una serie de líneas de investigación que el agente deberá validar antes de comenzar una implementación importante.

El documento de requisitos funcionales sigue siendo la referencia sobre qué debe poder hacer el sistema. Este documento trata únicamente sobre qué partes ya existentes podrían reutilizarse para conseguirlo.

---

# 1. Principios y asunciones utilizados en la investigación

Los proyectos destacados no se eligieron únicamente porque sean frameworks de presentaciones. Se filtraron según una serie de asunciones derivadas del sistema que se quiere construir.

## A1 — El producto diferencial no es una presentación HTML convencional

El sistema no pretende ser simplemente un generador de diapositivas lineales.

La parte diferencial es:

- un lienzo espacial;
- posiciones y agrupaciones;
- navegación mediante cámara;
- vistas generales;
- bloques;
- varios estados en una misma posición;
- un recorrido narrativo independiente de la disposición espacial.

Por ello, un framework convencional de presentaciones solo resulta útil si permite reutilizar infraestructura alrededor de este núcleo sin impedir construir nuestro propio modelo espacial.

---

## A2 — La autoría será principalmente mediante código y agentes

En esta fase no se requiere un editor visual completo.

La forma principal de trabajo prevista es:

1. definir o modificar la presentación mediante archivos;
2. trabajar sobre ellos con el agente;
3. ejecutar la aplicación;
4. revisar visualmente;
5. volver a modificar el código o la configuración.

Por ello se han priorizado proyectos que:

- tengan una estructura clara de repositorio;
- funcionen bien con TypeScript/JavaScript moderno;
- permitan definir contenido mediante código;
- sean razonablemente comprensibles para un agente;
- permitan desarrollo local rápido;
- tengan documentación suficiente.

Esto reduce el interés actual de frameworks cuyo principal valor sea un editor gráfico.

---

## A3 — Conviene reutilizar un framework de presentación si no condiciona el modelo espacial

No interesa reconstruir desde cero funciones ya resueltas como:

- escalado de diapositivas;
- pantalla completa;
- navegación por teclado;
- carga de assets;
- build de producción;
- exportación;
- hot reload;
- estructura de proyecto;
- presentación de componentes React.

Sin embargo, reutilizar estas capacidades solo es positivo si no obliga a modelar la presentación como una lista lineal convencional.

---

## A4 — La cámara y el contenido son problemas distintos

Los requisitos distinguen expresamente entre:

- movimiento espacial de cámara;
- transiciones internas de contenido.

Por ello se ha buscado una posible separación entre:

```text
motor espacial / cámara
        +
motor de transiciones internas
```

No se presupone que una única librería deba resolver ambos problemas.

---

## A5 — Se busca una base mantenible, no la mínima demo posible

El objetivo no es únicamente conseguir una primera presentación funcional.

Se busca una base que pueda reutilizarse para distintas presentaciones y crecer con nuevas capacidades.

Por ello se ha dado valor a:

- actividad reciente;
- TypeScript;
- documentación;
- modularidad;
- licencias permisivas;
- APIs públicas claras;
- ecosistemas suficientemente maduros.

---

## A6 — No debe introducirse un editor complejo sin necesidad

Un infinite canvas o un framework de diagramas puede resolver técnicamente gran parte de la navegación espacial.

Sin embargo, si trae consigo:

- selección avanzada;
- conectores;
- edición libre;
- herramientas de dibujo;
- colaboración;
- sistema de formas;
- UI de whiteboard;

puede ser una dependencia excesiva para los requisitos actuales.

La complejidad incorporada debe justificarse por capacidades realmente necesarias.

---

## A7 — La salida interactiva y la salida estática son necesidades distintas

El sistema debe conservar una versión interactiva con navegación espacial, pero también debe poder producir una versión lineal estática.

Por ello se ha dado valor a proyectos que ya tengan:

- build HTML;
- exportación PDF;
- infraestructura de renderizado consistente.

El orden narrativo de la presentación puede servir como base para esa representación estática.

---

# 2. Proyecto especialmente relevante: Open Slide

Repositorio:

https://github.com/open-slide/open-slide

## Qué es

Open Slide es un framework de presentaciones construido con React y TypeScript y orientado explícitamente al trabajo con agentes de código.

Su filosofía encaja especialmente bien con el flujo previsto para este proyecto:

> el agente escribe las diapositivas como código y el framework proporciona el runtime de presentación.

Las diapositivas son componentes React arbitrarios sobre un canvas fijo de 1920 × 1080.

## Capacidades ya disponibles

Actualmente proporciona, entre otras cosas:

- estructura de proyecto;
- React + TypeScript;
- canvas de diapositiva;
- escalado;
- navegación;
- hot reload;
- gestión de assets;
- modo presentación;
- build estático;
- exportación HTML;
- exportación PDF;
- exportación PPTX;
- CLI;
- infraestructura preparada para trabajar con agentes.

El repositorio tiene además documentación e instrucciones orientadas a agentes.

## Por qué se ha destacado

Open Slide resuelve gran parte de la infraestructura que no constituye el valor diferencial del sistema.

En lugar de dedicar tiempo a reconstruir:

```text
runtime de diapositivas
gestión de assets
modo presentación
build
exportación
escalado
infraestructura React
```

el desarrollo podría concentrarse en:

```text
modelo espacial
cámara
bloques
estados
layouts
recorrido narrativo
```

## Limitación principal

Su modelo actual sigue siendo fundamentalmente una colección convencional de diapositivas.

Por tanto, no cumple por sí solo los requisitos espaciales.

La pregunta técnica principal no es:

> ¿podemos usar Open Slide tal como está?

sino:

> ¿podemos reutilizar su infraestructura y sustituir o extender su modelo de navegación y presentación?

## Hipótesis inicial

Open Slide es actualmente el candidato más interesante para actuar como:

- base de aplicación;
- runtime;
- sistema de slides;
- infraestructura de assets;
- infraestructura de build/exportación.

Debe investigarse si conviene:

1. hacer un fork;
2. consumir `@open-slide/core`;
3. extraer únicamente determinados módulos;
4. utilizar su estructura como referencia sin depender directamente del paquete.

Esta decisión debe tomarse después de inspeccionar su código interno.

---

# 3. Referencia espacial principal: impress.js

Repositorio:

https://github.com/impress/impress.js

## Qué es

`impress.js` es un framework de presentaciones inspirado directamente por la navegación espacial de Prezi.

Su modelo consiste en situar pasos dentro de un espacio y mover la cámara entre ellos.

Entre los parámetros que maneja se encuentran:

```text
x
y
z
scale
rotate
rotate-x
rotate-y
rotate-z
```

También dispone de navegación programática mediante una API equivalente a:

```text
next()
prev()
goto(...)
```

## Qué conceptos coinciden con nuestro sistema

Tiene soluciones ya implementadas para problemas muy próximos a:

- coordenadas espaciales;
- escalado;
- movimiento de cámara;
- encuadre de pasos;
- overview;
- navegación entre posiciones;
- estado activo;
- elementos visitados/no visitados.

También dispone de estados como:

```text
past
present
future
```

que pueden servir de referencia conceptual para nuestro control de visibilidad.

## Por qué no se propone como base completa

Aunque continúa siendo útil y activo, su arquitectura procede de una generación anterior del ecosistema web.

Su modelo está fuertemente basado en:

- DOM;
- atributos HTML;
- transformaciones CSS;
- JavaScript convencional.

Para el sistema actual parece preferible trabajar con una arquitectura moderna React + TypeScript.

## Uso recomendado

No utilizarlo necesariamente como framework de aplicación.

Sí estudiarlo como **implementación de referencia del motor espacial**.

El agente debería inspeccionar especialmente:

- cálculo de transformaciones;
- posición de cámara;
- zoom;
- transición entre pasos;
- overview;
- navegación `goto`;
- clases/estados asociados al paso actual.

Al estar bajo licencia MIT, puede evaluarse incluso la adaptación de partes de su implementación cuando resulte conveniente.

---

# 4. React Flow / xyflow

Repositorio:

https://github.com/xyflow/xyflow

## Qué aporta

React Flow proporciona un canvas interactivo basado en React y TypeScript.

Incluye de serie:

- pan;
- zoom;
- viewport;
- nodos posicionables;
- nodos React personalizados;
- utilidades de encuadre;
- minimapa;
- controles;
- gestión eficiente del renderizado.

Desde el punto de vista puramente técnico, una diapositiva podría representarse como un nodo.

## Por qué es interesante

Podría resolver rápidamente:

- R06: lienzo espacial;
- R07: cámara navegable;
- parte de R09: retorno a vistas de contexto;
- posicionamiento espacial;
- encuadre de grupos.

Además es un proyecto activo, maduro y MIT.

## Razón para no adoptarlo inicialmente

Está diseñado principalmente para construir:

- grafos;
- workflows;
- editores node-based.

Eso implica incorporar conceptos y comportamiento que actualmente no necesitamos:

- edges;
- handles;
- conexiones;
- selección;
- interacción de edición;
- semántica de grafo.

## Cuándo reconsiderarlo

Gana mucho interés si en el futuro se decide construir un editor visual del sistema.

En ese escenario podría servir tanto para:

- editar la estructura;
- visualizar grupos;
- mover elementos;
- representar relaciones.

Para los requisitos actuales puede resultar excesivo.

---

# 5. d3-zoom como posible motor de cámara ligero

Proyecto:

https://github.com/d3/d3

Módulo relevante:

`d3-zoom`

## Qué aporta

`d3-zoom` resuelve:

- zoom;
- pan;
- transformaciones;
- control programático del viewport;
- transiciones suaves entre transformaciones.

No obliga a utilizar un tipo concreto de contenido.

Puede trabajar sobre:

- HTML;
- SVG;
- Canvas.

## Por qué puede encajar

Permitiría mantener un modelo propio muy pequeño:

```ts
Camera {
  x
  y
  scale
}
```

y construir por encima operaciones del dominio como:

```text
goToSlide(...)
fitBlock(...)
showOverview(...)
returnToParent(...)
```

Esto podría resultar más limpio que utilizar un framework de grafos completo.

## Papel posible

`d3-zoom` sería una dependencia del motor espacial, no el sistema de presentaciones.

Debe compararse directamente con adaptar la lógica de cámara de `impress.js`.

---

# 6. Motion para las transiciones internas

Repositorio:

https://github.com/motiondivision/motion

## Problema que resolvería

Los requisitos separan:

```text
movimiento de cámara
```

de:

```text
cambio del contenido que aparece dentro de una posición
```

Motion puede utilizarse para la segunda parte.

## Capacidades relevantes

Entre otras cosas permite:

- animaciones declarativas;
- entrada/salida de componentes;
- layout transitions;
- timelines;
- transformaciones;
- animaciones React.

## Uso conceptual

La arquitectura podría mantener una división clara:

```text
Spatial Engine
└── mueve la cámara

Motion
└── anima el contenido interno
```

Así, dos estados pueden compartir exactamente la misma posición espacial y cambiar mediante una transición interna sin mover el viewport.

Esto encaja directamente con los requisitos relativos a estados y superposición.

---

# 7. Layouts espaciales

Para la primera versión no parece necesario introducir una dependencia importante.

## Layouts simples

Distribuciones como:

- círculo;
- radial;
- línea;
- pila;
- hijos alrededor de padre;

pueden implementarse mediante funciones geométricas propias.

Ejemplo conceptual para un círculo:

```text
angle = 360° / N

x = cx + radius × cos(angle)
y = cy + radius × sin(angle)
```

## Posible dependencia futura: ELK.js

Repositorio:

https://github.com/kieler/elkjs

ELK.js puede calcular automáticamente disposiciones más complejas:

- layered;
- radial;
- force;
- tree;
- otros grafos.

Su ventaja es que calcula posiciones sin imponer cómo deben renderizarse.

No parece necesario para la primera implementación, pero puede ser útil si posteriormente aparecen estructuras espaciales más complejas.

---

# 8. Exportación: reutilizar antes que reconstruir

## Open Slide

Si se adopta como base, ya dispone de infraestructura de exportación:

- HTML;
- PDF;
- PPTX.

Debe comprobarse cuánto de esa infraestructura puede mantenerse al introducir navegación espacial propia.

## DeckTape como alternativa o fallback

Repositorio:

https://github.com/astefanutti/decktape

DeckTape está especializado en convertir presentaciones web en PDF.

Soporta distintos frameworks de presentaciones y dispone también de mecanismos genéricos.

Puede servir como solución externa si la exportación propia del framework deja de ser adecuada.

## Principio

No debería desarrollarse un exportador PDF propio salvo que exista una razón clara para hacerlo.

El recorrido narrativo definido por el sistema debe servir como secuencia para la salida estática.

---

# 9. Proyectos considerados pero no priorizados

## reveal.js

Repositorio:

https://github.com/hakimel/reveal.js

### Ventajas

Es extremadamente maduro y dispone de:

- nested slides;
- Markdown;
- Auto-Animate;
- PDF;
- API extensa;
- ecosistema de plugins;
- soporte de LaTeX;
- código;
- navegación consolidada.

### Problema

Su abstracción central sigue siendo una presentación basada en diapositivas.

Transformarlo en un sistema de navegación espacial probablemente implicaría modificar profundamente una arquitectura diseñada para otro modelo.

### Conclusión actual

Puede servir como referencia para capacidades auxiliares, pero no se considera la mejor base para el núcleo espacial.

---

## Slidev

Repositorio:

https://github.com/slidevjs/slidev

### Ventajas

- maduro;
- TypeScript;
- buen ecosistema;
- excelente experiencia code-first;
- integración con Markdown;
- pensado para desarrolladores.

### Problema

Introduce:

- Vue;
- Markdown como elemento central;
- un modelo fundamentalmente lineal de presentación.

No ofrece una ventaja clara frente a Open Slide para nuestros requisitos.

---

## tldraw

Repositorio:

https://github.com/tldraw/tldraw

### Ventajas

Es uno de los motores de infinite canvas más completos disponibles.

Tiene:

- cámara;
- formas;
- extensibilidad;
- runtime API;
- contenido DOM;
- herramientas;
- imágenes;
- vídeo;
- capacidades avanzadas de canvas.

### Problemas

Su alcance es mucho mayor que el necesario.

Incorporaría de entrada:

- whiteboard;
- herramientas de dibujo;
- edición avanzada;
- sistema de shapes;
- selección;
- bindings;
- UI compleja;
- infraestructura de colaboración potencial.

Además, su licencia actual debe revisarse cuidadosamente antes de considerar uso en producción.

### Conclusión actual

Técnicamente potente, pero probablemente sobredimensionado para esta fase.

---

## Konva

Repositorio:

https://github.com/konvajs/konva

Es un scene graph basado en HTML5 Canvas orientado a:

- graphics;
- design editors;
- whiteboards;
- diagramas.

Permite transformaciones, eventos, drag & drop, animaciones y exportación.

El problema es que trabaja a un nivel de rendering inferior al que necesitamos actualmente.

Adoptarlo implicaría construir más infraestructura propia de presentación.

---

## Motion Canvas

Repositorio:

https://github.com/motion-canvas/motion-canvas

Es una herramienta muy potente para visualizaciones y animaciones programáticas.

Sin embargo, su objetivo está más próximo a:

- animaciones;
- vídeos;
- visualización sincronizada;
- secuencias temporales.

No parece el mejor núcleo para una aplicación de presentaciones espaciales interactiva.

---

## Univer Slides

También se consideró conceptualmente por disponer de infraestructura de edición de presentaciones.

Sin embargo:

- está integrado en una suite Office mucho mayor;
- el objetivo principal no es un canvas espacial;
- incorporar la suite completa introduciría una complejidad elevada;
- determinadas funciones avanzadas de importación/exportación dependen de capacidades comerciales.

No se considera actualmente una base prioritaria.

---

# 10. Hipótesis arquitectónica inicial

La combinación más prometedora identificada hasta ahora es:

```text
Sistema propio
│
├── infraestructura de presentación
│   └── Open Slide
│       ├── React + TypeScript
│       ├── slide canvas
│       ├── assets
│       ├── desarrollo
│       ├── modo presentación
│       ├── build
│       └── exportación
│
├── Spatial Engine propio
│   ├── modelo del lienzo
│   ├── posiciones
│   ├── bloques
│   ├── layouts
│   ├── estados
│   ├── visibilidad
│   └── recorrido narrativo
│
├── Camera Engine
│   ├── estudiar/adaptar impress.js
│   └── o construirlo sobre d3-zoom
│
└── Content Transitions
    └── Motion
```

Esto no debe considerarse todavía una decisión arquitectónica definitiva.

Es la hipótesis que debe validar el agente.

---

# 11. Qué debe investigar el agente antes de implementar

El siguiente paso no debería ser comenzar directamente a programar la aplicación.

Debe realizarse una auditoría técnica breve de los candidatos principales.

## 11.1 Open Slide

Analizar:

- estructura interna de `packages/core`;
- cómo se registran las diapositivas;
- cómo funciona el runtime;
- cómo funciona la navegación;
- cómo se realiza el escalado;
- cómo se construye el modo presentación;
- cómo funciona la exportación PDF;
- cómo funciona la exportación HTML;
- acoplamiento entre navegación y representación de slides;
- posibilidad de sustituir el navegador lineal;
- posibilidad de reutilizar el resto del core.

Responder específicamente:

> ¿Es mejor hacer fork de Open Slide, utilizar `@open-slide/core` como dependencia o reutilizar selectivamente su código?

---

## 11.2 impress.js

Analizar:

- modelo de coordenadas;
- cálculo de transforms;
- cálculo del viewport;
- movimiento de cámara;
- `goto`;
- overview;
- escalado;
- eventos;
- estados `past/present/future`;
- plugins relevantes para navegación.

Responder:

> ¿Qué partes concretas de impress.js merece la pena adaptar y cuáles serían más sencillas de implementar de nuevo en TypeScript?

---

## 11.3 d3-zoom

Probar conceptualmente si permite implementar de forma limpia:

```text
goTo(position)
fit(element)
fit(group)
overview()
zoomTo(scale)
```

Evaluar si simplifica suficientemente la cámara como para evitar adaptar código de impress.js.

---

## 11.4 Motion

Confirmar que puede encargarse únicamente de las transiciones internas sin acoplarse a la cámara.

---

## 11.5 Exportación

Comprobar si la exportación de Open Slide puede seguir utilizándose cuando la presentación:

- tenga un lienzo espacial;
- utilice estados;
- tenga un recorrido narrativo diferente de la posición espacial.

Si no resulta viable, evaluar DeckTape u otra solución equivalente.

---

# 12. Criterios para la decisión

La selección técnica debería favorecer:

1. **reutilización real de código**, no únicamente inspiración;
2. **arquitectura comprensible para Codex**;
3. **TypeScript cuando sea razonable**;
4. **dependencias pequeñas para problemas pequeños**;
5. **evitar introducir un editor visual antes de necesitarlo**;
6. **mantener separado el modelo espacial del contenido de una diapositiva**;
7. **mantener separado el movimiento de cámara de las transiciones internas**;
8. **preservar la posibilidad de exportar una secuencia estática**;
9. **evitar acoplar el sistema a una disposición concreta**;
10. **priorizar mantenibilidad frente a una demo rápida**.

---

# 13. Resultado esperado de la siguiente investigación

Antes de implementar el sistema, el agente debería producir una decisión documentada aproximadamente con esta forma:

```text
Base seleccionada:
- Open Slide / propia / otra

Estrategia de integración:
- fork / dependencia / extracción de módulos

Motor espacial:
- adaptación de impress.js / d3-zoom / propio

Transiciones internas:
- Motion / CSS / otra solución

Exportación:
- Open Slide / DeckTape / otra

Código que se reutiliza:
- ...

Código que se implementa:
- ...

Dependencias iniciales:
- ...

Dependencias descartadas:
- ...

Riesgos:
- ...

Primer bloque de implementación:
- ...
```

Solo después de esta decisión debería comenzar la construcción del núcleo.

---

# 14. Conclusión provisional

La principal conclusión de esta investigación es que **no parece necesario construir el sistema completo desde cero**.

Existe infraestructura madura que puede encargarse de gran parte de las capacidades periféricas.

La dirección inicial más prometedora es:

> utilizar o adaptar Open Slide como infraestructura de presentación y concentrar el desarrollo propio en el modelo espacial, la cámara, los bloques, los estados y el recorrido narrativo.

`impress.js` debe estudiarse como referencia técnica del comportamiento espacial.

`d3-zoom` puede ofrecer una implementación moderna y pequeña para la cámara.

Motion puede resolver de forma independiente las transiciones internas.

React Flow, tldraw y otras soluciones de infinite canvas siguen siendo alternativas posibles, pero actualmente parecen introducir más infraestructura de edición de la que los requisitos justifican.

La primera tarea del agente debe ser validar esta hipótesis inspeccionando el código real de los proyectos señalados antes de fijar la arquitectura.

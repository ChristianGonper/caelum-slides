# Requisitos y decisiones de la presentación concreta — extracción de la reunión

## Propósito

Este documento recoge únicamente las decisiones, requisitos, propuestas visuales y condicionantes que en la reunión se referían a **esta presentación concreta**.

No define requisitos generales del sistema de diapositivas. Es un documento de entrada para que el agente pueda construir esta presentación utilizando el sistema.

Se han excluido deliberadamente:
- el guion hablado;
- frases concretas que se propusieron decir de viva voz;
- refinamientos de redacción;
- formulaciones exactas de textos de las diapositivas;
- discusiones puramente técnicas o comerciales que no afectan a cómo debe construirse o presentarse visualmente el deck.

Sí se conservan decisiones sobre estructura, recorrido, agrupación, transiciones, jerarquía visual, fondos, estilo gráfico, imágenes, elementos persistentes, densidad de información, elementos del equipo, cierre y formato de entrega.

Para evitar convertir ideas tentativas en obligaciones, cada punto se marca como:
- **Acordado**: la reunión termina aceptándolo.
- **Dirección aceptada**: se acepta la idea general, pero quedan detalles de diseño por resolver.
- **Abierto**: se discutió como posibilidad y no quedó cerrada.

---

# 1. Arranque de la presentación

## 1.1 Comenzar desde negro

**Estado: Acordado**

La presentación debe comenzar con la pantalla completamente negra.

Desde ese estado se pasa a la primera escena/diapositiva.

La intención es que el inicio tenga un carácter deliberado y no muestre desde el primer instante la estructura espacial completa.

---

# 2. Primer bloque: apariencia inicialmente convencional

## 2.1 Las dos primeras diapositivas deben sentirse inicialmente como una presentación normal

**Estado: Acordado**

Las dos primeras diapositivas deben mostrarse a pantalla completa y el paso entre ellas no debe revelar todavía el comportamiento espacial completo.

La intención explícita era generar un pequeño factor sorpresa:
1. comenzar como si fuese una presentación convencional;
2. pasar entre las primeras diapositivas de forma contenida;
3. revelar después el lienzo espacial mediante un zoom out.

## 2.2 Transición entre las dos primeras diapositivas

**Estado: Dirección aceptada**

La transición se planteó como una transición convencional de diapositiva, sin movimiento espacial importante de cámara.

Se mencionó como ejemplo una transición vertical, similar a que una diapositiva suba para dar paso a la siguiente.

No quedó fijado que tenga que ser exactamente ese efecto concreto; lo relevante es que:
- no debe parecer todavía un desplazamiento por el mapa;
- debe sentirse más cercana a una presentación convencional;
- el movimiento espacial principal se reserva para el momento posterior.

## 2.3 Relación espacial entre las dos primeras diapositivas

**Estado: Acordado conceptualmente**

Para que ambas puedan comportarse como un mismo punto del recorrido espacial, deben considerarse parte del mismo bloque/posición.

En la conversación se describe como tenerlas "una encima de otra" o "stacked".

No deben aparecer inicialmente como dos puntos alejados del mapa y luego fingir que comparten posición.

---

# 3. Revelación del mapa espacial

## 3.1 El mapa se revela después de las primeras diapositivas

**Estado: Acordado**

Tras el bloque inicial, debe producirse un **zoom out** que revele la organización general de la presentación.

Este es uno de los momentos visuales principales del deck.

La transición debe hacer evidente que las diapositivas vistas hasta ese momento pertenecían en realidad a una estructura espacial mayor.

## 3.2 Organización general en torno a un centro

**Estado: Acordado**

La vista general debe organizar los bloques alrededor de una zona central.

La estructura se describió como aproximadamente circular.

No es necesario que visualmente exista un círculo dibujado; el requisito es la disposición alrededor de un centro.

## 3.3 Recorrido horario

**Estado: Acordado**

Los bloques deben colocarse siguiendo el orden narrativo en sentido de las agujas del reloj.

La zona superior, equivalente aproximadamente a las 12 en un reloj, corresponde al comienzo del recorrido.

## 3.4 Organización por bloques

**Estado: Acordado**

La presentación no debe mostrar cada diapositiva como una unidad espacial completamente independiente.

Algunas partes forman bloques de varias diapositivas.

Cuando dos diapositivas pertenecen al mismo bloque:
- deben percibirse juntas;
- pueden compartir la misma posición espacial;
- pueden representarse como una pila;
- la navegación entre ellas puede realizarse sin desplazar la cámara a otra región del lienzo.

Se mencionó explícitamente que el bloque del equipo contiene dos diapositivas.

## 3.5 Visibilidad del conjunto en el overview

**Estado: Dirección aceptada**

Al hacer zoom out debe entenderse el conjunto completo de la presentación y la relación entre sus bloques.

Se discutió el deseo de que las diapositivas pertenecientes a un mismo bloque siguieran siendo perceptibles en la vista general.

La forma exacta de representar simultáneamente la pila y sus elementos no quedó cerrada, por lo que el agente puede resolverlo de forma coherente con el sistema.

---

# 4. Elemento central / portada integrada en el mapa

## 4.1 El centro debe contener información propia

**Estado: Acordado**

La zona central de la vista general no debe quedar vacía.

Debe actuar como una especie de **portada integrada en el mapa**.

No tiene por qué existir como una diapositiva independiente dentro del recorrido.

## 4.2 Función del centro

**Estado: Acordado**

El contenido central debe servir para identificar la presentación/proyecto/convocatoria de manera equivalente a una portada.

Se descartó sobrecargar esa zona con información que ya aparecerá después en la diapositiva del equipo.

Por tanto:
- debe ser claramente identificativa;
- debe ser breve;
- no debe competir visualmente con los bloques que la rodean.

## 4.3 Forma concreta del elemento central

**Estado: Abierto en la primera vista**

Se discutió si el centro debía ser:
- simplemente texto;
- una forma geométrica;
- una forma relacionada con un dron.

No quedó fijada una geometría concreta para la **vista central inicial**.

La representación de dron/octocóptero sí adquirió más fuerza posteriormente para el cierre.

---

# 5. Fondo global del mapa

## 5.1 El mapa debe tener un fondo propio

**Estado: Acordado**

La vista espacial general debe disponer de un fondo global.

## 5.2 El fondo no debe distraer

**Estado: Acordado**

El fondo debe ser suficientemente discreto como para que:
- las diapositivas sigan siendo protagonistas;
- el elemento central pueda leerse;
- el movimiento de zoom no genere ruido visual;
- la composición no se vuelva demasiado pequeña o confusa cuando la cámara se aleja.


## 5.3 Debe ser coherente con la paleta general

**Estado: Acordado**

Si se utiliza una imagen o ilustración de fondo, debe integrarse con la paleta de color elegida para el conjunto de la presentación.

No debe introducir una estética o gama cromática ajena al resto del deck.

## 5.4 El fondo debe relacionarse preferentemente con Caelum/el sistema, no con ESA de forma genérica

**Estado: Dirección aceptada**

Durante la discusión se descartó orientar el fondo principalmente hacia imágenes genéricas de ESA/lanzamientos.

La dirección preferida es que el fondo visual hable de:
- la empresa;
- el sistema;
- el prototipo;
- su integración en plataformas.

---

# 6. Lenguaje visual del sistema y del prototipo

## 6.1 Estética general: blueprint / boceto / delineado

**Estado: Acordado**

Para los elementos técnicos relacionados con el producto debe utilizarse un estilo:
- minimalista;
- delineado;
- de boceto;
- tipo blueprint/plano técnico.

No se busca una ilustración hiperrealista o excesivamente detallada.


## 6.2 Diferenciar plataforma y producto

**Estado: Acordado**

La reunión establece una distinción visual útil:
- los drones/plataformas pueden mostrarse como aeronaves normales, aunque manteniendo coherencia gráfica;
- el sistema propio de Caelum debe aparecer más claramente como **prototipo**, mediante tratamiento de boceto/delineado.

La intención es que visualmente se entienda que Caelum desarrolla el sistema, no necesariamente la aeronave completa.

## 6.3 El sistema debe ser el elemento visual protagonista

**Estado: Acordado**

Si se representan drones con el sistema integrado, debe quedar claro que:
- el sistema va montado en el dron;
- el foco visual está en el sistema;
- la aeronave actúa principalmente como contexto de integración.

## 6.4 Evitar exceso de detalle técnico en la ilustración

**Estado: Acordado**

Las referencias visuales existentes tenían demasiado detalle para funcionar como fondo o gráfico principal a gran escala.

La versión utilizada en la presentación debe simplificarse claramente.

---

# 7. Paleta de color

## 7.1 Utilizar una paleta coherente en toda la presentación

**Estado: Acordado**

La presentación debe construirse con una paleta definida y consistente.

La reunión da por supuesto que existe una paleta que debe respetarse también al seleccionar o generar imágenes y fondos.

La definición técnica de la paleta se proporciona aparte al agente.

## 7.2 Fondos, ilustraciones y contenido deben respetar esa misma identidad

**Estado: Acordado**

No se deben introducir imágenes visualmente atractivas si rompen la identidad cromática general.

La coherencia con la paleta tiene prioridad sobre utilizar una imagen concreta.

---

# 8. Numeración y elemento persistente

## 8.1 Numerar todas las diapositivas

**Estado: Acordado**

Todas las diapositivas deben estar numeradas.

Hubo una propuesta inicial de excluir las primeras diapositivas más visuales, pero se descartó: el acuerdo final fue numerarlas todas, aunque en las primeras el número pueda ser muy discreto.

## 8.2 Añadir un elemento persistente de identidad

**Estado: Acordado**

Debe existir un elemento persistente tipo footer/header que identifique la presentación y la convocatoria/proyecto.

Debe convivir con la numeración.

## 8.3 Posición concreta

**Estado: Abierto**

Se discutió colocarlo:
- abajo como footer;
- en un lateral;
- eventualmente arriba como header.

No quedó fijada la ubicación exacta.

Debe resolverse según la composición, manteniéndolo:
- discreto;
- consistente;
- poco intrusivo.

---

# 9. Densidad y composición del contenido

Estos puntos no fijan textos concretos; fijan cómo debe presentarse la información.

## 9.1 Evitar diapositivas excesivamente textuales

**Estado: Acordado**

A lo largo de la revisión se detectó repetidamente exceso de texto.

La presentación debe favorecer:
- jerarquía;
- puntos breves;
- elementos gráficos;
- explicación oral;

frente a párrafos extensos.

## 9.2 Diapositiva de alternativas/competencia técnica

**Estado: Acordado**

La diapositiva que compara distintos tipos de soluciones debe simplificarse visualmente.

En lugar de bloques densos de texto, las alternativas deben aparecer como elementos breves y estructurados, por ejemplo mediante una lista de puntos o bloques diferenciados.

Los detalles que solo sean necesarios durante la exposición se cuentan oralmente y no se cargan en la diapositiva.

## 9.3 Evitar información duplicada entre diapositivas

**Estado: Acordado**

Especialmente entre mercado, competencia y explicación técnica, debe evitarse repetir visualmente la misma información en varias diapositivas.

Cada diapositiva debe tener una función clara.

## 9.4 Reducir detalles técnicos ya entregados por escrito

**Estado: Acordado**

La presentación no debe reproducir todos los detalles que ya constan en documentación formal entregada al evaluador.

Se acordó retirar detalles redundantes para agilizar la presentación.

---

# 10. Diapositiva del equipo

## 10.1 El bloque del equipo consta de dos diapositivas

**Estado: Acordado**

Las dos diapositivas del equipo deben considerarse un mismo bloque espacial.

Por tanto, deben poder recorrerse sin que parezcan dos regiones independientes del mapa.

## 10.2 Incorporar fotografías de perfil

**Estado: Acordado**

La diapositiva del equipo debe incluir fotografías de perfil de los integrantes.

Durante la reunión se solicitó expresamente la fotografía que faltaba.

## 10.3 Tratamiento consistente de las fotografías

**Estado: Dirección implícita**

Al incorporar las fotografías debe conservarse la relación de aspecto y mantener un tratamiento visual homogéneo.

La discusión durante la reunión mostró preocupación por no deformar imágenes y por mantener tamaños/recortes coherentes.

No se fijó una plantilla exacta.

---

# 11. Logos y apoyos institucionales

## 11.1 Mostrar únicamente relaciones institucionales defendibles

**Estado: Acordado**

Cuando se utilicen logotipos o referencias institucionales, deben corresponder a relaciones que puedan justificarse.

No deben utilizarse logotipos que puedan interpretarse visualmente como un respaldo formal inexistente.

## 11.2 No usar la acumulación de logos como decoración

**Estado: Dirección aceptada**

La selección debe ser intencional y veraz.

La reunión cuestionó específicamente varios logos porque su mera presencia podía transmitir una relación mayor de la realmente existente.

Para el agente, esto implica que la diapositiva de apoyos/red institucional debe priorizar claridad y precisión frente a llenar espacio con marcas.

---

# 12. Presentación visual de financiación y estructura empresarial

## 12.1 Las categorías deben percibirse claramente separadas

**Estado: Acordado**

La parte de financiación debe mostrar categorías conceptualmente distintas como grupos diferenciados, en lugar de agruparlas bajo una categoría genérica.

Esto es también una instrucción visual: la estructura gráfica debe hacer evidente que son vías diferentes.

## 12.2 La diapositiva del equipo debe mostrar responsabilidades complementarias

**Estado: Acordado**

La distribución de roles debe permitir entender visualmente que el equipo no es únicamente técnico y que existen responsabilidades de gestión/proyecto/finanzas.

No se fija aquí el texto exacto de esos roles.

---

# 13. Cierre de la presentación

## 13.1 Volver al centro del mapa

**Estado: Acordado**

La presentación debe cerrar volviendo espacialmente al centro.

No se plantea terminar simplemente en la última diapositiva periférica.

La vuelta al centro sirve para cerrar visualmente el recorrido iniciado con el overview.

Referencia: ~01:37:19–01:38:29.

## 13.2 El centro debe cambiar de estado

**Estado: Acordado**

Al regresar al centro, el contenido central no debe ser exactamente el mismo que al principio.

Debe convertirse en un estado final de cierre/contacto.

Esto evita introducir necesariamente una diapositiva final completamente separada.

## 13.3 El cierre debe mantener información útil durante preguntas

**Estado: Acordado**

La última vista debe quedarse en pantalla durante preguntas y facilitar el seguimiento posterior.

Debe contener, como mínimo a nivel funcional:
- identidad del proyecto/empresa;
- identificación del equipo;
- vías de contacto.

No se fija aquí la redacción concreta.

---

# 14. Contacto y QR

## 14.1 Incorporar enlaces a perfiles profesionales

**Estado: Acordado**

Se propuso utilizar LinkedIn como vía de contacto inmediata mientras no exista una infraestructura corporativa definitiva.

## 14.2 Utilizar códigos QR

**Estado: Acordado**

La vista final debe poder incluir códigos QR asociados a los perfiles profesionales.

Se acordó que los QR pueden generarse directamente, sin depender de un servicio externo.

## 14.3 Composición propuesta

**Estado: Dirección aceptada**

Se planteó mostrar:
- nombre de cada integrante;
- su QR cercano/asociado;
- acceso a su perfil profesional.

Se mencionó como posibilidad colocar el QR a la izquierda del nombre.

La composición exacta queda abierta.

---

# 15. Motivo visual del cierre: dron/octocóptero

## 15.1 Reutilizar la forma de una aeronave vista en planta

**Estado: Dirección aceptada con bastante apoyo**

Para la vista final se propuso que la composición central adopte la forma esquemática de un dron visto desde arriba.

La propuesta evolucionó hacia un **octocóptero** si el número de elementos encaja.

## 15.2 Relacionar las partes del dron con el recorrido anterior

**Estado: Dirección aceptada**

La idea es que:
- el cuerpo central actúe como núcleo;
- los brazos/rotores se relacionen visualmente con los bloques o diapositivas anteriores.

No debe interpretarse necesariamente como un diagrama técnico real de un octocóptero; funciona como motivo gráfico de cierre.

## 15.3 Representación vectorial y simplificada

**Estado: Acordado para esta propuesta**

Si se implementa el octocóptero:
- debe ser un SVG sencillo;
- construido mediante líneas;
- estilo delineado/boceto;
- coherente con el lenguaje blueprint del resto de la presentación.

## 15.4 Vistas del producto alrededor

**Estado: Abierto / propuesta**

Se propuso acompañar el motivo central con distintas vistas del producto en zonas laterales.

Estas vistas podrían derivarse de fotografías o imágenes existentes, pero tratadas de forma:
- simplificada;
- delineada;
- coherente con el prototipo.

No quedó como obligación cerrada.

---

# 16. Relación entre apertura y cierre

**Estado: Dirección conceptual aceptada**

La presentación debe tener cierta simetría narrativa y espacial:

```text
inicio oscuro
    ↓
primeras diapositivas convencionales
    ↓
revelación del mapa
    ↓
recorrido espacial por bloques
    ↓
vuelta al centro
    ↓
estado final de contacto
```

Esta estructura es importante porque el uso de la navegación espacial no debe ser únicamente decorativo: debe ayudar a dar sensación de apertura, recorrido y cierre.

---

# 17. Formato de entrega y ejecución

## 17.1 Presentación principal interactiva

**Estado: Acordado**

La versión principal debe funcionar como aplicación HTML/web.

Para la presentación real puede ejecutarse mediante servidor local si es necesario.

## 17.2 Versión revisable

**Estado: Acordado**

Debe existir una versión que el resto del equipo pueda abrir y revisar con facilidad antes de la reunión final.

En la reunión se planteó un HTML autocontenido para revisión.

## 17.3 PDF de respaldo

**Estado: Acordado**

Debe generarse también una versión PDF estática como respaldo.

La versión PDF no necesita reproducir los movimientos espaciales; debe conservar una secuencia comprensible de las vistas/diapositivas.

## 17.4 La aplicación no debe construirse como un único archivo monolítico

**Estado: Acordado**

Aunque pueda generarse una versión autocontenida para revisión o distribución, el proyecto fuente debe estar estructurado correctamente.

No debe sacrificarse la arquitectura del código para producir un único HTML.

Referencia: ~01:47:36–01:48:41.

---

# 18. Decisiones que NO deben interpretarse como requisitos cerrados

El agente debe evitar convertir automáticamente en obligación los siguientes puntos:

- dibujar un círculo visible alrededor del centro;
- utilizar una imagen fotográfica concreta de fondo;
- utilizar una imagen de ESA o de un lanzamiento;
- representar el elemento central inicial con una geometría concreta;
- separar visualmente en el overview todos los estados que comparten una pila;
- utilizar exactamente una transición vertical entre las dos primeras diapositivas;
- colocar el footer exactamente abajo o exactamente a la izquierda;
- colocar los QR exactamente a la izquierda del nombre;
- usar obligatoriamente las vistas laterales del producto en el cierre;
- usar un octocóptero si la cantidad/estructura real de bloques hace que la composición no tenga sentido.

En estos casos debe conservarse la intención visual y resolver la implementación concreta de forma coherente.

---

# 19. Resumen operativo para el agente

La presentación debería construirse aproximadamente con este comportamiento:

```text
1. Pantalla negra.

2. Primera diapositiva a pantalla completa.

3. Segunda diapositiva del mismo bloque,
   con transición convencional y sin revelar todavía el mapa.

4. Zoom out:
   se revela el lienzo espacial completo.

5. Overview:
   - centro con función de portada;
   - bloques alrededor;
   - recorrido horario;
   - fondo discreto y coherente con la paleta;
   - identidad visual blueprint/delineada.

6. Recorrido:
   - zoom hacia cada bloque;
   - navegación interna en pilas cuando haya varias diapositivas;
   - regreso al contexto cuando corresponda;
   - mantener numeración y elemento persistente.

7. Contenido:
   - baja densidad textual;
   - evitar duplicaciones;
   - priorizar jerarquía visual y exposición oral;
   - gráficos técnicos simplificados;
   - producto en estilo prototipo/boceto.

8. Equipo:
   - dos diapositivas dentro del mismo bloque;
   - fotografías de perfil coherentes.

9. Final:
   - volver al centro;
   - sustituir el estado inicial por un cierre/contacto;
   - nombres + acceso profesional mediante QR;
   - explorar motivo de dron/octocóptero en SVG delineado.

10. Entrega:
    - aplicación web/HTML;
    - versión revisable;
    - PDF estático de respaldo;
    - código fuente estructurado, no monolítico.
```
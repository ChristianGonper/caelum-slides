# Presentación Caelum Systems · ESA BIC 2026

Estado: **primer borrador para discutir**, 30 de septiembre de 2026. Define la presentación que queremos conseguir; todavía no autoriza un plan de implementación, código ni producción de imágenes.

Condiciones confirmadas por el usuario en esta conversación: **10 minutos de exposición, Guillermo como presentador y preguntas aparte; conservación literal de los textos visibles; disponibilidad inicial de las tres paletas existentes en el sistema**.

## 1. Propósito y resultado esperado

Presentar Caelum Systems ante la audiencia de ESA BIC Castilla y León 2026, tomando como contenido de partida el material de Google Slides recogido en las notas. La presentación debe permitir entender el problema de respuesta frente a UAS en instalaciones sensibles, la propuesta acústica R.A.R., su conexión con el segmento terreno espacial, el camino hacia una actividad empresarial y las capacidades del equipo.

La experiencia empieza con una situación concreta, descubre después una organización espacial y termina recuperando su centro como lugar de identidad y contacto. El mapa debe ayudar a entender el recorrido. Las escenas ampliadas deben funcionar como diapositivas legibles durante una exposición oral.

El documento se mantendrá como definición de esta presentación. Las decisiones sobre el sistema general siguen perteneciendo a `system/`. Al aceptar esta definición, el siguiente paso será convertirla en un plan separado para construir y revisar el deck.

## 2. Fuentes y estado de las decisiones

- [Notas.md](Notas.md): contenido visible, guion hablado, imágenes previstas e instrucciones procedentes de Slides.
- [Requisitos de la reunión](requisitos-presentacion-concreta-reunion.md): acuerdos sobre experiencia, composición y entrega, con su grado de cierre.
- [Transcripción de la reunión](raw-sources/Reunion-pptx-ESA-BIC.md): contexto para aclarar discrepancias. Sus fechas de entrega no constituyen un calendario nuevo.
- [Petición inicial de Guillermo](raw-sources/Peticion-version-1-guillermo.txt): antecedente del recorrido circular y de la agrupación para reducir movimiento.
- [Requisitos del sistema](../../system/docs/requisitos-sistema-diapositivas.md), [hoja de ruta](../../system/docs/hoja-de-ruta-sistema-diapositivas.md) y temas de `system/themes/`: marco disponible, sin trasladar aquí la definición del motor.

**Acordado** identifica lo ya aceptado en la reunión. **Propuesta** identifica una solución de este borrador que debemos discutir. **Pendiente** identifica una decisión o material que aún falta. Las propuestas no se convierten en acuerdos por aparecer en este documento.

Para esta definición, las notas se usan como base de contenido y las capturas como contraste visual. La extracción de la reunión orienta el comportamiento y la composición. La decisión actual del usuario de conservar los textos prevalece sobre propuestas anteriores de reducirlos, eliminar duplicaciones o cambiar formulaciones. Si las fuentes difieren, se explica la discrepancia antes de cerrar la decisión. El guion no se convierte automáticamente en texto de pantalla.

Los recursos están disponibles localmente. Se han inspeccionado las diez capturas de `TEB_slides/` y las referencias `system-views.png` y `multi-drone-mounting.png`. La captura 3 está en blanco, coherentemente con su función de instrucción de navegación en las notas. Las capturas muestran una base convencional, principalmente blanca y textual: son referencia de contenido y composición de partida, no una obligación de conservar ese fondo al usar los temas del sistema.

### Conservación del contenido

Todos los títulos, subtítulos, frases, roles y referencias visibles se conservan literalmente, incluida la frase final. Se permite cambiar su ubicación, saltos de línea, tipografía, peso, color y relación con imágenes. No se permite resumir, sustituir, omitir, traducir ni añadir afirmaciones como solución de diseño. Los textos completos permanecen en [Notas.md](Notas.md), contrastados con las capturas; no se duplican aquí como una segunda versión editable del copy.

Las etiquetas nuevas de mapa, la identidad persistente y los contactos son contenido funcional adicional requerido por la experiencia. Se acordarán sin sustituir los textos existentes. Si aparece una discrepancia literal entre captura y notas, se señalará antes de fijar ese fragmento.

Una revelación progresiva puede ayudar a jerarquizar la lectura, siempre que no elimine texto y que la representación estática contenga todo el contenido. Tampoco se trasladará texto visible exclusivamente al guion para reducir densidad.

## 3. Idea de conjunto

**Acordado:** apertura negra, primeras dos escenas convencionales, revelación por zoom out, bloques alrededor de un centro, recorrido horario y regreso final a ese centro con contenido distinto.

**Propuesta:** seis bloques periféricos y un centro con dos estados. La organización conserva el orden de las notas y agrupa las dos aperturas y las dos escenas del equipo. Cada bloque responde a una pregunta del relato:

| Bloque | Material de las notas | Función | Posición orientativa |
| --- | --- | --- | --- |
| A · Contexto | 1 y 2 | Presentar la amenaza y acercarla al segmento terreno espacial | Arriba, a las 12 |
| B · Brecha de respuesta | 4 | Explicar la dificultad de intervenir sin comprometer la instalación | Arriba a la derecha |
| C · R.A.R. | 5 | Explicar el efector acústico y su lugar en la cadena de respuesta | Abajo a la derecha |
| D · Aplicación espacial y mercado | 6 | Delimitar el ámbito inicial y la propuesta de valor | Abajo |
| E · Viabilidad y negocio | 7 | Mostrar cómo se propone avanzar hacia una empresa | Abajo a la izquierda |
| F · Equipo y red | 8 y 9 | Mostrar responsables y relaciones que ayudan a madurar el proyecto | Arriba a la izquierda |
| Centro | Instrucción 3 y cierre 10 | Identificar el proyecto al revelar el mapa y ofrecer contacto al terminar | Centro |

Las posiciones expresan relaciones, no coordenadas de implementación. Se propone una distribución aproximadamente equidistante, ajustada a un encuadre horizontal para que el conjunto tenga tamaño suficiente. Todos los textos se mantienen derechos: la disposición circular no implica girar las diapositivas.

La instrucción «3» no añade una diapositiva de contenido. El cierre «10» se traslada al estado final del centro. Esta propuesta contiene ocho escenas de contenido periférico y un cierre central, además de las vistas de contexto y el estado negro. La numeración de las notas se conserva como referencia de origen, sin asumir que deba ser la numeración final.

## 4. Recorrido y ritmo

| Momento | Qué ve la audiencia | Qué ocurre al avanzar |
| --- | --- | --- |
| Inicio | Pantalla completamente negra | Aparece la planta nuclear |
| Apertura 1 | Fotografía de la planta a pantalla completa | Cambia a la estación sin descubrir el mapa |
| Apertura 2 | Fotografía de las antenas a pantalla completa | La cámara se aleja y revela el conjunto |
| Primera vista general | Centro identificativo y seis bloques reconocibles | Se entra en la brecha de respuesta |
| Bloques B a E | Una escena ampliada por bloque | Se recupera el contexto y se entra en el siguiente bloque |
| Equipo | Retratos y responsabilidades | Cambia a la red institucional sin mover la cámara |
| Red institucional | Relaciones descritas con precisión | La cámara recupera el mapa y vuelve al centro |
| Cierre | Identidad, integrantes y contactos | La vista queda estable durante preguntas |

**Propuesta:** fundido breve entre las dos aperturas. La transición vertical sigue siendo una alternativa admitida por la reunión, no una obligación. En ambos casos debe mantenerse el encuadre y reservarse la sorpresa espacial para después de las antenas.

**Propuesta:** entre bloques, un movimiento continuo de salida, reconocimiento del mapa y entrada. La primera vista general sí tendrá una pausa deliberada para identificar Caelum; las vueltas posteriores no necesitan detener la exposición en una portada repetida. Falta decidir si cada vuelta al mapa requerirá una pulsación adicional o será parte del avance al siguiente bloque.

Dentro de las dos pilas, la cámara permanece quieta. En las escenas ampliadas, solo el contenido del bloque activo ocupa el foco de lectura. La velocidad debe permitir reconocer origen y destino sin alargar el discurso. Las duraciones de animación deberán comprobarse con la presentación real dentro de los diez minutos disponibles.

**Propuesta de reparto para ensayar**, con transiciones incluidas: apertura y revelación 1:30; brecha de respuesta 1:10; R.A.R. 2:00; aplicación y mercado 1:10; viabilidad y negocio 1:45; equipo y red 1:40; cierre 0:25. Total: 9:40, con 20 segundos de margen. Las preguntas quedan fuera de este reparto. No implica reescribir el guion ni convertirlo en un cronómetro automático.

El cierre no avanza automáticamente, no inicia un bucle y no necesita música ni sonido. Durante preguntas debe ser posible volver a una escena y recuperar después el cierre con sus contactos.

## 5. Aspecto del mapa y del centro

### Vista general

**Propuesta:** fondo oscuro discreto, con trazos técnicos simplificados relacionados con R.A.R. o su integración. Las fotografías completas quedan reservadas principalmente para las escenas; el mapa necesita una base tranquila sobre la que se lean los bloques.

Cada bloque tendrá una representación reconocible y una etiqueta corta. Las etiquetas de trabajo son `Context`, `Response gap`, `R.A.R.`, `Space application`, `Business` y `Team`. Se propone mostrar una imagen o composición representativa por bloque, evitando pedir al público que lea miniaturas de todos los textos.

En los bloques A y F, un segundo plano ligeramente desplazado o dos pequeñas referencias visuales deben indicar que contienen dos escenas. La pila es un indicio de agrupación, no una segunda escena completa compitiendo por lectura. La vista general debe seguir mostrando el mismo conjunto al cambiar estados durante el recorrido.

No se propone un círculo dibujado obligatorio ni una interfaz de tarjetas, botones o indicadores de progreso añadidos al contenido. El orden puede entenderse por la colocación y por el movimiento.

### Centro inicial

**Propuesta:** identidad tipográfica sencilla, con `Caelum Systems`, un descriptor breve en inglés basado en el sistema acústico counter-UAS y `ESA BIC 2026 · Castilla y León`. El descriptor exacto queda pendiente de revisión.

Las notas pedían también los nombres en el centro; la reunión posterior aconsejaba evitar sobrecargarlo con información del equipo. Se propone reservar los nombres completos para equipo y cierre. Este ajuste necesita aceptación explícita al revisar el borrador.

### Centro final y motivo de aeronave

**Acordado:** al terminar se vuelve al centro, se cambia su contenido y se muestran identidad, equipo y contacto profesional mediante QR.

**Propuesta:** acercarse lo suficiente al centro final para que se lean los nombres y puedan escanearse los tres QR. El mapa puede seguir aportando contexto alrededor, pero los contactos tienen prioridad sobre conservar todos los bloques en pantalla.

El motivo de dron visto en planta puede relacionar el centro con los bloques mediante líneas simplificadas. Con seis bloques no se fuerza un octocóptero de ocho posiciones: se propone una forma esquemática de seis brazos si se acepta esa correspondencia. Una alternativa es conservar el octocóptero como motivo independiente, sin atribuir un bloque a cada rotor. Ninguna variante añade contenido al relato solo para completar la geometría.

La aeronave funciona como recurso gráfico, no como una especificación de la plataforma que Caelum fabrica. Si se acepta el motivo, conservará el lenguaje SVG delineado acordado. Las vistas laterales del producto quedan como opción para discutir únicamente si aportan claridad sin reducir el espacio de contacto.

## 6. Dirección visual

**Acordado:** paleta coherente, producto en lenguaje minimalista de boceto/blueprint, separación visual entre plataforma y prototipo y fotografías de personas sin deformaciones.

**Propuesta:** identidad oscura con texto claro, espacio libre y un acento técnico contenido. Los trazos del producto tendrán más presencia que los de la aeronave portadora. La rejilla, si existe, será tenue y no contendrá cotas o detalles que aparenten datos de ingeniería inexistentes.

**Confirmado por el usuario:** inicialmente se podrán utilizar los tres temas existentes: [Primary Space](../../system/themes/primary-space.json), [Deep Teal](../../system/themes/deep-teal.json) y [Monochrome Blue](../../system/themes/monochrome-blue.json). La composición, la estructura y los textos deben funcionar con los tres. No se crea una cuarta paleta ni se impone una única variante. El tema inicial de exposición puede elegirse al comparar el resultado, sin bloquear esta definición.

Se propone conservar las familias disponibles, Space Grotesk para títulos e Inter para lectura, utilizando la monoespaciada solo donde facilite una etiqueta técnica. La jerarquía se obtendrá por tamaño, peso, composición y separación, sin convertir todos los fragmentos en cajas.

Las fotografías conservan personas, instalaciones y proporciones reconocibles. Su integración puede requerir recorte o tratamiento de contraste, que se decidirá al disponer de los originales. La coherencia cromática no implica recolorear logotipos institucionales ni alterar identidades.

## 7. Definición de las escenas

Las siguientes composiciones son propuestas de diseño. Se conserva literalmente el contenido visible de partida en inglés, incluidos todos los títulos y subtítulos aunque aquí solo se cite alguno para identificar la escena. Los diez minutos condicionan el ritmo y la jerarquía, no autorizan condensar los textos.

### A1 · Planta nuclear — origen 1

Fotografía de la planta a pantalla completa, con la lectura visual de una instalación crítica como protagonista. Se propone no añadir párrafos ni animar un ataque que no está en el material: el escenario de UAS lo construye la exposición oral. Pie y número discretos desde que aparece la escena. El negro previo permanece completamente vacío.

La captura muestra una planta nocturna y su reflejo, con amplio cielo azul oscuro. Se propone conservar esa escala y esa atmósfera; el recorte no debe perder la instalación ni su reflejo principal.

### A2 · Infraestructura espacial — origen 2

Fotografía de antenas a pantalla completa y composición hermanada con A1. La exposición aproxima el problema al segmento terreno espacial. Se propone conservar esta escena principalmente visual, sin convertir los ejemplos de Cebreros, Andøya y Redu en un listado sobre la imagen.

La captura muestra dos antenas al atardecer, con la antena cercana a la derecha como dominante. Se conserva esa relación visual. Al alejarse la cámara, debe percibirse que las dos aperturas pertenecen al bloque superior del mapa.

### B · Brecha de respuesta — origen 4

Título de partida: `The response gap`. La frase `Detecting a drone is not the same as stopping it safely` concentra la idea principal. La fotografía de Cebreros sitúa el problema en una instalación con antenas, enlaces y personas.

La captura tiene texto a la izquierda y una fotografía vertical a la derecha. Se propone conservar esa relación general, mejorar contraste y separación, y jerarquizar los tres puntos completos sin modificar sus palabras. La frase sobre las restricciones conserva su lista literal de alternativas. El mensaje sobre continuidad operativa debe destacar mediante composición y peso.

La explicación de restricciones concretas permanece principalmente en el guion. No se inventan puntuaciones de eficacia, rankings ni conclusiones comparativas a partir de las notas.

### C · R.A.R. — origen 5

Título de partida: `Our solution`. R.A.R. debe ocupar la mayor parte de la atención visual. Se propone un esquema sencillo que relacione información de seguimiento externa, apuntamiento/emisión acústica y respuesta de la hélice objetivo.

La captura muestra el dron portador con tratamiento translúcido y el payload oscuro destacado. Esta distinción ya ayuda a identificar el producto propio. Se propone conservar su contenido de integración y simplificar su tratamiento hacia el blueprint acordado, utilizando `system-views.png` y `multi-drone-mounting.png` como referencias visuales del conjunto y sus vistas. No se sustituye la escena por una instalación terrestre inventada. El primer compromiso terrestre y el alcance del portador se mantienen en el guion.

Se conservan el subtítulo y los cuatro puntos visibles, incluida `Reusability.`. La representación gráfica no añadirá una neutralización demostrada: el guion ya sitúa la hipótesis técnica y el compromiso de medir prestaciones y límites. No se añaden cifras de alcance, coste o eficacia.

### D · Aplicación espacial y mercado — origen 6

Título de partida: `Built for the aerospace ground segment`. La aplicación a instalaciones del segmento terreno espacial ocupa la primera jerarquía. Aeropuertos, energía y otros entornos críticos aparecen como ámbitos adicionales, sin competir todos por la misma prominencia.

La captura contiene tres puntos completos: conexión espacial, mercado y competencia. Se propone separarlos por jerarquía y espacio, manteniendo literalmente títulos, subtítulo y esos tres puntos. Los ámbitos de aplicación pueden apoyarse en recursos gráficos discretos sin reemplazar sus frases. La validación con operadores e integradores permanece en el guion.

La lista de alternativas se repite parcialmente respecto a B y se conserva por indicación del usuario. Se distinguirá su función mediante la composición, sin eliminarla. La instrucción `LLEVAR LISTA DE COMPETIDORES` se conserva como preparación para preguntas; no añade automáticamente una diapositiva ni una lista de empresas al deck.

### E · Viabilidad y negocio — origen 7

Título de partida: `A credible route from prototype to business`. Es la escena con mayor riesgo de exceso de información. Debe conservar los cinco temas de las notas: viabilidad técnica, ingresos, producción, propiedad intelectual y financiación.

La captura organiza cuatro apartados en una tabla de dos columnas y financiación en una banda inferior. Se propone conservar las relaciones y todos sus textos, sustituyendo el peso de los bordes por separación, alineación y títulos claros. La financiación mantiene sus tres entradas literales y categorías distinguibles: incentivo ESA BIC, aceleradoras y otras fuentes. Su aparición no debe sugerir financiación ya concedida. La referencia científica permanece visible y completa.

La referencia científica se conservará asociada a la viabilidad y con el alcance conceptual indicado en las notas. Todavía no se ha verificado el artículo citado ni se usa aquí como prueba independiente. La comprobación bibliográfica queda pendiente antes de publicar la presentación.

Existe una discrepancia sobre patentes: el texto visible las asocia a la protección confidencial, el guion habla de evaluar patentabilidad durante incubación y la transcripción recoge intención de patentar. Se deja señalada para el equipo, conservando el texto visible literal; no se resuelve reescribiéndolo dentro de este trabajo de diseño.

Primera opción: una escena completa con mejor jerarquía y sin condensar copy. Si la legibilidad aconseja dividirla, se propondrá una segunda escena en la misma posición, conservando cada fragmento íntegro y sin añadir otro bloque al mapa. Ese cambio de cantidad no está aprobado todavía.

### F1 · Equipo — origen 8

Título de partida: `The team behind Caelum Systems`. Se conserva también `Three aerospace engineers with a vision`. Tres retratos de tamaño y tratamiento coherentes, nombres completos y todas las responsabilidades literales. El público debe identificar quién responde de cada parte, incluidas gestión, negocio y financiación.

La captura superpone textos al fondo grupal y utiliza recortes de retratos con proporciones inconsistentes, especialmente el de Alejandro. Se propone mantener el fondo grupal, reducir su competencia con el texto y disponer tres filas alineadas de retrato, nombre y rol completo. Esta composición permite dar espacio a los roles más largos sin encogerlos para igualarlos a los más cortos. Los recortes serán homogéneos y no deformarán los rostros.

El guion mantiene experiencia y explicación de las responsabilidades. Los nombres se conservan: Guillermo Alba Buitrón, Alejandro Gil Getino y Christian González Pérez. No se redistribuyen responsabilidades por razones de equilibrio visual.

### F2 · Red institucional — origen 9

Se conservan el título `The team behind Caelum Systems`, el subtítulo `Support and institutional network` y las tres entradas institucionales literales. La captura las distribuye en filas con sus logos a la derecha. Se propone mejorar alineación y escala de los logos, preservando su proporción y evitando que parezcan una banda decorativa de patrocinadores.

El guion distingue apoyo y disposición a colaborar en la Universidad de León, una declaración preliminar de INTA y contactos con personas vinculadas a ESA y con la Agencia Espacial Española. La composición no debe amplificar visualmente esos vínculos. Añadir etiquetas sobre el estado de cada relación sería una modificación de contenido adicional que requiere una decisión concreta del usuario; no se incorpora automáticamente.

Los detalles de personas, instalaciones y conversaciones permanecen en el guion o en documentación de apoyo. El avance F1 → F2 cambia contenido y mantiene posición y encuadre.

### Centro final · Cierre y contacto — origen 10

Se conservan `Caelum Systems` y la frase literal `Protecting Europe’s space ground infrastructure with disruptive sound technologies.`. Se añaden los tres nombres y tres QR asociados inequívocamente a sus perfiles profesionales, conforme al cierre de contacto acordado. Cada QR tendrá una etiqueta LinkedIn y una alternativa de enlace utilizable en la versión digital. Las URL concretas están pendientes.

La captura muestra `drone-defending.png` a pantalla completa, con el texto centrado. La reunión establece un cierre central de contacto, de modo que se propone trasladar íntegramente ese mensaje al estado final del centro y decidir si la imagen se mantiene como fondo o se sustituye por el motivo delineado acordado. No se propone una última diapositiva periférica adicional.

El motivo de aeronave y cualquier ilustración son secundarios respecto a la lectura y al escaneo. Esta composición debe permanecer útil durante preguntas y conservar el eslogan original.

## 8. Identidad persistente y numeración

**Acordado:** todas las diapositivas tienen número y un elemento persistente de identidad, incluidas las dos aperturas.

**Propuesta:** pie discreto en una posición estable, con `Caelum Systems · ESA BIC CYL 2026` a un lado y número al otro. Sobre fotografía se elegirá una zona y contraste que lo mantengan legible. El negro inicial no muestra pie, número ni controles propios del contenido.

Se propone numerar las ocho escenas periféricas como 01–08 y el cierre como 09, manteniendo en este documento la correspondencia con las notas. Las vueltas al mapa no incrementan ese número. La vista general usa identidad central y no aparenta ser una nueva diapositiva de contenido. Si se divide viabilidad y negocio, la numeración se revisa antes de construir.

La numeración del contenido es distinta del número de pasos del reproductor y de las páginas del PDF. Esta distinción evita que el público vea aumentar el contador solo por volver al contexto.

## 9. Recursos necesarios y su función

| Recursos previstos en las notas | Función en esta definición | Estado local |
| --- | --- | --- |
| `TEB_slides/` | Contrastar composición y comentarios con el deck de origen | Diez capturas disponibles e inspeccionadas |
| `nuclear-station.jpeg`, `two-antennas-deep.jpg` | Aperturas fotográficas | Disponibles; composición inspeccionada en capturas |
| `Cebreros_station_pillars.jpg` | Contexto de la brecha de respuesta | Disponible; composición inspeccionada en captura |
| `drone-mounting-clean.png` | Referencia de integración del sistema | Disponible; composición inspeccionada en captura |
| `system-views.png`, `multi-drone-mounting.png` | Referencias del efector y de su integración para definir el tratamiento técnico | Disponibles e inspeccionadas |
| `Foto Equipazo Bolas.JPG` | Contexto humano del equipo | Disponible |
| Tres fotografías de perfil enlazadas en las notas | Identificación individual del equipo | Disponibles; composición inspeccionada en captura |
| Logos ULeón, INTA, ESA y AEE enlazados en las notas | Identificación de relaciones descritas | Disponibles; composición inspeccionada en captura |
| `drone-defending.png` | Referencia del cierre original | Disponible; composición inspeccionada en captura |
| URL profesionales de los tres integrantes | Destinos de los QR y enlaces | Pendientes |
| Gráficos de R.A.R., fondo técnico y posible aeronave central | Recursos simplificados que se definirán a partir de referencias fieles | Por definir; no se generan en esta fase |

También existe una imagen de CDTI no pedida en las notas. Su disponibilidad no implica incorporarla. Las referencias del sistema permiten simplificar su aspecto sin inventar una geometría distinta. Los originales que solo se han visto dentro de las capturas deberán inspeccionarse en detalle antes de producir recortes o derivados.

## 10. Versiones de salida

**Acordado:** presentación HTML/web interactiva, versión fácil de revisar para el equipo y PDF estático de respaldo.

**Propuesta para el PDF:** mantener las escenas de contenido, la primera vista general y el cierre; omitir el negro de espera y las vueltas repetidas al mapa si se acepta que no aportan una página necesaria. La comprensión no puede depender del movimiento de cámara. Los contactos deben funcionar como enlaces además de QR.

El sistema actual genera una página por parada del recorrido. La selección de páginas para este deck es, por tanto, una decisión pendiente de planificar, no una capacidad que este documento dé por resuelta. Como alternativa, puede aceptarse un PDF que conserve todas las paradas. Se decidirá qué salida estática se quiere antes de construirla.

La versión de exposición debe centrar la atención en el contenido, con las herramientas del reproductor fuera de la composición que se proyecta. Las opciones de revisión, elección de tema y diagnóstico del sistema no forman parte del relato de Caelum.

## 11. Decisiones pendientes para cerrar la definición

1. Aceptar los seis bloques y elegir la relación del motivo de aeronave con ellos.
2. Confirmar el contenido del centro inicial, especialmente si incluye nombres.
3. Elegir el grado de presencia del blueprint en el fondo global, manteniendo disponibles las tres paletas existentes.
4. Confirmar el ritmo de salida/entrada entre bloques y las pulsaciones necesarias.
5. Resolver la densidad de viabilidad/negocio mediante composición o división en estados, conservando los textos íntegros.
6. Confirmar si la composición institucional mantiene los textos actuales sin etiquetas adicionales o si se desea añadir precisión. Las discrepancias sobre propiedad intelectual se señalan al equipo sin reescribir copy.
7. Confirmar la referencia científica antes de publicar y revisar en detalle los originales que se utilizarán para derivados.
8. Aportar los destinos de contacto y elegir el tratamiento visual del mensaje final, cuyo texto se conserva.
9. Elegir la secuencia de PDF y confirmar la numeración propuesta.

Quedan cerradas las condiciones de exposición, la conservación literal del copy y la disponibilidad de las tres paletas. Las decisiones restantes se resolverán sobre esta propuesta sin abrir todavía un plan técnico.

## 12. Cuándo consideraremos suficiente esta definición

El documento podrá aceptarse cuando podamos describir, sin decisiones narrativas importantes pendientes, qué aparece en cada escena, qué pertenece al guion, cómo se reconoce cada bloque en el mapa y cómo se llega al cierre. Deben quedar acordados la dirección visual, el ritmo, el contenido del centro y el criterio de ambas salidas.

Puede quedar producción de recursos por hacer, siempre que su función, estilo, fuente prevista y límites estén definidos. La revisión posterior deberá comprobar legibilidad en proyección, comodidad del recorrido, precisión de los mensajes, QR utilizables y correspondencia de la salida estática con lo acordado.

Al aceptar el documento, se conservarán las decisiones finales y las referencias de origen. El plan siguiente concretará cómo llevarlas al sistema existente y cómo comprobar el resultado; esta fase termina antes de redactar ese plan.

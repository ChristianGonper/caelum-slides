# Ajustes visuales de Caelum

Revisado el 1 de octubre de 2026 tras las modificaciones de la reunión.

El panel lateral y la barra estática ofrecen **Color de resaltado**: azul (inicial, #4DA3FF), cian, ámbar y lavanda. Cambiarlo mantiene la parada y la paleta. El valor se conserva en la URL mediante `highlight=blue|cyan|amber|lavender` y en el enlace a estático/PDF. La impresión usa el color seleccionado.

La entrada al centro sale al mapa general durante 1000 ms y después amplía la identidad central en 480 ms. El avance siguiente permanece manual. Movimiento reducido, redimensionado y carga directa encuadran sin vuelo. Una nueva navegación interrumpe el recorrido pendiente.

Se han retirado del menú los selectores de entrada y diagrama. La ilustración independiente del dron se ha retirado; el sketch vectorial original de `schema.tsx` permanece activo como decoración del mundo, salvo en la pantalla negra. El parámetro histórico `intro=map` sigue disponible para exportaciones anteriores. `diagram` ya no afecta a la presentación.

Todos los bloques permanecen visibles durante los vuelos de cámara. Sus estados se resuelven según la posición del recorrido: inicial antes de visitarlos, actual en la parada activa y final al dejarlos atrás. Los cambios de estado sin vuelo desplazan verticalmente el contenido; el fondo compartido del cierre y contactos permanece fijo. Equipo mantiene título, subtítulo y tarjetas arriba para dejar visibles las caras del fondo. Cierre y contactos comparten el mismo tratamiento de luminosidad.

El primer estado central incluye RAR entre el nombre del proyecto y su descriptor. Las diapos numeradas 03–05 usan interlineado 1.95 y separación de 26 px entre puntos principales. Las imágenes se alinean con el margen derecho del footer; la solución mantiene altura de 280 px y ancho adaptable. HPM y Sting tienen ventanas de recorte de 150 px de alto: se elimina cielo y terreno derecho en HPM, y fondo alrededor del interceptor en Sting. Los recortes se aplican al renderizar, conservando las fotografías originales completas.

**Presentar** solicita pantalla completa con la API del navegador y activa el modo exposición. **P** sigue alternando el HUD; **Esc** permite salir de pantalla completa. El navegador puede denegar pantalla completa; F11 queda como alternativa manual.

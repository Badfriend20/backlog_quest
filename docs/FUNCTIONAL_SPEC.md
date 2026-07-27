# Inventario funcional y no regresión

## Alcance

Backlog Quest administra localmente juegos, copias, partidas, misiones, cola, calendario y dispositivos. No usa backend, cuentas ni nube. Los textos visibles nunca son identificadores funcionales.

## Vistas

1. Inicio: métricas, misiones activas, próximos juegos, balance de dispositivos y actividad.
2. Cola: catálogo completo, filtros, posiciones, estados, dependencias y activación.
3. Biblioteca: búsqueda por relaciones, filtros, privacidad, creación y edición.
4. Plan: calendario generado desde reglas y preferencias, más una lista permanente de misiones activas para editar su agenda aunque no tengan días programados.
5. Historial: partidas de todos los juegos.
6. Dispositivos: catálogo con IDs estables e integridad referencial.
7. Configuración: franjas, cola, calendario, interfaz, plataformas, presentación de propiedades, temas y portabilidad.

La vista activa se conserva en `preferences.activeView`.

## Editor de juego

El editor contiene General, Copias y Partidas. General también administra la fecha de disponibilidad y las dependencias que pueden bloquear el juego en la cola. Un juego nuevo recibe un ID único, una campaña principal y una entrada al final de la cola. Puede existir sin copias, pero no puede activarse como misión hasta tener una copia válida.

Los contenidos no se administran en una pestaña independiente: activar o editar una misión crea y actualiza campañas, DLC, rejugadas u objetivos personalizados. Partidas e Historial consumen ese catálogo interno.

Una copia conserva plataforma, propiedad, dispositivos, estado, prioridad, sesión ideal, progreso entre copias y notas. La lista muestra un resumen y abre el formulario completo solo al editar. No puede eliminarse si una misión o partida la utiliza.

El juego no usa un porcentaje global de progreso. El avance se expresa mediante el estado de cada partida; el punto actual, las terminaciones y las rejugadas se conservan como información histórica agregada.

La plataforma de una copia procede de un catálogo con IDs estables. La propiedad representa la forma de acceso y nunca forma parte del nombre funcional de la plataforma.

Agregado rápido muestra todas las combinaciones biblioteca/propiedad conocidas, con la más reciente primero. Elegir una crea un formulario de copia prellenado sin seleccionar dispositivos.

Una partida conserva contenido, copia, dispositivo, estado, fechas y notas. No puede eliminarse si una misión la referencia.

## Misiones

Activar una misión vincula juego, contenido, copia, dispositivo, franja y partida; actualiza cola/copia/contenido y crea una regla si hay días elegidos. Una franja ocupada nunca se reemplaza silenciosamente.

Terminar cierra misión y partida, elimina calendario, actualiza progreso y contenido, registra actividad y reorganiza la cola según intención de rejugada.

Pausar, aplazar, enviar al final y abandonar conservan historial, liberan la franja y eliminan programación futura. Las acciones importantes admiten restaurar el snapshot previo mediante Deshacer.

## Cola y calendario

Cada juego aparece una sola vez en la cola, con posiciones continuas. Los estados válidos son `active`, `queued`, `paused`, `deferred`, `replay`, `replay-later`, `archived`, `low-interest`, `blocked` y `wishlist`.

El calendario se deriva de `scheduleRules`, `scheduleOverrides`, `scheduleWeeks` y `weekStartsOn`; no se codifican títulos o fechas manuales.

## Dispositivos

Las relaciones usan IDs (`deviceIds`, `deviceId`, `activeDeviceId`, `preferredDeviceId`). Los nombres son presentación y compatibilidad. Renombrar no rompe referencias; eliminar se bloquea mientras existan usos.

La administración del catálogo vive en esta vista, no en Configuración. La lista conserva el resumen de juegos y misiones; seleccionar una tarjeta o su acción Editar abre un formulario individual. Agregar dispositivo abre el mismo formulario con un ID nuevo y estable.

## Configuración

Todas las preferencias deben tener un efecto observable: perfiles de franjas, tamaño de Inicio, posición al aplazar, semanas, inicio de semana, vista compacta, tooltips, privacidad, confirmaciones, presentación de propiedades, temas e importación/exportación.

La vista compacta reduce relleno y separación vertical en tarjetas de Inicio y Biblioteca, bloques de misión y filas de Cola. No debe ocultar contenido, cambiar relaciones ni alterar el orden de los datos.

Cada término de propiedad puede ocultarse en las etiquetas rápidas o presentarse con un texto configurable de hasta 24 caracteres. La regla solo afecta la presentación; el valor funcional del catálogo no cambia.

Las plataformas pueden agregarse, renombrarse, desactivarse y eliminarse cuando no tienen referencias. Guardar dos con el mismo nombre las fusiona y reasigna copias y presets al ID conservado.

## Invariantes

- Una misión siempre referencia entidades del mismo juego.
- Una regla siempre referencia una misión existente.
- Una entrada de cola siempre referencia un juego existente.
- IDs internos y etiquetas visibles están desacoplados.
- Cambiar textos de ayuda no altera claves, relaciones ni operaciones.
- Importar o normalizar nunca borra datos existentes para reconstruirlos artificialmente.

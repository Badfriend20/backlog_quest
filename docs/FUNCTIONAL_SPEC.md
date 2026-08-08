# Inventario funcional y no regresión

## Alcance

Backlog Quest administra localmente actividades, modalidades, recorridos, misiones, lista,
calendario y recursos. No usa backend, cuentas ni nube. Los textos visibles nunca son
identificadores funcionales.

## Modelo neutral y compatibilidad

El lenguaje canónico es Actividad, Modalidad, Recorrido, Contenido, Recurso y Canal. Las claves
históricas del JSON v2, como `games`, `copies` y `playthroughs`, se conservan exclusivamente como
contrato de portabilidad; la migración las adapta al modelo neutral sin reescribir los respaldos
del usuario.

El perfil de vocabulario es una preferencia global de presentación. Cambiarlo adapta todas las
vistas al mismo tipo de actividad y no modifica el tipo, las relaciones ni el historial de cada
registro. El perfil Personalizado permite combinar términos, pero sigue siendo una sola
configuración global.

## Vistas

1. Inicio: métricas, misiones activas, próximas actividades, balance de recursos y actividad.
2. Lista: catálogo completo, filtros, posiciones, estados, dependencias y activación.
3. Colección: búsqueda por relaciones, filtros, privacidad, creación y edición.
4. Plan: calendario generado desde reglas y preferencias, más una lista permanente de misiones activas para editar su agenda aunque no tengan días programados.
5. Historial: recorridos de todas las actividades.
6. Recursos: catálogo con IDs estables e integridad referencial.
7. Configuración: vocabulario, franjas, lista, calendario, interfaz, canales, formas de acceso,
   temas, ejemplos y portabilidad.

La vista activa se conserva en `preferences.activeView`.

## Editor de actividad

El editor contiene General, Modalidades y Recorridos; el perfil activo puede presentar esos
términos como Copias y Partidas u otros equivalentes. General también administra el catálogo de
contenidos, la fecha de disponibilidad y las dependencias que pueden bloquear la actividad en la
lista. Una actividad nueva recibe un ID único y una entrada al final de la lista. Puede existir sin
modalidades ni contenidos, pero no puede activarse como misión hasta tener ambos.

Los contenidos no ocupan una pestaña independiente: se agregan, renombran, clasifican, reordenan y
eliminan desde General. Misiones y recorridos solo seleccionan contenidos existentes mediante un
ID estable; no crean términos libres.

Una modalidad conserva canal, forma de acceso, recursos, estado, prioridad, sesión ideal,
compatibilidad entre modalidades y notas. La lista muestra un resumen y abre el formulario completo
solo al editar. Puede eliminarse aunque una misión o recorrido la utilice; ambos se conservan sin la
referencia.

La actividad no usa un porcentaje global de progreso. El avance se expresa mediante el estado de
cada recorrido; el punto actual, las terminaciones y las repeticiones se conservan como información
histórica agregada.

El canal de una modalidad procede de un catálogo con IDs estables. La forma de acceso nunca forma
parte del nombre funcional del canal.

Agregado rápido muestra todas las combinaciones canal/forma de acceso conocidas, con la más reciente
primero. Elegir una crea un formulario de modalidad prellenado sin seleccionar recursos.

Un recorrido conserva contenido, modalidad, recurso, estado, fechas y notas. Solo puede crearse
cuando la actividad tiene al menos una modalidad y un contenido; comienza vinculado a ambos. Puede
eliminarse aunque una misión lo referencie; la misión se conserva y queda marcada como pendiente de
vincular a un nuevo recorrido.

## Misiones

Activar una misión vincula juego, contenido, copia, dispositivo y partida; actualiza lista/copia/contenido y crea una regla cuando existen sesiones. Cada sesión combina un día y una franja. Una misión puede usar distintas franjas durante la semana o varias el mismo día.

Dos misiones solo entran en conflicto cuando una sesión coincide tanto en día como en franja. El reemplazo nunca es silencioso: requiere confirmación y aplaza las misiones conflictivas.

Terminar cierra misión y partida, elimina calendario, actualiza progreso y contenido, registra
actividad y ajusta únicamente la entrada terminada según la intención de repetición. La rotación
sugerida se recalcula al renderizar y nunca provoca un reordenamiento persistido adicional.

Pausar, aplazar, enviar al final y abandonar conservan historial, liberan la franja y eliminan programación futura. Las acciones importantes admiten restaurar el snapshot previo mediante Deshacer.

## Lista y calendario

Cada juego aparece una sola vez en la lista, con posiciones continuas. Los estados válidos son `active`, `queued`, `paused`, `deferred`, `replay`, `replay-later`, `archived`, `low-interest`, `blocked` y `wishlist`.

La Lista separa dos conceptos. **Orden manual** muestra `QueueItem.position`, respeta pins y conserva
los controles de movimiento y las transiciones existentes. **Rotación sugerida** es un ranking
calculado en tiempo real que también alimenta Camino sugerido en Inicio. Construir la sugerencia es
una operación de solo lectura: no modifica posiciones, pins, estados ni ningún otro dato y no
persiste scores, deuda o planes en el JSON.

Solo los estados `queued` y `replay` son elegibles. Se excluyen los demás estados, en particular
`paused` y `deferred`, porque expresan decisiones manuales. Disponibilidad y dependencias son
restricciones duras: una fecha futura o una dependencia sin terminar impide recomendar. Una fecha
igual al día de referencia ya está disponible. Un recurso preferido desactivado también excluye el
candidato; la ausencia o un ID desconocido no falla y simplemente elimina los bonus asociados al
recurso.

La puntuación combina prioridad de la actividad, influencia decreciente de la posición manual,
deuda de rotación derivada del historial, prioridad del recurso y una penalización moderada cuando
ese recurso ya tiene una misión activa. La deuda está acotada: considera tiempo desde el último uso
y terminaciones de otros recursos desde entonces; un recurso sin historial recibe una oportunidad
inicial moderada, no deuda infinita.

La ventana se construye mediante selección sucesiva. Una tercera recomendación consecutiva del
mismo recurso recibe una penalización de diversidad cuando existe una alternativa elegible, pero
puede aparecer si su prioridad lo justifica o si no quedan alternativas. No existen cuotas ni
nombres de recursos codificados en el algoritmo.

Un pin futuro sigue excluido hasta `availableFrom`. Cuando está disponible recibe influencia fuerte
en la sugerencia, sin cambiar `pinnedPosition` ni garantizar una prohibición absoluta sobre otros
candidatos. El mismo `QuestData` y la misma fecha de referencia producen el mismo `RotationPlan`.

El calendario se deriva de `scheduleRules`, sus `sessions`, `scheduleOverrides`, `scheduleWeeks` y `weekStartsOn`; no se codifican títulos o fechas manuales. Una misión sin sesiones permanece activa y accesible desde Plan, pero no genera bloques de calendario.

La edición agrupa las sesiones por franja. Cada franja aparece una sola vez y conserva siete activadores `L M X J V S D`; activar un día crea su sesión y desactivarlo la elimina. Se pueden agregar hasta las cuatro franjas disponibles y una franja ya agregada queda deshabilitada en las demás agrupaciones. Una agrupación sin días es temporal y no se persiste hasta activar al menos uno.

## Dispositivos

Las relaciones usan IDs (`deviceIds`, `deviceId`, `activeDeviceId`, `preferredDeviceId`). Los nombres son presentación y compatibilidad. Renombrar no rompe referencias; eliminar se bloquea mientras existan usos.

La administración del catálogo vive en esta vista, no en Configuración. La lista conserva el resumen de juegos y misiones; seleccionar una tarjeta o su acción Editar abre un formulario individual. Agregar dispositivo abre el mismo formulario con un ID nuevo y estable.

## Configuración

El vocabulario se controla mediante los perfiles Genérico, Videojuegos, Lectura, Aprendizaje,
Proyectos y Personalizado. El editor personalizado explica la función de cada término; todo campo
vacío usa el término genérico correspondiente. Esto incluye los estados de actividad y recorrido:
por ejemplo, `En curso`/`Repitiendo` se presentan como `Jugando`/`Rejugando`,
`Leyendo`/`Releyendo`, `Cursando`/`Repasando` o `En ejecución`/`Iterando` según el perfil. Los
perfiles solamente cambian la presentación.

Apariencia permite editar por separado el fondo exterior, el contenedor principal y la barra
lateral, además de los colores de paneles, texto, bordes y estados.

Todas las preferencias deben tener un efecto observable: perfiles de franjas, tamaño de Inicio, posición al aplazar, semanas, inicio de semana, vista compacta, tooltips, privacidad, confirmaciones, presentación de propiedades, temas e importación/exportación.

La vista compacta reduce relleno y separación vertical en tarjetas de Inicio y Biblioteca, bloques de misión y filas de Lista. No debe ocultar contenido, cambiar relaciones ni alterar el orden de los datos.

Cada término de propiedad puede ocultarse en las etiquetas rápidas o presentarse con un texto configurable de hasta 24 caracteres. La regla solo afecta la presentación; el valor funcional del catálogo no cambia.

Las formas de acceso se pueden agregar, renombrar y eliminar. Al eliminar una opción, las
modalidades existentes conservan su texto histórico, pero los presets asociados dejan de aparecer
en el agregado rápido y la opción no puede asignarse a nuevas modalidades. Si no queda ninguna
opción, los formularios usan `Por definir`.

Las secciones de formas de acceso y canales reutilizan el módulo visual de catálogo editable. Cada
una conserva su política de referencias: las formas de acceso permiten eliminación histórica,
mientras que un canal referenciado debe fusionarse antes de eliminarse.

Las plataformas pueden agregarse, renombrarse, desactivarse y eliminarse cuando no tienen referencias. Guardar dos con el mismo nombre las fusiona y reasigna copias y presets al ID conservado.

Datos de ejemplo ofrece seis respaldos segmentados con al menos 15 actividades cada uno. Probar un
ejemplo inicia una sesión temporal: el primer estado real queda respaldado y no se sustituye al
cambiar entre ejemplos. La sesión sobrevive a una recarga. Restaurar recupera exactamente ese
estado; conservar la demostración elimina el respaldo sólo mediante confirmación explícita.

## Biblioteca y Lista

Biblioteca y Lista representan órdenes distintos. Lista conserva exclusivamente el orden planeado de juego; Biblioteca ofrece orden por pendientes, alfabético, prioridad o actividad reciente sin escribir posiciones en Lista. El orden predeterminado deja contenidos terminados, completados o abandonados al final y ordena cada grupo alfabéticamente.

## Misiones, copias y partidas

Una misión puede permanecer sin contenido, copia o partida vinculada después de eliminar una relación. Esas condiciones deben mostrarse como alertas diferenciadas en Inicio y Plan, y como indicadores compactos en otros resúmenes activos. Las misiones terminadas o abandonadas no requieren esa alerta.

Las alertas `Sin copia` y `Sin partida` son acciones de resolución. Abren directamente un formulario nuevo en la sección correspondiente y vinculan el registro a la misión al guardarlo. `Sin contenido` abre General para administrar el catálogo. `Sin partida` permanece deshabilitada cuando el juego todavía no tiene copia o contenido.

Eliminar una copia desacopla las misiones, partidas y preferencia de Lista relacionadas. La partida conserva sus descripciones históricas de plataforma y dispositivo. Eliminar una partida desacopla las misiones relacionadas, elimina su fila del historial editable y conserva la bitácora textual existente. Editar y guardar una misión sin partida crea una nueva; cerrar esa misión también debe crearla y vincularla, incluso cuando no exista una copia.

El control **Editar misión** permite seleccionar otro contenido existente, cambiar copia, dispositivo y agenda sin abandonar el objetivo. Desde el mismo formulario se puede abrir la administración de contenidos del juego.

## Lenguaje del dominio: Contenido

**Contenido** es una parte identificable del catálogo de un juego, por ejemplo una campaña, expansión, DLC, rejugada u objetivo personalizado. El juego es su propietario y conserva el orden del catálogo. Misión y Partida son consumidores: guardan `contentId` mientras la relación existe y una copia textual de título y tipo para explicar el historial si el contenido se elimina.

## Invariantes

- Toda referencia no vacía de una misión pertenece al mismo juego.
- Una regla siempre referencia una misión existente.
- Una sesión programada contiene un día válido de `0` a `6` y una franja existente.
- Una misma regla no contiene dos veces la misma combinación día/franja.
- Una entrada de lista siempre referencia un juego existente.
- IDs internos y etiquetas visibles están desacoplados.
- Cambiar textos de ayuda no altera claves, relaciones ni operaciones.
- Importar o normalizar nunca borra datos existentes para reconstruirlos artificialmente.

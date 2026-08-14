# Backlog Quest

Backlog Quest organiza una colección personal de actividades, sus formas de acceso, recorridos,
misiones y planificación. Conserva una identidad de aventura sin asumir que las actividades son
videojuegos.

## Language

**Actividad**:
Registro principal que una persona quiere realizar, completar o repetir.
_Avoid_: Juego como término universal, elemento

**Colección**:
Vista que reúne todas las actividades sin imponer el orden de ejecución.
_Avoid_: Biblioteca como término universal, Lista

**Modalidad**:
Forma concreta de realizar una actividad, definida por un canal, una forma de acceso y cero o más
recursos compatibles.
_Avoid_: Copia como término universal, actividad

**Canal**:
Origen, formato, plataforma, servicio o entorno al que pertenece una modalidad.
_Avoid_: Recurso, colección

**Forma de acceso**:
Condición mediante la cual una modalidad está disponible, como propiedad, préstamo, suscripción o
acceso gratuito.
_Avoid_: Propiedad como término universal, canal

**Catálogo de formas de acceso**:
Opciones disponibles para crear modalidades y agregados rápidos. Eliminar una opción no reescribe
las modalidades existentes: su texto queda como valor histórico, pero deja de ofrecerse para
nuevos vínculos. Si el catálogo está vacío se usa `Por definir`.
_Avoid_: Referencia obligatoria por ID, borrado de valores históricos

**Recurso**:
Equipo, herramienta, espacio, medio o entorno concreto usado para realizar una actividad.
Las notas conservan el contexto manual; las misiones activas describen su uso actual.
_Avoid_: Canal

**Contenido**:
Parte identificable y ordenable dentro de una actividad. Las misiones y los recorridos lo
seleccionan, pero no son propietarios de su identidad.
_Avoid_: Texto libre de misión, recorrido

**Recorrido**:
Ejecución concreta e histórica de una actividad. Puede conservarse aunque posteriormente pierda
alguna relación con contenido o modalidad.
_Avoid_: Sesión programada, porcentaje global

**Misión**:
Objetivo activo que puede vincularse a una actividad, contenido, modalidad, recurso, recorrido y
agenda.
_Avoid_: Actividad, recorrido

**Repetición**:
Nuevo recorrido de una actividad ya finalizada.
_Avoid_: Rejugada como término universal

**Sesión programada**:
Combinación recurrente de un día de la semana y una franja dentro de la agenda de una misión.
_Avoid_: Franja aislada, recorrido

**Franja programada**:
Agrupación visual y editable de una franja con sus siete activadores semanales.
_Avoid_: Segunda franja duplicada, selector independiente por sesión

**Perfil de vocabulario**:
Conjunto de etiquetas visibles para adaptar el lenguaje a un tipo de actividad sin cambiar IDs,
relaciones ni historial. Los términos personalizados vacíos usan el perfil genérico.
_Avoid_: Esquema de datos, traducción de identificadores

**Estado de actividad**:
Etapa del ciclo de vida de una actividad o recorrido. Se guarda de forma compatible y su etiqueta
visible depende del perfil de vocabulario (`En curso`, `Jugando`, `Leyendo`, `Cursando`, etc.).
_Avoid_: Estado de misión, etiqueta persistente dependiente del perfil

**Superficie de tarjeta**:
Base visual temática compartida para contenido agrupado: panel, borde, color y transición. Las
features agregan solamente variantes de interacción o estado sobre `CardSurface`.
_Avoid_: Fondo oscuro literal, tarjeta de dominio universal con todo el contenido

**Sesión de demostración**:
Estado temporal que sustituye los datos visibles por un JSON de ejemplo y conserva el primer
respaldo real en una clave local separada. Cambiar de ejemplo no reemplaza ese respaldo; restaurar
lo recupera y conservar la demostración lo descarta mediante confirmación explícita.
_Avoid_: Restauración inicial, importación destructiva implícita

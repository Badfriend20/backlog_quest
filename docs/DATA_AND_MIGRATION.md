# Datos, persistencia y migración

## Estado inicial y privacidad

Las preferencias incluyen `vocabularyProfile` y `customVocabulary`. Los respaldos anteriores que no
los contienen se normalizan al perfil `generic`; un término personalizado vacío usa el valor
genérico de respaldo.

`vocabularyProfile` es global para todo el respaldo. No clasifica individualmente cada actividad:
selecciona una sola presentación para toda la aplicación y `customVocabulary` permite ajustar sus
términos.

Los estados de actividad se conservan como valores compatibles en los respaldos. La presentación
reconoce tanto los estados neutrales actuales (`En curso`, `Repitiendo`) como los alias históricos
(`Jugando`, `Rejugando`) y muestra la etiqueta del perfil activo sin reescribir el dato importado.

`catalogs.ownership` es un catálogo de opciones nuevas, no una tabla referenciada por ID. Al quitar
una forma de acceso, las modalidades existentes conservan su campo `ownership`; las reglas visuales
y presets que dependían de la opción eliminada se descartan. Un catálogo vacío es válido y usa
`Por definir` en formularios nuevos.

`customTheme` incorpora colores independientes para `background`, `container` y `sidebar`. Los
respaldos anteriores reciben valores compatibles durante la normalización.

El JSON incluido es un estado inicial anónimo: conserva solamente catálogos y preferencias estructurales. Juegos, lista, misiones, dispositivos, plataformas de copia, actividad y presets rápidos comienzan vacíos.

`meta.owner` dejó de formar parte del modelo. Los respaldos antiguos que lo incluyan siguen siendo válidos, pero la normalización lo descarta para que no vuelva a persistirse ni exportarse.

## Agregado raíz

`QuestData` es el documento completo del dominio: metadatos, preferencias, catálogos, recursos,
lista, misiones, reglas, excepciones, actividad y actividades. El adaptador de persistencia conserva
las claves históricas `devices` y `games` del JSON v2. `catalogs.platforms` guarda los canales
configurables y cada modalidad los referencia mediante `platformId`. Cada actividad contiene
modalidades, recorridos, contenidos y dependencias.

Cada regla de agenda guarda `sessions`: una lista de combinaciones `{ weekday, slotId }`. La duración mínima y máxima sigue perteneciendo a la regla completa. Una lista vacía representa una misión activa sin calendario fijo.

`crossCopyProgress` indica compatibilidad de partidas guardadas entre copias mediante valores estables: `shared`, `separate`, `partial` o `unknown`. La migración convierte el antiguo `sharedProgress` y elimina `platformPriority` y el porcentaje global `progress.percent` de respaldos anteriores.

## Persistencia

`BacklogStorage` es la seam de Application. `browserBacklogStorage` es su adaptador de navegador y usa:

- `backlog-quest:data:v2` como clave actual;
- `backlog-quest:data:v1` como fallback heredado;
- `backlog-quest:demo-snapshot:v2` como respaldo aislado de una sesión de demostración;
- el JSON incluido si no hay respaldo local válido.

La UI recibe el adaptador desde `app/composition`; no accede directamente a localStorage.

## Datos de demostración

`public/examples` contiene seis respaldos v2 segmentados: genérico, videojuegos, lectura,
aprendizaje, proyectos y personalizado/cocina. Cada archivo tiene 15 actividades ficticias y
combina modalidades, formas de acceso, recursos, contenidos, recorridos, estados de lista,
misiones y reglas de calendario. `npm run generate:examples` los regenera de forma determinista y
las pruebas los recorren por el mismo adaptador de migración usado por la importación.

Iniciar una demostración guarda una copia estructural del estado actual en
`backlog-quest:demo-snapshot:v2`. Cargar otro ejemplo reutiliza ese primer respaldo. La sesión
persiste al recargar la aplicación; **Restaurar mis datos** recupera el respaldo y elimina la clave
temporal. **Conservar demo como mis datos** mantiene el ejemplo actual y elimina el respaldo sólo
después de una confirmación.

## Importación

`migrateBacklog` acepta v1 y v2. `normalizeV2` completa campos faltantes, resuelve IDs de dispositivos, completa la lista y normaliza relaciones. Los valores existentes tienen prioridad sobre defaults.

Los presets rápidos existentes se conservan. Si no existen o están vacíos, se reconstruyen con todas las copias y se deduplican por biblioteca/propiedad.

Los respaldos sin catálogo de plataformas lo reconstruyen desde las copias y presets. La migración separa sufijos de propiedad heredados del nombre de plataforma usando los propios datos de cada copia; por ejemplo, dos variantes de una misma plataforma con propiedades diferentes convergen en un ID sin depender de nombres codificados.

La normalización crea una regla de presentación por cada propiedad del catálogo. Los respaldos anteriores conservan el comportamiento histórico ocultando `Propio` inicialmente; desde ese momento todas las reglas se guardan como datos configurables, sin lógica especial en la UI.

## Exportación

Se exporta un único JSON UTF-8 con preferencias, catálogos de plataformas y propiedades, dispositivos y relaciones. Antes de descargar se actualiza `meta.updatedAt`; no se fragmentan entidades en archivos independientes.

## Integridad

Las operaciones de Domain actualizan conjuntamente las relaciones afectadas. No se debe modificar una misión, partida, lista o copia de manera aislada desde un componente.

Las relaciones de misión con contenido, copia y partida son opcionales una vez creadas. `contentId`, `copyId` o `playthroughId` vacíos representan una misión que requiere atención. Eliminar un contenido limpia su ID en misiones y partidas, pero conserva snapshots de `contentTitle` y `contentType`. Renombrar o reclasificar un contenido todavía existente sincroniza esos snapshots. Eliminar una copia limpia su referencia en misiones, partidas y Lista; conserva las descripciones históricas de la partida. Eliminar una partida limpia su identificador en las misiones relacionadas. Ninguna operación elimina la misión, sus reglas ni las entradas descriptivas de `activityLog`.

La creación y la conservación tienen reglas diferentes: una partida nueva requiere una copia y un contenido válidos, mientras que una partida existente puede quedar sin cualquiera de esas relaciones después de desacoplarlas.

La migración conserva arreglos de contenido explícitamente vacíos; no inventa una campaña para sustituir una decisión del usuario. En respaldos anteriores completa los snapshots de partidas a partir del contenido referenciado cuando todavía existe.

Los respaldos anteriores con `weekdays` se convierten a `sessions` usando `mission.slotId` como franja de cada día heredado. La normalización elimina `weekdays` al exportar para evitar dos fuentes de verdad.

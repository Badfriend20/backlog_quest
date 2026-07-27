# Datos, persistencia y migración

## Estado inicial y privacidad

El JSON incluido es un estado inicial anónimo: conserva solamente catálogos y preferencias estructurales. Juegos, cola, misiones, dispositivos, plataformas de copia, actividad y presets rápidos comienzan vacíos.

`meta.owner` dejó de formar parte del modelo. Los respaldos antiguos que lo incluyan siguen siendo válidos, pero la normalización lo descarta para que no vuelva a persistirse ni exportarse.

## Agregado raíz

`BacklogData` es el documento completo: metadatos, preferencias, catálogos, dispositivos, cola, misiones, reglas, excepciones, actividad y juegos. `catalogs.platforms` guarda las plataformas configurables y cada copia las referencia mediante `platformId`. Cada juego contiene copias, partidas, contenidos y dependencias.

`crossCopyProgress` indica compatibilidad de partidas guardadas entre copias mediante valores estables: `shared`, `separate`, `partial` o `unknown`. La migración convierte el antiguo `sharedProgress` y elimina `platformPriority` y el porcentaje global `progress.percent` de respaldos anteriores.

## Persistencia

`BacklogStorage` es la seam de Application. `browserBacklogStorage` es su adaptador de navegador y usa:

- `backlog-quest:data:v2` como clave actual;
- `backlog-quest:data:v1` como fallback heredado;
- el JSON incluido si no hay respaldo local válido.

La UI recibe el adaptador desde `app/composition`; no accede directamente a localStorage.

## Importación

`migrateBacklog` acepta v1 y v2. `normalizeV2` completa campos faltantes, resuelve IDs de dispositivos, completa la cola y normaliza relaciones. Los valores existentes tienen prioridad sobre defaults.

Los presets rápidos existentes se conservan. Si no existen o están vacíos, se reconstruyen con todas las copias y se deduplican por biblioteca/propiedad.

Los respaldos sin catálogo de plataformas lo reconstruyen desde las copias y presets. La migración separa sufijos de propiedad heredados del nombre de plataforma usando los propios datos de cada copia; por ejemplo, dos variantes de una misma plataforma con propiedades diferentes convergen en un ID sin depender de nombres codificados.

La normalización crea una regla de presentación por cada propiedad del catálogo. Los respaldos anteriores conservan el comportamiento histórico ocultando `Propio` inicialmente; desde ese momento todas las reglas se guardan como datos configurables, sin lógica especial en la UI.

## Exportación

Se exporta un único JSON UTF-8 con preferencias, catálogos de plataformas y propiedades, dispositivos y relaciones. Antes de descargar se actualiza `meta.updatedAt`; no se fragmentan entidades en archivos independientes.

## Integridad

Las operaciones de Domain actualizan conjuntamente las relaciones afectadas. No se debe modificar una misión, partida, cola o copia de manera aislada desde un componente.

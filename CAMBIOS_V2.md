# Cambios de Backlog Quest v2.2

## Agregado rápido dinámico

- Eliminado el botón fijo `+ Steam familiar`.
- Conservado intacto el encabezado y texto de **Licencias y versiones / Copias del juego**.
- Nueva sección **Agregado rápido** antes de las cards de copias.
- Las opciones se generan desde combinaciones únicas de biblioteca y propiedad.
- Las opciones del último juego guardado se colocan primero.
- Se evitan nombres y botones duplicados.
- Propiedad `Propio` se omite del nombre del botón.
- Modal `Ver más` con todas las combinaciones y formulario para crear una nueva.

## Dispositivos normalizados

- Las copias guardan `deviceIds` además de la etiqueta legible.
- Las partidas guardan `deviceId`.
- Las misiones guardan `activeDeviceId`.
- La lista guarda `preferredDeviceId`.
- Copias usan selector múltiple.
- Partidas, misiones y cierre de misión usan selectores simples.
- Configuración permite agregar, renombrar, activar y eliminar dispositivos.
- Renombrar un dispositivo actualiza todas sus etiquetas sin perder relaciones.

## Compatibilidad

- La aplicación conserva `schemaVersion: 2` y amplía el esquema de forma retrocompatible.
- Respaldos v2.1 se normalizan automáticamente.
- Service worker actualizado a caché `backlog-quest-shell-v2.2`.
- Versión del proyecto: `2.2.0`.

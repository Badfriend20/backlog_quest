# Mantener la aplicación local-first y sin backend

Backlog Quest conserva el agregado `BacklogData` en el navegador detrás de la interfaz
`BacklogStorage`, con importación y exportación de un único JSON y funcionamiento offline mediante
PWA. Se eligió este modelo frente a cuentas y sincronización remota para priorizar privacidad,
portabilidad y operación sin infraestructura.

## Consecuencias

- Las migraciones deben conservar compatibilidad con respaldos anteriores.
- No existe sincronización automática entre dispositivos ni resolución de escrituras concurrentes.
- Una integración que requiera secretos deberá usar un adaptador y un backend externo opcional; el
  cliente local no debe conocer credenciales.

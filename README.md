# Backlog Quest v2.5.0

Aplicación React + TypeScript + Vite para organizar colecciones de actividades, misiones,
recorridos y planes sin servidor ni cuenta.

## Inicio rápido

Requiere una versión de Node.js compatible con las dependencias declaradas en `package.json`.

```bash
npm install
npm run dev
```

Para generar el sitio estático:

```bash
npm run build
```

La carpeta `dist` queda lista para GitHub Pages o cualquier hosting estático.

## Funciones principales

- Colección y lista completa.
- Misiones activas vinculadas a contenido, modalidad y recurso.
- Calendario dinámico con distintas franjas por día.
- Historial de recorridos y repeticiones.
- Modalidades editables por canal y forma de acceso.
- Agregado rápido dinámico.
- Catálogo configurable de recursos.
- Perfiles de vocabulario genérico, videojuegos, lectura, aprendizaje y proyectos.
- Vocabulario personalizado con valores genéricos de respaldo.
- Laboratorio reversible con seis JSON y 15 ejemplos por tipo de actividad.
- Importación y exportación de un único JSON.
- Persistencia local y service worker.
- Despliegue estático compatible con GitHub Pages.

## Datos

El archivo `src/data/backlog.json` contiene el estado inicial anónimo. Los cambios del usuario se
guardan en `localStorage` y pueden importarse o exportarse como un único respaldo JSON. La
aplicación normaliza respaldos compatibles de las versiones 1 y 2.

## Documentación

- [Arquitectura](docs/ARCHITECTURE.md): módulos, capas, dependencias y reglas verificables.
- [Especificación funcional](docs/FUNCTIONAL_SPEC.md): comportamiento e invariantes de no regresión.
- [Datos y migración](docs/DATA_AND_MIGRATION.md): persistencia, referencias y compatibilidad.
- [Agregado rápido](docs/QUICK_COPY.md): identidad, deduplicación y flujo de presets.
- [Estilos y temas](docs/STYLING.md): propiedad visual, temas y comportamiento responsivo.
- [Modo offline y caché](docs/OFFLINE_AND_CACHE.md): PWA, Workbox y actualizaciones.
- [Pruebas](docs/TESTING.md): validación automática y revisión manual.
- [Changelog](docs/CHANGELOG.md): historial cronológico de versiones.
- [Lenguaje del dominio](CONTEXT.md): términos funcionales compartidos.
- Decisiones arquitectónicas: [local-first](docs/adr/0001-local-first-sin-backend.md),
  [features y kernel compartido](docs/adr/0002-features-y-kernel-compartido-minimo.md) y
  [preservación del historial](docs/adr/0003-preservar-historial-al-desacoplar-relaciones.md).

## Comandos principales

```bash
npm run dev
npm run test
npm run generate:examples
npm run format
npm run build
npm run validate
```

`npm run validate` es el criterio automático de terminado: comprueba formato, lint, pruebas,
arquitectura, build y despliegue para GitHub Pages.

## Licencia

Este proyecto no cuenta actualmente con una licencia de código abierto. Todos los derechos están reservados.

# Backlog Quest v2.5.0

Aplicación React + TypeScript + Vite para administrar una biblioteca de videojuegos sin servidor ni cuenta.

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

- Biblioteca y lista completa.
- Misiones activas vinculadas a contenido, copia y dispositivo.
- Calendario dinámico con distintas franjas por día.
- Historial de partidas y rejugadas.
- Copias editables por biblioteca y propiedad.
- Agregado rápido dinámico.
- Catálogo configurable de dispositivos.
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
npm run format
npm run build
npm run validate
```

`npm run validate` es el criterio automático de terminado: comprueba formato, lint, pruebas,
arquitectura, build y despliegue para GitHub Pages.

## Licencia

Este proyecto no cuenta actualmente con una licencia de código abierto. Todos los derechos están reservados.

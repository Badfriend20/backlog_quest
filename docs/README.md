# Documentación de Backlog Quest

Esta carpeta es la fuente de verdad para mantener Backlog Quest v2.3.0. El repositorio incluye un estado inicial anónimo; los datos del usuario se conservan en `localStorage` y en los respaldos JSON que exporte. La aplicación funciona sin backend.

## Mapa de documentos

- `STYLING.md`: propiedad de estilos, styled components, temas y validación responsiva.

- [ARCHITECTURE.md](ARCHITECTURE.md): módulos, capas, dependencias y reglas verificables.
- [FUNCTIONAL_SPEC.md](FUNCTIONAL_SPEC.md): inventario funcional e invariantes de no regresión.
- [QUICK_COPY.md](QUICK_COPY.md): agregado rápido global, deduplicación y flujo de persistencia.
- [DATA_AND_MIGRATION.md](DATA_AND_MIGRATION.md): entidades, referencias, localStorage y compatibilidad.
- [THEMES.md](THEMES.md): temas predefinidos, tema personalizado y variables CSS.
- [OFFLINE_AND_CACHE.md](OFFLINE_AND_CACHE.md): generación Workbox, precache y actualización por build.
- [TESTING.md](TESTING.md): pruebas, validación y criterios de entrega.
- [REFACTOR_HISTORY.md](REFACTOR_HISTORY.md): cambios arquitectónicos y funcionales realizados.
- [CHANGELOG.md](CHANGELOG.md): cambios por versión.

## Comandos principales

```bash
npm run dev
npm run test
npm run format
npm run build
npm run validate
```

`npm run validate` es el criterio automático de terminado: formato, lint/Sonar, pruebas, arquitectura y build deben pasar.

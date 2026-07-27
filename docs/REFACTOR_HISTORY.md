# Historial de refactorización

## Estilos por propietario v2.3.0

La hoja CSS monolítica se reemplazó por componentes de estilo de `styled-components`.
Las reglas particulares se distribuyeron entre las features que realmente las consumen y las
reglas con consumidores múltiples permanecieron en `shared/ui/tokens/GlobalStyles.ts`.
Las vistas y los modales autónomos montan su componente de estilo para no depender de haber
visitado previamente otra sección.

La regla arquitectónica rechaza nuevos archivos `.css` dentro de `src`. La migración no cambia
el formato del JSON, las claves de localStorage ni la interfaz de los casos de uso.

## Separación estructural

El componente original `BacklogQuestApp` superaba 3400 líneas y contenía vistas, editores, formularios y reglas de datos. Se dividió en features y componentes de una sola responsabilidad. Las transformaciones de juegos y plataformas pasaron a Application; comandos de misiones y cola permanecen en Domain; migración y localStorage viven en Infrastructure.

`GameEditor` se separó en paneles General, Copias y Partidas, con estado coordinado por `useGameEditor`. La fecha de disponibilidad y las dependencias viven en General; el catálogo interno de contenidos se deriva del flujo de misiones. `SettingsView` se convirtió en composición de secciones independientes.

## Shared

Se revisó por consumidores reales. `Modal` permanece compartido; `Metric`, `EmptyCard` y `TooltipChip` se devolvieron a sus features. Los barrels y carpetas sin implementación se eliminaron.

## Interfaz menos opinativa

Se retiraron ejemplos estáticos que asumían bibliotecas o tipos de propiedad concretos. Los nombres específicos continúan apareciendo cuando provienen del JSON del usuario. IDs y datos estructurados gobiernan la lógica.

## Temas

Se agregaron temas predefinidos y personalizado. En v2.2.1 se corrigió el contraste de controles claros mediante variables dedicadas y `color-scheme` dinámico.

## Agregado rápido v2.2.1

La regresión provenía de usar `quickCopyPresetsReady` como interruptor de visibilidad: respaldos válidos con presets pero sin esa propiedad quedaban normalizados con `false`. La migración ahora deriva la bandera, el selector siempre consulta la colección global y reconstruye desde todas las copias cuando hace falta.

También se restauraron reglas de etiqueta, notas al convertir copias y los campos de prioridad de plataforma/notas en el modal personalizado.

## Protección futura

Se incorporaron Prettier, ESLint, SonarJS, Vitest y un verificador arquitectónico. `npm run validate` reúne todos los controles.

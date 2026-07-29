# Historial de refactorización

## Componentes visuales propietarios v2.5.0

La migración iniciada en v2.3 dejó de tratar `styled-components` como un contenedor de selectores
globales. Cada scope de feature es ahora un elemento renderizado y los patrones transversales
—modal, acciones, tarjetas, chips, tooltips, formularios, rejillas y resúmenes— viven como
componentes estilizados reales en `shared/ui`.

`GlobalStyles` conserva únicamente tokens, reset y controles HTML base. La verificación
arquitectónica impide nuevos `createGlobalStyle` de feature y clases que repliquen variantes de
botón. También se formalizó el punto en que el prop drilling deja de ser aceptable y exige un
gestor de estado.

## Agenda y sistema de diseño v2.4.0

Las reglas de calendario dejaron de depender de una única franja por misión. Cada regla conserva
sesiones recurrentes día/franja y la migración transforma los antiguos `weekdays` sin perder
información. La lógica común de normalización, conflictos y etiquetas vive en
`shared/kernel/schedule.ts`.

Las variantes visuales comunes de botón se concentraron en `shared/ui/atoms/Button.tsx`. Esto
evita que una feature dependa de clases definidas por otra, como sucedía entre Missions y
Dashboard con `text-button`.

La edición de agenda se profundizó como una interfaz por franja: cada agrupación posee sus
activadores semanales y se convierte a las mismas sesiones día/franja al guardar. La exclusividad
de una franja se expresa en la estructura visual y ya no mediante filas de combinaciones.

La persistencia, deshacer, avisos, importación y restauración se movieron a
`application/useBacklogCommands`. `BacklogQuestApp` dejó de coordinar esos efectos. El editor de
juego conserva un único controlador público, compuesto por controladores internos de Contenidos,
Copias y Partidas.

## Estilos por propietario v2.3.0

La hoja CSS monolítica se reemplazó por componentes de estilo de `styled-components`.
Las reglas particulares se distribuyeron entre las features que realmente las consumen y las
reglas con consumidores múltiples permanecieron en `shared/ui/tokens/GlobalStyles.ts`.
Las vistas y los modales autónomos montan su componente de estilo para no depender de haber
visitado previamente otra sección.

La regla arquitectónica rechaza nuevos archivos `.css` dentro de `src`. La migración no cambia
el formato del JSON, las claves de localStorage ni la interfaz de los casos de uso.

## Separación estructural

El componente original `BacklogQuestApp` superaba 3400 líneas y contenía vistas, editores, formularios y reglas de datos. Se dividió en features y componentes de una sola responsabilidad. Las transformaciones de juegos y plataformas pasaron a Application; comandos de misiones y lista permanecen en Domain; migración y localStorage viven en Infrastructure.

`GameEditor` se separó en paneles General, Copias y Partidas, con una interfaz coordinada por `useGameEditor` y controladores internos por relación. La fecha de disponibilidad, las dependencias y el catálogo de contenidos viven en General; misiones y partidas seleccionan sus contenidos por ID. `SettingsView` se convirtió en composición de secciones independientes.

## Shared

Se revisó por consumidores reales. `Button` y `Modal` permanecen compartidos; `Metric`, `EmptyCard` y `TooltipChip` se devolvieron a sus features. Los barrels y carpetas sin implementación se eliminaron.

## Interfaz menos opinativa

Se retiraron ejemplos estáticos que asumían bibliotecas o tipos de propiedad concretos. Los nombres específicos continúan apareciendo cuando provienen del JSON del usuario. IDs y datos estructurados gobiernan la lógica.

## Temas

Se agregaron temas predefinidos y personalizado. En v2.2.1 se corrigió el contraste de controles claros mediante variables dedicadas y `color-scheme` dinámico.

## Agregado rápido v2.2.1

La regresión provenía de usar `quickCopyPresetsReady` como interruptor de visibilidad: respaldos válidos con presets pero sin esa propiedad quedaban normalizados con `false`. La migración ahora deriva la bandera, el selector siempre consulta la colección global y reconstruye desde todas las copias cuando hace falta.

También se restauraron reglas de etiqueta, notas al convertir copias y los campos de prioridad de plataforma/notas en el modal personalizado.

## Protección futura

Se incorporaron Prettier, ESLint, SonarJS, Vitest y un verificador arquitectónico. `npm run validate` reúne todos los controles.

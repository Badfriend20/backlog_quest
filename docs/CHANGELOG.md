# Changelog

## 2.5.0 — 2026-07-27

### Styled components y sistema compartido

- `GlobalStyles` queda limitado a tokens, reset y elementos HTML base.
- Los scopes de feature son wrappers renderizados; ya no se inyectan hojas globales por feature.
- Modal, botones, tooltips, chips, tarjetas, rejillas, formularios, acciones y resúmenes usan
  `styled.tag`, `styled(Component)`, transient props y fragmentos `css`.
- Los patrones usados entre features se concentran en `shared/ui/atoms`, `layout` y `organisms`.
- La arquitectura rechaza `createGlobalStyle` fuera del reset y variantes de botón por clase.
- Se documenta un umbral objetivo de prop drilling que obliga a adoptar un gestor de estado.

## 2.4.0 — 2026-07-27

### Agenda flexible

- Cada misión admite cero o varias sesiones recurrentes, definidas por día y franja.
- Una misma misión puede programarse en franjas diferentes durante la semana y repetir más de una franja el mismo día.
- Plan muestra la franja correspondiente a cada sesión, no una franja global de la misión.
- Los conflictos se detectan únicamente cuando dos misiones coinciden en día y franja.
- Los respaldos con `weekdays` se migran automáticamente a `sessions` usando la franja preferida que ya tenía la misión.
- La edición vuelve a usar activadores `L M X J V S D`, agrupados dentro de cada franja única; se pueden agregar hasta cuatro franjas sin combinaciones duplicadas.

### Sistema de diseño y arquitectura

- `Button` vive en `shared/ui` como átomo reutilizable con variantes `primary`, `ghost`, `danger`, `warning` y `text`.
- Inicio, Misiones, Contenidos y la composición principal consumen el mismo botón tipado.
- La lógica recurrente de sesiones, conflictos y etiquetas se concentra en `shared/kernel/schedule.ts`.
- Se agregaron pruebas de migración, persistencia y generación de calendarios multirranja.
- Una fachada de comandos concentra persistencia, deshacer, avisos, importación y restauración fuera de `BacklogQuestApp`.
- `useGameEditor` compone controladores separados para Contenidos, Copias y Partidas sin cambiar la interfaz consumida por el modal.

## 2.3.0 — 2026-07-26

### Datos iniciales y presentación

- Estado inicial anónimo, sin juegos, cola, misiones, dispositivos, actividad ni presets personales.
- Eliminado `meta.owner`; los respaldos anteriores siguen importándose y el campo se descarta al normalizar.
- Pruebas de dominio desacopladas del JSON inicial mediante datos sintéticos.
- “Tarjetas compactas” se aclara como una vista de menor espaciado que no oculta información.
- Biblioteca incorpora orden independiente de Cola: pendientes primero, alfabético, prioridad o actividad reciente.
- Las partidas pueden eliminarse aunque estén vinculadas; las misiones permanecen desacopladas y muestran una alerta.
- Las copias pueden eliminarse aunque estén vinculadas; misiones, partidas y Cola limpian la referencia sin perder historial.
- Inicio y Plan distinguen misiones activas `Sin copia` y `Sin partida`.
- Las alertas de relaciones abren directamente el formulario de alta y vinculan el registro al guardarlo.
- Crear partidas requiere una copia disponible, sin volver a bloquear la eliminación posterior.
- General administra un catálogo ordenable de contenidos; misiones y partidas seleccionan sus elementos por ID.
- Eliminar contenido desacopla las relaciones sin perder sus snapshots históricos; las misiones afectadas muestran `Sin contenido`.
- Crear partidas requiere además un contenido disponible.
- Editar misión queda visible en la tarjeta y permite corregir contenido sin abandonar.
- Cerrar una misión sin partida crea y vincula el historial faltante.

### Arquitectura visual

- Migración del runtime de estilos a `styled-components`.
- Eliminación de hojas `.css` cargadas por el punto de entrada.
- Tokens, reset y reglas transversales montados como un componente de estilo tipado.
- Documentación de propiedad, colocación y reutilización de estilos.
- Conservación de temas, comportamiento responsivo y generación PWA.

## 2.2.1 — 2026-07-22

### Corregido

- Administración de dispositivos migrada desde Configuración a la vista Dispositivos, con formulario individual para alta y edición desde cada tarjeta.
- Eliminación de dispositivos bloqueada mientras existan referencias, sin cambiar IDs ni el formato persistido.
- Copias compactas con formulario bajo demanda y nuevas copias abiertas al inicio de la lista.
- Eliminación de prioridad de plataforma y del porcentaje global de progreso.
- Progreso entre copias renombrado, aclarado con tooltip y normalizado mediante estados estables.
- Separadas plataformas, propiedades y dispositivos como conceptos independientes.
- Nueva configuración persistente de plataformas con altas, renombres, activación, eliminación segura y fusión por nombre.
- Migración de bibliotecas heredadas que incluían la propiedad dentro del nombre, sin reglas ligadas a marcas concretas.
- Copias y agregado rápido ahora referencian plataformas mediante IDs estables.
- Restaurada la visibilidad global de Agregado rápido en respaldos sin `quickCopyPresetsReady`.
- Reconstrucción de presets desde todas las copias cuando la colección está ausente o vacía.
- Deduplicación normalizada y prioridad de la configuración más reciente.
- Etiquetas genéricas para propiedad propia, no repetición e inclusión dinámica de otras propiedades.
- Conservación de notas al generar presets desde copias.
- Restaurados prioridad de plataforma y notas en la configuración rápida personalizada.
- Contraste de inputs, selects, textareas y controles nativos en el tema Claro.
- Agregado rápido muestra todas las combinaciones en ancho completo y mantiene primero la más reciente.
- Los presets crean copias sin preseleccionar dispositivos.
- Nueva configuración desopinionada de propiedades: ocultar o definir una etiqueta de hasta 24 caracteres.

### Arquitectura y calidad

- Generación, manifiesto y registro PWA centralizados en `vite-plugin-pwa`; eliminados el registro React y el generador Workbox manuales.
- ESLint ahora ejecuta el perfil estricto de `eslint-plugin-jsx-a11y` y `prefer-tag-over-role` sobre todos los componentes TSX.
- Corregidos elementos ARIA sustituibles por HTML semántico, asociaciones de labels y navegación por teclado de tooltips.
- Selectores puros para presets globales y claves existentes.
- Separación entre el valor funcional de propiedad y sus reglas de presentación.
- Eliminado el árbol legacy duplicado de `src/`; el único punto de entrada es `src/app/composition/main.tsx`.
- Pruebas Vitest de agregado rápido, temas, migración y acciones de misión.
- Documentación técnica y funcional en `docs/`.
- Eliminación de barrels y directorios vacíos.

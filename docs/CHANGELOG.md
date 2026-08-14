# Changelog

## Sin publicar — 2026-08-13

- Colección, cards de misión y Orden manual permiten cambiar la prioridad general de una actividad
  desde un chip accesible, con opciones del catálogo, persistencia y Deshacer.
- Las cards de Colección separan encabezado, contenido abrible y acción de activación para evitar
  controles interactivos anidados.
- Camino sugerido y Rotación sugerida permiten mover una recomendación a mitad, a dos tercios o al
  final del orden manual sin activar una misión, respetando pins y Deshacer.
- Recursos elimina `currentRole`; las notas conservan contexto manual y Balance deriva el uso actual
  de las misiones activas.
- La importación deja de aceptar respaldos con `schemaVersion: 1` y conserva únicamente la
  normalización del formato actual con `schemaVersion: 2`.
- Portabilidad simplifica sus etiquetas visibles a **Exportar JSON** e **Importar JSON**.

## 2.6.0 — 2026-07-29

### Modelo neutral y vocabulario

- El kernel compartido adopta `QuestData`, `Activity`, `ActivityVariant`, `ActivityContent`,
  `Journey`, `Resource` y `Channel` como lenguaje canónico, sin cambiar las claves históricas del
  JSON v2.
- Configuración incorpora perfiles de vocabulario para actividades genéricas, videojuegos,
  lectura, aprendizaje y proyectos, además de un perfil personalizado con valores genéricos de
  respaldo.
- Los estados de actividad y recorrido conservan valores estables, pero presentan etiquetas
  acordes al perfil activo, como `Jugando`, `Leyendo`, `Cursando` o `En ejecución`.
- Navegación, encabezados, métricas, formularios y mensajes dejan de asumir que toda actividad es
  un videojuego.

### Catálogos y compatibilidad histórica

- Formas de acceso y canales reutilizan un mismo módulo de catálogo editable con políticas de
  eliminación específicas.
- Eliminar una forma de acceso no reescribe modalidades ni historiales existentes; la opción deja
  de ofrecerse para relaciones nuevas y los formularios usan `Por definir` si el catálogo queda
  vacío.
- Los respaldos v1 y v2 continúan importándose mediante el adaptador de migración, y el JSON inicial
  v2 incluye preferencias y catálogos compatibles con los nuevos valores genéricos.

### Temas y componentes compartidos

- La composición monta `ThemeProvider` de `styled-components` y centraliza colores de fondo,
  contenedor, barra lateral, paneles, texto, bordes y estados.
- `CardSurface` y sus variantes seleccionables sustituyen superficies y degradados duplicados en
  Inicio, Colección, Misiones, Recursos y Configuración.
- Se corrige el contraste del texto en Historial y Configuración para el tema Claro.

### Interfaz y PWA

- Historial usa el color de texto temático en todas sus celdas y conserva contraste en Claro.
- Configuración incorpora seis JSON de ejemplo con 15 actividades cada uno y una sesión de
  demostración persistente, reversible y separada de los datos reales.
- La sección de datos de ejemplo explica la diferencia entre probar temporalmente y descargar un
  JSON sin modificar los datos actuales.
- Los JSON de demostración forman parte del precache offline.
- Temas, vocabulario y franjas comparten la misma superficie de selección derivada de
  `CardSurface`.
- El selector nativo de archivos permanece oculto y la importación se abre desde el botón propio.
- Las actualizaciones del service worker quedan en espera hasta que el usuario pulse **Actualizar**.

### Calidad y documentación

- La validación detecta secuencias de texto posiblemente mal codificadas antes de ejecutar pruebas
  y build.
- Se amplían las pruebas de vocabulario, migración, sesiones de demostración, temas, contraste y
  primitivas compartidas.
- El lenguaje del dominio, arquitectura, datos, estilos, offline y especificación funcional
  documentan el modelo neutral y su compatibilidad con respaldos existentes.
- El `README.md` raíz concentra instalación, comandos y navegación documental.
- Temas se integra en la arquitectura de estilos y se eliminan guías históricas duplicadas.
- La especificación funcional contiene únicamente comportamiento implementado.

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

- Estado inicial anónimo, sin juegos, lista, misiones, dispositivos, actividad ni presets personales.
- Eliminado `meta.owner`; los respaldos anteriores siguen importándose y el campo se descarta al normalizar.
- Pruebas de dominio desacopladas del JSON inicial mediante datos sintéticos.
- “Tarjetas compactas” se aclara como una vista de menor espaciado que no oculta información.
- Biblioteca incorpora orden independiente de Lista: pendientes primero, alfabético, prioridad o actividad reciente.
- Las partidas pueden eliminarse aunque estén vinculadas; las misiones permanecen desacopladas y muestran una alerta.
- Las copias pueden eliminarse aunque estén vinculadas; misiones, partidas y Lista limpian la referencia sin perder historial.
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

## 2.2.0

- Agregado rápido se genera desde combinaciones únicas de plataforma y propiedad, priorizando las
  utilizadas más recientemente.
- Copias, partidas, misiones y Lista incorporan referencias estables a dispositivos.
- Los respaldos mantienen `schemaVersion: 2` y se normalizan de forma retrocompatible.

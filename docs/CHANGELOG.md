# Changelog

## 2.3.0 — 2026-07-26

### Datos iniciales y presentación

- Estado inicial anónimo, sin juegos, cola, misiones, dispositivos, actividad ni presets personales.
- Eliminado `meta.owner`; los respaldos anteriores siguen importándose y el campo se descarta al normalizar.
- Pruebas de dominio desacopladas del JSON inicial mediante datos sintéticos.
- “Tarjetas compactas” se aclara como una vista de menor espaciado que no oculta información.

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

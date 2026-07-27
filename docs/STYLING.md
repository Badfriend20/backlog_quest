# Arquitectura de estilos

Desde la versión 2.3.0, Backlog Quest utiliza `styled-components`. El punto de entrada no importa hojas CSS y los estilos se distribuyen según su propietario.

## Propiedad

- `shared/ui/tokens/GlobalStyles.ts` contiene únicamente reglas transversales: tokens, reset, controles nativos y patrones consumidos realmente por más de una feature.
- Cada feature mantiene un componente de estilo en su carpeta `ui`: `BacklogStyles`, `DashboardStyles`, `DevicesStyles`, `GamesStyles`, `HistoryStyles`, `MissionsStyles`, `QueueStyles`, `ScheduleStyles` y `SettingsStyles`.
- La vista o componente autónomo que puede aparecer fuera de su vista principal monta el componente de estilo que necesita. Por ejemplo, `GameEditor` monta `GamesStyles` y `MissionEditor` monta `MissionsStyles`.
- Los temas siguen llegando desde las preferencias como variables CSS en el shell. Las reglas de los styled components consumen esas variables, por lo que no duplican la lógica de temas.

## Criterio de colocación

Una regla pertenece a una feature cuando todos sus consumidores están en esa feature. Solo se mueve a `shared` después de comprobar consumidores reales en más de una feature y una semántica estable.

No se crean wrappers styled que únicamente reenvían propiedades. Un componente de estilo debe ocultar una decisión visual reutilizable o concentrar las reglas de una vista completa.

## Responsivo

Los media queries viven junto al módulo al que modifican. Las reglas transversales, como el cambio entre sidebar y encabezado móvil, pertenecen a `BacklogStyles`. Los breakpoints actuales verificados son 320, 390, 760, 761, 900 y 1280 píxeles.

## Reglas verificables

- No se admiten archivos `.css` dentro de `src`.
- `src/app/composition/main.tsx` monta `GlobalStyles`.
- Una feature no importa el archivo de estilos interno de otra feature.
- `npm run check:architecture` comprueba que no reaparezcan hojas CSS.
- `npm run validate` comprueba formato, lint, pruebas, arquitectura y build.

## Cómo agregar estilos

1. Agrega la regla al componente de estilo de la feature propietaria.
2. Si el componente puede renderizarse de forma autónoma, asegúrate de que monte su componente de estilo.
3. Conserva estados visuales como clases semánticas o atributos; no introduzcas estilos inline salvo variables dinámicas del tema.
4. Ejecuta `npm run validate`.
5. Revisa al menos un ancho móvil y uno de escritorio cuando cambies layout, overflow o posición.

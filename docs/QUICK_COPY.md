# Agregado rápido global

## Propósito

Agregado rápido reutiliza configuraciones de copias usadas previamente. Las opciones proceden de datos del usuario, nunca de botones fijos ni textos promocionales.

## Fuente y fallback

La fuente primaria es `preferences.quickCopyPresets`. `selectGlobalQuickCopyPresets(data)` ignora la antigua bandera de visibilidad y devuelve los presets almacenados. Si faltan, reconstruye desde `games.flatMap(game => game.copies)`.

La migración marca `quickCopyPresetsReady=true` cuando existe al menos un preset. Esto conserva compatibilidad, pero la UI ya no depende de esa bandera para ocultar datos válidos.

## Identidad y orden

`quickCopyKey(library, ownership, platformId)` usa el ID estable de plataforma y la propiedad. Una combinación aparece una sola vez aunque la plataforma sea renombrada. Al guardar un juego, sus copias se convierten en presets recientes y se colocan al inicio; el resto permanece después, hasta un máximo de 80.

Cuando una combinación se repite, gana la configuración entrante más reciente: dispositivos, prioridad, sesión, progreso entre copias y notas.

## Presentación

`quickCopyLabel` usa `preferences.ownershipDisplayRules`. Cada término de propiedad tiene dos decisiones de presentación independientes del valor funcional:

- `hidden`: muestra solo la biblioteca;
- `label`: texto breve que se agrega después de la biblioteca, con un máximo de 24 caracteres.

Si la biblioteca ya contiene el texto configurado, no se repite. La UI muestra todas las combinaciones globales en una lista responsiva de ancho completo. La combinación usada más recientemente queda primero. Una combinación presente en el borrador permanece visible, se deshabilita y muestra `Ya agregada`; nunca filtra las demás.

Configuración > Propiedades permite ocultar cada propiedad o cambiar su texto visible. Al ocultarla, el campo de texto se deshabilita. Esto no renombra el valor del catálogo ni modifica la identidad de los presets.

## Configuración personalizada

El modal permite plataforma, propiedad, prioridad, sesión ideal, progreso entre copias y notas. `createQuickCopyPreset` construye el objeto completo. Al elegir una opción se crea una copia nueva prellenada, pero sin dispositivos (`deviceIds=[]`); estos se eligen explícitamente en el formulario. El preset permanece en la pestaña Copias y se vuelve global al guardar el juego.

## Caso de aceptación

Con Xbox/Game Pass, Nintendo Switch/Propio y Steam/Biblioteca familiar, al editar Xbox deben aparecer las tres: Xbox deshabilitada, Nintendo y Steam habilitadas.

Las pruebas permanentes están en `backlogSelectors.test.ts`, `quickCopy.test.ts` y `migration.test.ts`.

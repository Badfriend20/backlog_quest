# Pruebas y validación

Los escenarios que necesitan juegos, copias, dispositivos o misiones usan una fixture sintética de `shared/testing`. No deben depender del JSON inicial de producción, que intencionalmente permanece vacío y anónimo.

## Pirámide actual

Vitest prueba seams puras y estables:

- agregado rápido: clave, etiqueta configurable, selección global, deduplicación, recencia y copias sin dispositivos preseleccionados;
- creación de presets personalizados;
- normalización y reconstrucción de presets;
- normalización, persistencia y fusión de plataformas con conservación de referencias;
- tema claro;
- pausar, aplazar, enviar al final, terminar y activar misiones.
- rotación sugerida: prioridad, orden manual, historial por recurso, restricciones, diversidad,
  pins, fecha inyectada e inmutabilidad.
- movimiento directo de recomendaciones: destinos relativos, continuidad, estado, pins, límites,
  bitácora y efecto sobre la posición observada por la rotación.
- importación: formato actual válido y normalizable, rechazo de formatos anteriores, desconocidos o
  sin estructura suficiente.

Las pruebas usan resultados literales de la especificación, no replican el algoritmo dentro del test.

## Comandos

```bash
npm run test
npm run lint
npm run check:architecture
npm run build
npm run validate
```

`npm run build` ejecuta Vite y `vite-plugin-pwa` genera dentro del mismo proceso `dist/sw.js`, el runtime de Workbox y `dist/manifest.webmanifest`. El registro controlado se integra en el JavaScript compilado mediante `PwaUpdatePrompt`.

`validate` debe pasar antes de entregar. Añadir una regresión requiere primero una prueba roja en la seam pública que reproduce el síntoma y después el cambio mínimo que la vuelve verde.

`npm run lint` analiza todo el proyecto con TypeScript ESLint, React Hooks, SonarJS y el perfil estricto de accesibilidad JSX. También activa `jsx-a11y/prefer-tag-over-role`, que reproduce localmente los avisos de Sonar sobre preferir elementos HTML semánticos frente a roles ARIA.

## Checklist manual de UI

- Tema Claro: inputs, selects, textareas, placeholders y selectores nativos son legibles.
- Copias: aparecen todas las combinaciones globales a lo ancho disponible; las existentes están deshabilitadas sin ocultar otras.
- Configurar: el modal muestra todos los presets y los campos configurables, excepto dispositivos.
- Propiedades: ocultar deshabilita el texto visible; al mostrarlo se respeta el máximo de 24 caracteres.
- Tema personalizado: cada color se persiste al cambiar de vista.
- Portabilidad: solo se muestran **Exportar JSON** e **Importar JSON**; el selector nativo permanece oculto.
- Inicio y Lista: Camino sugerido y Rotación sugerida permiten activar o mover hacia abajo; los
  destinos anteriores y las posiciones fijadas permanecen deshabilitados.
- Recursos: no existe un campo de rol manual; Balance muestra actividad activa, notas o el fallback
  discreto correspondiente.
- Actualización PWA: una versión nueva queda en espera hasta pulsar **Actualizar** en el aviso.
- Vista compacta: reduce espacios en Inicio, Biblioteca y Lista sin ocultar información.
- Biblioteca: cambiar el orden no modifica posiciones de Lista y los cerrados quedan al final en el orden predeterminado.
- Partidas: eliminar una vinculada conserva la misión con alerta; editarla o cerrarla vuelve a crear el vínculo.
- Copias: eliminar una vinculada conserva misión y partida, limpia la preferencia de Lista y muestra `Sin copia` sin borrar las descripciones históricas.
- Alertas de misión: `Sin contenido` abre General; `Sin copia` abre una copia nueva; `Sin partida` abre una partida nueva y queda deshabilitada hasta que existan copia y contenido.
- Contenidos: renombrar sincroniza los snapshots; eliminar desacopla misión y partida conservando título y tipo históricos.
- Creación de partidas: siempre comienza con una copia y un contenido válidos; eliminar cualquiera posteriormente sigue permitido.
- Agenda: una regla heredada conserva sus días al migrar y cada uno recibe la franja preferida anterior.
- Agenda multirranja: `generateSchedule` respeta la franja de cada combinación día/franja y `activateMission` guarda la lista completa.
- Activadores de agenda: agrupar sesiones produce una sola entrada por franja; alternar un día no duplica la franja ni modifica los demás días.
- Conflictos: solo bloquean sesiones que coinciden simultáneamente en día y franja.
- Tooltips: cursor y teclado no quedan recortados en las chips inferiores.

## Incorporar nuevas pruebas

Colocar pruebas junto al módulo (`*.test.ts`). Probar interfaces y resultados observables; no mocks de funciones internas. Si una operación no puede probarse sin atravesar UI, primero evaluar si falta una seam pura.

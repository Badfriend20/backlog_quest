# Pruebas y validación

Los escenarios que necesitan juegos, copias, dispositivos o misiones usan una fixture sintética de `shared/testing`. No deben depender del JSON inicial de producción, que intencionalmente permanece vacío y anónimo.

## Pirámide actual

Vitest prueba seams puras y estables:

- agregado rápido: clave, etiqueta configurable, selección global, deduplicación, recencia y copias sin dispositivos preseleccionados;
- creación de presets personalizados;
- migración y reconstrucción de presets;
- migración, persistencia y fusión de plataformas con conservación de referencias;
- tema claro;
- pausar, aplazar, enviar al final, terminar y activar misiones.

Las pruebas usan resultados literales de la especificación, no replican el algoritmo dentro del test.

## Comandos

```bash
npm run test
npm run lint
npm run check:architecture
npm run build
npm run validate
```

`npm run build` ejecuta Vite y `vite-plugin-pwa` genera dentro del mismo proceso `dist/sw.js`, `dist/registerSW.js`, el runtime de Workbox y `dist/manifest.webmanifest`.

`validate` debe pasar antes de entregar. Añadir una regresión requiere primero una prueba roja en la seam pública que reproduce el síntoma y después el cambio mínimo que la vuelve verde.

`npm run lint` analiza todo el proyecto con TypeScript ESLint, React Hooks, SonarJS y el perfil estricto de accesibilidad JSX. También activa `jsx-a11y/prefer-tag-over-role`, que reproduce localmente los avisos de Sonar sobre preferir elementos HTML semánticos frente a roles ARIA.

## Checklist manual de UI

- Tema Claro: inputs, selects, textareas, placeholders y selectores nativos son legibles.
- Copias: aparecen todas las combinaciones globales a lo ancho disponible; las existentes están deshabilitadas sin ocultar otras.
- Configurar: el modal muestra todos los presets y los campos configurables, excepto dispositivos.
- Propiedades: ocultar deshabilita el texto visible; al mostrarlo se respeta el máximo de 24 caracteres.
- Tema personalizado: cada color se persiste al cambiar de vista.
- Vista compacta: reduce espacios en Inicio, Biblioteca y Cola sin ocultar información.
- Tooltips: cursor y teclado no quedan recortados en las chips inferiores.

## Incorporar nuevas pruebas

Colocar pruebas junto al módulo (`*.test.ts`). Probar interfaces y resultados observables; no mocks de funciones internas. Si una operación no puede probarse sin atravesar UI, primero evaluar si falta una seam pura.

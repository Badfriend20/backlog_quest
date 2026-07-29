# Modo offline y caché

## GitHub Pages

El workflow `.github/workflows/deploy.yml` compila con Vite y publica exclusivamente `dist` mediante el artefacto oficial de Pages. En **Settings → Pages → Build and deployment**, la fuente debe ser **GitHub Actions**; seleccionar una rama activa el flujo de Jekyll y publica archivos fuente o documentación en lugar de la aplicación.

`npm run check:pages` verifica que el workflow use Actions compatibles con Node.js 24, que el artefacto apunte a `dist` y que el HTML compilado no conserve referencias a `main.tsx`.

## Configuración

`VitePWA` en `vite.config.ts` genera el service worker, el manifiesto y el precache. El componente `PwaUpdatePrompt` registra el worker mediante el módulo virtual de Vite PWA para poder avisar cuando una versión nueva está esperando.

El plugin usa la estrategia `generateSW` y durante `npm run build` produce:

- `dist/sw.js` con el precache revisionado;
- `dist/workbox-<hash>.js` con el runtime local;
- `dist/manifest.webmanifest` a partir de la configuración de Vite.

## Actualización

`registerType: "prompt"` descarga la versión nueva y la deja en espera. `PwaUpdatePrompt` muestra el aviso **Hay una actualización disponible** y el botón **Actualizar**; al pulsarlo, el worker nuevo toma el control y la página se recarga. Workbox elimina las entradas obsoletas.

Las navegaciones usan `index.html` como fallback. Workbox incluye HTML, JavaScript y CSS; el plugin agrega el manifiesto y sus iconos sin duplicarlos. Los sourcemaps se excluyen.

## Comandos

```bash
npm run build
npm run preview
```

No existe un paso de generación separado: ejecutar Vite es suficiente y evita producir artefactos PWA a partir de un `dist/` desactualizado.

## Verificación

Después de `npm run build` deben existir los artefactos indicados arriba. `index.html` debe enlazar el manifiesto y el JavaScript compilado debe incluir el registro controlado por `PwaUpdatePrompt`.

# Modo offline y caché

## GitHub Pages

El workflow `.github/workflows/deploy.yml` compila con Vite y publica exclusivamente `dist` mediante el artefacto oficial de Pages. En **Settings → Pages → Build and deployment**, la fuente debe ser **GitHub Actions**; seleccionar una rama activa el flujo de Jekyll y publica archivos fuente o documentación en lugar de la aplicación.

`npm run check:pages` verifica que el workflow use Actions compatibles con Node.js 24, que el artefacto apunte a `dist` y que el HTML compilado no conserve referencias a `main.tsx`.

## Única configuración

La PWA se configura exclusivamente mediante `VitePWA` en `vite.config.ts`. No existen un service worker fuente, un script de generación posterior al build, un manifiesto manual ni código de registro dentro de React.

El plugin usa la estrategia `generateSW` y durante `npm run build` produce:

- `dist/sw.js` con el precache revisionado;
- `dist/workbox-<hash>.js` con el runtime local;
- `dist/registerSW.js` y su inclusión automática en el HTML;
- `dist/manifest.webmanifest` a partir de la configuración de Vite.

## Actualización

`registerType: "autoUpdate"` conserva activación inmediata y control de clientes. Cada build recalcula las revisiones según el contenido; los recursos modificados se descargan en la siguiente instalación y Workbox elimina las entradas obsoletas.

Las navegaciones usan `index.html` como fallback. Workbox incluye HTML, JavaScript y CSS; el plugin agrega el manifiesto y sus iconos sin duplicarlos. Los sourcemaps se excluyen.

## Comandos

```bash
npm run build
npm run preview
```

No existe un paso de generación separado: ejecutar Vite es suficiente y evita producir artefactos PWA a partir de un `dist/` desactualizado.

## Verificación

Después de `npm run build` deben existir los cuatro artefactos indicados arriba. `index.html` debe enlazar el manifiesto e incluir `registerSW.js`; el punto de entrada React no debe contener lógica de registro PWA.

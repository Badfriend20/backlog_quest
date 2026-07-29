import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: "auto",
      registerType: "prompt",
      manifest: {
        name: "Backlog Quest",
        short_name: "BacklogQuest",
        description: "Seguimiento gamer local, portable y sin nube.",
        lang: "es",
        start_url: "./",
        scope: "./",
        display: "standalone",
        background_color: "#0d0a17",
        theme_color: "#151126",
        screenshots: [
          {
            src: "screenshots/backlog-quest-desktop.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
            label: "Panel principal de Backlog Quest en escritorio",
          },
          {
            src: "screenshots/backlog-quest-mobile.png",
            sizes: "390x844",
            type: "image/png",
            label: "Panel principal de Backlog Quest en móvil",
          },
        ],
        icons: [
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{html,js,css}"],
        globIgnores: ["**/*.map"],
        navigateFallback: "index.html",
        sourcemap: false,
      },
    }),
  ],
  // La ruta relativa permite publicar el mismo build en cualquier repositorio
  // de GitHub Pages sin conocer de antemano el nombre del repo.
  base: "./",
  build: {
    sourcemap: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          minSize: 10_000,
          groups: [
            {
              name: "react-vendor",
              test: /node_modules[\\/](?:react|react-dom|scheduler)[\\/]/,
              priority: 30,
            },
            {
              name: "styles-vendor",
              test: /node_modules[\\/]styled-components[\\/]/,
              priority: 20,
            },
            {
              name: "vendor",
              test: /node_modules[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
});

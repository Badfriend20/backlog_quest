# Arquitectura frontend

El único punto de entrada de la aplicación es `src/app/composition/main.tsx`. No deben recrearse implementaciones paralelas como `src/main.tsx` o `src/App.tsx`; toda funcionalidad nueva pertenece a una feature o a un módulo compartido justificado.

La infraestructura offline tiene una única seam en `vite.config.ts`. `vite-plugin-pwa` genera durante `vite build` el manifiesto web, el registro, el service worker y el precache de Workbox; React no registra ni implementa service workers y `public/` solo conserva los iconos estáticos.

## Objetivo

La arquitectura favorece localidad: cada cambio funcional debe concentrarse en su feature. Una carpeta no existe para satisfacer un diagrama; existe únicamente cuando contiene comportamiento real.

## Estructura

```text
src/
  app/composition/       composición y arranque
  data/                  respaldo inicial incluido
  features/
    backlog/             coordinación, comandos, migración y persistencia
    dashboard/           vista de inicio
    devices/             catálogo, reglas de integridad, edición y selectores de dispositivos
    games/               biblioteca, editor, copias y partidas
    history/             historial global
    missions/            cards, activación y cierre
    queue/               cola completa
    schedule/            calendario generado
    settings/            preferencias y temas
  shared/
    kernel/              contratos y selectores usados por varias features
    ui/organisms/        UI realmente compartida
    ui/tokens/           tokens, reset y estilos transversales con styled-components
```

## Capas de una feature

- `domain`: reglas puras. No importa React, UI, Platform ni Infrastructure.
- `application`: casos de uso, transformaciones y puertos.
- `infrastructure`: adaptadores concretos, migración y navegador.
- `ui`: componentes y hooks de presentación. No realiza I/O directo.
- `index.ts`: interfaz pública de la feature. Solo existe si exporta algo usado externamente.

No todas las features necesitan todas las capas. Agregar carpetas vacías está prohibido.

## Política de shared

Un módulo entra en `shared` solamente si tiene consumidores reales en más de una feature y semántica transversal estable. Si solo lo utiliza una feature, vive junto a ella.

Ejemplos actuales:

- `Modal` es compartido por Games y Missions.
- Los contratos `BacklogData`, `Game`, `Mission` y sus selectores son transversales.
- `Metric` y `EmptyCard` pertenecen a Dashboard.
- `TooltipChip` pertenece a Missions.

No se promociona código a `shared` por una posible reutilización futura.

Los estilos siguen la misma política. Cada feature conserva en `ui` su componente de estilo,
mientras `shared/ui/tokens/GlobalStyles.ts` contiene solo reglas con alcance transversal. No se
importan hojas `.css`; consulta `STYLING.md` para los criterios y verificaciones.

La feature `devices` es propietaria del alta, edición, borrado seguro y presentación del catálogo. `settings` no administra dispositivos; la composición solo entrega el comando que persiste la colección y sincroniza sus etiquetas derivadas.

## Reglas automáticas

`npm run check:architecture` rechaza:

- más de un componente implementado por archivo;
- componentes de más de 350 líneas;
- imports de internals entre features;
- dependencias de Shared hacia features;
- Domain dependiente de React o capas externas;
- Infrastructure dependiente de UI;
- UI realizando I/O mediante Platform;
- un organismo compartido componiendo más de otro organismo;
- archivos `index.ts` vacíos y directorios vacíos.
- archivos `.css` dentro de `src`.

## Criterio para extraer un módulo

Se extrae cuando existe una responsabilidad nombrable, una interfaz más pequeña que su implementación y una prueba natural a través de esa interfaz. No se extraen wrappers que solo reenvían props.

## Public exports

Los consumidores externos importan desde el `index.ts` de una feature. Los módulos internos de la misma feature pueden usar rutas relativas. Un barrel vacío es un error, no un marcador de posición.

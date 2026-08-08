# Arquitectura frontend

El único punto de entrada de la aplicación es `src/app/composition/main.tsx`. No deben recrearse implementaciones paralelas como `src/main.tsx` o `src/App.tsx`; toda funcionalidad nueva pertenece a una feature o a un módulo compartido justificado.

La infraestructura offline se divide en dos seams: `vite.config.ts` genera el manifiesto, el service worker y el precache de Workbox; `app/composition/PwaUpdatePrompt.tsx` registra el worker y presenta la actualización pendiente. React no implementa un service worker propio y `public/` conserva iconos y JSON de demostración estáticos.

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
    queue/               orden manual y rotación sugerida
    schedule/            calendario generado
    settings/            preferencias y temas
  shared/
    kernel/              contratos y selectores usados por varias features
    ui/atoms/            controles visuales indivisibles y reutilizables
    ui/layout/           composición visual compartida sin lógica de dominio
    ui/organisms/        UI compuesta realmente compartida
    ui/tokens/           únicamente tokens y reset global
```

## Capas de una feature

- `domain`: reglas puras. No importa React, UI, Platform ni Infrastructure.
- `application`: casos de uso, transformaciones y puertos.
- `infrastructure`: adaptadores concretos, migración y navegador.
- `ui`: componentes y hooks de presentación. No realiza I/O directo.
- `index.ts`: interfaz pública de la feature. Solo existe si exporta algo usado externamente.

No todas las features necesitan todas las capas. Agregar carpetas vacías está prohibido.

## Política de shared

El kernel transversal expone `QuestData`, `Activity`, `ActivityVariant`, `ActivityContent`,
`ActivityProgress`, `Journey`, `Resource` y `Channel`. Las claves históricas del JSON v2 se
conservan como contrato de portabilidad y la migración actúa como adaptador; no deben volver a ser
el lenguaje canónico del código.

`shared/vocabulary` es un módulo profundo compartido por las vistas. Su interfaz resuelve un perfil
completo y aplica el vocabulario genérico cuando un término personalizado está vacío. Cambiar un
perfil afecta solamente la presentación y nunca los identificadores o relaciones persistidas.

`settings/ui/EditableCatalogSection` concentra la edición visual de catálogos: borrador, alta,
descarte, guardado, conteo de referencias y confirmación de eliminación. Formas de acceso y canales
son dos adapters de esa seam; aportan sus campos y política de referencias sin duplicar el flujo.

Un módulo entra en `shared` solamente si tiene consumidores reales en más de una feature y semántica transversal estable. Si solo lo utiliza una feature, vive junto a ella.

Ejemplos actuales:

- `Button` es el átomo compartido del sistema de diseño para acciones primarias, secundarias, destructivas y de texto.
- `CardSurface` es la seam de superficie consumida por Dashboard, Games, Missions, Devices y
  Settings. `GameCard`, `LibraryCard` y `RelationCard` son adapters visuales, no implementaciones
  paralelas.
- `Modal` es compartido por Games y Missions.
- Los contratos `QuestData`, `Activity`, `Mission` y sus selectores son transversales; los nombres
  históricos del JSON quedan encapsulados en el adaptador de persistencia.
- `Metric` y `EmptyCard` pertenecen a Dashboard.
- `TooltipChip` pertenece a Missions.

No se promociona código a `shared` por una posible reutilización futura.

Los estilos siguen la misma política. Cada elemento reutilizable se implementa con `styled.tag`,
`styled(Component)` o fragmentos `css` explícitos. Los ámbitos de feature son wrappers renderizados
y nunca inyectan estilos globales. `GlobalStyles.ts` se limita a tokens, reset y elementos HTML
base. No se importan hojas `.css`; consulta `STYLING.md`.

La feature `devices` es propietaria del alta, edición, borrado seguro y presentación del catálogo. `settings` no administra dispositivos; la composición solo entrega el comando que persiste la colección y sincroniza sus etiquetas derivadas.

La feature `games` es propietaria del catálogo de contenidos. `Mission` y `Playthrough` no crean contenidos: referencian un `contentId` y conservan snapshots descriptivos para tolerar la eliminación posterior. Las mutaciones coordinadas que sincronizan o desacoplan estas relaciones viven en `backlog/application`, no en componentes React.

`shared/kernel/schedule.ts` concentra el lenguaje transversal de agenda: normalización de sesiones recurrentes, detección de conflictos y etiquetas. Missions edita esas sesiones, Backlog las persiste y Schedule las proyecta; ninguna de esas features reimplementa la regla.

`backlog/application/useBacklogCommands.ts` es la fachada que posee el estado persistente, el snapshot de deshacer, las notificaciones y las operaciones de importar, restaurar y exportar. `BacklogQuestApp` conserva únicamente estado efímero de navegación y modales.

`queue/domain/rotation.ts` es propietario de la elegibilidad, la deuda de rotación por recurso, la
puntuación base y la selección diversa de recomendaciones. `RotationPlan` es una proyección pura y
determinista de `QuestData` para una fecha de referencia: no persiste resultados ni modifica
`QueueItem.position`. Dashboard consume esta capacidad exclusivamente mediante el `index.ts` de
Queue; la lista manual continúa derivándose con `sortedQueue`.

`backlog/application/demoSession.ts` concentra la transición pura entre datos reales, ejemplo y
respaldo original. `BacklogStorage` persiste ese respaldo en una clave separada y Settings aporta
los JSON y la interacción; ningún componente accede directamente a `localStorage`.

`useGameEditor` mantiene una interfaz estable para `GameEditor`, pero compone controladores internos independientes para Contenidos, Copias y Partidas. Cada controlador concentra su edición, snapshot y sincronización; agregar una operación de una relación no exige modificar las demás.

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
- `createGlobalStyle` fuera del único reset global;
- variantes visuales de botón recreadas mediante clases.

## Criterio para extraer un módulo

Se extrae cuando existe una responsabilidad nombrable, una interfaz más pequeña que su implementación y una prueba natural a través de esa interfaz. No se extraen wrappers que solo reenvían props.

La segunda aparición confirmada de una misma pieza de interfaz es el umbral de extracción: si ambas
apariciones pertenecen a una feature, se crea un componente local; si pertenecen a features
distintas y conservan la misma semántica, se promueve a `shared/ui`. Se permite repetir una regla
pequeña de layout cuando abstraerla mezclaría conceptos distintos, pero no se duplica una parte de
componente con comportamiento o estados.

## Umbral de prop drilling y gestor de estado

Se considera **uso elevado de prop drilling** cuando se cumple al menos una condición:

1. un dato o una acción atraviesa tres o más límites de componentes sin ser consumido por los
   intermediarios;
2. un grupo de cinco o más props de estado/acciones se reenvía unido hacia dos o más ramas;
3. el mismo estado mutable es consumido por tres o más features;
4. una operación transversal ordinaria obliga a modificar cuatro o más componentes intermediarios
   únicamente para transportar props.

Al alcanzar cualquiera de esos umbrales es obligatorio introducir un gestor de estado antes de
seguir extendiendo el flujo. La opción predeterminada es Zustand con stores pequeños, acciones
orientadas a casos de uso y selectores por feature. Context API queda reservado para dependencias
estables y de baja frecuencia; Redux Toolkit solo se justifica cuando se necesita trazabilidad de
eventos, middleware o flujos asíncronos complejos. El store no absorbe reglas de dominio ni
persistencia: coordina estado y llama a Application.

## Public exports

Los consumidores externos importan desde el `index.ts` de una feature. Los módulos internos de la misma feature pueden usar rutas relativas. Un barrel vacío es un error, no un marcador de posición.

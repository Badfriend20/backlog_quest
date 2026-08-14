import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const initial = JSON.parse(await readFile(path.join(root, "src/data/backlog.json"), "utf8"));
const outputDirectory = path.join(root, "public/examples");
const createdAt = "2026-07-29T12:00:00.000Z";

const definitions = [
  {
    id: "generic",
    fileName: "backlog-quest-ejemplo-generico.json",
    profile: "generic",
    title: "Ejemplos · Actividades variadas",
    channels: ["Presencial", "En línea", "En casa"],
    resources: ["Espacio principal", "Equipo portátil", "Lugar compartido"],
    content: ["Objetivo principal", "Preparación", "Cierre"],
    names: [
      "Preparar un portafolio personal",
      "Explorar una ruta de senderismo",
      "Completar una serie documental",
      "Crear un jardín de interior",
      "Organizar fotografías familiares",
      "Practicar conversación semanal",
      "Visitar una exposición temporal",
      "Aprender una receta nueva",
      "Rediseñar el espacio de trabajo",
      "Escuchar una temporada de pódcast",
      "Construir un álbum de viaje",
      "Participar en un club local",
      "Completar un reto de movilidad",
      "Planear una excursión de fin de semana",
      "Digitalizar documentos importantes",
    ],
  },
  {
    id: "gaming",
    fileName: "backlog-quest-ejemplo-videojuegos.json",
    profile: "gaming",
    title: "Ejemplos · Videojuegos",
    channels: ["PC", "Consola", "Nube"],
    resources: ["Equipo de escritorio", "Consola portátil", "Sala principal"],
    content: ["Campaña principal", "Contenido adicional", "Desafíos opcionales"],
    names: [
      "Ecos de Aster",
      "La torre de cobre",
      "Jardines de Neón",
      "Cartógrafos del vacío",
      "Último tren a Borealia",
      "Islas de cristal",
      "Archivo Meridian",
      "Ceniza y circuito",
      "Bosque de relojes",
      "Órbita perdida",
      "El faro imposible",
      "Taller de autómatas",
      "Mareas de titanio",
      "Ciudad bajo cero",
      "Crónicas del cometa",
    ],
  },
  {
    id: "reading",
    fileName: "backlog-quest-ejemplo-lectura.json",
    profile: "reading",
    title: "Ejemplos · Lectura",
    channels: ["Libro físico", "Lector digital", "Biblioteca"],
    resources: ["Estantería personal", "Lector electrónico", "Sala de lectura"],
    content: ["Texto principal", "Apéndices", "Notas de lectura"],
    names: [
      "La ciudad de los puentes",
      "Atlas de nubes pequeñas",
      "El oficio de observar",
      "Cartas desde el norte",
      "Breve historia del color",
      "Los jardines del tiempo",
      "Manual de preguntas difíciles",
      "La casa de las mareas",
      "Ensayos sobre lo cotidiano",
      "El mapa y la memoria",
      "Voces de la montaña",
      "Ciencia para días tranquilos",
      "El último archivo",
      "Historias de una plaza",
      "Cuaderno de futuros posibles",
    ],
  },
  {
    id: "learning",
    fileName: "backlog-quest-ejemplo-aprendizaje.json",
    profile: "learning",
    title: "Ejemplos · Aprendizaje",
    channels: ["Aula virtual", "Taller presencial", "Material autónomo"],
    resources: ["Computadora personal", "Cuaderno de práctica", "Laboratorio compartido"],
    content: ["Módulo principal", "Práctica guiada", "Proyecto final"],
    names: [
      "Fundamentos de diseño accesible",
      "Introducción al análisis de datos",
      "Escritura clara para equipos",
      "Fotografía con luz natural",
      "Conversación básica en italiano",
      "Primeros pasos con electrónica",
      "Historia del arte moderno",
      "Gestión personal del conocimiento",
      "Modelado tridimensional inicial",
      "Finanzas personales esenciales",
      "Presentaciones con narrativa",
      "Pensamiento estadístico",
      "Ilustración digital práctica",
      "Huerto urbano desde cero",
      "Mantenimiento básico de bicicletas",
    ],
  },
  {
    id: "projects",
    fileName: "backlog-quest-ejemplo-proyectos.json",
    profile: "projects",
    title: "Ejemplos · Proyectos",
    channels: ["Local", "Repositorio compartido", "Taller"],
    resources: ["Estación de trabajo", "Tableta portátil", "Mesa de prototipos"],
    content: ["Entregable principal", "Validación", "Documentación"],
    names: [
      "Renovar el sitio personal",
      "Crear un archivo fotográfico",
      "Automatizar el reporte mensual",
      "Diseñar un mueble modular",
      "Publicar una guía interna",
      "Migrar notas al nuevo sistema",
      "Preparar una exposición colectiva",
      "Construir un sensor ambiental",
      "Catalogar la biblioteca familiar",
      "Lanzar un boletín trimestral",
      "Rediseñar el proceso de bienvenida",
      "Producir un episodio piloto",
      "Crear un kit de identidad visual",
      "Documentar recetas familiares",
      "Organizar un intercambio comunitario",
    ],
  },
  {
    id: "custom-cooking",
    fileName: "backlog-quest-ejemplo-personalizado-cocina.json",
    profile: "custom",
    title: "Ejemplos · Cocina personalizada",
    channels: ["Recetario", "Curso en línea", "Taller presencial"],
    resources: ["Cocina principal", "Horno portátil", "Mesa de preparación"],
    content: ["Preparación base", "Acompañamiento", "Presentación final"],
    names: [
      "Pan rústico de fermentación lenta",
      "Sopa de tomate asado",
      "Tacos de setas al pastor",
      "Pasta fresca con hierbas",
      "Curry suave de garbanzos",
      "Tarta de cítricos",
      "Ensalada templada de granos",
      "Galletas de avena y cacao",
      "Caldo vegetal concentrado",
      "Pizza de masa integral",
      "Arroz especiado con verduras",
      "Helado de fruta sin lácteos",
      "Empanadas horneadas",
      "Salsa picante fermentada",
      "Desayuno de temporada",
    ],
    customVocabulary: {
      activity: "receta",
      activities: "recetas",
      collection: "recetario",
      variant: "versión",
      variants: "versiones",
      channel: "fuente",
      channels: "fuentes",
      accessMethod: "disponibilidad",
      resource: "equipo",
      resources: "equipos",
      journey: "preparación",
      journeys: "preparaciones",
      repetition: "repetición",
      repetitions: "repeticiones",
      content: "parte",
      contents: "partes",
      mission: "menú activo",
      missions: "menús activos",
      statusPending: "Por conseguir",
      statusActive: "Cocinando",
      statusSecondary: "Preparación secundaria",
      statusRepeating: "Repitiendo receta",
      statusPaused: "En pausa",
      statusFinished: "Preparada",
      statusCompleted: "Dominada",
      statusAbandoned: "Descartada",
    },
  },
];

const activityStatuses = [
  "En curso",
  "Repitiendo",
  "En curso secundario",
  "Disponible",
  "En lista",
  "Pausado",
  "Terminado",
  "Completado",
  "Abandonado",
  "Al final",
  "En consideración",
  "Pendiente de acceso",
  "Terminado",
  "Disponible",
  "Completado",
];
const queueStates = [
  "active",
  "active",
  "active",
  "queued",
  "paused",
  "deferred",
  "replay",
  "archived",
  "low-interest",
  "wishlist",
  "blocked",
  "replay-later",
  "queued",
  "deferred",
  "archived",
];

function resolveJourneyStatus(number, status, finished) {
  if (number <= 3) return status;
  return finished ? status : "Terminado";
}

function resolveContentStatus(hasJourney, finished) {
  if (finished) return "finished";
  return hasJourney ? "active" : "not-started";
}

function buildExample(definition) {
  const channels = definition.channels.map((name, index) => ({
    id: `${definition.id}-channel-${index + 1}`,
    name,
    active: true,
  }));
  const resources = definition.resources.map((name, index) => ({
    id: `${definition.id}-resource-${index + 1}`,
    name,
    kind: ["computer", "handheld", "custom"][index],
    active: true,
    priority: ["Alta", "Media", "Baja"][index],
    notes: `Recurso ${index + 1} del conjunto de demostración.`,
  }));
  const games = definition.names.map((title, index) => {
    const number = index + 1;
    const activityId = `${definition.id}-activity-${number}`;
    const contentId = `${activityId}-content-main`;
    const copyId = `${activityId}-variant-main`;
    const hasSecondVariant = number % 3 === 0;
    const hasJourney = number <= 3 || number % 2 === 0;
    const status = activityStatuses[index];
    const journeyFinished = ["Terminado", "Completado", "Abandonado"].includes(status);
    const journeyStatus = resolveJourneyStatus(number, status, journeyFinished);
    return {
      id: activityId,
      title,
      type: definition.profile,
      status,
      priority: ["S", "Alta", "Media", "Baja"][index % 4],
      suggestedSession: ["first", "second", "flexible"][index % 3],
      private: number % 7 === 0,
      notes: `Ejemplo ${number}: combina estado, prioridad, modalidad, contenido y recurso.`,
      tags: [`ejemplo-${definition.id}`, ["corto", "medio", "largo"][index % 3]],
      progress: {
        chapter: hasJourney ? `Etapa ${Math.min(number, 5)}` : "",
        completions: journeyFinished ? 1 : 0,
        replays: status === "Repitiendo" ? 1 : 0,
        lastPlayedAt: hasJourney ? `2026-07-${String(10 + (index % 15)).padStart(2, "0")}` : null,
      },
      copies: [
        {
          id: copyId,
          platformId: channels[index % channels.length].id,
          library: channels[index % channels.length].name,
          device: resources[index % resources.length].name,
          deviceIds: [resources[index % resources.length].id],
          ownership: initial.catalogs.ownership[index % initial.catalogs.ownership.length],
          status: "Disponible",
          priority: ["Alta", "Media", "Baja"][index % 3],
          idealSession: ["first", "second", "flexible"][index % 3],
          crossCopyProgress: ["shared", "separate", "partial", "unknown"][index % 4],
          notes: "Modalidad principal del ejemplo.",
        },
        ...(hasSecondVariant
          ? [
              {
                id: `${activityId}-variant-alt`,
                platformId: channels[(index + 1) % channels.length].id,
                library: channels[(index + 1) % channels.length].name,
                device: resources[(index + 1) % resources.length].name,
                deviceIds: [resources[(index + 1) % resources.length].id],
                ownership:
                  initial.catalogs.ownership[(index + 1) % initial.catalogs.ownership.length],
                status: "Disponible",
                priority: "Media",
                idealSession: "flexible",
                crossCopyProgress: "partial",
                notes: "Alternativa para demostrar varias modalidades.",
              },
            ]
          : []),
      ],
      playthroughs: hasJourney
        ? [
            {
              id: `${activityId}-journey-1`,
              number: 1,
              platform: channels[index % channels.length].name,
              device: resources[index % resources.length].name,
              deviceId: resources[index % resources.length].id,
              status: journeyStatus,
              startedAt: `2026-07-${String(1 + (index % 9)).padStart(2, "0")}`,
              finishedAt: journeyFinished
                ? `2026-07-${String(15 + (index % 10)).padStart(2, "0")}`
                : null,
              notes: "Recorrido incluido para demostrar el historial.",
              contentId,
              contentTitle: definition.content[0],
              contentType: "campaign",
              copyId,
            },
          ]
        : [],
      contents: [
        {
          id: contentId,
          title: definition.content[0],
          type: "campaign",
          status: resolveContentStatus(hasJourney, journeyFinished),
          notes: "Contenido principal del ejemplo.",
        },
        ...(number % 4 === 0
          ? [
              {
                id: `${activityId}-content-extra`,
                title: definition.content[1],
                type: "custom",
                status: "not-started",
                notes: "Contenido adicional para mostrar combinaciones.",
              },
            ]
          : []),
      ],
      dependencies:
        number > 1 && number % 5 === 0 ? [`${definition.id}-activity-${number - 1}`] : [],
      availableFrom: status === "Pendiente de acceso" ? "2026-10-01" : null,
    };
  });
  const missions = games.slice(0, 3).map((activity, index) => ({
    id: `${definition.id}-mission-${index + 1}`,
    gameId: activity.id,
    contentId: activity.contents[0].id,
    contentTitle: activity.contents[0].title,
    contentType: activity.contents[0].type,
    copyId: activity.copies[0].id,
    activeDevice: resources[index].name,
    activeDeviceId: resources[index].id,
    slotId: ["first", "second", "flexible"][index],
    status: "active",
    playthroughId: activity.playthroughs[0].id,
    scheduleRuleId: `${definition.id}-schedule-${index + 1}`,
    startedAt: `2026-07-0${index + 1}`,
    finishedAt: null,
    notes: "Misión activa incluida en la demostración.",
  }));
  return {
    ...initial,
    meta: {
      title: definition.title,
      createdAt,
      updatedAt: createdAt,
      source: "Backlog Quest · datos de demostración",
      notes: "Conjunto ficticio y reversible para explorar las funciones de la aplicación.",
    },
    preferences: {
      ...initial.preferences,
      vocabularyProfile: definition.profile,
      customVocabulary: definition.customVocabulary ?? {},
      activeView: "dashboard",
      quickCopyPresetsReady: false,
      quickCopyPresets: [],
    },
    catalogs: {
      ...initial.catalogs,
      platforms: channels,
    },
    platforms: resources,
    games,
    queue: games.map((activity, index) => ({
      gameId: activity.id,
      position: index + 1,
      state: queueStates[index],
      preferredCopyId: activity.copies[0].id,
      preferredDevice: resources[index % resources.length].name,
      preferredDeviceId: resources[index % resources.length].id,
      preferredSlotId: ["first", "second", "flexible"][index % 3],
      replayIntent: ["unknown", "yes", "maybe", "no"][index % 4],
      availableFrom: activity.availableFrom,
      pinned: index === 0,
      pinnedPosition: index === 0 ? 1 : null,
      deferredAt: queueStates[index] === "deferred" ? "2026-07-20" : null,
      reason: `Caso ${index + 1} de la demostración.`,
    })),
    missions,
    scheduleRules: missions.map((mission, index) => ({
      id: mission.scheduleRuleId,
      missionId: mission.id,
      sessions: [
        { weekday: 1 + index, slotId: mission.slotId },
        { weekday: 4 + index, slotId: mission.slotId },
      ],
      durationMin: 30 + index * 15,
      durationMax: 60 + index * 15,
      enabled: true,
    })),
    scheduleOverrides: [
      {
        id: `${definition.id}-override-1`,
        date: "2026-08-03",
        missionId: missions[0].id,
        action: "skip",
        notes: "Ejemplo de excepción de calendario.",
      },
    ],
    activityLog: games.slice(0, 5).map((activity, index) => ({
      id: `${definition.id}-log-${index + 1}`,
      type: "example",
      gameId: activity.id,
      missionId: index < missions.length ? missions[index].id : null,
      at: `2026-07-${String(20 + index).padStart(2, "0")}T12:00:00.000Z`,
      description: `Actividad de demostración registrada para ${activity.title}.`,
    })),
  };
}

await mkdir(outputDirectory, { recursive: true });
for (const definition of definitions) {
  const target = path.join(outputDirectory, definition.fileName);
  const formatting = await prettier.resolveConfig(target);
  const json = await prettier.format(JSON.stringify(buildExample(definition)), {
    ...formatting,
    filepath: target,
  });
  await writeFile(target, json, "utf8");
}

console.log(`Generados ${definitions.length} respaldos de ejemplo en ${outputDirectory}.`);

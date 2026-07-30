import type { AppPreferences, VocabularyProfileId, VocabularyTerms } from "../kernel/quest";

export interface VocabularyDefinition {
  id: Exclude<VocabularyProfileId, "custom">;
  label: string;
  description: string;
  terms: VocabularyTerms;
}

export const GENERIC_VOCABULARY: VocabularyTerms = {
  activity: "actividad",
  activities: "actividades",
  collection: "colección",
  variant: "modalidad",
  variants: "modalidades",
  channel: "canal",
  channels: "canales",
  accessMethod: "forma de acceso",
  resource: "recurso",
  resources: "recursos",
  journey: "recorrido",
  journeys: "recorridos",
  repetition: "repetición",
  repetitions: "repeticiones",
  content: "contenido",
  contents: "contenidos",
  mission: "misión",
  missions: "misiones",
  statusPending: "Pendiente",
  statusActive: "En curso",
  statusSecondary: "En curso secundario",
  statusRepeating: "Repitiendo",
  statusPaused: "Pausado",
  statusFinished: "Terminado",
  statusCompleted: "Completado",
  statusAbandoned: "Abandonado",
};

function withTerms(patch: Partial<VocabularyTerms>): VocabularyTerms {
  return { ...GENERIC_VOCABULARY, ...patch };
}

export const VOCABULARY_PROFILES: VocabularyDefinition[] = [
  {
    id: "generic",
    label: "Genérico",
    description: "Actividades de cualquier tipo con términos neutrales.",
    terms: GENERIC_VOCABULARY,
  },
  {
    id: "gaming",
    label: "Videojuegos",
    description: "Biblioteca, copias, dispositivos, partidas y rejugadas.",
    terms: withTerms({
      activity: "juego",
      activities: "juegos",
      collection: "biblioteca",
      variant: "copia",
      variants: "copias",
      channel: "plataforma",
      channels: "plataformas",
      accessMethod: "propiedad",
      resource: "dispositivo",
      resources: "dispositivos",
      journey: "partida",
      journeys: "partidas",
      repetition: "rejugada",
      repetitions: "rejugadas",
      statusActive: "Jugando",
      statusSecondary: "Jugando secundario",
      statusRepeating: "Rejugando",
    }),
  },
  {
    id: "reading",
    label: "Lectura",
    description: "Libros, ediciones, formatos y lecturas.",
    terms: withTerms({
      activity: "libro",
      activities: "libros",
      collection: "biblioteca",
      variant: "edición",
      variants: "ediciones",
      channel: "formato",
      channels: "formatos",
      resource: "medio",
      resources: "medios",
      journey: "lectura",
      journeys: "lecturas",
      repetition: "relectura",
      repetitions: "relecturas",
      content: "sección",
      contents: "secciones",
      statusActive: "Leyendo",
      statusSecondary: "Lectura secundaria",
      statusRepeating: "Releyendo",
      statusPaused: "En pausa",
    }),
  },
  {
    id: "learning",
    label: "Aprendizaje",
    description: "Cursos, módulos, plataformas y recorridos formativos.",
    terms: withTerms({
      activity: "curso",
      activities: "cursos",
      collection: "catálogo",
      variant: "modalidad",
      variants: "modalidades",
      channel: "plataforma",
      channels: "plataformas",
      resource: "recurso",
      resources: "recursos",
      journey: "recorrido",
      journeys: "recorridos",
      repetition: "repaso",
      repetitions: "repasos",
      content: "módulo",
      contents: "módulos",
      statusActive: "Cursando",
      statusSecondary: "Curso secundario",
      statusRepeating: "Repasando",
      statusPaused: "En pausa",
      statusFinished: "Finalizado",
    }),
  },
  {
    id: "projects",
    label: "Proyectos",
    description: "Proyectos, entregables, herramientas y ciclos.",
    terms: withTerms({
      activity: "proyecto",
      activities: "proyectos",
      collection: "portafolio",
      variant: "enfoque",
      variants: "enfoques",
      channel: "entorno",
      channels: "entornos",
      resource: "herramienta",
      resources: "herramientas",
      journey: "ciclo",
      journeys: "ciclos",
      repetition: "iteración",
      repetitions: "iteraciones",
      content: "entregable",
      contents: "entregables",
      statusActive: "En ejecución",
      statusSecondary: "Ejecución secundaria",
      statusRepeating: "Iterando",
      statusPaused: "En pausa",
      statusFinished: "Finalizado",
      statusAbandoned: "Cancelado",
    }),
  },
];

export function resolveVocabulary(
  preferences: Pick<AppPreferences, "vocabularyProfile" | "customVocabulary">
): VocabularyTerms {
  if (preferences.vocabularyProfile === "custom") {
    return Object.fromEntries(
      Object.entries(GENERIC_VOCABULARY).map(([key, fallback]) => [
        key,
        preferences.customVocabulary[key as keyof VocabularyTerms]?.trim() || fallback,
      ])
    ) as unknown as VocabularyTerms;
  }
  return (
    VOCABULARY_PROFILES.find(profile => profile.id === preferences.vocabularyProfile)?.terms ??
    GENERIC_VOCABULARY
  );
}

export function capitalizeTerm(term: string): string {
  return term ? `${term[0].toUpperCase()}${term.slice(1)}` : term;
}

type ActivityStatusTerm = Extract<keyof VocabularyTerms, `status${string}`>;

const ACTIVITY_STATUSES: Array<{
  term: ActivityStatusTerm;
  value: string;
  aliases: string[];
}> = [
  { term: "statusPending", value: "Pendiente", aliases: ["pendiente"] },
  {
    term: "statusActive",
    value: "En curso",
    aliases: ["en curso", "jugando", "leyendo", "cursando", "en ejecución"],
  },
  {
    term: "statusSecondary",
    value: "En curso secundario",
    aliases: [
      "en curso secundario",
      "jugando secundario",
      "lectura secundaria",
      "curso secundario",
      "ejecución secundaria",
    ],
  },
  {
    term: "statusRepeating",
    value: "Repitiendo",
    aliases: ["repitiendo", "rejugando", "releyendo", "repasando", "iterando"],
  },
  { term: "statusPaused", value: "Pausado", aliases: ["pausado", "en pausa"] },
  { term: "statusFinished", value: "Terminado", aliases: ["terminado", "finalizado"] },
  { term: "statusCompleted", value: "Completado", aliases: ["completado"] },
  { term: "statusAbandoned", value: "Abandonado", aliases: ["abandonado", "cancelado"] },
];

function normalizeStatus(status: string): string {
  return status
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("es");
}

function findActivityStatus(status: string) {
  const normalized = normalizeStatus(status);
  return ACTIVITY_STATUSES.find(item =>
    item.aliases.some(alias => normalizeStatus(alias) === normalized)
  );
}

export function activityStatusLabel(status: string, terms: VocabularyTerms): string {
  const definition = findActivityStatus(status);
  return definition ? terms[definition.term] : status;
}

export function canonicalActivityStatus(status: string): string {
  return findActivityStatus(status)?.value ?? status;
}

export function activityStatusOptions(terms: VocabularyTerms) {
  return ACTIVITY_STATUSES.map(item => ({
    value: item.value,
    label: terms[item.term],
  }));
}

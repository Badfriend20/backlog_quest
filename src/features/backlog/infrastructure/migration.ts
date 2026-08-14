import type {
  QuestData,
  Activity,
  ActivityContent,
  PriorityCatalogItem,
  QuickVariantPreset,
  QueueItem,
  QueueState,
  ScheduleRule,
  ScheduleSession,
  SlotProfile,
  ThemeColors,
} from "../../../shared/kernel/quest";
import {
  deviceLabel,
  inferDeviceIds,
  mergeQuickCopyPresets,
  normalize,
  normalizeCrossCopyProgress,
  normalizeCopyPlatforms,
  normalizeOwnershipDisplayRules,
  ownershipDisplayKey,
  quickCopyKey,
  resolveCopyPlatform,
} from "../../../shared/kernel/questSelectors";
import { normalizeScheduleSessions } from "../../../shared/kernel/schedule";

const STATUS_DESCRIPTIONS: Record<string, string> = {
  Wishlist: "Actividad que todavía no está disponible en tu colección.",
  "Pendiente de acceso": "Actividad que todavía no está disponible en tu colección.",
  "Próximo lanzamiento":
    "Todavía no se puede jugar; permanece en espera hasta su fecha de disponibilidad.",
  Disponible: "Tienes acceso a la actividad, pero no hay una misión activa.",
  "En lista": "Está considerado para jugarse más adelante.",
  "En lista prioritaria": "Es uno de los siguientes candidatos para convertirse en misión.",
  Jugando: "Recorrido principal activo.",
  "En curso": "Recorrido principal activo.",
  "Jugando secundario": "Misión activa con menor frecuencia que el recorrido principal.",
  "En curso secundario": "Misión activa con menor frecuencia que el recorrido principal.",
  Rejugando: "Nuevo recorrido de una actividad que ya terminaste antes.",
  Repitiendo: "Nuevo recorrido de una actividad que ya terminaste antes.",
  Pausado: "Conserva su progreso, pero no ocupa una franja activa.",
  Terminado: "Llegaste a los créditos o cumpliste el objetivo principal.",
  Completado: "Terminaste todo lo que personalmente querías hacer en ese contenido.",
  Abandonado: "El recorrido se cerró sin intención actual de continuarlo.",
  "Probablemente no lo juegue": "Permanece en la colección, pero está al final de las prioridades.",
  "En la mira": "Te interesa, aunque todavía no forma parte de la lista prioritaria.",
};

const PRIORITIES: PriorityCatalogItem[] = [
  { id: "s", label: "S", description: "Prioridad máxima o con fecha importante." },
  {
    id: "high",
    label: "Alta",
    description: "Interés fuerte; debe aparecer antes que la prioridad media.",
  },
  { id: "medium", label: "Media", description: "Interés normal, sin urgencia." },
  { id: "low", label: "Baja", description: "Sin interés inmediato." },
];

const SLOT_PROFILES: SlotProfile[] = [
  {
    id: "day-night",
    label: "Día / Noche",
    custom: false,
    slots: [
      { id: "first", label: "Día" },
      { id: "second", label: "Noche" },
    ],
  },
  {
    id: "early-late",
    label: "Temprano / Tarde",
    custom: false,
    slots: [
      { id: "first", label: "Temprano" },
      { id: "second", label: "Tarde" },
    ],
  },
  {
    id: "morning-night",
    label: "Mañana / Noche",
    custom: false,
    slots: [
      { id: "first", label: "Mañana" },
      { id: "second", label: "Noche" },
    ],
  },
  {
    id: "work-home",
    label: "Oficina / Casa",
    custom: false,
    slots: [
      { id: "first", label: "Oficina" },
      { id: "second", label: "Casa" },
    ],
  },
];

const DEFAULT_CUSTOM_THEME: ThemeColors = {
  background: "#0d0a17",
  container: "#0d0a17",
  sidebar: "#0d0a17",
  panel: "#171126",
  panelAlt: "#211a35",
  border: "#443762",
  text: "#f4f0ff",
  muted: "#aaa0bd",
  primary: "#a673ff",
  accent: "#61e7ff",
  success: "#7effa2",
  warning: "#ffd56a",
  danger: "#ff6f7d",
};

const QUEUE_STATE_CATALOG: Array<{ id: QueueState; label: string; description: string }> = [
  { id: "active", label: "Activo", description: "Actualmente ocupa una misión." },
  { id: "queued", label: "En lista", description: "Disponible para convertirse en misión." },
  { id: "paused", label: "Pausado", description: "Conserva su posición y progreso." },
  {
    id: "deferred",
    label: "Aplazado",
    description: "Se movió temporalmente fuera de los próximos lugares.",
  },
  {
    id: "replay",
    label: "Repetición futura",
    description: "Terminado y con intención clara de repetirlo.",
  },
  {
    id: "replay-later",
    label: "Quizá repetir",
    description: "Podría volver a jugarse, pero no pronto.",
  },
  {
    id: "archived",
    label: "Archivado",
    description: "Terminado sin intención actual de repetirlo.",
  },
  {
    id: "low-interest",
    label: "Al final",
    description: "No interesa actualmente, aunque sigue en la colección.",
  },
  { id: "blocked", label: "Bloqueado", description: "Conviene completar otro título antes." },
  { id: "wishlist", label: "Pendiente de acceso", description: "No está disponible todavía." },
];

function descriptionForStatus(label: string): string {
  return STATUS_DESCRIPTIONS[label] ?? "Estado personalizado de la actividad.";
}

function contentStatus(status: string): ActivityContent["status"] {
  const normalized = normalize(status);
  if (
    normalized.includes("jugando") ||
    normalized.includes("rejugando") ||
    normalized.includes("en curso") ||
    normalized.includes("repitiendo")
  )
    return "active";
  if (normalized.includes("completado")) return "completed";
  if (normalized.includes("terminado")) return "finished";
  if (normalized.includes("pausado")) return "paused";
  if (normalized.includes("abandonado")) return "abandoned";
  return "not-started";
}

function defaultContent(game: any): ActivityContent[] {
  const baseStatus = contentStatus(String(game.status ?? ""));
  return [
    {
      id: "main-campaign",
      title: "Contenido principal",
      type: "campaign",
      status: baseStatus,
      notes: "",
    },
  ];
}

function dependenciesFor(): string[] {
  return [];
}

function availableFromFor(): string | null {
  return null;
}

function normalizeMeta(
  meta: Partial<QuestData["meta"]> & Record<string, unknown>
): QuestData["meta"] {
  const now = new Date().toISOString();
  return {
    title: typeof meta.title === "string" && meta.title.trim() ? meta.title : "Backlog Quest",
    createdAt: typeof meta.createdAt === "string" ? meta.createdAt : now,
    updatedAt: typeof meta.updatedAt === "string" ? meta.updatedAt : now,
    source: typeof meta.source === "string" ? meta.source : "Backlog Quest",
    notes: typeof meta.notes === "string" ? meta.notes : "",
  };
}

function queueStateFor(game: Activity): QueueState {
  const status = normalize(game.status);
  if (status.includes("wishlist")) return "wishlist";
  if (status.includes("jugando") || status.includes("en curso")) return "active";
  if (status.includes("pausado")) return "paused";
  if (status.includes("rejugando") || status.includes("repitiendo")) return "replay";
  if (status.includes("terminado") || status.includes("completado")) return "archived";
  if (status.includes("probablemente")) return "low-interest";
  if (game.dependencies.length) return "blocked";
  return "queued";
}

export function isCurrentBacklog(value: unknown): value is QuestData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<QuestData>;
  return (
    candidate.schemaVersion === 2 &&
    Array.isArray(candidate.games) &&
    Array.isArray(candidate.queue) &&
    Boolean(candidate.preferences && typeof candidate.preferences === "object") &&
    Boolean(candidate.catalogs && typeof candidate.catalogs === "object")
  );
}

export function normalizeBacklog(value: unknown): QuestData {
  if (
    value &&
    typeof value === "object" &&
    (value as { schemaVersion?: unknown }).schemaVersion === 1
  )
    throw new Error("Este respaldo utiliza un formato anterior que ya no es compatible.");
  if (!isCurrentBacklog(value))
    throw new Error("El archivo no corresponde a un respaldo compatible de Backlog Quest.");
  return normalizeCurrentBacklog(value);
}

function ownershipSuffixCandidates(ownership: string): string[][] {
  const words = normalize(ownership)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  const candidates: string[][] = [];
  for (let size = words.length; size >= 1; size -= 1) {
    for (let start = 0; start + size <= words.length; start += 1) {
      if (size > 1 || words.length === 1 || start === words.length - 1)
        candidates.push(words.slice(start, start + size));
    }
  }
  return candidates;
}

function trimPlatformSeparator(value: string): string {
  const separators = new Set(["/", "+", ":", "_", "-"]);
  let result = value.trimEnd();
  while (result && separators.has(result.at(-1) ?? "")) result = result.slice(0, -1).trimEnd();
  return result;
}

function platformNameWithoutOwnership(library: string, ownership: string): string {
  const libraryWords = [...library.matchAll(/[\p{L}\p{N}]+/gu)];
  const normalizedLibraryWords = libraryWords.map(match => normalize(match[0]));
  for (const suffix of ownershipSuffixCandidates(ownership)) {
    const suffixStart = normalizedLibraryWords.length - suffix.length;
    if (suffixStart <= 0) continue;
    if (!suffix.every((word, index) => normalizedLibraryWords[suffixStart + index] === word))
      continue;
    const cutoff = libraryWords[suffixStart].index ?? library.length;
    const base = trimPlatformSeparator(library.slice(0, cutoff));
    if (base) return base;
  }
  return library.trim();
}

export function normalizeCurrentBacklog(data: QuestData): QuestData {
  const platforms = (data.platforms ?? []).map(platform => ({
    id: platform.id,
    name: platform.name,
    kind: platform.kind,
    active: platform.active,
    priority: platform.priority,
    notes: platform.notes ?? "",
  }));
  const platformData = { platforms };
  const copyPlatforms = normalizeCopyPlatforms(data.catalogs.platforms ?? [], [
    ...data.games.flatMap(game =>
      (game.copies ?? []).map(copy => platformNameWithoutOwnership(copy.library, copy.ownership))
    ),
    ...(data.preferences.quickCopyPresets ?? []).map(preset =>
      platformNameWithoutOwnership(preset.library, preset.ownership)
    ),
  ]);
  const games = data.games.map(game => {
    const contents = Array.isArray(game.contents) ? game.contents : defaultContent(game);
    const copies = (game.copies ?? []).map(copy => {
      const platformName = platformNameWithoutOwnership(copy.library, copy.ownership);
      const copyPlatform = resolveCopyPlatform(copyPlatforms, copy.platformId, platformName);
      const deviceIds = (
        copy.deviceIds?.length ? copy.deviceIds : inferDeviceIds(platformData, copy.device)
      ).filter(
        (id, index, all) =>
          platforms.some(platform => platform.id === id) && all.indexOf(id) === index
      );
      return {
        id: copy.id,
        platformId: copyPlatform?.id,
        library: copyPlatform?.name ?? platformName,
        ownership: copy.ownership,
        status: copy.status,
        priority: copy.priority,
        idealSession: copy.idealSession,
        crossCopyProgress: normalizeCrossCopyProgress(
          copy.crossCopyProgress ?? (copy as unknown as { sharedProgress?: string }).sharedProgress
        ),
        notes: copy.notes,
        deviceIds,
        device: deviceIds.length
          ? deviceLabel(platformData, deviceIds)
          : copy.device || "Por confirmar",
      };
    });
    const playthroughs = (game.playthroughs ?? []).map(play => {
      const selectedCopy = copies.find(copy => copy.id === play.copyId);
      const selectedContent = contents.find(content => content.id === play.contentId);
      const allowed = selectedCopy?.deviceIds ?? [];
      const inferred =
        play.deviceId && platforms.some(platform => platform.id === play.deviceId)
          ? play.deviceId
          : (inferDeviceIds(platformData, play.device)[0] ?? allowed[0]);
      return {
        ...play,
        contentTitle: play.contentTitle ?? selectedContent?.title,
        contentType: play.contentType ?? selectedContent?.type,
        deviceId: inferred,
        device: inferred ? deviceLabel(platformData, [inferred]) : play.device || "Por confirmar",
      };
    });
    return {
      ...game,
      progress: {
        chapter: game.progress?.chapter ?? "",
        completions: game.progress?.completions ?? 0,
        replays: game.progress?.replays ?? 0,
        lastPlayedAt: game.progress?.lastPlayedAt ?? null,
      },
      contents,
      dependencies: game.dependencies ?? dependenciesFor(),
      availableFrom: game.availableFrom ?? availableFromFor(),
      tags: game.tags ?? [],
      copies,
      playthroughs,
    };
  });
  const presentIds = new Set(data.queue.map(item => item.gameId));
  const extraQueue: QueueItem[] = games
    .filter(game => !presentIds.has(game.id))
    .map((game, index) => {
      const firstCopy = game.copies[0];
      const firstDeviceId = firstCopy?.deviceIds?.[0];
      return {
        gameId: game.id,
        position: data.queue.length + index + 1,
        state: queueStateFor(game),
        preferredCopyId: firstCopy?.id ?? null,
        preferredDevice: firstDeviceId
          ? deviceLabel(platformData, [firstDeviceId])
          : (firstCopy?.device ?? ""),
        preferredDeviceId: firstDeviceId,
        preferredSlotId: "flexible",
        replayIntent: "unknown",
        availableFrom: game.availableFrom,
        pinned: false,
        pinnedPosition: null,
        deferredAt: null,
        reason: game.notes,
      };
    });
  const queue = [...data.queue, ...extraQueue]
    .sort((a, b) => a.position - b.position)
    .map((item, index) => {
      const preferredDeviceId =
        item.preferredDeviceId && platforms.some(platform => platform.id === item.preferredDeviceId)
          ? item.preferredDeviceId
          : inferDeviceIds(platformData, item.preferredDevice)[0];
      return {
        ...item,
        position: index + 1,
        preferredDeviceId,
        preferredDevice: preferredDeviceId
          ? deviceLabel(platformData, [preferredDeviceId])
          : item.preferredDevice,
      };
    });
  const missions = (data.missions ?? []).map(mission => {
    const activeDeviceId =
      mission.activeDeviceId && platforms.some(platform => platform.id === mission.activeDeviceId)
        ? mission.activeDeviceId
        : inferDeviceIds(platformData, mission.activeDevice)[0];
    return {
      ...mission,
      activeDeviceId,
      activeDevice: activeDeviceId
        ? deviceLabel(platformData, [activeDeviceId])
        : mission.activeDevice,
    };
  });
  const existingPresets = data.preferences.quickCopyPresets ?? [];
  const quickCopyPresets: QuickVariantPreset[] = existingPresets.length
    ? existingPresets.map(preset => {
        const platformName = platformNameWithoutOwnership(preset.library, preset.ownership);
        const copyPlatform = resolveCopyPlatform(copyPlatforms, preset.platformId, platformName);
        return {
          key: quickCopyKey(copyPlatform?.name ?? platformName, preset.ownership, copyPlatform?.id),
          platformId: copyPlatform?.id,
          library: copyPlatform?.name ?? platformName,
          ownership: preset.ownership,
          status: preset.status,
          priority: preset.priority,
          idealSession: preset.idealSession,
          crossCopyProgress: normalizeCrossCopyProgress(
            preset.crossCopyProgress ??
              (preset as unknown as { sharedProgress?: string }).sharedProgress
          ),
          notes: preset.notes,
          updatedAt: preset.updatedAt,
          deviceIds: (preset.deviceIds ?? []).filter(id =>
            platforms.some(platform => platform.id === id)
          ),
        };
      })
    : mergeQuickCopyPresets(
        platformData,
        [],
        games.flatMap(game => game.copies)
      );
  const savedOwnershipRules = data.preferences.ownershipDisplayRules ?? {};
  const ownershipDisplayRules = normalizeOwnershipDisplayRules(
    data.catalogs.ownership ?? [],
    savedOwnershipRules
  );
  if (Object.keys(savedOwnershipRules).length === 0) {
    const ownTerm = (data.catalogs.ownership ?? []).find(
      ownership => normalize(ownership) === "propio"
    );
    if (ownTerm) ownershipDisplayRules[ownershipDisplayKey(ownTerm)].hidden = true;
  }
  const scheduleRules = (data.scheduleRules ?? []).map(rule => {
    const mission = missions.find(item => item.id === rule.missionId);
    const compatibleRule = rule as unknown as ScheduleRule & {
      sessions?: ScheduleSession[];
      weekdays?: number[];
    };
    const sessions = normalizeScheduleSessions(
      compatibleRule.sessions ??
        (compatibleRule.weekdays ?? []).map(weekday => ({
          weekday,
          slotId: mission?.slotId ?? "flexible",
        }))
    );
    return {
      id: rule.id,
      missionId: rule.missionId,
      sessions,
      durationMin: rule.durationMin,
      durationMax: rule.durationMax,
      enabled: rule.enabled,
    };
  });
  return {
    ...data,
    schemaVersion: 2,
    meta: normalizeMeta(data.meta),
    preferences: {
      theme: ["midnight", "graphite", "forest", "light", "custom"].includes(data.preferences.theme)
        ? data.preferences.theme
        : "midnight",
      customTheme: { ...DEFAULT_CUSTOM_THEME, ...data.preferences.customTheme },
      vocabularyProfile: [
        "generic",
        "gaming",
        "reading",
        "learning",
        "projects",
        "custom",
      ].includes(data.preferences.vocabularyProfile)
        ? data.preferences.vocabularyProfile
        : "generic",
      customVocabulary: data.preferences.customVocabulary ?? {},
      hidePrivateByDefault: data.preferences.hidePrivateByDefault ?? true,
      activeView: data.preferences.activeView ?? "dashboard",
      activeSlotProfileId: data.preferences.activeSlotProfileId ?? "day-night",
      slotProfiles: data.preferences.slotProfiles?.length
        ? data.preferences.slotProfiles
        : SLOT_PROFILES,
      secondarySlotLabel: data.preferences.secondarySlotLabel ?? "Secundario",
      flexibleSlotLabel: data.preferences.flexibleSlotLabel ?? "Flexible",
      queueDisplayCount: data.preferences.queueDisplayCount ?? 10,
      deferPosition: data.preferences.deferPosition ?? 12,
      scheduleWeeks: data.preferences.scheduleWeeks ?? 4,
      weekStartsOn: data.preferences.weekStartsOn ?? 1,
      compactCards: data.preferences.compactCards ?? false,
      showTooltips: data.preferences.showTooltips ?? true,
      confirmDestructiveActions: data.preferences.confirmDestructiveActions ?? true,
      autoSuggestNext: data.preferences.autoSuggestNext ?? true,
      rules: data.preferences.rules ?? [],
      quickCopyPresetsReady: quickCopyPresets.length > 0,
      quickCopyPresets,
      ownershipDisplayRules,
    },
    catalogs: {
      statuses: data.catalogs.statuses.map(item => ({
        ...item,
        description: item.description ?? descriptionForStatus(item.label),
      })),
      priorities:
        Array.isArray(data.catalogs.priorities) && typeof data.catalogs.priorities[0] === "string"
          ? (data.catalogs.priorities as unknown as string[]).map(
              label =>
                PRIORITIES.find(item => item.label === label) ?? {
                  id: normalize(label),
                  label,
                  description: "Prioridad personalizada.",
                }
            )
          : data.catalogs.priorities,
      platforms: copyPlatforms,
      ownership: data.catalogs.ownership ?? [],
      deviceKinds: data.catalogs.deviceKinds ?? [],
      queueStates: data.catalogs.queueStates?.length
        ? data.catalogs.queueStates
        : QUEUE_STATE_CATALOG,
    },
    platforms,
    games,
    queue,
    missions,
    scheduleRules,
    scheduleOverrides: data.scheduleOverrides ?? [],
    activityLog: data.activityLog ?? [],
  };
}

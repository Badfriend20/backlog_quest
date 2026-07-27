import type {
  BacklogData,
  Game,
  GameContent,
  Mission,
  PriorityCatalogItem,
  QuickCopyPreset,
  QueueItem,
  QueueState,
  ScheduleRule,
  SlotProfile,
  StatusCatalogItem,
  ThemeColors,
} from "../../../shared/kernel/backlog";
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
} from "../../../shared/kernel/backlogSelectors";

const STATUS_DESCRIPTIONS: Record<string, string> = {
  Wishlist: "Juego que todavía no tienes o no está disponible en tu biblioteca.",
  "Próximo lanzamiento":
    "Todavía no se puede jugar; permanece en espera hasta su fecha de disponibilidad.",
  Disponible: "Tienes acceso al juego, pero no hay una misión activa.",
  "En cola": "Está considerado para jugarse más adelante.",
  "En cola inmediata": "Es uno de los siguientes candidatos para convertirse en misión.",
  Jugando: "Campaña o recorrido principal activo.",
  "Jugando secundario": "Misión activa con menor frecuencia que la campaña principal.",
  Rejugando: "Nuevo recorrido de un juego que ya terminaste antes.",
  Pausado: "Conserva su progreso, pero no ocupa una franja activa.",
  Terminado: "Llegaste a los créditos o cumpliste el objetivo principal.",
  Completado: "Terminaste todo lo que personalmente querías hacer en ese contenido.",
  Abandonado: "La partida se cerró sin intención actual de continuarla.",
  "Probablemente no lo juegue":
    "Permanece en la biblioteca, pero está al final de las prioridades.",
  "En la mira": "Te interesa, aunque todavía no forma parte de la cola inmediata.",
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
  { id: "queued", label: "En cola", description: "Disponible para convertirse en misión." },
  { id: "paused", label: "Pausado", description: "Conserva su posición y progreso." },
  {
    id: "deferred",
    label: "Aplazado",
    description: "Se movió temporalmente fuera de los próximos lugares.",
  },
  {
    id: "replay",
    label: "Rejugada futura",
    description: "Terminado y con intención clara de rejugarlo.",
  },
  {
    id: "replay-later",
    label: "Quizá rejugar",
    description: "Podría volver a jugarse, pero no pronto.",
  },
  {
    id: "archived",
    label: "Archivado",
    description: "Terminado sin intención actual de rejugarlo.",
  },
  {
    id: "low-interest",
    label: "Al final",
    description: "No interesa actualmente, aunque sigue en la biblioteca.",
  },
  { id: "blocked", label: "Bloqueado", description: "Conviene completar otro título antes." },
  { id: "wishlist", label: "Pendiente de acceso", description: "No está disponible todavía." },
];

function descriptionForStatus(label: string): string {
  return STATUS_DESCRIPTIONS[label] ?? "Estado personalizado del juego.";
}

function contentStatus(status: string): GameContent["status"] {
  const normalized = normalize(status);
  if (normalized.includes("jugando") || normalized.includes("rejugando")) return "active";
  if (normalized.includes("completado")) return "completed";
  if (normalized.includes("terminado")) return "finished";
  if (normalized.includes("pausado")) return "paused";
  if (normalized.includes("abandonado")) return "abandoned";
  return "not-started";
}

function defaultContent(game: any): GameContent[] {
  const baseStatus = contentStatus(String(game.status ?? ""));
  return [
    {
      id: "main-campaign",
      title: "Campaña principal",
      type: "campaign",
      status: baseStatus,
      notes: "",
    },
  ];
}

function dependenciesFor(): string[] {
  return [];
  /* Compatibilidad histórica conservada sin aplicarla automáticamente.
  const map: Record<string, string[]> = {
    G022: ["G021"],
    G023: ["G022"],
    G046: ["G045"],
    G053: ["G052"],
    G089: ["G115", "G116"],
    G060: ["G059"],
    G057: ["G060"],
    G063: ["G057"],
    G039: ["G063"],
    G040: ["G039"],
    G064: ["G040"],
    G065: ["G064"],
    G066: ["G065"],
  };
  return map[gameId] ?? [];
  */
}

function availableFromFor(): string | null {
  return null;
}

function normalizeMeta(
  meta: Partial<BacklogData["meta"]> & Record<string, unknown>
): BacklogData["meta"] {
  const now = new Date().toISOString();
  return {
    title: typeof meta.title === "string" && meta.title.trim() ? meta.title : "Backlog Quest",
    createdAt: typeof meta.createdAt === "string" ? meta.createdAt : now,
    updatedAt: typeof meta.updatedAt === "string" ? meta.updatedAt : now,
    source: typeof meta.source === "string" ? meta.source : "Backlog Quest",
    notes: typeof meta.notes === "string" ? meta.notes : "",
  };
}

function queueStateFor(game: Game): QueueState {
  const status = normalize(game.status);
  if (status.includes("wishlist")) return "wishlist";
  if (status.includes("jugando")) return "active";
  if (status.includes("pausado")) return "paused";
  if (status.includes("rejugando")) return "replay";
  if (status.includes("terminado") || status.includes("completado")) return "archived";
  if (status.includes("probablemente")) return "low-interest";
  if (game.dependencies.length) return "blocked";
  return "queued";
}

function selectCopy(game: Game, preferredText = "") {
  const normalized = normalize(preferredText);
  return (
    game.copies.find(copy => normalize(`${copy.library} ${copy.device}`).includes(normalized)) ??
    game.copies.find(copy => normalize(copy.status).includes("jugando")) ??
    game.copies[0] ??
    null
  );
}

function legacyPreferredSlot(gameId: string): QueueItem["preferredSlotId"] {
  if (gameId === "G008") return "first";
  if (gameId === "G006") return "second";
  if (gameId === "G018") return "secondary";
  return "flexible";
}

function buildMissions(): { missions: Mission[]; rules: ScheduleRule[] } {
  return { missions: [], rules: [] };
  /* La migración ya no inventa misiones a partir de identificadores del archivo.
  const definitions = [
    {
      gameId: "G008",
      copyId: "C038",
      device: "ROG Ally X",
      slotId: "first",
      contentId: "main-campaign",
      contentTitle: "Campaña principal",
      contentType: "campaign" as const,
      weekdays: [1, 3, 5],
      min: 30,
      max: 50,
    },
    {
      gameId: "G006",
      copyId: "C006",
      device: "Xbox Series X",
      slotId: "second",
      contentId: "revelations",
      contentTitle: "Revelations",
      contentType: "dlc" as const,
      weekdays: [2, 4, 6],
      min: 60,
      max: 120,
    },
    {
      gameId: "G018",
      copyId: "C117",
      device: "Nintendo Switch",
      slotId: "secondary",
      contentId: "ancient-gods",
      contentTitle: "The Ancient Gods",
      contentType: "dlc" as const,
      weekdays: [2],
      min: 30,
      max: 45,
    },
  ];
  const missions: Mission[] = [];
  const rules: ScheduleRule[] = [];
  definitions.forEach((definition, index) => {
    const game = games.find(item => item.id === definition.gameId);
    if (!game) return;
    const copy = game.copies.find(item => item.id === definition.copyId) ?? game.copies[0];
    if (!copy) return;
    const playthrough =
      game.playthroughs.find(item => normalize(item.status).includes("jugando")) ??
      game.playthroughs.at(-1);
    const missionId = `M${String(index + 1).padStart(3, "0")}`;
    const ruleId = `SR${String(index + 1).padStart(3, "0")}`;
    if (!game.contents.some(content => content.id === definition.contentId)) {
      game.contents.push({
        id: definition.contentId,
        title: definition.contentTitle,
        type: definition.contentType,
        status: "active",
        notes: game.progress.chapter,
      });
    } else {
      game.contents = game.contents.map(content =>
        content.id === definition.contentId ? { ...content, status: "active" } : content
      );
    }
    missions.push({
      id: missionId,
      gameId: game.id,
      contentId: definition.contentId,
      contentTitle: definition.contentTitle,
      contentType: definition.contentType,
      copyId: copy.id,
      activeDevice: definition.device,
      activeDeviceId: inferDeviceIds({ platforms }, definition.device)[0],
      slotId: definition.slotId,
      status: "active",
      playthroughId: playthrough?.id ?? "",
      scheduleRuleId: ruleId,
      startedAt: playthrough?.startedAt ?? "2026-07-21",
      finishedAt: null,
      notes: game.progress.chapter || game.notes,
    });
    rules.push({
      id: ruleId,
      missionId,
      weekdays: definition.weekdays,
      durationMin: definition.min,
      durationMax: definition.max,
      enabled: true,
    });
  });
  return { missions, rules };
  */
}

export function isBacklogV2(value: unknown): value is BacklogData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<BacklogData>;
  return (
    candidate.schemaVersion === 2 &&
    Array.isArray(candidate.games) &&
    Array.isArray(candidate.queue) &&
    Array.isArray(candidate.missions) &&
    Array.isArray(candidate.scheduleRules)
  );
}

export function migrateBacklog(value: unknown): BacklogData {
  if (isBacklogV2(value)) return normalizeV2(value);
  if (!value || typeof value !== "object")
    throw new Error("El archivo no contiene datos válidos de Backlog Quest.");
  const old = value as any;
  if (old.schemaVersion !== 1 || !Array.isArray(old.games)) {
    throw new Error("El archivo no corresponde a Backlog Quest v1 o v2.");
  }

  const games: Game[] = old.games.map((game: any) => ({
    ...game,
    tags: Array.isArray(game.tags) ? game.tags : [],
    copies: Array.isArray(game.copies) ? game.copies : [],
    playthroughs: Array.isArray(game.playthroughs) ? game.playthroughs : [],
    contents: defaultContent(game),
    dependencies: dependenciesFor(),
    availableFrom: availableFromFor(),
  }));

  const queueSeed = new Map<string, any>((old.queue ?? []).map((item: any) => [item.gameId, item]));
  const firstIds = (old.queue ?? []).map((item: any) => item.gameId);
  const remaining = games
    .filter(game => !firstIds.includes(game.id))
    .sort((a, b) => {
      const priority = ["S", "Alta", "Media", "Baja"];
      return (
        priority.indexOf(a.priority) - priority.indexOf(b.priority) ||
        a.title.localeCompare(b.title, "es")
      );
    });
  const orderedGames = [
    ...firstIds.map((id: string) => games.find(game => game.id === id)).filter(Boolean),
    ...remaining,
  ] as Game[];
  const queue: QueueItem[] = orderedGames.map((game, index) => {
    const seed = queueSeed.get(game.id);
    const copy = selectCopy(game, seed?.platform ?? "");
    return {
      gameId: game.id,
      position: index + 1,
      state: queueStateFor(game),
      preferredCopyId: copy?.id ?? null,
      preferredDevice: seed?.platform ?? copy?.device ?? "",
      preferredSlotId: legacyPreferredSlot(game.id),
      replayIntent: game.progress.replays > 0 ? "maybe" : "unknown",
      availableFrom: availableFromFor(),
      pinned: game.id === "G121",
      pinnedPosition: game.id === "G121" ? 5 : null,
      deferredAt: null,
      reason: seed?.reason ?? game.notes ?? "",
    };
  });

  const { missions, rules } = buildMissions();
  queue.forEach(item => {
    if (missions.some(mission => mission.gameId === item.gameId)) item.state = "active";
  });

  const statuses: StatusCatalogItem[] = (old.catalogs?.statuses ?? []).map((item: any) => ({
    id: item.id,
    label: item.label,
    color: item.color,
    description: descriptionForStatus(item.label),
  }));

  return normalizeV2({
    schemaVersion: 2,
    meta: normalizeMeta({
      ...(old.meta ?? {}),
      updatedAt: new Date().toISOString(),
      source: `${old.meta?.source ?? "Backlog Quest"} · migrado a v2`,
    }),
    preferences: {
      theme: "midnight",
      customTheme: DEFAULT_CUSTOM_THEME,
      hidePrivateByDefault: old.preferences?.hidePrivateByDefault ?? true,
      activeView: "dashboard",
      activeSlotProfileId: "day-night",
      slotProfiles: SLOT_PROFILES,
      secondarySlotLabel: "Secundario",
      flexibleSlotLabel: "Flexible",
      queueDisplayCount: 10,
      deferPosition: 12,
      scheduleWeeks: 4,
      weekStartsOn: 1,
      compactCards: false,
      showTooltips: true,
      confirmDestructiveActions: true,
      autoSuggestNext: true,
      quickCopyPresetsReady: false,
      quickCopyPresets: [],
      ownershipDisplayRules: {},
      rules: [],
    },
    catalogs: {
      statuses,
      priorities: PRIORITIES,
      platforms: [],
      ownership: old.catalogs?.ownership ?? [],
      deviceKinds: old.catalogs?.deviceKinds ?? [],
      queueStates: QUEUE_STATE_CATALOG,
    },
    platforms: old.platforms ?? [],
    queue,
    missions,
    scheduleRules: rules,
    scheduleOverrides: [],
    activityLog: [
      {
        id: "A001",
        type: "migration",
        gameId: null,
        missionId: null,
        at: new Date().toISOString(),
        description:
          "Datos migrados al esquema v2 con misiones, cola completa y calendario dinámico.",
      },
    ],
    games,
  });
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

function legacyPlatformName(library: string, ownership: string): string {
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

export function normalizeV2(data: BacklogData): BacklogData {
  const platformData = { platforms: data.platforms ?? [] };
  const copyPlatforms = normalizeCopyPlatforms(data.catalogs.platforms ?? [], [
    ...data.games.flatMap(game =>
      (game.copies ?? []).map(copy => legacyPlatformName(copy.library, copy.ownership))
    ),
    ...(data.preferences.quickCopyPresets ?? []).map(preset =>
      legacyPlatformName(preset.library, preset.ownership)
    ),
  ]);
  const games = data.games.map(game => {
    const copies = (game.copies ?? []).map(copy => {
      const legacyLibrary = legacyPlatformName(copy.library, copy.ownership);
      const copyPlatform = resolveCopyPlatform(copyPlatforms, copy.platformId, legacyLibrary);
      const deviceIds = (
        copy.deviceIds?.length ? copy.deviceIds : inferDeviceIds(platformData, copy.device)
      ).filter(
        (id, index, all) =>
          data.platforms.some(platform => platform.id === id) && all.indexOf(id) === index
      );
      return {
        id: copy.id,
        platformId: copyPlatform?.id,
        library: copyPlatform?.name ?? legacyLibrary,
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
      const allowed = selectedCopy?.deviceIds ?? [];
      const inferred =
        play.deviceId && data.platforms.some(platform => platform.id === play.deviceId)
          ? play.deviceId
          : (inferDeviceIds(platformData, play.device)[0] ?? allowed[0]);
      return {
        ...play,
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
      contents: game.contents?.length ? game.contents : defaultContent(game),
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
        item.preferredDeviceId &&
        data.platforms.some(platform => platform.id === item.preferredDeviceId)
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
      mission.activeDeviceId &&
      data.platforms.some(platform => platform.id === mission.activeDeviceId)
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
  const quickCopyPresets: QuickCopyPreset[] = existingPresets.length
    ? existingPresets.map(preset => {
        const legacyLibrary = legacyPlatformName(preset.library, preset.ownership);
        const copyPlatform = resolveCopyPlatform(copyPlatforms, preset.platformId, legacyLibrary);
        return {
          key: quickCopyKey(
            copyPlatform?.name ?? legacyLibrary,
            preset.ownership,
            copyPlatform?.id
          ),
          platformId: copyPlatform?.id,
          library: copyPlatform?.name ?? legacyLibrary,
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
            data.platforms.some(platform => platform.id === id)
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
    const legacyOwnTerm = (data.catalogs.ownership ?? []).find(
      ownership => normalize(ownership) === "propio"
    );
    if (legacyOwnTerm) ownershipDisplayRules[ownershipDisplayKey(legacyOwnTerm)].hidden = true;
  }
  return {
    ...data,
    schemaVersion: 2,
    meta: normalizeMeta(data.meta),
    preferences: {
      theme: ["midnight", "graphite", "forest", "light", "custom"].includes(data.preferences.theme)
        ? data.preferences.theme
        : "midnight",
      customTheme: { ...DEFAULT_CUSTOM_THEME, ...data.preferences.customTheme },
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
    platforms: data.platforms ?? [],
    games,
    queue,
    missions,
    scheduleRules: data.scheduleRules ?? [],
    scheduleOverrides: data.scheduleOverrides ?? [],
    activityLog: data.activityLog ?? [],
  };
}

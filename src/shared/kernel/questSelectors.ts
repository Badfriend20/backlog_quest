import type {
  QuestData,
  Channel,
  CrossCopyProgress,
  Activity,
  ActivityVariant,
  Mission,
  OwnershipDisplayRules,
  QueueItem,
  QuickVariantPreset,
} from "./quest";

export const ACTIVE_GAME_STATUSES = new Set([
  "En curso",
  "En curso secundario",
  "Repitiendo",
  "Jugando",
  "Jugando secundario",
  "Rejugando",
]);
const UNKNOWN_LABEL = "Por confirmar";
export const OWNERSHIP_LABEL_MAX_LENGTH = 24;
export const DEFAULT_ACCESS_METHOD = "Por definir";
export const CROSS_COPY_PROGRESS_HELP =
  "Indica si el progreso de esta modalidad puede continuarse en otras modalidades o canales de la misma actividad.";
export const CROSS_COPY_PROGRESS_OPTIONS: Array<{
  value: CrossCopyProgress;
  label: string;
}> = [
  { value: "shared", label: "Sí, comparte progreso" },
  { value: "separate", label: "No comparte progreso" },
  { value: "partial", label: "Solo con algunas modalidades" },
  { value: "unknown", label: "Por confirmar" },
];

export function normalizeCrossCopyProgress(value: unknown): CrossCopyProgress {
  if (value === "shared" || value === "separate" || value === "partial" || value === "unknown")
    return value;
  const normalized = normalize(String(value ?? ""));
  if (normalized === "si") return "shared";
  if (normalized === "no") return "separate";
  if (normalized.includes("depende") || normalized.includes("algunas")) return "partial";
  return "unknown";
}

export function crossCopyProgressLabel(value: CrossCopyProgress): string {
  return (
    CROSS_COPY_PROGRESS_OPTIONS.find(option => option.value === value)?.label ?? "Por confirmar"
  );
}

export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function formatDate(date: string | null): string {
  if (!date) return "Sin fecha";
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function statusClass(status: string): string {
  const normalized = normalize(status);
  if (
    normalized.includes("jugando") ||
    normalized.includes("activo") ||
    normalized.includes("rejugando") ||
    normalized.includes("repitiendo")
  )
    return "status-green";
  if (
    normalized.includes("terminado") ||
    normalized.includes("completado") ||
    normalized.includes("archivado")
  )
    return "status-cyan";
  if (normalized.includes("pausado") || normalized.includes("aplazado")) return "status-orange";
  if (
    normalized.includes("abandonado") ||
    normalized.includes("no lo juegue") ||
    normalized.includes("al final")
  )
    return "status-red";
  if (
    normalized.includes("wishlist") ||
    normalized.includes("mira") ||
    normalized.includes("replay")
  )
    return "status-pink";
  if (normalized.includes("lista") || normalized.includes("bloqueado")) return "status-purple";
  return "status-yellow";
}

export function gameSearchText(game: Activity): string {
  return normalize(
    [
      game.title,
      game.status,
      game.priority,
      game.suggestedSession,
      game.notes,
      ...game.tags,
      ...game.contents.flatMap(content => [content.title, content.type, content.status]),
      ...game.copies.flatMap(copy => [copy.library, copy.device, copy.ownership]),
    ].join(" ")
  );
}

export function nextGeneratedId(prefix: string, ids: string[]): string {
  const max = ids.reduce((current, id) => {
    const value = Number(id.replace(/\D/g, ""));
    return Number.isFinite(value) ? Math.max(current, value) : current;
  }, 0);
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

export function getActiveSlotProfile(data: QuestData) {
  return (
    data.preferences.slotProfiles.find(
      profile => profile.id === data.preferences.activeSlotProfileId
    ) ?? data.preferences.slotProfiles[0]
  );
}

export function getSlotLabel(data: QuestData, slotId: string): string {
  const profile = getActiveSlotProfile(data);
  if (slotId === "first") return profile?.slots[0].label ?? "Primera franja";
  if (slotId === "second") return profile?.slots[1].label ?? "Segunda franja";
  if (slotId === "secondary") return data.preferences.secondarySlotLabel;
  return data.preferences.flexibleSlotLabel;
}

export function deviceName(data: QuestData, deviceId: string | null | undefined): string {
  if (!deviceId) return UNKNOWN_LABEL;
  return data.platforms.find(platform => platform.id === deviceId)?.name ?? UNKNOWN_LABEL;
}

export function copyPlatformKey(value: string): string {
  return (
    normalize(value)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "plataforma"
  );
}

export function normalizeCopyPlatforms(
  existing: Channel[] = [],
  libraryNames: string[] = []
): Channel[] {
  const result: Channel[] = [];
  const names = new Set<string>();
  const ids = new Set<string>();

  for (const platform of existing) {
    const name = platform.name.trim();
    const normalizedName = normalize(name);
    if (!name || names.has(normalizedName) || ids.has(platform.id)) continue;
    result.push({ ...platform, name, active: platform.active ?? true });
    names.add(normalizedName);
    ids.add(platform.id);
  }

  for (const libraryName of libraryNames) {
    const name = libraryName.trim();
    const normalizedName = normalize(name);
    if (!name || names.has(normalizedName)) continue;
    const baseId = `platform-${copyPlatformKey(name)}`;
    let id = baseId;
    let suffix = 2;
    while (ids.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }
    result.push({ id, name, active: true });
    names.add(normalizedName);
    ids.add(id);
  }
  return result;
}

export function resolveCopyPlatform(
  platforms: Channel[],
  platformId: string | undefined,
  legacyLibrary: string
): Channel | undefined {
  return (
    platforms.find(platform => platform.id === platformId) ??
    platforms.find(platform => normalize(platform.name) === normalize(legacyLibrary))
  );
}

export function inferDeviceIds(data: Pick<QuestData, "platforms">, text: string): string[] {
  const normalizedText = normalize(text || "");
  if (!normalizedText || normalizedText === "por confirmar") return [];
  return data.platforms
    .filter(platform => {
      const fullName = normalize(platform.name);
      if (normalizedText.includes(fullName) || fullName.includes(normalizedText)) return true;
      return platform.name
        .split(/[/+]/)
        .map(part => normalize(part))
        .filter(part => part.length >= 3)
        .some(part => normalizedText.includes(part));
    })
    .map(platform => platform.id);
}

export function copyDeviceIds(
  data: Pick<QuestData, "platforms">,
  copy: ActivityVariant | null | undefined
): string[] {
  if (!copy) return [];
  const valid = new Set(data.platforms.map(platform => platform.id));
  const saved = (copy.deviceIds ?? []).filter(id => valid.has(id));
  return saved.length ? saved : inferDeviceIds(data, copy.device);
}

export function deviceLabels(data: Pick<QuestData, "platforms">, ids: string[]): string[] {
  const valid = new Map(data.platforms.map(platform => [platform.id, platform.name]));
  return ids.map(id => valid.get(id)).filter((name): name is string => Boolean(name));
}

export function deviceLabel(data: Pick<QuestData, "platforms">, ids: string[]): string {
  return deviceLabels(data, ids).join(" + ") || UNKNOWN_LABEL;
}

export function copyDeviceLabel(
  data: Pick<QuestData, "platforms">,
  copy: ActivityVariant | null | undefined
): string {
  if (!copy) return UNKNOWN_LABEL;
  const ids = copyDeviceIds(data, copy);
  return ids.length ? deviceLabel(data, ids) : copy.device || UNKNOWN_LABEL;
}

export function quickCopyKey(library: string, ownership: string, platformId?: string): string {
  const platformKey = platformId || copyPlatformKey(library) || "sin-plataforma";
  return `${platformKey}::${normalize(ownership).replace(/[^a-z0-9]+/g, "-") || "sin-propiedad"}`;
}

export function ownershipDisplayKey(ownership: string): string {
  return normalize(ownership)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeOwnershipDisplayRules(
  ownershipTerms: string[],
  existing: OwnershipDisplayRules = {}
): OwnershipDisplayRules {
  return Object.fromEntries(
    ownershipTerms.map(ownership => {
      const key = ownershipDisplayKey(ownership);
      const saved = existing[key];
      const label = (saved?.label.trim() || ownership).slice(0, OWNERSHIP_LABEL_MAX_LENGTH);
      return [key, { hidden: saved?.hidden ?? false, label }];
    })
  );
}

export function accessMethodOptions(ownershipTerms: string[], current?: string): string[] {
  const terms = ownershipTerms.map(item => item.trim()).filter(Boolean);
  const available = terms.length ? terms : [DEFAULT_ACCESS_METHOD];
  if (current && !available.some(item => normalize(item) === normalize(current))) {
    return [current, ...available];
  }
  return available;
}

export function quickCopyLabel(
  preset: Pick<QuickVariantPreset, "library" | "ownership">,
  rules: OwnershipDisplayRules = {}
): string {
  const library = preset.library.trim() || "Modalidad";
  const ownership = preset.ownership.trim();
  const rule = rules[ownershipDisplayKey(ownership)];
  if (!ownership || rule?.hidden) return library;
  const display = (rule?.label.trim() || ownership).slice(0, OWNERSHIP_LABEL_MAX_LENGTH);
  if (!display || normalize(library).includes(normalize(display))) return library;
  return `${library} ${display}`;
}

export function quickCopyPresetFromCopy(
  data: Pick<QuestData, "platforms">,
  copy: ActivityVariant,
  updatedAt = new Date().toISOString()
): QuickVariantPreset {
  return {
    key: quickCopyKey(copy.library, copy.ownership, copy.platformId),
    platformId: copy.platformId,
    library: copy.library,
    ownership: copy.ownership,
    deviceIds: copyDeviceIds(data, copy),
    status: "Disponible",
    priority: copy.priority,
    idealSession: copy.idealSession,
    crossCopyProgress: copy.crossCopyProgress,
    notes: copy.notes,
    updatedAt,
  };
}

export function mergeQuickCopyPresets(
  data: Pick<QuestData, "platforms">,
  existing: QuickVariantPreset[],
  copies: ActivityVariant[]
): QuickVariantPreset[] {
  const now = new Date().toISOString();
  const incoming = copies
    .filter(copy => copy.library.trim())
    .map(copy => quickCopyPresetFromCopy(data, copy, now));
  const keys = new Set(incoming.map(preset => preset.key));
  const normalizedExisting = existing.map(preset => ({
    ...preset,
    key: quickCopyKey(preset.library, preset.ownership, preset.platformId),
  }));
  return [...incoming, ...normalizedExisting.filter(preset => !keys.has(preset.key))]
    .filter((preset, index, all) => all.findIndex(item => item.key === preset.key) === index)
    .slice(0, 80);
}

export function selectGlobalQuickCopyPresets(
  data: Pick<QuestData, "games" | "platforms" | "preferences" | "catalogs">
): QuickVariantPreset[] {
  const stored = data.preferences.quickCopyPresets ?? [];
  const presets = stored.length
    ? mergeQuickCopyPresets(data, stored, [])
    : mergeQuickCopyPresets(
        data,
        [],
        data.games.flatMap(game => game.copies)
      );
  if (!data.catalogs?.ownership) return presets;
  const allowed = new Set(accessMethodOptions(data.catalogs.ownership).map(normalize));
  return presets.filter(preset => allowed.has(normalize(preset.ownership)));
}

export function selectExistingQuickCopyKeys(game: Pick<Activity, "copies">): Set<string> {
  return new Set(
    game.copies.map(copy => quickCopyKey(copy.library, copy.ownership, copy.platformId))
  );
}

export function selectQuickCopyPresets(
  data: Pick<QuestData, "games" | "platforms" | "preferences" | "catalogs">,
  sessionPresets: QuickVariantPreset[]
): QuickVariantPreset[] {
  const global = selectGlobalQuickCopyPresets(data);
  const sessionKeys = new Set(
    sessionPresets.map(preset => quickCopyKey(preset.library, preset.ownership, preset.platformId))
  );
  return [
    ...sessionPresets.map(preset => ({
      ...preset,
      key: quickCopyKey(preset.library, preset.ownership, preset.platformId),
    })),
    ...global.filter(preset => !sessionKeys.has(preset.key)),
  ].slice(0, 80);
}

export function splitDevices(device: string): string[] {
  return device
    .split(/[/+]/)
    .map(item => item.trim())
    .filter(Boolean)
    .filter((item, index, all) => all.indexOf(item) === index);
}

export function gameForMission(data: QuestData, mission: Mission): Activity | null {
  return data.games.find(game => game.id === mission.gameId) ?? null;
}

export function activeMissions(data: QuestData): Mission[] {
  const slotOrder = new Map([
    ["first", 0],
    ["second", 1],
    ["secondary", 2],
    ["flexible", 3],
  ]);
  return data.missions
    .filter(mission => mission.status === "active")
    .sort((a, b) => (slotOrder.get(a.slotId) ?? 9) - (slotOrder.get(b.slotId) ?? 9));
}

export function sortedQueue(data: QuestData): QueueItem[] {
  return [...data.queue].sort((a, b) => a.position - b.position);
}

export function missionLinkState(
  data: QuestData,
  mission: Pick<Mission, "gameId" | "contentId" | "copyId" | "playthroughId">
): { hasContent: boolean; hasCopy: boolean; hasPlaythrough: boolean; complete: boolean } {
  const game = data.games.find(item => item.id === mission.gameId);
  const hasContent = Boolean(
    mission.contentId && game?.contents.some(content => content.id === mission.contentId)
  );
  const hasCopy = Boolean(mission.copyId && game?.copies.some(copy => copy.id === mission.copyId));
  const hasPlaythrough = Boolean(
    mission.playthroughId &&
    game?.playthroughs.some(playthrough => playthrough.id === mission.playthroughId)
  );
  return { hasContent, hasCopy, hasPlaythrough, complete: hasContent && hasCopy && hasPlaythrough };
}

export function queueLabel(data: QuestData, state: QueueItem["state"]): string {
  return data.catalogs.queueStates.find(item => item.id === state)?.label ?? state;
}

export function unresolvedDependencies(data: QuestData, game: Activity): Activity[] {
  return game.dependencies
    .map(id => data.games.find(candidate => candidate.id === id))
    .filter((candidate): candidate is Activity => Boolean(candidate))
    .filter(candidate => !["Terminado", "Completado"].includes(candidate.status));
}

export function getWeekLabel(date: Date, weekStartsOn: 0 | 1): string {
  const start = new Date(date);
  const day = start.getDay();
  let delta = -day;
  if (weekStartsOn === 1) delta = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + delta);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const formatter = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short" });
  return `${formatter.format(start)} – ${formatter.format(end)}`;
}

export interface GeneratedScheduleItem {
  id: string;
  date: string;
  day: string;
  missions: Array<{
    mission: Mission;
    game: Activity;
    slotId: string;
    label: string;
    duration: string;
  }>;
}

function durationLabel(min: number, max: number): string {
  if (min === max) return `${min} min`;
  return `${min}–${max} min`;
}

export function generateSchedule(data: QuestData): GeneratedScheduleItem[] {
  const days = Math.max(1, data.preferences.scheduleWeeks) * 7;
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const formatter = new Intl.DateTimeFormat("es-MX", { weekday: "long" });
  const overrides = data.scheduleOverrides;
  const result: GeneratedScheduleItem[] = [];

  for (let index = 0; index < days; index += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const dateKey = date.toISOString().slice(0, 10);
    const weekday = date.getDay();
    const missions = data.scheduleRules.flatMap(rule => {
      if (!rule.enabled) return [];
      const skipped = overrides.some(
        override =>
          override.date === dateKey &&
          override.missionId === rule.missionId &&
          override.action === "skip"
      );
      if (skipped) return [];
      const mission = data.missions.find(
        item => item.id === rule.missionId && item.status === "active"
      );
      if (!mission) return [];
      const game = data.games.find(item => item.id === mission.gameId);
      if (!game) return [];
      return rule.sessions
        .filter(session => session.weekday === weekday)
        .map(session => ({
          mission,
          game,
          slotId: session.slotId,
          label: getSlotLabel(data, session.slotId),
          duration: durationLabel(rule.durationMin, rule.durationMax),
        }));
    });
    result.push({
      id: `CAL-${dateKey}`,
      date: dateKey,
      day: formatter.format(date).replace(/^./, letter => letter.toUpperCase()),
      missions,
    });
  }
  return result;
}

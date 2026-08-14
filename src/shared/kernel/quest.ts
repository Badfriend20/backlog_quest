export type QueueState =
  | "active"
  | "queued"
  | "paused"
  | "deferred"
  | "replay"
  | "replay-later"
  | "archived"
  | "low-interest"
  | "blocked"
  | "wishlist";

export type MissionStatus = "active" | "paused" | "deferred" | "finished" | "abandoned";
export type ContentType = "campaign" | "dlc" | "replay" | "custom";
export type CompletionResult = "Terminado" | "Completado";
export type ReplayIntent = "yes" | "maybe" | "no" | "unknown";
export type CrossCopyProgress = "shared" | "separate" | "partial" | "unknown";

export interface ActivityVariant {
  id: string;
  platformId?: string;
  library: string;
  device: string;
  deviceIds?: string[];
  ownership: string;
  status: string;
  priority: string;
  idealSession: string;
  crossCopyProgress: CrossCopyProgress;
  notes: string;
}

export interface Journey {
  id: string;
  number: number;
  platform: string;
  device: string;
  deviceId?: string;
  status: string;
  startedAt: string | null;
  finishedAt: string | null;
  notes: string;
  contentId?: string;
  contentTitle?: string;
  contentType?: ContentType;
  copyId?: string;
}

export interface ActivityProgress {
  chapter: string;
  completions: number;
  replays: number;
  lastPlayedAt: string | null;
}

export interface ActivityContent {
  id: string;
  title: string;
  type: ContentType;
  status: "not-started" | "active" | "paused" | "finished" | "completed" | "abandoned";
  notes: string;
}

export interface Activity {
  id: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  suggestedSession: string;
  private: boolean;
  notes: string;
  tags: string[];
  progress: ActivityProgress;
  copies: ActivityVariant[];
  playthroughs: Journey[];
  contents: ActivityContent[];
  dependencies: string[];
  availableFrom: string | null;
}

export interface Resource {
  id: string;
  name: string;
  kind: string;
  active: boolean;
  priority: string;
  notes: string;
}

export interface QuickVariantPreset {
  key: string;
  platformId?: string;
  library: string;
  ownership: string;
  deviceIds: string[];
  status: string;
  priority: string;
  idealSession: string;
  crossCopyProgress: CrossCopyProgress;
  notes: string;
  updatedAt: string;
}

export interface QueueItem {
  gameId: string;
  position: number;
  state: QueueState;
  preferredCopyId: string | null;
  preferredDevice: string;
  preferredDeviceId?: string;
  preferredSlotId: string;
  replayIntent: ReplayIntent;
  availableFrom: string | null;
  pinned: boolean;
  pinnedPosition: number | null;
  deferredAt: string | null;
  reason: string;
}

export interface Mission {
  id: string;
  gameId: string;
  contentId: string;
  contentTitle: string;
  contentType: ContentType;
  copyId: string;
  activeDevice: string;
  activeDeviceId?: string;
  slotId: string;
  status: MissionStatus;
  playthroughId: string;
  scheduleRuleId: string | null;
  startedAt: string;
  finishedAt: string | null;
  notes: string;
}

export interface ScheduleRule {
  id: string;
  missionId: string;
  sessions: ScheduleSession[];
  durationMin: number;
  durationMax: number;
  enabled: boolean;
}

export interface ScheduleSession {
  weekday: number;
  slotId: string;
}

export interface ScheduleOverride {
  id: string;
  date: string;
  missionId: string;
  action: "skip" | "add";
  notes: string;
}

export interface ActivityItem {
  id: string;
  type: string;
  gameId: string | null;
  missionId: string | null;
  at: string;
  description: string;
}

export interface StatusCatalogItem {
  id: string;
  label: string;
  color: string;
  description: string;
}

export interface PriorityCatalogItem {
  id: string;
  label: string;
  description: string;
}

export interface Channel {
  id: string;
  name: string;
  active: boolean;
}

export interface SlotDefinition {
  id: "first" | "second";
  label: string;
}

export interface SlotProfile {
  id: string;
  label: string;
  custom: boolean;
  slots: [SlotDefinition, SlotDefinition];
}

export type ThemeId = "midnight" | "graphite" | "forest" | "light" | "custom";
export type VocabularyProfileId =
  "generic" | "gaming" | "reading" | "learning" | "projects" | "custom";

export interface VocabularyTerms {
  activity: string;
  activities: string;
  collection: string;
  variant: string;
  variants: string;
  channel: string;
  channels: string;
  accessMethod: string;
  resource: string;
  resources: string;
  journey: string;
  journeys: string;
  repetition: string;
  repetitions: string;
  content: string;
  contents: string;
  mission: string;
  missions: string;
  statusPending: string;
  statusActive: string;
  statusSecondary: string;
  statusRepeating: string;
  statusPaused: string;
  statusFinished: string;
  statusCompleted: string;
  statusAbandoned: string;
}

export interface OwnershipDisplayRule {
  hidden: boolean;
  label: string;
}

export type OwnershipDisplayRules = Record<string, OwnershipDisplayRule>;

export interface ThemeColors {
  background: string;
  container: string;
  sidebar: string;
  panel: string;
  panelAlt: string;
  border: string;
  text: string;
  muted: string;
  primary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
}

export interface AppPreferences {
  theme: ThemeId;
  customTheme: ThemeColors;
  vocabularyProfile: VocabularyProfileId;
  customVocabulary: Partial<VocabularyTerms>;
  hidePrivateByDefault: boolean;
  activeView: AppView;
  activeSlotProfileId: string;
  slotProfiles: SlotProfile[];
  secondarySlotLabel: string;
  flexibleSlotLabel: string;
  queueDisplayCount: number;
  deferPosition: number;
  scheduleWeeks: number;
  weekStartsOn: 0 | 1;
  compactCards: boolean;
  showTooltips: boolean;
  confirmDestructiveActions: boolean;
  autoSuggestNext: boolean;
  rules: string[];
  quickCopyPresetsReady: boolean;
  quickCopyPresets: QuickVariantPreset[];
  ownershipDisplayRules: OwnershipDisplayRules;
}

export interface QuestData {
  schemaVersion: 2;
  meta: {
    title: string;
    createdAt: string;
    updatedAt: string;
    source: string;
    notes: string;
  };
  preferences: AppPreferences;
  catalogs: {
    statuses: StatusCatalogItem[];
    priorities: PriorityCatalogItem[];
    platforms: Channel[];
    ownership: string[];
    deviceKinds: string[];
    queueStates: Array<{ id: QueueState; label: string; description: string }>;
  };
  platforms: Resource[];
  queue: QueueItem[];
  missions: Mission[];
  scheduleRules: ScheduleRule[];
  scheduleOverrides: ScheduleOverride[];
  activityLog: ActivityItem[];
  games: Activity[];
}

export type AppView =
  "dashboard" | "queue" | "library" | "schedule" | "history" | "platforms" | "settings";

export interface CompletionFormValue {
  result: CompletionResult;
  scope: "content" | "game";
  replayIntent: Exclude<ReplayIntent, "unknown">;
  copyId: string;
  device: string;
  deviceId: string;
  notes: string;
}

export interface MissionFormValue {
  gameId: string;
  contentId: string;
  copyId: string;
  activeDevice: string;
  activeDeviceId: string;
  slotId: string;
  sessions: ScheduleSession[];
  durationMin: number;
  durationMax: number;
  notes: string;
  replaceOccupied: boolean;
}

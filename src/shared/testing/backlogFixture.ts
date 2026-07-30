import type { QuestData, Activity } from "../kernel/quest";

const PRIMARY_DEVICE_ID = "device-primary";
const SECONDARY_DEVICE_ID = "device-secondary";
const PRIMARY_DEVICE_NAME = "Equipo principal";
const SECONDARY_DEVICE_NAME = "Equipo secundario";
const FIXTURE_DATE = "2026-01-01T00:00:00.000Z";

const EMPTY_BACKLOG_FIXTURE: QuestData = {
  schemaVersion: 2,
  meta: {
    title: "Fixture de Backlog Quest",
    createdAt: FIXTURE_DATE,
    updatedAt: FIXTURE_DATE,
    source: "Pruebas",
    notes: "",
  },
  preferences: {
    theme: "midnight",
    customTheme: {
      background: "#101018",
      container: "#101018",
      sidebar: "#181824",
      panel: "#181824",
      panelAlt: "#202030",
      border: "#36364a",
      text: "#f4f4ff",
      muted: "#a0a0b8",
      primary: "#b794f4",
      accent: "#67e8f9",
      success: "#6ee7b7",
      warning: "#ffd166",
      danger: "#ff6f7d",
    },
    vocabularyProfile: "generic",
    customVocabulary: {},
    hidePrivateByDefault: true,
    activeView: "dashboard",
    activeSlotProfileId: "test-profile",
    slotProfiles: [
      {
        id: "test-profile",
        label: "Día / Noche",
        custom: false,
        slots: [
          { id: "first", label: "Día" },
          { id: "second", label: "Noche" },
        ],
      },
    ],
    secondarySlotLabel: "Secundario",
    flexibleSlotLabel: "Flexible",
    queueDisplayCount: 10,
    deferPosition: 2,
    scheduleWeeks: 1,
    weekStartsOn: 1,
    compactCards: false,
    showTooltips: true,
    confirmDestructiveActions: true,
    autoSuggestNext: true,
    rules: [],
    quickCopyPresetsReady: false,
    quickCopyPresets: [],
    ownershipDisplayRules: {},
  },
  catalogs: {
    statuses: [],
    priorities: [],
    platforms: [],
    ownership: ["Propio"],
    deviceKinds: ["computer", "console"],
    queueStates: [],
  },
  platforms: [],
  queue: [],
  missions: [],
  scheduleRules: [],
  scheduleOverrides: [],
  activityLog: [],
  games: [],
};

function game(
  id: string,
  title: string,
  copyId: string,
  platformId: string,
  library: string,
  deviceId: string,
  device: string,
  withActivePlaythrough = false
): Activity {
  return {
    id,
    title,
    type: "Juego",
    status: withActivePlaythrough ? "Jugando" : "Disponible",
    priority: withActivePlaythrough ? "Alta" : "Media",
    suggestedSession: "Flexible",
    private: false,
    notes: "",
    tags: [],
    progress: {
      chapter: withActivePlaythrough ? "Capítulo de prueba" : "",
      completions: 0,
      replays: 0,
      lastPlayedAt: null,
    },
    copies: [
      {
        id: copyId,
        platformId,
        library,
        device,
        deviceIds: [deviceId],
        ownership: "Propio",
        status: "Disponible",
        priority: "Alta",
        idealSession: "Flexible",
        crossCopyProgress: "unknown",
        notes: "",
      },
    ],
    playthroughs: withActivePlaythrough
      ? [
          {
            id: "playthrough-1",
            number: 1,
            platform: library,
            device,
            deviceId,
            status: "Jugando",
            startedAt: FIXTURE_DATE,
            finishedAt: null,
            notes: "",
            contentId: "main-campaign",
            copyId,
          },
        ]
      : [],
    contents: [
      {
        id: "main-campaign",
        title: "Campaña principal",
        type: "campaign",
        status: withActivePlaythrough ? "active" : "not-started",
        notes: "",
      },
    ],
    dependencies: [],
    availableFrom: null,
  };
}

export function withBacklogFixture(base: QuestData): QuestData {
  const data = structuredClone(base);
  const primaryGame = game(
    "game-1",
    "Juego de prueba A",
    "copy-1",
    "platform-steam",
    "Steam",
    PRIMARY_DEVICE_ID,
    PRIMARY_DEVICE_NAME,
    true
  );
  const secondaryGame = game(
    "game-2",
    "Juego de prueba B",
    "copy-2",
    "platform-epic",
    "Epic Games",
    SECONDARY_DEVICE_ID,
    SECONDARY_DEVICE_NAME
  );

  return {
    ...data,
    catalogs: {
      ...data.catalogs,
      platforms: [
        { id: "platform-steam", name: "Steam", active: true },
        { id: "platform-epic", name: "Epic Games", active: true },
      ],
    },
    platforms: [
      {
        id: PRIMARY_DEVICE_ID,
        name: PRIMARY_DEVICE_NAME,
        kind: "computer",
        active: true,
        priority: "Alta",
        currentRole: "Principal",
        notes: "",
      },
      {
        id: SECONDARY_DEVICE_ID,
        name: SECONDARY_DEVICE_NAME,
        kind: "console",
        active: true,
        priority: "Media",
        currentRole: "Secundario",
        notes: "",
      },
    ],
    games: [primaryGame, secondaryGame],
    queue: [
      {
        gameId: primaryGame.id,
        position: 1,
        state: "active",
        preferredCopyId: "copy-1",
        preferredDevice: PRIMARY_DEVICE_NAME,
        preferredDeviceId: PRIMARY_DEVICE_ID,
        preferredSlotId: "first",
        replayIntent: "unknown",
        availableFrom: null,
        pinned: false,
        pinnedPosition: null,
        deferredAt: null,
        reason: "",
      },
      {
        gameId: secondaryGame.id,
        position: 2,
        state: "queued",
        preferredCopyId: "copy-2",
        preferredDevice: SECONDARY_DEVICE_NAME,
        preferredDeviceId: SECONDARY_DEVICE_ID,
        preferredSlotId: "flexible",
        replayIntent: "unknown",
        availableFrom: null,
        pinned: false,
        pinnedPosition: null,
        deferredAt: null,
        reason: "",
      },
    ],
    missions: [
      {
        id: "mission-1",
        gameId: primaryGame.id,
        contentId: "main-campaign",
        contentTitle: "Campaña principal",
        contentType: "campaign",
        copyId: "copy-1",
        activeDevice: PRIMARY_DEVICE_NAME,
        activeDeviceId: PRIMARY_DEVICE_ID,
        slotId: "first",
        status: "active",
        playthroughId: "playthrough-1",
        scheduleRuleId: "schedule-1",
        startedAt: FIXTURE_DATE,
        finishedAt: null,
        notes: "",
      },
    ],
    scheduleRules: [
      {
        id: "schedule-1",
        missionId: "mission-1",
        sessions: [{ weekday: 1, slotId: "first" }],
        durationMin: 30,
        durationMax: 60,
        enabled: true,
      },
    ],
    scheduleOverrides: [],
    activityLog: [],
  };
}

export function createBacklogFixture(): QuestData {
  return withBacklogFixture(EMPTY_BACKLOG_FIXTURE);
}

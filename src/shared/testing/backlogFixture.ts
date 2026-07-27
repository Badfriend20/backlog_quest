import type { BacklogData, Game } from "../kernel/backlog";

const PRIMARY_DEVICE_ID = "device-primary";
const SECONDARY_DEVICE_ID = "device-secondary";
const PRIMARY_DEVICE_NAME = "Equipo principal";
const SECONDARY_DEVICE_NAME = "Equipo secundario";

function game(
  id: string,
  title: string,
  copyId: string,
  platformId: string,
  library: string,
  deviceId: string,
  device: string,
  withActivePlaythrough = false
): Game {
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
      chapter: withActivePlaythrough ? "CapÃ­tulo de prueba" : "",
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
            startedAt: "2026-01-01T00:00:00.000Z",
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
        title: "CampaÃ±a principal",
        type: "campaign",
        status: withActivePlaythrough ? "active" : "not-started",
        notes: "",
      },
    ],
    dependencies: [],
    availableFrom: null,
  };
}

export function withBacklogFixture(base: BacklogData): BacklogData {
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
        contentTitle: "CampaÃ±a principal",
        contentType: "campaign",
        copyId: "copy-1",
        activeDevice: PRIMARY_DEVICE_NAME,
        activeDeviceId: PRIMARY_DEVICE_ID,
        slotId: "first",
        status: "active",
        playthroughId: "playthrough-1",
        scheduleRuleId: "schedule-1",
        startedAt: "2026-01-01T00:00:00.000Z",
        finishedAt: null,
        notes: "",
      },
    ],
    scheduleRules: [
      {
        id: "schedule-1",
        missionId: "mission-1",
        weekdays: [1],
        durationMin: 30,
        durationMax: 60,
        enabled: true,
      },
    ],
    scheduleOverrides: [],
    activityLog: [],
  };
}

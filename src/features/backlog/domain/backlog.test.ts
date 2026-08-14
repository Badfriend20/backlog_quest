import { describe, expect, it } from "vitest";
import type { QuestData } from "../../../shared/kernel/quest";
import { createBacklogFixture } from "../../../shared/testing/backlogFixture";
import { buildRotationPlan } from "../../queue";
import {
  activateMission,
  deferMission,
  finishMission,
  pauseMission,
  sendMissionToEnd,
  moveQueueToPosition,
} from "./backlog";

function referenceData() {
  return createBacklogFixture();
}

function linkedState(action: typeof pauseMission) {
  const data = referenceData();
  const mission = data.missions.find(item => item.status === "active")!;
  const result = action(data, mission.id);
  const game = result.games.find(item => item.id === mission.gameId)!;
  return {
    before: data,
    mission,
    result,
    updatedMission: result.missions.find(item => item.id === mission.id)!,
    queueItem: result.queue.find(item => item.gameId === mission.gameId)!,
    playthrough: game.playthroughs.find(item => item.id === mission.playthroughId)!,
  };
}

describe("acciones coherentes de misión", () => {
  it.each([
    ["pausar", pauseMission, "paused", "paused"],
    ["aplazar", deferMission, "deferred", "deferred"],
    ["enviar al final", sendMissionToEnd, "deferred", "low-interest"],
  ] as const)(
    "%s actualiza misión, partida, lista y calendario",
    (_name, action, missionStatus, queueState) => {
      const state = linkedState(action);

      expect(state.updatedMission.status).toBe(missionStatus);
      expect(state.playthrough.status).toBe("Pausado");
      expect(state.queueItem.state).toBe(queueState);
      expect(state.result.scheduleRules.some(rule => rule.missionId === state.mission.id)).toBe(
        false
      );
      expect(state.result.activityLog.length).toBeGreaterThan(state.before.activityLog.length);
    }
  );

  it("terminar cierra la partida elegida y reorganiza todas las relaciones", () => {
    const data = referenceData();
    const mission = data.missions.find(item => item.status === "active")!;
    const game = data.games.find(item => item.id === mission.gameId)!;
    const copy = game.copies.find(item => item.id === mission.copyId)!;
    const result = finishMission(data, mission.id, {
      result: "Terminado",
      scope: "game",
      replayIntent: "maybe",
      copyId: copy.id,
      device: mission.activeDevice,
      deviceId: mission.activeDeviceId!,
      notes: "Cierre probado",
    });
    const updatedGame = result.games.find(item => item.id === mission.gameId)!;
    const updatedPlaythrough = updatedGame.playthroughs.find(
      item => item.id === mission.playthroughId
    )!;

    expect(result.missions.find(item => item.id === mission.id)?.status).toBe("finished");
    expect(updatedPlaythrough.status).toBe("Terminado");
    expect(updatedPlaythrough.copyId).toBe(copy.id);
    expect(result.queue.find(item => item.gameId === mission.gameId)?.state).toBe("replay-later");
    expect(result.scheduleRules.some(rule => rule.missionId === mission.id)).toBe(false);
    expect(result.activityLog.length).toBeGreaterThan(data.activityLog.length);
  });

  it("terminar una misión sin partida crea y vincula su historial", () => {
    const data = referenceData();
    const mission = data.missions[0];
    const game = data.games.find(item => item.id === mission.gameId)!;
    const copy = game.copies[0];
    const withoutPlaythrough = {
      ...data,
      missions: data.missions.map(item =>
        item.id === mission.id ? { ...item, playthroughId: "" } : item
      ),
      games: data.games.map(item => (item.id === game.id ? { ...item, playthroughs: [] } : item)),
    };

    const result = finishMission(withoutPlaythrough, mission.id, {
      result: "Terminado",
      scope: "game",
      replayIntent: "no",
      copyId: copy.id,
      device: mission.activeDevice,
      deviceId: mission.activeDeviceId!,
      notes: "",
    });
    const updatedMission = result.missions.find(item => item.id === mission.id)!;
    const updatedGame = result.games.find(item => item.id === game.id)!;

    expect(updatedMission.playthroughId).not.toBe("");
    expect(updatedGame.playthroughs.some(play => play.id === updatedMission.playthroughId)).toBe(
      true
    );
  });

  it("terminar una misión sin copia conserva el cierre desacoplado", () => {
    const data = referenceData();
    const mission = data.missions[0];
    const game = data.games.find(item => item.id === mission.gameId)!;
    const withoutCopy = {
      ...data,
      missions: data.missions.map(item =>
        item.id === mission.id ? { ...item, copyId: "" } : item
      ),
      games: data.games.map(item =>
        item.id === game.id
          ? {
              ...item,
              copies: item.copies.filter(copy => copy.id !== mission.copyId),
              playthroughs: item.playthroughs.map(play =>
                play.id === mission.playthroughId ? { ...play, copyId: undefined } : play
              ),
            }
          : item
      ),
    };

    const result = finishMission(withoutCopy, mission.id, {
      result: "Terminado",
      scope: "game",
      replayIntent: "no",
      copyId: "",
      device: mission.activeDevice,
      deviceId: mission.activeDeviceId ?? "",
      notes: "",
    });
    const updatedMission = result.missions.find(item => item.id === mission.id)!;
    const updatedGame = result.games.find(item => item.id === game.id)!;
    const updatedPlaythrough = updatedGame.playthroughs.find(
      play => play.id === updatedMission.playthroughId
    )!;
    const updatedQueueItem = result.queue.find(item => item.gameId === game.id)!;

    expect(updatedMission.status).toBe("finished");
    expect(updatedMission.copyId).toBe("");
    expect(updatedPlaythrough.status).toBe("Terminado");
    expect(updatedPlaythrough.copyId).toBeUndefined();
    expect(updatedQueueItem.preferredCopyId).toBeNull();
  });

  it("activar crea una misión y vincula copia, dispositivo, partida, lista y calendario", () => {
    const data = referenceData();
    const activeGameIds = new Set(
      data.missions.filter(mission => mission.status === "active").map(mission => mission.gameId)
    );
    const game = data.games.find(item => item.copies.length > 0 && !activeGameIds.has(item.id))!;
    const copy = game.copies[0];
    const deviceId =
      copy.deviceIds?.[0] ?? data.platforms.find(platform => platform.active)?.id ?? "";
    const result = activateMission(data, {
      gameId: game.id,
      contentId: game.contents[0]?.id ?? "",
      copyId: copy.id,
      activeDevice:
        data.platforms.find(platform => platform.id === deviceId)?.name ?? "Por confirmar",
      activeDeviceId: deviceId,
      slotId: "flexible",
      sessions: [
        { weekday: 1, slotId: "second" },
        { weekday: 2, slotId: "first" },
        { weekday: 3, slotId: "flexible" },
      ],
      durationMin: 30,
      durationMax: 60,
      notes: "Activación probada",
      replaceOccupied: false,
    });
    const mission = result.missions.find(
      item => item.gameId === game.id && item.status === "active"
    )!;
    const updatedGame = result.games.find(item => item.id === game.id)!;

    expect(mission.copyId).toBe(copy.id);
    expect(mission.activeDeviceId).toBe(deviceId);
    expect(updatedGame.playthroughs.some(play => play.id === mission.playthroughId)).toBe(true);
    expect(result.queue.find(item => item.gameId === game.id)?.state).toBe("active");
    expect(result.scheduleRules.find(rule => rule.missionId === mission.id)?.sessions).toEqual([
      { weekday: 1, slotId: "second" },
      { weekday: 2, slotId: "first" },
      { weekday: 3, slotId: "flexible" },
    ]);
  });
});

function queueFixture(length = 6): QuestData {
  const data = createBacklogFixture();
  const templateGame = data.games[1];
  const templateItem = data.queue[1];
  return {
    ...data,
    games: Array.from({ length }, (_, index) => ({
      ...structuredClone(templateGame),
      id: `game-${index + 1}`,
      title: `Actividad ${index + 1}`,
      priority: "Media",
    })),
    queue: Array.from({ length }, (_, index) => ({
      ...structuredClone(templateItem),
      gameId: `game-${index + 1}`,
      position: index + 1,
      state: index === 0 ? ("replay" as const) : ("queued" as const),
      pinned: false,
      pinnedPosition: null,
    })),
    missions: [],
    scheduleRules: [],
    activityLog: [],
  };
}

describe("moveQueueToPosition", () => {
  it("mueve a una posición exacta y conserva posiciones continuas", () => {
    const result = moveQueueToPosition(queueFixture(), "game-1", 4);

    expect(result.queue.find(item => item.gameId === "game-1")?.position).toBe(4);
    expect(result.queue.map(item => item.position).sort((a, b) => a - b)).toEqual([
      1, 2, 3, 4, 5, 6,
    ]);
  });

  it("conserva el estado y el resto de los datos de la entrada", () => {
    const data = queueFixture();
    const original = data.queue[0];
    const result = moveQueueToPosition(data, original.gameId, 5);
    const moved = result.queue.find(item => item.gameId === original.gameId)!;

    expect(moved).toEqual({ ...original, position: 5 });
  });

  it("no mueve un elemento fijado", () => {
    const data = queueFixture();
    data.queue[0] = { ...data.queue[0], pinned: true, pinnedPosition: 1 };

    expect(moveQueueToPosition(data, "game-1", 6)).toBe(data);
  });

  it("respeta la posición de otros elementos fijados", () => {
    const data = queueFixture();
    data.queue[2] = { ...data.queue[2], pinned: true, pinnedPosition: 3 };
    const result = moveQueueToPosition(data, "game-1", 5);

    expect(result.queue.find(item => item.gameId === "game-3")?.position).toBe(3);
    expect(result.queue.map(item => item.position).sort((a, b) => a - b)).toEqual([
      1, 2, 3, 4, 5, 6,
    ]);
  });

  it("mueve al final y normaliza posiciones fuera de límites", () => {
    const atEnd = moveQueueToPosition(queueFixture(), "game-1", 999);
    expect(atEnd.queue.find(item => item.gameId === "game-1")?.position).toBe(6);

    const atStart = moveQueueToPosition(queueFixture(), "game-6", -20);
    expect(atStart.queue.find(item => item.gameId === "game-6")?.position).toBe(1);
  });

  it("registra actividad y actualiza metadatos", () => {
    const data = queueFixture();
    const result = moveQueueToPosition(data, "game-1", 4);

    expect(result.activityLog[0]).toMatchObject({ type: "queue-moved", gameId: "game-1" });
    expect(result.meta.updatedAt).not.toBe(data.meta.updatedAt);
  });

  it("cambia naturalmente la influencia de posición en la rotación", () => {
    const data = queueFixture(2);
    const before = buildRotationPlan(data, { referenceDate: "2026-06-15" });
    const result = moveQueueToPosition(data, "game-1", 2);
    const after = buildRotationPlan(result, { referenceDate: "2026-06-15" });

    expect(before.candidates[0].game.id).toBe("game-1");
    expect(after.candidates[0].game.id).toBe("game-2");
  });
});

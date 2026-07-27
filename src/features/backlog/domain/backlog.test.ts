import { describe, expect, it } from "vitest";
import defaultBacklogJson from "../../../data/backlog.json";
import { withBacklogFixture } from "../../../shared/testing/backlogFixture";
import { migrateBacklog } from "../infrastructure/migration";
import {
  activateMission,
  deferMission,
  finishMission,
  pauseMission,
  sendMissionToEnd,
} from "./backlog";

function referenceData() {
  return withBacklogFixture(migrateBacklog(structuredClone(defaultBacklogJson)));
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
    "%s actualiza misión, partida, cola y calendario",
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

  it("activar crea una misión y vincula copia, dispositivo, partida, cola y calendario", () => {
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
      contentTitle: game.contents[0]?.title ?? "Campaña principal",
      contentType: "campaign",
      copyId: copy.id,
      activeDevice:
        data.platforms.find(platform => platform.id === deviceId)?.name ?? "Por confirmar",
      activeDeviceId: deviceId,
      slotId: "flexible",
      weekdays: [1],
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
    expect(result.scheduleRules.some(rule => rule.missionId === mission.id)).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { copyDeviceIds, missionLinkState, normalize } from "../../../shared/kernel/questSelectors";
import { createBacklogFixture } from "../../../shared/testing/backlogFixture";
import {
  linkMissionRelation,
  removeCopy,
  removeGameContent,
  removePlaythrough,
  replaceGame,
  replaceCopyPlatforms,
  replaceOwnershipCatalog,
  replacePlatforms,
  updateActivityPriority,
} from "./backlogMutations";

describe("prioridad de actividad", () => {
  it("actualiza solo la actividad objetivo con una prioridad del catálogo", () => {
    const data = createBacklogFixture();
    data.catalogs.priorities.push({
      id: "custom",
      label: "Personalizada",
      description: "Prioridad creada por la persona.",
    });
    const target = data.games[1];
    const untouched = data.games[0];

    const updated = updateActivityPriority(data, target.id, "Personalizada");

    expect(updated.games.find(game => game.id === target.id)?.priority).toBe("Personalizada");
    expect(updated.games.find(game => game.id === untouched.id)).toEqual(untouched);
    expect(updated.queue).toEqual(data.queue);
    expect(updated.missions).toEqual(data.missions);
    expect(updated.meta.updatedAt).not.toBe(data.meta.updatedAt);
  });

  it("rechaza actividades inexistentes y valores ajenos al catálogo", () => {
    const data = createBacklogFixture();

    expect(updateActivityPriority(data, "missing", "Alta")).toBe(data);
    expect(updateActivityPriority(data, data.games[0].id, "Inventada")).toBe(data);
  });
});

describe("contenidos vinculados", () => {
  it("elimina el contenido y conserva snapshots en misión y partida", () => {
    const data = createBacklogFixture();
    const mission = data.missions[0];
    const game = data.games.find(item => item.id === mission.gameId)!;
    const content = game.contents.find(item => item.id === mission.contentId)!;
    const playthrough = game.playthroughs.find(item => item.id === mission.playthroughId)!;

    const updated = removeGameContent(data, game.id, content.id);
    const updatedMission = updated.missions.find(item => item.id === mission.id)!;
    const updatedGame = updated.games.find(item => item.id === game.id)!;
    const updatedPlaythrough = updatedGame.playthroughs.find(item => item.id === playthrough.id)!;

    expect(updatedGame.contents.some(item => item.id === content.id)).toBe(false);
    expect(updatedMission.contentId).toBe("");
    expect(updatedMission.contentTitle).toBe(content.title);
    expect(updatedMission.contentType).toBe(content.type);
    expect(updatedPlaythrough.contentId).toBeUndefined();
    expect(updatedPlaythrough.contentTitle).toBe(content.title);
    expect(updatedPlaythrough.contentType).toBe(content.type);
    expect(updated.activityLog).toEqual(data.activityLog);
  });

  it("sincroniza el nombre y tipo en las referencias mientras el contenido existe", () => {
    const data = createBacklogFixture();
    const mission = data.missions[0];
    const game = data.games.find(item => item.id === mission.gameId)!;
    const updatedGame = {
      ...game,
      contents: game.contents.map(content =>
        content.id === mission.contentId
          ? { ...content, title: "Nombre actualizado", type: "dlc" as const }
          : content
      ),
    };

    const updated = replaceGame(data, updatedGame);
    const updatedMission = updated.missions.find(item => item.id === mission.id)!;
    const updatedPlaythrough = updated.games
      .find(item => item.id === game.id)!
      .playthroughs.find(item => item.id === mission.playthroughId)!;

    expect(updatedMission.contentTitle).toBe("Nombre actualizado");
    expect(updatedMission.contentType).toBe("dlc");
    expect(updatedPlaythrough.contentTitle).toBe("Nombre actualizado");
    expect(updatedPlaythrough.contentType).toBe("dlc");
  });
});

describe("vinculación de misiones", () => {
  it("vincula una copia y sincroniza la partida ya existente", () => {
    const data = createBacklogFixture();
    const mission = data.missions[0];
    const game = data.games.find(item => item.id === mission.gameId)!;
    const copy = game.copies[0];
    const detached = {
      ...data,
      missions: data.missions.map(item =>
        item.id === mission.id ? { ...item, copyId: "" } : item
      ),
      games: data.games.map(item =>
        item.id === game.id
          ? {
              ...item,
              playthroughs: item.playthroughs.map(play =>
                play.id === mission.playthroughId ? { ...play, copyId: undefined } : play
              ),
            }
          : item
      ),
    };

    const updated = linkMissionRelation(detached, mission.id, {
      kind: "copy",
      id: copy.id,
    });
    const updatedMission = updated.missions.find(item => item.id === mission.id)!;
    const updatedGame = updated.games.find(item => item.id === game.id)!;
    const updatedPlaythrough = updatedGame.playthroughs.find(
      play => play.id === mission.playthroughId
    );

    expect(updatedMission.copyId).toBe(copy.id);
    expect(updatedPlaythrough?.copyId).toBe(copy.id);
    expect(updatedPlaythrough?.platform).toBe(copy.library);
    expect(updated.queue.find(item => item.gameId === game.id)?.preferredCopyId).toBe(copy.id);
  });

  it("vincula una partida válida y deriva su copia", () => {
    const data = createBacklogFixture();
    const mission = data.missions[0];
    const game = data.games.find(item => item.id === mission.gameId)!;
    const playthrough = game.playthroughs.find(play => Boolean(play.copyId))!;
    const detached = {
      ...data,
      missions: data.missions.map(item =>
        item.id === mission.id ? { ...item, copyId: "", playthroughId: "" } : item
      ),
    };

    const updated = linkMissionRelation(detached, mission.id, {
      kind: "playthrough",
      id: playthrough.id,
    });
    const updatedMission = updated.missions.find(item => item.id === mission.id)!;

    expect(updatedMission.playthroughId).toBe(playthrough.id);
    expect(updatedMission.copyId).toBe(playthrough.copyId);
  });

  it("rechaza vincular una partida que no tiene copia", () => {
    const data = createBacklogFixture();
    const mission = data.missions[0];
    const game = data.games.find(item => item.id === mission.gameId)!;
    const playthrough = game.playthroughs[0];
    const withoutCopy = {
      ...data,
      games: data.games.map(item =>
        item.id === game.id
          ? {
              ...item,
              playthroughs: item.playthroughs.map(play =>
                play.id === playthrough.id ? { ...play, copyId: undefined } : play
              ),
            }
          : item
      ),
    };

    expect(
      linkMissionRelation(withoutCopy, mission.id, {
        kind: "playthrough",
        id: playthrough.id,
      })
    ).toBe(withoutCopy);
  });
});

describe("copias vinculadas", () => {
  it("elimina la copia y conserva misiones y partidas desacopladas", () => {
    const data = createBacklogFixture();
    const mission = data.missions[0];
    const game = data.games.find(item => item.id === mission.gameId)!;
    const copy = game.copies.find(item => item.id === mission.copyId)!;
    const playthrough = game.playthroughs.find(item => item.copyId === copy.id)!;
    const dataWithPreferredCopy = {
      ...data,
      queue: data.queue.map(item =>
        item.gameId === game.id ? { ...item, preferredCopyId: copy.id } : item
      ),
    };

    const updated = removeCopy(dataWithPreferredCopy, game.id, copy.id);
    const updatedGame = updated.games.find(item => item.id === game.id);
    const updatedMission = updated.missions.find(item => item.id === mission.id);
    const updatedPlaythrough = updatedGame?.playthroughs.find(item => item.id === playthrough.id);
    const updatedQueueItem = updated.queue.find(item => item.gameId === game.id);

    expect(updatedGame?.copies.some(item => item.id === copy.id)).toBe(false);
    expect(updatedMission?.copyId).toBe("");
    expect(updatedPlaythrough?.copyId).toBeUndefined();
    expect(updatedPlaythrough?.platform).toBe(playthrough.platform);
    expect(updatedQueueItem?.preferredCopyId).toBeNull();
    expect(updatedQueueItem?.preferredDevice).toBe("");
    expect(updatedQueueItem?.preferredDeviceId).toBeUndefined();
    expect(updated.activityLog).toEqual(data.activityLog);
    expect(updated.queue).toHaveLength(dataWithPreferredCopy.queue.length);
    expect(missionLinkState(updated, updatedMission!)).toEqual({
      hasContent: true,
      hasCopy: false,
      hasPlaythrough: true,
      complete: false,
    });
  });
});

describe("partidas vinculadas", () => {
  it("elimina la partida y conserva la misión desacoplada", () => {
    const data = createBacklogFixture();
    const mission = data.missions[0];

    const updated = removePlaythrough(data, mission.gameId, mission.playthroughId);
    const updatedGame = updated.games.find(game => game.id === mission.gameId);
    const updatedMission = updated.missions.find(item => item.id === mission.id);

    expect(updatedGame?.playthroughs.some(play => play.id === mission.playthroughId)).toBe(false);
    expect(updatedMission?.playthroughId).toBe("");
    expect(updated.activityLog).toEqual(data.activityLog);
    expect(missionLinkState(updated, updatedMission!)).toEqual({
      hasContent: true,
      hasCopy: true,
      hasPlaythrough: false,
      complete: false,
    });
  });
});

describe("dispositivos", () => {
  it("renombra sin cambiar IDs y sincroniza las etiquetas derivadas", () => {
    const data = createBacklogFixture();
    const device = data.platforms.find(platform =>
      data.games.some(game =>
        game.copies.some(copy => copyDeviceIds(data, copy).includes(platform.id))
      )
    );

    expect(device).toBeDefined();
    const updated = replacePlatforms(
      data,
      data.platforms.map(platform =>
        platform.id === device?.id ? { ...platform, name: "Dispositivo renombrado" } : platform
      )
    );
    const linkedCopies = updated.games
      .flatMap(game => game.copies)
      .filter(copy => copyDeviceIds(updated, copy).includes(device?.id ?? ""));

    expect(updated.platforms.find(platform => platform.id === device?.id)?.name).toBe(
      "Dispositivo renombrado"
    );
    expect(linkedCopies.length).toBeGreaterThan(0);
    expect(linkedCopies.every(copy => copy.device.includes("Dispositivo renombrado"))).toBe(true);
  });
});

describe("configuración de plataformas", () => {
  it("fusiona nombres repetidos y conserva las referencias mediante ID", () => {
    const data = createBacklogFixture();
    const steam = data.catalogs.platforms.find(platform => normalize(platform.name) === "steam");
    const epic = data.catalogs.platforms.find(
      platform => normalize(platform.name) === "epic games"
    );

    expect(steam).toBeDefined();
    expect(epic).toBeDefined();

    const updated = replaceCopyPlatforms(
      data,
      data.catalogs.platforms.map(platform =>
        platform.id === epic?.id ? { ...platform, name: steam?.name ?? "Steam" } : platform
      )
    );
    const steamPlatforms = updated.catalogs.platforms.filter(
      platform => normalize(platform.name) === "steam"
    );
    const mergedCopies = data.games
      .flatMap(game => game.copies)
      .filter(copy => copy.platformId === epic?.id)
      .map(copy => copy.id);
    const updatedMergedCopies = updated.games
      .flatMap(game => game.copies)
      .filter(copy => mergedCopies.includes(copy.id));

    expect(steamPlatforms).toHaveLength(1);
    expect(updatedMergedCopies.length).toBeGreaterThan(0);
    expect(updatedMergedCopies.every(copy => copy.platformId === steamPlatforms[0].id)).toBe(true);
    expect(updatedMergedCopies.every(copy => copy.library === "Steam")).toBe(true);
  });
});

describe("catálogo de formas de acceso", () => {
  it("elimina una opción sin reescribir el historial ni permitir nuevos agregados con ella", () => {
    const data = createBacklogFixture();
    const historicalOwnership = data.games[0].copies[0].ownership;
    const key = historicalOwnership
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    const withPreset = {
      ...data,
      preferences: {
        ...data.preferences,
        ownershipDisplayRules: {
          ...data.preferences.ownershipDisplayRules,
          [key]: { hidden: false, label: "Suscripción" },
        },
        quickCopyPresets: [
          {
            key: `platform-test::${key}`,
            library: "Canal de prueba",
            ownership: historicalOwnership,
            deviceIds: [],
            status: "Disponible",
            priority: "Media",
            idealSession: "Flexible",
            crossCopyProgress: "unknown" as const,
            notes: "",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      },
    };

    const updated = replaceOwnershipCatalog(
      withPreset,
      data.catalogs.ownership.filter(item => item !== historicalOwnership),
      withPreset.preferences.ownershipDisplayRules
    );

    expect(updated.catalogs.ownership).not.toContain(historicalOwnership);
    expect(updated.games[0].copies[0].ownership).toBe(historicalOwnership);
    expect(updated.preferences.quickCopyPresets).toEqual([]);
    expect(updated.preferences.ownershipDisplayRules[key]).toBeUndefined();
  });
});

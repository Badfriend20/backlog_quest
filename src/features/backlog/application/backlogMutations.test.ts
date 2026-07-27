import { describe, expect, it } from "vitest";
import defaultBacklogJson from "../../../data/backlog.json";
import { copyDeviceIds, normalize } from "../../../shared/kernel/backlogSelectors";
import { withBacklogFixture } from "../../../shared/testing/backlogFixture";
import { migrateBacklog } from "../infrastructure/migration";
import { replaceCopyPlatforms, replacePlatforms } from "./backlogMutations";

describe("dispositivos", () => {
  it("renombra sin cambiar IDs y sincroniza las etiquetas derivadas", () => {
    const data = withBacklogFixture(migrateBacklog(defaultBacklogJson));
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
    const data = withBacklogFixture(migrateBacklog(defaultBacklogJson));
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

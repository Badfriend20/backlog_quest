import { describe, expect, it } from "vitest";
import defaultBacklogJson from "../../../data/backlog.json";
import { quickCopyKey } from "../../../shared/kernel/backlogSelectors";
import { withBacklogFixture } from "../../../shared/testing/backlogFixture";
import { migrateBacklog } from "./migration";

describe("normalizaciÃ³n del estado inicial", () => {
  it("mantiene un estado anÃ³nimo y sin actividad personal", () => {
    const migrated = migrateBacklog(defaultBacklogJson);

    expect(migrated.games).toEqual([]);
    expect(migrated.queue).toEqual([]);
    expect(migrated.missions).toEqual([]);
    expect(migrated.platforms).toEqual([]);
    expect(migrated.activityLog).toEqual([]);
    expect(migrated.preferences.quickCopyPresets).toEqual([]);
    expect(migrated.preferences.quickCopyPresetsReady).toBe(false);
    expect("owner" in migrated.meta).toBe(false);
  });

  it("conserva presets globales configurados explÃ­citamente", () => {
    const backup = migrateBacklog(defaultBacklogJson);
    backup.catalogs.platforms = [{ id: "platform-steam", name: "Steam", active: true }];
    backup.preferences.quickCopyPresets = [
      {
        key: "legacy-key",
        platformId: "platform-steam",
        library: "Steam",
        ownership: "Propio",
        deviceIds: [],
        status: "Disponible",
        priority: "Media",
        idealSession: "Flexible",
        crossCopyProgress: "unknown",
        notes: "",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ];
    const migrated = migrateBacklog(backup);

    expect(migrated.preferences.quickCopyPresetsReady).toBe(true);
    expect(migrated.preferences.quickCopyPresets[0].key).toBe(
      quickCopyKey("Steam", "Propio", "platform-steam")
    );
  });

  it("acepta respaldos anteriores pero elimina owner al normalizar y exportar", () => {
    const backup = structuredClone(defaultBacklogJson) as typeof defaultBacklogJson & {
      meta: typeof defaultBacklogJson.meta & { owner?: string };
    };
    backup.meta.owner = "Nombre heredado";
    const migrated = migrateBacklog(backup);
    const serialized = JSON.stringify(migrated);

    expect("owner" in migrated.meta).toBe(false);
    expect(serialized).not.toContain('"owner"');
    expect(migrated.meta.title).toBe("Backlog Quest");
  });

  it("exporta el modelo simplificado sin campos de progreso obsoletos", () => {
    const migrated = withBacklogFixture(migrateBacklog(defaultBacklogJson));
    const serialized = JSON.stringify(migrated);

    expect(serialized).not.toContain('"platformPriority"');
    expect(serialized).not.toContain('"sharedProgress"');
    expect(serialized).not.toContain('"percent"');
    expect(
      migrated.games
        .flatMap(game => game.copies)
        .every(copy =>
          ["shared", "separate", "partial", "unknown"].includes(copy.crossCopyProgress)
        )
    ).toBe(true);
  });

  it("reconstruye presets desde las copias cuando un respaldo no los contiene", () => {
    const backup = withBacklogFixture(migrateBacklog(defaultBacklogJson));
    backup.preferences.quickCopyPresets = [];
    const migrated = migrateBacklog(backup);
    const copyKeys = new Set(
      migrated.games.flatMap(game =>
        game.copies.map(copy => quickCopyKey(copy.library, copy.ownership, copy.platformId))
      )
    );

    expect(migrated.preferences.quickCopyPresetsReady).toBe(true);
    expect(migrated.preferences.quickCopyPresets).toHaveLength(copyKeys.size);
  });

  it("conserva un catálogo de contenidos vacío definido explícitamente", () => {
    const backup = withBacklogFixture(migrateBacklog(defaultBacklogJson));
    backup.games[0].contents = [];

    const migrated = migrateBacklog(backup);

    expect(migrated.games[0].contents).toEqual([]);
  });

  it("completa snapshots históricos de partidas vinculadas", () => {
    const backup = withBacklogFixture(migrateBacklog(defaultBacklogJson));
    const game = backup.games[0];
    const playthrough = game.playthroughs[0];
    const content = game.contents.find(item => item.id === playthrough.contentId);
    delete playthrough.contentTitle;
    delete playthrough.contentType;

    const migrated = migrateBacklog(backup);
    const migratedPlaythrough = migrated.games[0].playthroughs[0];

    expect(migratedPlaythrough.contentTitle).toBe(content?.title);
    expect(migratedPlaythrough.contentType).toBe(content?.type);
  });

  it("convierte días heredados en sesiones con la franja preferida de la misión", () => {
    const backup = withBacklogFixture(migrateBacklog(defaultBacklogJson));
    const mission = backup.missions[0];
    const rule = backup.scheduleRules.find(item => item.missionId === mission.id)!;
    const legacyRule = rule as unknown as {
      weekdays: number[];
      sessions?: Array<{ weekday: number; slotId: string }>;
    };
    legacyRule.weekdays = [1, 3];
    delete legacyRule.sessions;

    const migrated = migrateBacklog(backup);
    const migratedRule = migrated.scheduleRules.find(item => item.id === rule.id)!;

    expect(migratedRule.sessions).toEqual([
      { weekday: 1, slotId: mission.slotId },
      { weekday: 3, slotId: mission.slotId },
    ]);
    expect("weekdays" in migratedRule).toBe(false);
  });
});

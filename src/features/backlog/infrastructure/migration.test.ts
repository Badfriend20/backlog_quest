import { describe, expect, it } from "vitest";
import defaultBacklogJson from "../../../data/backlog.json";
import { quickCopyKey } from "../../../shared/kernel/questSelectors";
import { withBacklogFixture } from "../../../shared/testing/backlogFixture";
import { normalizeBacklog } from "./migration";

describe("normalización del formato actual", () => {
  it("importa un respaldo válido con schemaVersion 2", () => {
    const normalized = normalizeBacklog(defaultBacklogJson);

    expect(normalized.schemaVersion).toBe(2);
    expect(normalized.games).toEqual([]);
    expect(normalized.queue).toEqual([]);
    expect(normalized.missions).toEqual([]);
    expect(normalized.platforms).toEqual([]);
    expect(normalized.activityLog).toEqual([]);
    expect(normalized.preferences.quickCopyPresets).toEqual([]);
    expect(normalized.preferences.quickCopyPresetsReady).toBe(false);
  });

  it("normaliza un respaldo compatible al completar campos actuales faltantes", () => {
    const backup = withBacklogFixture(normalizeBacklog(defaultBacklogJson));
    backup.preferences.quickCopyPresets = [];
    backup.games[0].contents = undefined as never;

    const normalized = normalizeBacklog(backup);

    expect(normalized.preferences.quickCopyPresetsReady).toBe(true);
    expect(normalized.games[0].contents).toHaveLength(1);
    expect(normalized.games[0].contents[0].id).toBe("main-campaign");
  });

  it("rechaza explícitamente schemaVersion 1", () => {
    expect(() => normalizeBacklog({ schemaVersion: 1, games: [] })).toThrow(
      "formato anterior que ya no es compatible"
    );
  });

  it("rechaza una versión desconocida", () => {
    expect(() => normalizeBacklog({ schemaVersion: 99, games: [], queue: [] })).toThrow(
      "respaldo compatible de Backlog Quest"
    );
  });

  it("rechaza un objeto sin la estructura mínima del formato actual", () => {
    expect(() => normalizeBacklog({ schemaVersion: 2, games: [] })).toThrow(
      "respaldo compatible de Backlog Quest"
    );
  });

  it("descarta campos obsoletos de metadatos y recursos", () => {
    const backup = withBacklogFixture(normalizeBacklog(defaultBacklogJson));
    const meta = backup.meta as typeof backup.meta & { owner?: string };
    const obsoleteResourceKey = ["current", "Role"].join("");
    const resource = backup.platforms[0] as (typeof backup.platforms)[number] &
      Record<string, string>;
    meta.owner = "Nombre anterior";
    resource[obsoleteResourceKey] = "Principal";

    const normalized = normalizeBacklog(backup);
    const serialized = JSON.stringify(normalized);

    expect("owner" in normalized.meta).toBe(false);
    expect(serialized).not.toContain('"owner"');
    expect(serialized).not.toContain(`"${obsoleteResourceKey}"`);
  });

  it("conserva presets configurados y normaliza su clave", () => {
    const backup = normalizeBacklog(defaultBacklogJson);
    backup.catalogs.platforms = [{ id: "platform-steam", name: "Steam", active: true }];
    backup.preferences.quickCopyPresets = [
      {
        key: "previous-key",
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

    const normalized = normalizeBacklog(backup);

    expect(normalized.preferences.quickCopyPresets[0].key).toBe(
      quickCopyKey("Steam", "Propio", "platform-steam")
    );
  });

  it("conserva un catálogo de contenidos vacío definido explícitamente", () => {
    const backup = withBacklogFixture(normalizeBacklog(defaultBacklogJson));
    backup.games[0].contents = [];

    expect(normalizeBacklog(backup).games[0].contents).toEqual([]);
  });

  it("completa snapshots históricos de recorridos vinculados", () => {
    const backup = withBacklogFixture(normalizeBacklog(defaultBacklogJson));
    const game = backup.games[0];
    const playthrough = game.playthroughs[0];
    const content = game.contents.find(item => item.id === playthrough.contentId);
    delete playthrough.contentTitle;
    delete playthrough.contentType;

    const normalizedPlaythrough = normalizeBacklog(backup).games[0].playthroughs[0];

    expect(normalizedPlaythrough.contentTitle).toBe(content?.title);
    expect(normalizedPlaythrough.contentType).toBe(content?.type);
  });

  it("normaliza weekdays compatibles dentro de schemaVersion 2", () => {
    const backup = withBacklogFixture(normalizeBacklog(defaultBacklogJson));
    const mission = backup.missions[0];
    const rule = backup.scheduleRules[0];
    const compatibleRule = rule as unknown as {
      weekdays: number[];
      sessions?: Array<{ weekday: number; slotId: string }>;
    };
    compatibleRule.weekdays = [1, 3];
    delete compatibleRule.sessions;

    const normalizedRule = normalizeBacklog(backup).scheduleRules[0];

    expect(normalizedRule.sessions).toEqual([
      { weekday: 1, slotId: mission.slotId },
      { weekday: 3, slotId: mission.slotId },
    ]);
    expect("weekdays" in normalizedRule).toBe(false);
  });
});

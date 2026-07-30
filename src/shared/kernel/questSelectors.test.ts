import { describe, expect, it } from "vitest";
import { createBacklogFixture } from "../testing/backlogFixture";
import type { QuestData, Activity, QuickVariantPreset } from "./quest";
import {
  accessMethodOptions,
  mergeQuickCopyPresets,
  generateSchedule,
  normalizeOwnershipDisplayRules,
  ownershipDisplayKey,
  quickCopyLabel,
  selectExistingQuickCopyKeys,
  selectGlobalQuickCopyPresets,
} from "./questSelectors";

const GAME_PASS = "Plan Plus";
const NINTENDO_SWITCH = "Nintendo Switch";
const FAMILY_LIBRARY = "Biblioteca familiar";
const SUBSCRIPTION = "Suscripción";

function preset(library: string, ownership: string, deviceIds: string[] = []): QuickVariantPreset {
  return {
    key: `${library}::${ownership}`,
    library,
    ownership,
    deviceIds,
    status: "Disponible",
    priority: "Media",
    idealSession: "Flexible",
    crossCopyProgress: "separate",
    notes: "",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
}

describe("etiquetas de agregado rápido", () => {
  const rules = {
    [ownershipDisplayKey("Propio")]: { hidden: true, label: "Propio" },
    [ownershipDisplayKey(GAME_PASS)]: { hidden: false, label: GAME_PASS },
    [ownershipDisplayKey(FAMILY_LIBRARY)]: { hidden: false, label: "Familiar" },
  };

  it("oculta o presenta cada propiedad según su configuración", () => {
    expect(quickCopyLabel({ library: NINTENDO_SWITCH, ownership: "Propio" }, rules)).toBe(
      NINTENDO_SWITCH
    );
    expect(quickCopyLabel({ library: "Canal Plan Plus", ownership: GAME_PASS }, rules)).toBe(
      "Canal Plan Plus"
    );
    expect(quickCopyLabel({ library: "Steam", ownership: FAMILY_LIBRARY }, rules)).toBe(
      "Steam Familiar"
    );
  });

  it("limita los textos configurables a 24 caracteres", () => {
    const normalized = normalizeOwnershipDisplayRules([SUBSCRIPTION], {
      [ownershipDisplayKey(SUBSCRIPTION)]: {
        hidden: false,
        label: "Una etiqueta demasiado extensa para un botón compacto",
      },
    });

    expect(normalized[ownershipDisplayKey(SUBSCRIPTION)].label).toHaveLength(24);
    expect(quickCopyLabel({ library: "Plataforma", ownership: SUBSCRIPTION }, normalized)).toBe(
      `Plataforma ${normalized[ownershipDisplayKey(SUBSCRIPTION)].label}`
    );
  });

  it("usa el término original cuando no existe una regla guardada", () => {
    expect(quickCopyLabel({ library: "Steam", ownership: FAMILY_LIBRARY }, {})).toBe(
      "Steam Biblioteca familiar"
    );
  });

  it("usa Por definir cuando no existe un catálogo y conserva valores históricos al editar", () => {
    expect(accessMethodOptions([])).toEqual(["Por definir"]);
    expect(accessMethodOptions(["Propio"], "Suscripción anterior")).toEqual([
      "Suscripción anterior",
      "Propio",
    ]);
  });
});

describe("agenda recurrente", () => {
  it("genera cada día con la franja asignada a esa sesión", () => {
    const data = createBacklogFixture();
    data.preferences.scheduleWeeks = 1;
    const mission = data.missions[0];
    const rule = data.scheduleRules.find(item => item.missionId === mission.id)!;
    rule.sessions = [
      { weekday: 1, slotId: "first" },
      { weekday: 2, slotId: "second" },
      { weekday: 3, slotId: "flexible" },
    ];

    const generated = generateSchedule(data);
    const missionSlots = new Map(
      generated.flatMap(day =>
        day.missions
          .filter(item => item.mission.id === mission.id)
          .map(item => [new Date(`${day.date}T12:00:00`).getDay(), item.label] as const)
      )
    );

    expect(missionSlots.get(1)).toBe("Día");
    expect(missionSlots.get(2)).toBe("Noche");
    expect(missionSlots.get(3)).toBe("Flexible");
  });
});

describe("selección global de agregado rápido", () => {
  it("mantiene todas las combinaciones globales y separa las ya agregadas", () => {
    const xbox = preset("Xbox", GAME_PASS);
    const nintendo = preset(NINTENDO_SWITCH, "Propio");
    const steam = preset("Steam", FAMILY_LIBRARY);
    const game = {
      copies: [{ id: "C1", library: "Xbox", ownership: GAME_PASS }],
    } as Activity;
    const data = {
      platforms: [],
      games: [game],
      catalogs: {
        ownership: [GAME_PASS, "Propio", FAMILY_LIBRARY],
      },
      preferences: {
        quickCopyPresetsReady: false,
        quickCopyPresets: [xbox, nintendo, steam],
      },
    } as unknown as QuestData;

    expect(selectGlobalQuickCopyPresets(data).map(item => item.library)).toEqual([
      "Xbox",
      NINTENDO_SWITCH,
      "Steam",
    ]);
    expect(selectExistingQuickCopyKeys(game)).toEqual(new Set(["xbox::plan-plus"]));
  });

  it("conserva primero la configuración más reciente para una combinación repetida", () => {
    const older = preset("Xbox", GAME_PASS, ["D1"]);
    const incomingCopy = {
      id: "C2",
      library: "Xbox",
      ownership: GAME_PASS,
      deviceIds: ["D2"],
      device: "Dispositivo 2",
      status: "Disponible",
      priority: "Alta",
      idealSession: "Noche",
      crossCopyProgress: "shared" as const,
      notes: "Reciente",
    };

    const merged = mergeQuickCopyPresets(
      { platforms: [{ id: "D2", name: "Dispositivo 2" }] } as QuestData,
      [older],
      [incomingCopy]
    );

    expect(merged).toHaveLength(1);
    expect(merged[0]).toMatchObject({ deviceIds: ["D2"], priority: "Alta", notes: "Reciente" });
  });
});

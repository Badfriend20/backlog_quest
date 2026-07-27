import { describe, expect, it } from "vitest";
import { createGameCopyFromPreset, createQuickCopyPreset } from "./quickCopy";

describe("configuración rápida personalizada", () => {
  it("conserva todos los valores configurables al crear el preset", () => {
    const preset = createQuickCopyPreset(
      {
        library: "Epic Games",
        ownership: "Gratis o regalo",
        deviceIds: ["pc"],
        priority: "Alta",
        idealSession: "Noche",
        crossCopyProgress: "separate",
        notes: "Configuración personal",
      },
      "2026-07-22T00:00:00.000Z"
    );

    expect(preset).toMatchObject({
      key: "epic-games::gratis-o-regalo",
      crossCopyProgress: "separate",
      notes: "Configuración personal",
      deviceIds: ["pc"],
    });
  });

  it("prellena una copia sin heredar dispositivos del preset", () => {
    const preset = createQuickCopyPreset({
      library: "Steam",
      ownership: "Biblioteca familiar",
      deviceIds: ["pc", "deck"],
      priority: "Alta",
      idealSession: "Noche",
      crossCopyProgress: "shared",
      notes: "Preset global",
    });

    expect(createGameCopyFromPreset(preset, "C100", "Flexible")).toEqual({
      id: "C100",
      library: "Steam",
      ownership: "Biblioteca familiar",
      deviceIds: [],
      device: "Por confirmar",
      status: "Disponible",
      priority: "Alta",
      idealSession: "Noche",
      crossCopyProgress: "shared",
      notes: "Preset global",
    });
  });
});

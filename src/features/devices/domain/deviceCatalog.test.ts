import { describe, expect, it } from "vitest";
import { createBacklogFixture } from "../../../shared/testing/backlogFixture";
import { createDevice, deviceUsageCount, removeUnusedDevice, saveDevice } from "./deviceCatalog";

describe("catálogo de dispositivos", () => {
  it("crea un ID nuevo y agrega el dispositivo sin alterar los existentes", () => {
    const data = createBacklogFixture();
    const draft = createDevice(data.platforms);
    const platforms = saveDevice(data.platforms, { ...draft, name: "  Equipo nuevo  " });

    expect(data.platforms.some(platform => platform.id === draft.id)).toBe(false);
    expect(platforms).toHaveLength(data.platforms.length + 1);
    expect(platforms.at(-1)).toMatchObject({ id: draft.id, name: "Equipo nuevo" });
    expect(draft).not.toHaveProperty(["current", "Role"].join(""));
  });

  it("edita un dispositivo conservando su ID y posición", () => {
    const data = createBacklogFixture();
    const original = data.platforms[0];
    const platforms = saveDevice(data.platforms, {
      ...original,
      name: "Nombre actualizado",
      notes: "  Contexto manual  ",
    });

    expect(platforms).toHaveLength(data.platforms.length);
    expect(platforms[0]).toMatchObject({
      id: original.id,
      name: "Nombre actualizado",
      notes: "Contexto manual",
    });
  });

  it("solo permite eliminar dispositivos sin referencias", () => {
    const data = createBacklogFixture();
    const used = data.platforms.find(platform => deviceUsageCount(data, platform.id) > 0);
    const unused = createDevice(data.platforms);
    const dataWithUnused = { ...data, platforms: [...data.platforms, unused] };

    expect(used).toBeDefined();
    expect(removeUnusedDevice(data, used?.id ?? "")).toBeUndefined();
    expect(removeUnusedDevice(dataWithUnused, unused.id)).not.toContainEqual(unused);
  });
});

import { describe, expect, it } from "vitest";
import { normalizeBacklog } from "../../backlog";
import { EXAMPLE_DATASETS } from "./exampleDatasets";
import generic from "../../../../public/examples/backlog-quest-ejemplo-generico.json";
import gaming from "../../../../public/examples/backlog-quest-ejemplo-videojuegos.json";
import reading from "../../../../public/examples/backlog-quest-ejemplo-lectura.json";
import learning from "../../../../public/examples/backlog-quest-ejemplo-aprendizaje.json";
import projects from "../../../../public/examples/backlog-quest-ejemplo-proyectos.json";
import customCooking from "../../../../public/examples/backlog-quest-ejemplo-personalizado-cocina.json";

const examples = {
  "backlog-quest-ejemplo-generico.json": generic,
  "backlog-quest-ejemplo-videojuegos.json": gaming,
  "backlog-quest-ejemplo-lectura.json": reading,
  "backlog-quest-ejemplo-aprendizaje.json": learning,
  "backlog-quest-ejemplo-proyectos.json": projects,
  "backlog-quest-ejemplo-personalizado-cocina.json": customCooking,
};

describe("JSON de demostración", () => {
  it.each(EXAMPLE_DATASETS)("$label contiene al menos 15 ejemplos válidos y combinados", item => {
    const data = normalizeBacklog(examples[item.fileName as keyof typeof examples]);

    expect(data.preferences.vocabularyProfile).toBe(item.profile);
    expect(data.games.length).toBeGreaterThanOrEqual(15);
    expect(data.games.every(activity => activity.contents.length > 0)).toBe(true);
    expect(data.games.every(activity => activity.copies.length > 0)).toBe(true);
    expect(new Set(data.games.map(activity => activity.status)).size).toBeGreaterThanOrEqual(6);
    expect(new Set(data.queue.map(entry => entry.state)).size).toBeGreaterThanOrEqual(5);
    expect(data.games.filter(activity => activity.playthroughs.length > 0).length).toBeGreaterThan(
      5
    );
    expect(data.missions.length).toBeGreaterThanOrEqual(3);
  });

  it("el ejemplo personalizado demuestra términos propios", () => {
    const item = EXAMPLE_DATASETS.find(dataset => dataset.profile === "custom");
    expect(item).toBeDefined();
    const data = normalizeBacklog(examples[item!.fileName as keyof typeof examples]);

    expect(data.preferences.customVocabulary.activity).toBe("receta");
    expect(data.preferences.customVocabulary.journey).toBe("preparación");
  });
});

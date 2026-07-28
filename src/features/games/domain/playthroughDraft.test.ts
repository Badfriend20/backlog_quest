import { describe, expect, it } from "vitest";
import { createBacklogFixture } from "../../../shared/testing/backlogFixture";
import { createPlaythroughDraft } from "./playthroughDraft";

describe("creación de partidas", () => {
  it("no crea una partida si el juego no tiene copias", () => {
    const data = createBacklogFixture();
    const game = { ...data.games[0], copies: [] };

    expect(createPlaythroughDraft(data, game, { id: "P-new" })).toBeUndefined();
  });

  it("no crea una partida si el juego no tiene contenidos", () => {
    const data = createBacklogFixture();
    const game = { ...data.games[0], contents: [] };

    expect(createPlaythroughDraft(data, game, { id: "P-new" })).toBeUndefined();
  });

  it("crea la partida vinculada a una copia disponible", () => {
    const data = createBacklogFixture();
    const game = data.games.find(item => item.copies.length > 0)!;
    const copy = game.copies[0];

    const playthrough = createPlaythroughDraft(data, game, {
      id: "P-new",
      preferredCopyId: copy.id,
    });

    expect(playthrough?.copyId).toBe(copy.id);
    expect(playthrough?.platform).toBe(copy.library);
    expect(playthrough?.contentId).toBe(game.contents[0].id);
    expect(playthrough?.contentTitle).toBe(game.contents[0].title);
  });
});

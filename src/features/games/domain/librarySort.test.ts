import { describe, expect, it } from "vitest";
import type { Game } from "../../../shared/kernel/backlog";
import { sortLibraryGames } from "./librarySort";

const FINISHED_TITLE = "Zeta terminado";
const BETA_TITLE = "Beta pendiente";
const ALPHA_TITLE = "Alfa pendiente";

function game(title: string, status: string, priority = "Media"): Game {
  return {
    id: title,
    title,
    type: "Juego",
    status,
    priority,
    suggestedSession: "Flexible",
    private: false,
    notes: "",
    tags: [],
    progress: { chapter: "", completions: 0, replays: 0, lastPlayedAt: null },
    copies: [],
    playthroughs: [],
    contents: [],
    dependencies: [],
    availableFrom: null,
  };
}

describe("orden independiente de Biblioteca", () => {
  const games = [
    game(FINISHED_TITLE, "Terminado", "S"),
    game(BETA_TITLE, "Disponible", "Baja"),
    game(ALPHA_TITLE, "Disponible", "Media"),
  ];

  it("muestra pendientes alfabéticamente y deja cerrados al final por defecto", () => {
    expect(sortLibraryGames(games, "unfinished-title").map(item => item.title)).toEqual([
      ALPHA_TITLE,
      BETA_TITLE,
      FINISHED_TITLE,
    ]);
  });

  it("puede ordenar alfabéticamente o por prioridad sin consultar la Cola", () => {
    expect(sortLibraryGames(games, "title").map(item => item.title)).toEqual([
      ALPHA_TITLE,
      BETA_TITLE,
      FINISHED_TITLE,
    ]);
    expect(sortLibraryGames(games, "priority").map(item => item.title)).toEqual([
      FINISHED_TITLE,
      ALPHA_TITLE,
      BETA_TITLE,
    ]);
  });
});

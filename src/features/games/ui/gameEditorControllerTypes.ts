import type { Dispatch, SetStateAction } from "react";
import type { Game } from "../../../shared/kernel/backlog";

export type GameEditorTab = "general" | "copies" | "playthroughs";

export interface GameDraftController {
  draft: Game;
  setDraft: Dispatch<SetStateAction<Game>>;
  setTab: Dispatch<SetStateAction<GameEditorTab>>;
}

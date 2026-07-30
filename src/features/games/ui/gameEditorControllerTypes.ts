import type { Dispatch, SetStateAction } from "react";
import type { Activity } from "../../../shared/kernel/quest";

export type GameEditorTab = "general" | "copies" | "playthroughs";

export interface GameDraftController {
  draft: Activity;
  setDraft: Dispatch<SetStateAction<Activity>>;
  setTab: Dispatch<SetStateAction<GameEditorTab>>;
}

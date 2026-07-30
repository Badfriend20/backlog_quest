import type { Activity, ActivityVariant } from "../../../shared/kernel/quest";
import {
  accessMethodOptions,
  getSlotLabel,
  nextGeneratedId,
} from "../../../shared/kernel/questSelectors";
import type { GameEditorProps } from "./gameEditorTypes";

export const UNKNOWN_GAME_RELATION = "Por confirmar";

export function createBlankCopy(data: GameEditorProps["data"], id: string): ActivityVariant {
  return {
    id,
    platformId: undefined,
    library: "",
    device: UNKNOWN_GAME_RELATION,
    deviceIds: [],
    ownership: accessMethodOptions(data.catalogs.ownership)[0],
    status: "Disponible",
    priority: "Media",
    idealSession: getSlotLabel(data, "flexible"),
    crossCopyProgress: "unknown",
    notes: "",
  };
}

export function createGameDraft(data: GameEditorProps["data"], game?: Activity | null): Activity {
  if (game) return structuredClone(game);
  return {
    id: nextGeneratedId(
      "G",
      data.games.map(item => item.id)
    ),
    title: "",
    type: "Juego",
    status: "Disponible",
    priority: "Media",
    suggestedSession: getSlotLabel(data, "flexible"),
    private: false,
    notes: "",
    tags: [],
    progress: {
      chapter: "",
      completions: 0,
      replays: 0,
      lastPlayedAt: null,
    },
    copies: [],
    playthroughs: [],
    contents: [],
    dependencies: [],
    availableFrom: null,
  };
}

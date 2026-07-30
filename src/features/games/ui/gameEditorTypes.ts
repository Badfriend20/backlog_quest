import type { QuestData, Activity, Mission } from "../../../shared/kernel/quest";

export interface GameEditorMissionIntent {
  kind: "copy" | "playthrough";
  mission: Mission;
}

export interface SavedMissionRelation {
  kind: GameEditorMissionIntent["kind"];
  id: string;
}

export interface GameEditorProps {
  game: Activity | null;
  data: QuestData;
  missionIntent?: GameEditorMissionIntent;
  onClose: () => void;
  onSave: (game: Activity, closeEditor: boolean) => void;
  onResolveMissionRelation: (
    game: Activity,
    missionId: string,
    relation: SavedMissionRelation
  ) => void;
  onRemoveContent: (gameId: string, contentId: string) => void;
  onRemoveCopy: (gameId: string, copyId: string) => void;
  onRemovePlaythrough: (gameId: string, playthroughId: string) => void;
}

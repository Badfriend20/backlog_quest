import type { BacklogData, Game, Mission } from "../../../shared/kernel/backlog";

export interface GameEditorMissionIntent {
  kind: "copy" | "playthrough";
  mission: Mission;
}

export interface SavedMissionRelation {
  kind: GameEditorMissionIntent["kind"];
  id: string;
}

export interface GameEditorProps {
  game: Game | null;
  data: BacklogData;
  missionIntent?: GameEditorMissionIntent;
  onClose: () => void;
  onSave: (game: Game, closeEditor: boolean) => void;
  onResolveMissionRelation: (game: Game, missionId: string, relation: SavedMissionRelation) => void;
  onRemoveContent: (gameId: string, contentId: string) => void;
  onRemoveCopy: (gameId: string, copyId: string) => void;
  onRemovePlaythrough: (gameId: string, playthroughId: string) => void;
}

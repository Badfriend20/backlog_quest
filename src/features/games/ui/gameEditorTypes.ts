import type { BacklogData, Game } from "../../../shared/kernel/backlog";
export interface GameEditorProps {
  game: Game | null;
  data: BacklogData;
  onClose: () => void;
  onSave: (game: Game, closeEditor: boolean) => void;
}

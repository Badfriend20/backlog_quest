export function UndoToast({
  message,
  canUndo,
  onUndo,
}: {
  message: string;
  canUndo: boolean;
  onUndo(): void;
}) {
  return (
    <output className="toast">
      <span>{message}</span>
      {canUndo && (
        <Button variant="text" onClick={onUndo}>
          Deshacer
        </Button>
      )}
    </output>
  );
}
import { Button } from "../../../shared/ui";

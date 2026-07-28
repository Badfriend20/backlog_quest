export function EmptyCard({
  title,
  text,
  action,
  onAction,
}: {
  title: string;
  text: string;
  action: string;
  onAction(): void;
}) {
  return (
    <GameCard className="empty-card">
      <h3>{title}</h3>
      <p>{text}</p>
      <Button variant="primary" size="compact" onClick={onAction}>
        {action}
      </Button>
    </GameCard>
  );
}
import { Button, GameCard } from "../../../shared/ui";

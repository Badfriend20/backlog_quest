import type { QuestData } from "../../../shared/kernel/quest";
import { queueLabel, statusClass } from "../../../shared/kernel/questSelectors";
import { Button, StatusChip } from "../../../shared/ui";
import type { RecommendationMoveTarget } from "../domain/recommendationMove";
import { explainRotationCandidate, type RotationCandidate } from "../domain/rotation";
import { RotationMoveMenu } from "./RotationMoveMenu";
import { RotationRecommendationRow } from "./RotationRecommendationStyles";

export function RotationRecommendationItem({
  data,
  candidate,
  suggestionPosition,
  onActivate,
  onMove,
}: {
  data: QuestData;
  candidate: RotationCandidate;
  suggestionPosition: number;
  onActivate: (gameId: string) => void;
  onMove: (gameId: string, target: RecommendationMoveTarget) => void;
}) {
  const stateLabel = queueLabel(data, candidate.item.state);
  return (
    <RotationRecommendationRow>
      <span className="rotation-number">{suggestionPosition}</span>
      <div className="rotation-copy">
        <StatusChip tone={statusClass(stateLabel)}>{stateLabel}</StatusChip>
        <strong>{candidate.game.title}</strong>
        <small>{candidate.item.preferredDevice || "Recurso por elegir"}</small>
        <p className="rotation-reason">{explainRotationCandidate(candidate)}</p>
      </div>
      <div className="rotation-actions">
        <Button size="compact" onClick={() => onActivate(candidate.game.id)}>
          Activar
        </Button>
        <RotationMoveMenu
          item={candidate.item}
          queueLength={data.queue.length}
          onMove={target => onMove(candidate.game.id, target)}
        />
      </div>
    </RotationRecommendationRow>
  );
}

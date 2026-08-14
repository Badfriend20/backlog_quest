import type { QuestData } from "../../../shared/kernel/quest";
import { recommendationTargetPosition, type RecommendationMoveTarget } from "../../queue";
import { moveQueueToPosition } from "../domain/backlog";

export function moveRecommendation(
  data: QuestData,
  gameId: string,
  target: RecommendationMoveTarget
): QuestData {
  return moveQueueToPosition(data, gameId, recommendationTargetPosition(data.queue.length, target));
}

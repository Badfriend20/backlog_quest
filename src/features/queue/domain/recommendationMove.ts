export type RecommendationMoveTarget = "half" | "two-thirds" | "end";

export interface RecommendationMoveOption {
  id: RecommendationMoveTarget;
  label: string;
  position: number;
  disabled: boolean;
}

const TARGETS: Array<{
  id: RecommendationMoveTarget;
  label: string;
  position(queueLength: number): number;
}> = [
  { id: "half", label: "A mitad", position: length => Math.ceil(length / 2) },
  { id: "two-thirds", label: "A 2/3", position: length => Math.ceil((length * 2) / 3) },
  { id: "end", label: "Al final", position: length => length },
];

export function recommendationTargetPosition(
  queueLength: number,
  target: RecommendationMoveTarget
): number {
  return TARGETS.find(option => option.id === target)?.position(queueLength) ?? queueLength;
}

export function recommendationMoveOptions(
  queueLength: number,
  currentPosition: number
): RecommendationMoveOption[] {
  return TARGETS.map(target => {
    const position = recommendationTargetPosition(queueLength, target.id);
    return { ...target, position, disabled: position <= currentPosition };
  });
}

export function recommendationMoveMessage(target: RecommendationMoveTarget): string {
  if (target === "half") return "Actividad movida a la mitad de la lista.";
  if (target === "two-thirds") return "Actividad movida a dos tercios de la lista.";
  return "Actividad enviada al final de la lista.";
}

import type { QuestData } from "../../../shared/kernel/quest";

export interface DemoSession {
  data: QuestData;
  snapshot: QuestData;
}

export function beginDemoSession(
  current: QuestData,
  example: QuestData,
  existingSnapshot: QuestData | null
): DemoSession {
  return {
    data: structuredClone(example),
    snapshot: structuredClone(existingSnapshot ?? current),
  };
}

export function restoreDemoSession(snapshot: QuestData): QuestData {
  return structuredClone(snapshot);
}

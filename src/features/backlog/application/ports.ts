import type { QuestData } from "../../../shared/kernel/quest";

export interface BacklogStorage {
  load(fallback: QuestData): QuestData;
  save(data: QuestData): void;
  clear(): void;
  loadDemoSnapshot(): QuestData | null;
  saveDemoSnapshot(data: QuestData): void;
  clearDemoSnapshot(): void;
  parse(text: string): QuestData;
  export(data: QuestData): void;
}

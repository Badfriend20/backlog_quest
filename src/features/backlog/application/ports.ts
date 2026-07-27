import type { BacklogData } from "../../../shared/kernel/backlog";

export interface BacklogStorage {
  load(fallback: BacklogData): BacklogData;
  save(data: BacklogData): void;
  clear(): void;
  parse(text: string): BacklogData;
  export(data: BacklogData): void;
}

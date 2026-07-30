import type { QuestData } from "../../../shared/kernel/quest";
import type { BacklogStorage } from "../application/ports";
import { isBacklogV2, migrateBacklog } from "./migration";

const STORAGE_KEY = "backlog-quest:data:v2";
const LEGACY_STORAGE_KEY = "backlog-quest:data:v1";
const DEMO_SNAPSHOT_KEY = "backlog-quest:demo-snapshot:v2";

function loadBacklog(fallback: QuestData): QuestData {
  for (const key of [STORAGE_KEY, LEGACY_STORAGE_KEY]) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const migrated = migrateBacklog(JSON.parse(raw));
      if (key === LEGACY_STORAGE_KEY) localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    } catch {
      // Intenta el siguiente respaldo local.
    }
  }
  return fallback;
}

function saveBacklog(data: QuestData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clearBacklog(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}

function loadDemoSnapshot(): QuestData | null {
  try {
    const raw = localStorage.getItem(DEMO_SNAPSHOT_KEY);
    return raw ? migrateBacklog(JSON.parse(raw)) : null;
  } catch {
    localStorage.removeItem(DEMO_SNAPSHOT_KEY);
    return null;
  }
}

function saveDemoSnapshot(data: QuestData): void {
  localStorage.setItem(DEMO_SNAPSHOT_KEY, JSON.stringify(data));
}

function clearDemoSnapshot(): void {
  localStorage.removeItem(DEMO_SNAPSHOT_KEY);
}

function parseBacklogJson(text: string): QuestData {
  return migrateBacklog(JSON.parse(text) as unknown);
}

function exportBacklog(data: QuestData): void {
  const updated: QuestData = {
    ...data,
    meta: { ...data.meta, updatedAt: new Date().toISOString() },
  };
  if (!isBacklogV2(updated)) throw new Error("No se pudo preparar el respaldo v2.");
  const blob = new Blob([JSON.stringify(updated, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `backlog-quest-v2-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export const browserBacklogStorage: BacklogStorage = {
  load: loadBacklog,
  save: saveBacklog,
  clear: clearBacklog,
  loadDemoSnapshot,
  saveDemoSnapshot,
  clearDemoSnapshot,
  parse: parseBacklogJson,
  export: exportBacklog,
};

import type { QuestData } from "../../../shared/kernel/quest";
import type { BacklogStorage } from "../application/ports";
import { isCurrentBacklog, normalizeBacklog } from "./migration";

const STORAGE_KEY = "backlog-quest:data:v2";
const DEMO_SNAPSHOT_KEY = "backlog-quest:demo-snapshot:v2";

function loadBacklog(fallback: QuestData): QuestData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeBacklog(JSON.parse(raw));
  } catch {
    // Usa el estado inicial si el respaldo local no es compatible.
  }
  return fallback;
}

function saveBacklog(data: QuestData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clearBacklog(): void {
  localStorage.removeItem(STORAGE_KEY);
}

function loadDemoSnapshot(): QuestData | null {
  try {
    const raw = localStorage.getItem(DEMO_SNAPSHOT_KEY);
    return raw ? normalizeBacklog(JSON.parse(raw)) : null;
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
  return normalizeBacklog(JSON.parse(text) as unknown);
}

function exportBacklog(data: QuestData): void {
  const updated: QuestData = {
    ...data,
    meta: { ...data.meta, updatedAt: new Date().toISOString() },
  };
  if (!isCurrentBacklog(updated)) throw new Error("No se pudo preparar el respaldo.");
  const blob = new Blob([JSON.stringify(updated, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `backlog-quest-${new Date().toISOString().slice(0, 10)}.json`;
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

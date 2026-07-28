import { useEffect, useState } from "react";
import type { BacklogData } from "../../../shared/kernel/backlog";
import type { BacklogStorage } from "./ports";

export interface BacklogNotification {
  message: string;
  undo: boolean;
}

export function useBacklogCommands(initialData: BacklogData, storage: BacklogStorage) {
  const [data, setData] = useState<BacklogData>(() => storage.load(structuredClone(initialData)));
  const [notification, setNotification] = useState<BacklogNotification | null>(null);
  const [undoSnapshot, setUndoSnapshot] = useState<BacklogData | null>(null);

  useEffect(() => storage.save(data), [data, storage]);
  useEffect(() => {
    if (!notification) return;
    const timeout = window.setTimeout(() => setNotification(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [notification]);

  function update(updater: (current: BacklogData) => BacklogData) {
    setData(updater);
  }

  function commit(updater: (current: BacklogData) => BacklogData, message: string, canUndo = true) {
    setData(current => {
      if (canUndo) setUndoSnapshot(structuredClone(current));
      return updater(current);
    });
    setNotification({ message, undo: canUndo });
  }

  function notify(message: string) {
    setNotification({ message, undo: false });
  }

  function undo() {
    if (!undoSnapshot) return;
    setData(undoSnapshot);
    setUndoSnapshot(null);
    notify("Última acción deshecha.");
  }

  function replace(imported: BacklogData) {
    setData(imported);
    setUndoSnapshot(null);
    notify("Respaldo importado y migrado correctamente.");
  }

  function reset() {
    storage.clear();
    setData(structuredClone(initialData));
    setUndoSnapshot(null);
    notify("Datos restaurados al respaldo inicial.");
  }

  return {
    data,
    notification,
    canUndo: Boolean(undoSnapshot),
    update,
    commit,
    notify,
    undo,
    replace,
    reset,
    exportData: () => storage.export(data),
  };
}

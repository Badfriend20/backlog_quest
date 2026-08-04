import { useEffect, useState } from "react";
import type { QuestData } from "../../../shared/kernel/quest";
import { beginDemoSession, restoreDemoSession } from "./demoSession";
import type { BacklogStorage } from "./ports";

export interface BacklogNotification {
  message: string;
  undo: boolean;
}

export function useBacklogCommands(initialData: QuestData, storage: BacklogStorage) {
  const [data, setData] = useState<QuestData>(() => storage.load(structuredClone(initialData)));
  const [demoSnapshot, setDemoSnapshot] = useState<QuestData | null>(() =>
    storage.loadDemoSnapshot()
  );
  const [notification, setNotification] = useState<BacklogNotification | null>(null);
  const [undoSnapshot, setUndoSnapshot] = useState<QuestData | null>(null);

  useEffect(() => storage.save(data), [data, storage]);
  useEffect(() => {
    if (!notification) return;
    const timeout = window.setTimeout(() => setNotification(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [notification]);

  function update(updater: (current: QuestData) => QuestData) {
    setData(updater);
  }

  function commit(updater: (current: QuestData) => QuestData, message: string, canUndo = true) {
    setData(current => {
      if (canUndo) setUndoSnapshot(structuredClone(current));
      return updater(current);
    });
    setNotification({ message, undo: canUndo });
  }

  function notify(message: string) {
    setNotification({ message, undo: false });
  }

  function dismissNotification() {
    setNotification(null);
  }

  function undo() {
    if (!undoSnapshot) return;
    setData(undoSnapshot);
    setUndoSnapshot(null);
    notify("Última acción deshecha.");
  }

  function replace(imported: QuestData) {
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

  function startDemo(example: QuestData) {
    const session = beginDemoSession(data, example, demoSnapshot);
    if (!demoSnapshot) storage.saveDemoSnapshot(session.snapshot);
    setDemoSnapshot(session.snapshot);
    setData(session.data);
    setUndoSnapshot(null);
    notify("Demostración temporal iniciada. Tus datos reales están respaldados.");
    return session.data;
  }

  function restoreDemo() {
    if (!demoSnapshot) return null;
    const restored = restoreDemoSession(demoSnapshot);
    storage.clearDemoSnapshot();
    setDemoSnapshot(null);
    setData(restored);
    setUndoSnapshot(null);
    notify("Tus datos anteriores fueron restaurados.");
    return restored;
  }

  function keepDemo() {
    storage.clearDemoSnapshot();
    setDemoSnapshot(null);
    setUndoSnapshot(null);
    notify("La demostración quedó guardada como tus datos principales.");
  }

  return {
    data,
    notification,
    canUndo: Boolean(undoSnapshot),
    demoActive: Boolean(demoSnapshot),
    update,
    commit,
    notify,
    dismissNotification,
    undo,
    replace,
    reset,
    startDemo,
    restoreDemo,
    keepDemo,
    exportData: () => storage.export(data),
  };
}

import { useEffect, useState } from "react";
import type {
  AppView,
  BacklogData,
  CopyPlatform,
  Game,
  Platform,
} from "../../../shared/kernel/backlog";
import { themeStyle } from "../../settings";
import { GameEditor } from "../../games";
import { CompletionModal, MissionEditor } from "../../missions";
import type { BacklogStorage } from "../application/ports";
import {
  appendGame,
  replaceCopyPlatforms,
  replaceGame,
  replacePlatforms,
} from "../application/backlogMutations";
import { BacklogView } from "./BacklogView";
import {
  abandonMission,
  activateMission,
  deferMission,
  finishMission,
  moveQueueOneStep,
  pauseMission,
  sendMissionToEnd,
  updatePreferences,
} from "../domain/backlog";
import { AppNavigation } from "./AppNavigation";
import { BacklogStyles } from "./BacklogStyles";
import { NAV_ITEMS } from "./NavigationItems";

type ToastState = { message: string; undo: boolean } | null;
type MissionEditorState = { missionId: string | null; gameId: string | null } | null;

interface BacklogQuestAppProps {
  initialData: BacklogData;
  storage: BacklogStorage;
}

export function BacklogQuestApp({ initialData, storage }: BacklogQuestAppProps) {
  const cloneInitialData = () => structuredClone(initialData);
  const [data, setData] = useState<BacklogData>(() => storage.load(cloneInitialData()));
  const [view, setView] = useState<AppView>(data.preferences.activeView || "dashboard");
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [creatingGame, setCreatingGame] = useState(false);
  const [completionMissionId, setCompletionMissionId] = useState<string | null>(null);
  const [missionEditor, setMissionEditor] = useState<MissionEditorState>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [undoSnapshot, setUndoSnapshot] = useState<BacklogData | null>(null);

  useEffect(() => storage.save(data), [data, storage]);
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const selectedGame = selectedGameId
    ? (data.games.find(game => game.id === selectedGameId) ?? null)
    : null;
  const completionMission = completionMissionId
    ? (data.missions.find(mission => mission.id === completionMissionId) ?? null)
    : null;
  const editingMission = missionEditor?.missionId
    ? (data.missions.find(mission => mission.id === missionEditor.missionId) ?? null)
    : null;

  function changeView(nextView: AppView) {
    setView(nextView);
    setData(current => updatePreferences(current, { activeView: nextView }));
  }

  function commit(updater: (current: BacklogData) => BacklogData, message: string, canUndo = true) {
    setData(current => {
      if (canUndo) setUndoSnapshot(structuredClone(current));
      return updater(current);
    });
    setToast({ message, undo: canUndo });
  }

  function undo() {
    if (!undoSnapshot) return;
    setData(undoSnapshot);
    setUndoSnapshot(null);
    setToast({ message: "Última acción deshecha.", undo: false });
  }

  function updateGame(updated: Game, closeEditor: boolean) {
    commit(
      current => replaceGame(current, updated),
      "Juego, copias y partidas actualizados localmente."
    );
    if (closeEditor) {
      setSelectedGameId(null);
      setCreatingGame(false);
    }
  }

  function addGame(game: Game, closeEditor: boolean) {
    commit(
      current => appendGame(current, game),
      "Juego agregado al catálogo y al final de la cola."
    );
    setCreatingGame(false);
    setSelectedGameId(closeEditor ? null : game.id);
  }

  function updatePlatforms(platforms: Platform[]) {
    commit(
      current => replacePlatforms(current, platforms),
      "Dispositivos guardados y referencias actualizadas."
    );
  }

  function updateCopyPlatforms(platforms: CopyPlatform[]) {
    commit(
      current => replaceCopyPlatforms(current, platforms),
      "Plataformas guardadas y copias actualizadas.",
      false
    );
  }

  function destructiveAllowed(message: string): boolean {
    return !data.preferences.confirmDestructiveActions || window.confirm(message);
  }

  const sharedActions = {
    onEditGame: setSelectedGameId,
    onFinish: setCompletionMissionId,
    onDefer: (missionId: string) =>
      commit(
        current => deferMission(current, missionId),
        `Misión aplazada a la posición ${data.preferences.deferPosition}.`
      ),
    onPause: (missionId: string) =>
      commit(
        current => pauseMission(current, missionId),
        "Misión pausada; conserva su lugar en la cola."
      ),
    onSendEnd: (missionId: string) => {
      if (!destructiveAllowed("¿Enviar esta misión al final de la cola?")) return;
      commit(
        current => sendMissionToEnd(current, missionId),
        "Misión enviada al final de la cola."
      );
    },
    onAbandon: (missionId: string) => {
      if (!destructiveAllowed("¿Abandonar esta partida? El progreso seguirá en el historial."))
        return;
      commit(current => abandonMission(current, missionId), "Misión abandonada y archivada.");
    },
    onEditMission: (missionId: string) => setMissionEditor({ missionId, gameId: null }),
  };

  return (
    <div
      className={`app-shell ${data.preferences.compactCards ? "compact-mode" : ""}`}
      style={themeStyle(data.preferences.theme, data.preferences.customTheme)}
    >
      <BacklogStyles />
      <AppNavigation activeView={view} onNavigate={changeView} />

      <main className="main-content" id="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">PARTIDA LOCAL</p>
            <h1>{NAV_ITEMS.find(item => item.id === view)?.label}</h1>
          </div>
          <div className="topbar-actions">
            <button type="button" className="ghost-button" onClick={() => storage.export(data)}>
              Exportar JSON
            </button>
            <button type="button" className="primary-button" onClick={() => setCreatingGame(true)}>
              + Juego
            </button>
          </div>
        </header>
        <BacklogView
          view={view}
          data={data}
          storage={storage}
          onOpenView={changeView}
          onSelectGame={setSelectedGameId}
          onCreateGame={() => setCreatingGame(true)}
          onEditMission={missionId => setMissionEditor({ missionId, gameId: null })}
          onActivate={gameId => setMissionEditor({ missionId: null, gameId })}
          onMove={(id, direction) =>
            commit(
              current => moveQueueOneStep(current, id, direction),
              "Posición de cola actualizada."
            )
          }
          onPreferencesChange={(patch, message) =>
            commit(current => updatePreferences(current, patch), message, false)
          }
          onPlatformsChange={updatePlatforms}
          onCopyPlatformsChange={updateCopyPlatforms}
          onReplaceData={imported => {
            setData(imported);
            setView(imported.preferences.activeView || "dashboard");
            setUndoSnapshot(null);
            setToast({ message: "Respaldo importado y migrado correctamente.", undo: false });
          }}
          onReset={() => {
            storage.clear();
            setData(cloneInitialData());
            setView("dashboard");
            setToast({ message: "Datos restaurados al respaldo inicial.", undo: false });
          }}
          missionActions={sharedActions}
        />
      </main>

      {(selectedGame || creatingGame) && (
        <GameEditor
          game={selectedGame}
          data={data}
          onClose={() => {
            setSelectedGameId(null);
            setCreatingGame(false);
          }}
          onSave={selectedGame ? updateGame : addGame}
        />
      )}
      {completionMission && (
        <CompletionModal
          data={data}
          mission={completionMission}
          onClose={() => setCompletionMissionId(null)}
          onComplete={form => {
            commit(
              current => finishMission(current, completionMission.id, form),
              `${data.games.find(game => game.id === completionMission.gameId)?.title ?? "La misión"} fue cerrada y la cola se reorganizó.`
            );
            setCompletionMissionId(null);
            if (data.preferences.autoSuggestNext) changeView("queue");
          }}
        />
      )}
      {missionEditor && (
        <MissionEditor
          data={data}
          mission={editingMission}
          initialGameId={missionEditor.gameId}
          onClose={() => setMissionEditor(null)}
          onSave={form => {
            const occupied = data.missions.find(
              mission =>
                mission.status === "active" &&
                mission.slotId === form.slotId &&
                mission.id !== editingMission?.id
            );
            if (occupied && !form.replaceOccupied) return;
            commit(
              current => activateMission(current, form, editingMission?.id ?? null),
              editingMission
                ? "Misión actualizada."
                : "Nueva misión activada y calendario regenerado."
            );
            setMissionEditor(null);
          }}
        />
      )}

      {toast && (
        <output className="toast">
          <span>{toast.message}</span>
          {toast.undo && undoSnapshot && (
            <button type="button" onClick={undo}>
              Deshacer
            </button>
          )}
        </output>
      )}
    </div>
  );
}

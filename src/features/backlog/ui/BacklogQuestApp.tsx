import { useState } from "react";
import { ThemeProvider } from "styled-components";
import type {
  AppView,
  QuestData,
  Channel,
  Activity,
  Resource,
  OwnershipDisplayRules,
} from "../../../shared/kernel/quest";
import { findScheduleConflicts } from "../../../shared/kernel/schedule";
import { getThemeColors, themeStyle } from "../../settings";
import { VocabularyProvider } from "../../../shared/vocabulary";
import { GameEditor, type GameEditorMissionIntent, type SavedMissionRelation } from "../../games";
import { CompletionModal, MissionEditor } from "../../missions";
import type { BacklogStorage } from "../application/ports";
import { useBacklogCommands } from "../application/useBacklogCommands";
import {
  appendGame,
  linkMissionRelation,
  removeCopy,
  removeGameContent,
  removePlaythrough,
  replaceCopyPlatforms,
  replaceOwnershipCatalog,
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
import { AppTopbar } from "./AppTopbar";
import { BacklogScope } from "./BacklogStyles";
import { UndoToast } from "./UndoToast";

type MissionEditorState = { missionId: string | null; gameId: string | null } | null;

export function BacklogQuestApp({
  initialData,
  storage,
}: {
  initialData: QuestData;
  storage: BacklogStorage;
}) {
  const commands = useBacklogCommands(initialData, storage);
  const { data } = commands;
  const [view, setView] = useState<AppView>(data.preferences.activeView || "dashboard");
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [gameEditorIntent, setGameEditorIntent] = useState<GameEditorMissionIntent>();
  const [creatingGame, setCreatingGame] = useState(false);
  const [completionMissionId, setCompletionMissionId] = useState<string | null>(null);
  const [missionEditor, setMissionEditor] = useState<MissionEditorState>(null);

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
    commands.update(current => updatePreferences(current, { activeView: nextView }));
  }

  function updateGame(updated: Activity, closeEditor: boolean) {
    commands.commit(
      current => replaceGame(current, updated),
      "Actividad, modalidades y recorridos actualizados localmente."
    );
    if (closeEditor) {
      setSelectedGameId(null);
      setCreatingGame(false);
    }
  }

  function addGame(game: Activity, closeEditor: boolean) {
    commands.commit(
      current => appendGame(current, game),
      "Actividad agregada al catálogo y al final de la lista."
    );
    setCreatingGame(false);
    setSelectedGameId(closeEditor ? null : game.id);
  }

  function updatePlatforms(platforms: Resource[]) {
    commands.commit(
      current => replacePlatforms(current, platforms),
      "Recursos guardados y referencias actualizadas."
    );
  }

  function updateCopyPlatforms(platforms: Channel[]) {
    commands.commit(
      current => replaceCopyPlatforms(current, platforms),
      "Canales guardados y modalidades actualizadas.",
      false
    );
  }

  function updateOwnershipCatalog(ownership: string[], rules: OwnershipDisplayRules) {
    commands.commit(
      current => replaceOwnershipCatalog(current, ownership, rules),
      "Formas de acceso guardadas; los valores históricos permanecen intactos.",
      false
    );
  }

  function openMissionRelation(missionId: string, kind: GameEditorMissionIntent["kind"]) {
    const mission = data.missions.find(item => item.id === missionId);
    const game = data.games.find(item => item.id === mission?.gameId);
    if (!mission || !game) return;
    if (kind === "playthrough" && (!game.copies.length || !game.contents.length)) {
      commands.notify("Agrega una modalidad y un contenido antes de crear un recorrido.");
      return;
    }
    setCreatingGame(false);
    setGameEditorIntent({ kind, mission });
    setSelectedGameId(game.id);
  }

  function openContentManager(gameId: string) {
    setMissionEditor(null);
    setCreatingGame(false);
    setGameEditorIntent(undefined);
    setSelectedGameId(gameId);
  }

  function manageMissionContents(missionId: string) {
    const gameId = data.missions.find(item => item.id === missionId)?.gameId;
    if (gameId) openContentManager(gameId);
  }

  function resolveMissionRelation(
    updatedGame: Activity,
    missionId: string,
    relation: SavedMissionRelation
  ) {
    commands.commit(
      current => linkMissionRelation(replaceGame(current, updatedGame), missionId, relation),
      relation.kind === "copy"
        ? "Modalidad agregada y vinculada a la misión."
        : "Recorrido agregado y vinculado a la misión."
    );
    setGameEditorIntent(undefined);
    setSelectedGameId(null);
  }

  function destructiveAllowed(message: string): boolean {
    return !data.preferences.confirmDestructiveActions || window.confirm(message);
  }

  const sharedActions = {
    onEditGame: setSelectedGameId,
    onFinish: setCompletionMissionId,
    onDefer: (missionId: string) =>
      commands.commit(
        current => deferMission(current, missionId),
        `Misión aplazada a la posición ${data.preferences.deferPosition}.`
      ),
    onPause: (missionId: string) =>
      commands.commit(
        current => pauseMission(current, missionId),
        "Misión pausada; conserva su lugar en la lista."
      ),
    onSendEnd: (missionId: string) => {
      if (!destructiveAllowed("¿Enviar esta misión al final de la lista?")) return;
      commands.commit(
        current => sendMissionToEnd(current, missionId),
        "Misión enviada al final de la lista."
      );
    },
    onAbandon: (missionId: string) => {
      if (!destructiveAllowed("¿Abandonar este recorrido? El progreso seguirá en el historial."))
        return;
      commands.commit(
        current => abandonMission(current, missionId),
        "Misión abandonada y archivada."
      );
    },
    onEditMission: (missionId: string) => setMissionEditor({ missionId, gameId: null }),
    onAddCopyForMission: (missionId: string) => openMissionRelation(missionId, "copy"),
    onAddPlaythroughForMission: (missionId: string) =>
      openMissionRelation(missionId, "playthrough"),
    onManageContentsForMission: manageMissionContents,
  };

  return (
    <ThemeProvider theme={getThemeColors(data.preferences.theme, data.preferences.customTheme)}>
      <VocabularyProvider preferences={data.preferences}>
        <BacklogScope>
          <div
            className={`app-shell ${data.preferences.compactCards ? "compact-mode" : ""}`}
            style={themeStyle(data.preferences.theme, data.preferences.customTheme)}
          >
            <AppNavigation activeView={view} onNavigate={changeView} />

            <main className="main-content" id="main-content">
              <AppTopbar
                view={view}
                onExport={commands.exportData}
                onCreateGame={() => setCreatingGame(true)}
              />
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
                  commands.commit(
                    current => moveQueueOneStep(current, id, direction),
                    "Posición de lista actualizada."
                  )
                }
                onPreferencesChange={(patch, message) =>
                  commands.commit(current => updatePreferences(current, patch), message, false)
                }
                onPlatformsChange={updatePlatforms}
                onCopyPlatformsChange={updateCopyPlatforms}
                onOwnershipCatalogChange={updateOwnershipCatalog}
                onReplaceData={imported => {
                  commands.replace(imported);
                  setView(imported.preferences.activeView || "dashboard");
                }}
                demoActive={commands.demoActive}
                onStartDemo={example => {
                  const demo = commands.startDemo(example);
                  setView(demo.preferences.activeView || "dashboard");
                }}
                onRestoreDemo={() => {
                  const restored = commands.restoreDemo();
                  if (restored) setView(restored.preferences.activeView || "dashboard");
                }}
                onKeepDemo={commands.keepDemo}
                onReset={() => {
                  commands.reset();
                  setView("dashboard");
                }}
                missionActions={sharedActions}
              />
            </main>

            {(selectedGame || creatingGame) && (
              <GameEditor
                game={selectedGame}
                data={data}
                missionIntent={gameEditorIntent}
                onClose={() => {
                  setSelectedGameId(null);
                  setCreatingGame(false);
                  setGameEditorIntent(undefined);
                }}
                onSave={selectedGame ? updateGame : addGame}
                onResolveMissionRelation={resolveMissionRelation}
                onRemoveContent={(gameId, contentId) =>
                  commands.commit(
                    current => removeGameContent(current, gameId, contentId),
                    "Contenido eliminado; misiones y recorridos conservaron su descripción histórica."
                  )
                }
                onRemoveCopy={(gameId, copyId) =>
                  commands.commit(
                    current => removeCopy(current, gameId, copyId),
                    "Modalidad eliminada; las misiones y recorridos vinculados permanecen desacoplados."
                  )
                }
                onRemovePlaythrough={(gameId, playthroughId) =>
                  commands.commit(
                    current => removePlaythrough(current, gameId, playthroughId),
                    "Recorrido eliminado; las misiones vinculadas permanecen sin recorrido."
                  )
                }
              />
            )}
            {completionMission && (
              <CompletionModal
                data={data}
                mission={completionMission}
                onClose={() => setCompletionMissionId(null)}
                onComplete={form => {
                  commands.commit(
                    current => finishMission(current, completionMission.id, form),
                    `${data.games.find(game => game.id === completionMission.gameId)?.title ?? "La misión"} fue cerrada y la lista se reorganizó.`
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
                onManageContents={openContentManager}
                onSave={form => {
                  const conflicts = findScheduleConflicts(data, form.sessions, editingMission?.id);
                  if (conflicts.length && !form.replaceOccupied) return;
                  commands.commit(
                    current => activateMission(current, form, editingMission?.id ?? null),
                    editingMission
                      ? "Misión actualizada."
                      : "Nueva misión activada y calendario regenerado."
                  );
                  setMissionEditor(null);
                }}
              />
            )}

            {commands.notification && (
              <UndoToast
                message={commands.notification.message}
                canUndo={commands.notification.undo && commands.canUndo}
                onUndo={commands.undo}
              />
            )}
          </div>
        </BacklogScope>
      </VocabularyProvider>
    </ThemeProvider>
  );
}

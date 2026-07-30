import { useState } from "react";
import type { Journey } from "../../../shared/kernel/quest";
import { copyDeviceIds, deviceName, nextGeneratedId } from "../../../shared/kernel/questSelectors";
import { createPlaythroughDraft } from "../domain/playthroughDraft";
import type { GameDraftController } from "./gameEditorControllerTypes";
import { UNKNOWN_GAME_RELATION } from "./gameEditorDraft";
import type { GameEditorProps } from "./gameEditorTypes";

export function useGamePlaythroughsController({
  draft,
  setDraft,
  setTab,
  data,
  missionIntent,
  onSave,
  onResolveMissionRelation,
  onRemovePlaythrough,
  initialEditingPlaythroughId,
  initialSnapshot,
}: GameDraftController &
  Pick<
    GameEditorProps,
    "data" | "missionIntent" | "onSave" | "onResolveMissionRelation" | "onRemovePlaythrough"
  > & {
    initialEditingPlaythroughId: string | null;
    initialSnapshot?: Journey[];
  }) {
  const [editingPlaythroughId, setEditingPlaythroughId] = useState<string | null>(
    initialEditingPlaythroughId
  );
  const [playthroughEditSnapshot, setPlaythroughEditSnapshot] = useState<Journey[] | undefined>(
    initialSnapshot
  );

  function addPlaythrough() {
    if (!draft.copies.length || !draft.contents.length) return;
    setPlaythroughEditSnapshot(structuredClone(draft.playthroughs));
    const allIds = data.games.flatMap(item => item.playthroughs.map(playthrough => playthrough.id));
    const playthrough = createPlaythroughDraft(data, draft, {
      id: nextGeneratedId("P", [...allIds, ...draft.playthroughs.map(candidate => candidate.id)]),
    });
    if (!playthrough) return;
    setDraft(current => ({
      ...current,
      playthroughs: [playthrough, ...current.playthroughs],
    }));
    setEditingPlaythroughId(playthrough.id);
    setTab("playthroughs");
  }

  function updatePlaythrough(playthroughId: string, patch: Partial<Journey>) {
    setDraft(current => ({
      ...current,
      playthroughs: current.playthroughs.map(playthrough => {
        if (playthrough.id !== playthroughId) return playthrough;
        const next = { ...playthrough, ...patch };
        if ("copyId" in patch) {
          const copy = current.copies.find(item => item.id === patch.copyId);
          if (copy) {
            const deviceIds = copyDeviceIds(data, copy);
            next.platform = copy.library;
            if (!next.deviceId || !deviceIds.includes(next.deviceId)) next.deviceId = deviceIds[0];
            next.device = next.deviceId ? deviceName(data, next.deviceId) : UNKNOWN_GAME_RELATION;
          } else {
            next.platform = UNKNOWN_GAME_RELATION;
            next.device = UNKNOWN_GAME_RELATION;
            next.deviceId = undefined;
          }
        }
        if ("deviceId" in patch) {
          next.device = patch.deviceId ? deviceName(data, patch.deviceId) : UNKNOWN_GAME_RELATION;
        }
        return next;
      }),
    }));
  }

  function beginPlaythroughEdit(playthroughId: string) {
    setPlaythroughEditSnapshot(structuredClone(draft.playthroughs));
    setEditingPlaythroughId(playthroughId);
  }

  function savePlaythroughEdit() {
    const stored = data.games.find(game => game.id === draft.id);
    const saved = stored ? { ...stored, playthroughs: draft.playthroughs } : draft;
    if (missionIntent?.kind === "playthrough" && editingPlaythroughId) {
      const playthrough = saved.playthroughs.find(item => item.id === editingPlaythroughId);
      if (!playthrough?.copyId) return;
      onResolveMissionRelation(saved, missionIntent.mission.id, {
        kind: "playthrough",
        id: editingPlaythroughId,
      });
    } else {
      onSave(saved, false);
    }
    setPlaythroughEditSnapshot(undefined);
    setEditingPlaythroughId(null);
  }

  function discardPlaythroughEdit() {
    if (playthroughEditSnapshot) {
      setDraft(current => ({
        ...current,
        playthroughs: structuredClone(playthroughEditSnapshot),
      }));
    }
    setPlaythroughEditSnapshot(undefined);
    setEditingPlaythroughId(null);
  }

  function removePlaythrough(playthroughId: string) {
    setDraft(current => ({
      ...current,
      playthroughs: current.playthroughs.filter(playthrough => playthrough.id !== playthroughId),
    }));
    onRemovePlaythrough(draft.id, playthroughId);
    setPlaythroughEditSnapshot(undefined);
    setEditingPlaythroughId(current => (current === playthroughId ? null : current));
  }

  return {
    editingPlaythroughId,
    beginPlaythroughEdit,
    savePlaythroughEdit,
    discardPlaythroughEdit,
    addPlaythrough,
    updatePlaythrough,
    removePlaythrough,
  };
}

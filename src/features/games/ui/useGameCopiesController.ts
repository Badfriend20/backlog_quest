import { useMemo, useState } from "react";
import type { Activity, ActivityVariant, QuickVariantPreset } from "../../../shared/kernel/quest";
import {
  deviceLabel,
  deviceName,
  getSlotLabel,
  nextGeneratedId,
  selectExistingQuickCopyKeys,
  selectQuickCopyPresets,
} from "../../../shared/kernel/questSelectors";
import { createGameCopyFromPreset } from "../domain/quickCopy";
import { addChannel } from "../../../shared/kernel/channelCatalog";
import type { GameDraftController } from "./gameEditorControllerTypes";
import { createBlankCopy, UNKNOWN_GAME_RELATION } from "./gameEditorDraft";
import type { GameEditorProps } from "./gameEditorTypes";

export function useGameCopiesController({
  draft,
  setDraft,
  setTab,
  data,
  missionIntent,
  onSave,
  onCopyPlatformsChange,
  onResolveMissionRelation,
  onRemoveCopy,
  initialEditingCopyId,
  initialSnapshot,
}: GameDraftController &
  Pick<
    GameEditorProps,
    | "data"
    | "missionIntent"
    | "onSave"
    | "onCopyPlatformsChange"
    | "onResolveMissionRelation"
    | "onRemoveCopy"
  > & {
    initialEditingCopyId: string | null;
    initialSnapshot?: Pick<Activity, "copies" | "playthroughs">;
  }) {
  const [editingCopyId, setEditingCopyId] = useState<string | null>(initialEditingCopyId);
  const [copyEditSnapshot, setCopyEditSnapshot] = useState<
    Pick<Activity, "copies" | "playthroughs"> | undefined
  >(initialSnapshot);
  const [showQuickOptions, setShowQuickOptions] = useState(false);
  const [sessionPresets, setSessionPresets] = useState<QuickVariantPreset[]>([]);
  const missionCopyIds = useMemo(
    () =>
      new Set(
        data.missions.filter(mission => mission.gameId === draft.id).map(mission => mission.copyId)
      ),
    [data.missions, draft.id]
  );
  const quickPresets = useMemo(
    () => selectQuickCopyPresets(data, sessionPresets),
    [data, sessionPresets]
  );
  const existingQuickKeys = useMemo(
    () => selectExistingQuickCopyKeys({ copies: draft.copies }),
    [draft.copies]
  );
  const copyPlatforms = useMemo(
    () =>
      data.catalogs.platforms.filter(
        platform => platform.active || draft.copies.some(copy => copy.platformId === platform.id)
      ),
    [data.catalogs.platforms, draft.copies]
  );

  function nextCopyId() {
    return nextGeneratedId("C", [
      ...data.games.flatMap(item => item.copies.map(copy => copy.id)),
      ...draft.copies.map(item => item.id),
    ]);
  }

  function beginCopy(copy: ActivityVariant) {
    setCopyEditSnapshot(
      structuredClone({ copies: draft.copies, playthroughs: draft.playthroughs })
    );
    setDraft(current => ({ ...current, copies: [copy, ...current.copies] }));
    setEditingCopyId(copy.id);
    setTab("copies");
  }

  function addBlankCopy() {
    beginCopy(createBlankCopy(data, nextCopyId()));
  }

  function addCopyFromPreset(preset: QuickVariantPreset) {
    beginCopy(createGameCopyFromPreset(preset, nextCopyId(), getSlotLabel(data, "flexible")));
    setSessionPresets(current => [preset, ...current.filter(item => item.key !== preset.key)]);
    setShowQuickOptions(false);
  }

  function updateCopy(copyId: string, patch: Partial<ActivityVariant>) {
    setDraft(current => ({
      ...current,
      copies: current.copies.map(copy => (copy.id === copyId ? { ...copy, ...patch } : copy)),
      playthroughs: current.playthroughs.map(playthrough => {
        if (playthrough.copyId !== copyId) return playthrough;
        const updatedCopy = current.copies.find(copy => copy.id === copyId);
        return {
          ...playthrough,
          platform: patch.library ?? updatedCopy?.library ?? playthrough.platform,
        };
      }),
    }));
  }

  function updateCopyPlatform(copyId: string, platformId: string) {
    const platform = data.catalogs.platforms.find(item => item.id === platformId);
    updateCopy(copyId, { platformId: platform?.id, library: platform?.name ?? "" });
  }

  function addCopyPlatform(copyId: string, name: string) {
    const result = addChannel(data.catalogs.platforms, name);
    onCopyPlatformsChange(result.channels);
    updateCopy(copyId, { platformId: result.channel.id, library: result.channel.name });
  }

  function updateCopyDevices(copyId: string, deviceIds: string[]) {
    updateCopy(copyId, { deviceIds, device: deviceLabel(data, deviceIds) });
    setDraft(current => ({
      ...current,
      playthroughs: current.playthroughs.map(playthrough => {
        if (
          playthrough.copyId !== copyId ||
          !playthrough.deviceId ||
          deviceIds.includes(playthrough.deviceId)
        )
          return playthrough;
        const deviceId = deviceIds[0];
        return {
          ...playthrough,
          deviceId,
          device: deviceId ? deviceName(data, deviceId) : UNKNOWN_GAME_RELATION,
        };
      }),
    }));
  }

  function beginCopyEdit(copyId: string) {
    setCopyEditSnapshot(
      structuredClone({ copies: draft.copies, playthroughs: draft.playthroughs })
    );
    setEditingCopyId(copyId);
  }

  function saveCopyEdit() {
    const stored = data.games.find(game => game.id === draft.id);
    const saved = stored
      ? { ...stored, copies: draft.copies, playthroughs: draft.playthroughs }
      : draft;
    if (missionIntent?.kind === "copy" && editingCopyId) {
      onResolveMissionRelation(saved, missionIntent.mission.id, {
        kind: "copy",
        id: editingCopyId,
      });
    } else {
      onSave(saved, false);
    }
    setCopyEditSnapshot(undefined);
    setEditingCopyId(null);
  }

  function discardCopyEdit() {
    if (copyEditSnapshot) {
      setDraft(current => ({ ...current, ...structuredClone(copyEditSnapshot) }));
    }
    setCopyEditSnapshot(undefined);
    setEditingCopyId(null);
  }

  function removeCopy(copyId: string) {
    setDraft(current => ({
      ...current,
      copies: current.copies.filter(copy => copy.id !== copyId),
      playthroughs: current.playthroughs.map(playthrough =>
        playthrough.copyId === copyId ? { ...playthrough, copyId: undefined } : playthrough
      ),
    }));
    onRemoveCopy(draft.id, copyId);
    setCopyEditSnapshot(undefined);
    setEditingCopyId(current => (current === copyId ? null : current));
  }

  return {
    editingCopyId,
    beginCopyEdit,
    saveCopyEdit,
    discardCopyEdit,
    showQuickOptions,
    setShowQuickOptions,
    missionCopyIds,
    quickPresets,
    existingQuickKeys,
    copyPlatforms,
    addBlankCopy,
    addCopyFromPreset,
    updateCopy,
    updateCopyPlatform,
    addCopyPlatform,
    updateCopyDevices,
    removeCopy,
  };
}

import { useMemo, useState } from "react";
import type React from "react";
import type { Game, GameCopy, Playthrough, QuickCopyPreset } from "../../../shared/kernel/backlog";
import {
  copyDeviceIds,
  deviceLabel,
  deviceName,
  getSlotLabel,
  nextGeneratedId,
  selectExistingQuickCopyKeys,
  selectQuickCopyPresets,
} from "../../../shared/kernel/backlogSelectors";
import type { GameEditorProps } from "./gameEditorTypes";
import { createGameCopyFromPreset } from "../domain/quickCopy";

const UNKNOWN_LABEL = "Por confirmar";

export function useGameEditor({
  game,
  data,
  onSave,
}: Pick<GameEditorProps, "game" | "data" | "onSave">) {
  const isNew = !game;
  const initial = useMemo<Game>(
    () =>
      game
        ? structuredClone(game)
        : {
            id: nextGeneratedId(
              "G",
              data.games.map(item => item.id)
            ),
            title: "",
            type: "Juego",
            status: "Disponible",
            priority: "Media",
            suggestedSession: getSlotLabel(data, "flexible"),
            private: false,
            notes: "",
            tags: [],
            progress: {
              chapter: "",
              completions: 0,
              replays: 0,
              lastPlayedAt: null,
            },
            copies: [],
            playthroughs: [],
            contents: [
              {
                id: "main-campaign",
                title: "Campaña principal",
                type: "campaign",
                status: "not-started",
                notes: "",
              },
            ],
            dependencies: [],
            availableFrom: null,
          },
    [data, game]
  );
  const [draft, setDraft] = useState<Game>(initial);
  const [tab, setTab] = useState<"general" | "copies" | "playthroughs">("general");
  const [editingCopyId, setEditingCopyId] = useState<string | null>(null);
  const [editingPlaythroughId, setEditingPlaythroughId] = useState<string | null>(null);
  const [copyEditSnapshot, setCopyEditSnapshot] = useState<
    Pick<Game, "copies" | "playthroughs"> | undefined
  >();
  const [playthroughEditSnapshot, setPlaythroughEditSnapshot] = useState<
    Playthrough[] | undefined
  >();
  const [showQuickOptions, setShowQuickOptions] = useState(false);
  const [sessionPresets, setSessionPresets] = useState<QuickCopyPreset[]>([]);
  const missionCopyIds = useMemo(
    () =>
      new Set(
        data.missions.filter(mission => mission.gameId === draft.id).map(mission => mission.copyId)
      ),
    [data.missions, draft.id]
  );
  const missionPlaythroughIds = useMemo(
    () =>
      new Set(
        data.missions
          .filter(mission => mission.gameId === draft.id)
          .map(mission => mission.playthroughId)
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
  function patch<K extends keyof Game>(key: K, value: Game[K]) {
    setDraft(current => ({ ...current, [key]: value }));
  }
  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (draft.title.trim()) onSave({ ...draft, title: draft.title.trim() }, true);
  }
  function nextCopyId() {
    return nextGeneratedId("C", [
      ...data.games.flatMap(item => item.copies.map(copy => copy.id)),
      ...draft.copies.map(item => item.id),
    ]);
  }
  function addBlankCopy() {
    setCopyEditSnapshot(
      structuredClone({ copies: draft.copies, playthroughs: draft.playthroughs })
    );
    const copy: GameCopy = {
      id: nextCopyId(),
      platformId: undefined,
      library: "",
      device: UNKNOWN_LABEL,
      deviceIds: [],
      ownership: "Propio",
      status: "Disponible",
      priority: "Media",
      idealSession: getSlotLabel(data, "flexible"),
      crossCopyProgress: "unknown",
      notes: "",
    };
    setDraft(current => ({ ...current, copies: [copy, ...current.copies] }));
    setEditingCopyId(copy.id);
    setTab("copies");
  }
  function addCopyFromPreset(preset: QuickCopyPreset) {
    setCopyEditSnapshot(
      structuredClone({ copies: draft.copies, playthroughs: draft.playthroughs })
    );
    const copy = createGameCopyFromPreset(preset, nextCopyId(), getSlotLabel(data, "flexible"));
    setDraft(current => ({ ...current, copies: [copy, ...current.copies] }));
    setEditingCopyId(copy.id);
    setSessionPresets(current => [preset, ...current.filter(item => item.key !== preset.key)]);
    setShowQuickOptions(false);
    setTab("copies");
  }
  function updateCopy(copyId: string, patchValue: Partial<GameCopy>) {
    setDraft(current => ({
      ...current,
      copies: current.copies.map(copy => (copy.id === copyId ? { ...copy, ...patchValue } : copy)),
      playthroughs: current.playthroughs.map(play => {
        if (play.copyId !== copyId) return play;
        const updatedCopy = current.copies.find(copy => copy.id === copyId);
        return { ...play, platform: patchValue.library ?? updatedCopy?.library ?? play.platform };
      }),
    }));
  }
  function updateCopyPlatform(copyId: string, platformId: string) {
    const platform = data.catalogs.platforms.find(item => item.id === platformId);
    updateCopy(copyId, {
      platformId: platform?.id,
      library: platform?.name ?? "",
    });
  }
  function updateCopyDevices(copyId: string, deviceIds: string[]) {
    updateCopy(copyId, { deviceIds, device: deviceLabel(data, deviceIds) });
    setDraft(current => ({
      ...current,
      playthroughs: current.playthroughs.map(play => {
        if (play.copyId !== copyId || !play.deviceId || deviceIds.includes(play.deviceId))
          return play;
        const nextDeviceId = deviceIds[0];
        return {
          ...play,
          deviceId: nextDeviceId,
          device: nextDeviceId ? deviceName(data, nextDeviceId) : UNKNOWN_LABEL,
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
    onSave(saved, false);
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
    const linkedPlaythroughs = draft.playthroughs.filter(play => play.copyId === copyId);
    if (missionCopyIds.has(copyId)) {
      window.alert(
        "Esta copia está vinculada a una misión. Cambia primero la plataforma de esa misión."
      );
      return;
    }
    if (linkedPlaythroughs.length) {
      window.alert(
        `Esta copia está vinculada a ${linkedPlaythroughs.length} partida(s). Reasígnalas antes de eliminarla.`
      );
      return;
    }
    const next = {
      ...draft,
      copies: draft.copies.filter(copy => copy.id !== copyId),
    };
    const stored = data.games.find(game => game.id === draft.id);
    setDraft(next);
    onSave(
      stored ? { ...stored, copies: next.copies, playthroughs: next.playthroughs } : next,
      false
    );
    setCopyEditSnapshot(undefined);
    setEditingCopyId(current => (current === copyId ? null : current));
  }
  function addPlaythrough() {
    setPlaythroughEditSnapshot(structuredClone(draft.playthroughs));
    const allIds = data.games.flatMap(item => item.playthroughs.map(play => play.id));
    const play: Playthrough = {
      id: nextGeneratedId("P", [...allIds, ...draft.playthroughs.map(item => item.id)]),
      number: Math.max(0, ...draft.playthroughs.map(item => item.number)) + 1,
      platform: UNKNOWN_LABEL,
      device: UNKNOWN_LABEL,
      deviceId: undefined,
      status: "Pendiente",
      startedAt: null,
      finishedAt: null,
      notes: "",
      contentId: draft.contents[0]?.id ?? "main-campaign",
      copyId: undefined,
    };
    setDraft(current => ({ ...current, playthroughs: [play, ...current.playthroughs] }));
    setEditingPlaythroughId(play.id);
    setTab("playthroughs");
  }
  function updatePlaythrough(playId: string, patchValue: Partial<Playthrough>) {
    setDraft(current => ({
      ...current,
      playthroughs: current.playthroughs.map(play => {
        if (play.id !== playId) return play;
        const next = { ...play, ...patchValue };
        if ("copyId" in patchValue) {
          const copy = current.copies.find(item => item.id === patchValue.copyId);
          if (copy) {
            const ids = copyDeviceIds(data, copy);
            next.platform = copy.library;
            if (!next.deviceId || !ids.includes(next.deviceId)) next.deviceId = ids[0];
            next.device = next.deviceId ? deviceName(data, next.deviceId) : UNKNOWN_LABEL;
          } else {
            next.platform = UNKNOWN_LABEL;
            next.device = UNKNOWN_LABEL;
            next.deviceId = undefined;
          }
        }
        if ("deviceId" in patchValue)
          next.device = patchValue.deviceId ? deviceName(data, patchValue.deviceId) : UNKNOWN_LABEL;
        return next;
      }),
    }));
  }
  function beginPlaythroughEdit(playId: string) {
    setPlaythroughEditSnapshot(structuredClone(draft.playthroughs));
    setEditingPlaythroughId(playId);
  }
  function savePlaythroughEdit() {
    const stored = data.games.find(game => game.id === draft.id);
    onSave(stored ? { ...stored, playthroughs: draft.playthroughs } : draft, false);
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
  function removePlaythrough(playId: string) {
    if (missionPlaythroughIds.has(playId)) {
      window.alert(
        "Esta partida está vinculada a una misión. Pausa, termina o reasigna la misión antes de eliminarla."
      );
      return;
    }
    const next = {
      ...draft,
      playthroughs: draft.playthroughs.filter(play => play.id !== playId),
    };
    const stored = data.games.find(game => game.id === draft.id);
    setDraft(next);
    onSave(stored ? { ...stored, playthroughs: next.playthroughs } : next, false);
    setPlaythroughEditSnapshot(undefined);
    setEditingPlaythroughId(current => (current === playId ? null : current));
  }
  return {
    isNew,
    draft,
    setDraft,
    tab,
    setTab,
    editingCopyId,
    beginCopyEdit,
    saveCopyEdit,
    discardCopyEdit,
    editingPlaythroughId,
    beginPlaythroughEdit,
    savePlaythroughEdit,
    discardPlaythroughEdit,
    showQuickOptions,
    setShowQuickOptions,
    missionCopyIds,
    missionPlaythroughIds,
    quickPresets,
    existingQuickKeys,
    copyPlatforms,
    patch,
    submit,
    addBlankCopy,
    addCopyFromPreset,
    updateCopy,
    updateCopyPlatform,
    updateCopyDevices,
    removeCopy,
    addPlaythrough,
    updatePlaythrough,
    removePlaythrough,
  };
}
export type GameEditorController = ReturnType<typeof useGameEditor>;

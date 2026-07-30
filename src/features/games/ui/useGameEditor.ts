import { useMemo, useState } from "react";
import type React from "react";
import type { Activity } from "../../../shared/kernel/quest";
import { nextGeneratedId } from "../../../shared/kernel/questSelectors";
import { createPlaythroughDraft } from "../domain/playthroughDraft";
import type { GameEditorTab } from "./gameEditorControllerTypes";
import { createBlankCopy, createGameDraft } from "./gameEditorDraft";
import type { GameEditorProps } from "./gameEditorTypes";
import { useGameContentsController } from "./useGameContentsController";
import { useGameCopiesController } from "./useGameCopiesController";
import { useGamePlaythroughsController } from "./useGamePlaythroughsController";

export function useGameEditor({
  game,
  data,
  missionIntent,
  onSave,
  onResolveMissionRelation,
  onRemoveContent,
  onRemoveCopy,
  onRemovePlaythrough,
}: Pick<
  GameEditorProps,
  | "game"
  | "data"
  | "missionIntent"
  | "onSave"
  | "onResolveMissionRelation"
  | "onRemoveContent"
  | "onRemoveCopy"
  | "onRemovePlaythrough"
>) {
  const isNew = !game;
  const initial = useMemo(() => createGameDraft(data, game), [data, game]);
  const editorInitial = useMemo(() => {
    const draft = structuredClone(initial);
    const copyIds = data.games.flatMap(item => item.copies.map(copy => copy.id));
    const playthroughIds = data.games.flatMap(item =>
      item.playthroughs.map(playthrough => playthrough.id)
    );

    if (missionIntent?.kind === "copy") {
      const copy = createBlankCopy(data, nextGeneratedId("C", copyIds));
      return {
        draft: { ...draft, copies: [copy, ...draft.copies] },
        tab: "copies" as const,
        editingCopyId: copy.id,
        editingPlaythroughId: null,
        copySnapshot: structuredClone({
          copies: draft.copies,
          playthroughs: draft.playthroughs,
        }),
        playthroughSnapshot: undefined,
      };
    }

    if (missionIntent?.kind === "playthrough") {
      const playthrough = createPlaythroughDraft(data, draft, {
        id: nextGeneratedId("P", playthroughIds),
        preferredCopyId: missionIntent.mission.copyId,
        contentId: missionIntent.mission.contentId,
        startedAt: missionIntent.mission.startedAt,
      });
      return {
        draft: playthrough
          ? { ...draft, playthroughs: [playthrough, ...draft.playthroughs] }
          : draft,
        tab: "playthroughs" as const,
        editingCopyId: null,
        editingPlaythroughId: playthrough?.id ?? null,
        copySnapshot: undefined,
        playthroughSnapshot: structuredClone(draft.playthroughs),
      };
    }

    return {
      draft,
      tab: "general" as const,
      editingCopyId: null,
      editingPlaythroughId: null,
      copySnapshot: undefined,
      playthroughSnapshot: undefined,
    };
  }, [data, initial, missionIntent]);
  const [draft, setDraft] = useState<Activity>(editorInitial.draft);
  const [tab, setTab] = useState<GameEditorTab>(editorInitial.tab);
  const shared = { draft, setDraft, setTab };
  const contents = useGameContentsController({
    ...shared,
    data,
    onSave,
    onRemoveContent,
  });
  const copies = useGameCopiesController({
    ...shared,
    data,
    missionIntent,
    onSave,
    onResolveMissionRelation,
    onRemoveCopy,
    initialEditingCopyId: editorInitial.editingCopyId,
    initialSnapshot: editorInitial.copySnapshot,
  });
  const playthroughs = useGamePlaythroughsController({
    ...shared,
    data,
    missionIntent,
    onSave,
    onResolveMissionRelation,
    onRemovePlaythrough,
    initialEditingPlaythroughId: editorInitial.editingPlaythroughId,
    initialSnapshot: editorInitial.playthroughSnapshot,
  });

  function patch<K extends keyof Activity>(key: K, value: Activity[K]) {
    setDraft(current => ({ ...current, [key]: value }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (draft.title.trim()) onSave({ ...draft, title: draft.title.trim() }, true);
  }

  return {
    isNew,
    draft,
    setDraft,
    tab,
    setTab,
    patch,
    submit,
    ...contents,
    ...copies,
    ...playthroughs,
  };
}

export type GameEditorController = ReturnType<typeof useGameEditor>;

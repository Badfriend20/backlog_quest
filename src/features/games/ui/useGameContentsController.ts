import { useState } from "react";
import type { GameContent } from "../../../shared/kernel/backlog";
import { nextGeneratedId } from "../../../shared/kernel/backlogSelectors";
import type { GameEditorProps } from "./gameEditorTypes";
import type { GameDraftController } from "./gameEditorControllerTypes";

export function useGameContentsController({
  draft,
  setDraft,
  data,
  onSave,
  onRemoveContent,
}: Omit<GameDraftController, "setTab"> &
  Pick<GameEditorProps, "data" | "onSave" | "onRemoveContent">) {
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [contentEditSnapshot, setContentEditSnapshot] = useState<GameContent[]>();

  function addContent() {
    setContentEditSnapshot(structuredClone(draft.contents));
    const content: GameContent = {
      id: nextGeneratedId("CT", [
        ...data.games.flatMap(item => item.contents.map(candidate => candidate.id)),
        ...draft.contents.map(candidate => candidate.id),
      ]),
      title: "",
      type: "custom",
      status: "not-started",
      notes: "",
    };
    setDraft(current => ({ ...current, contents: [content, ...current.contents] }));
    setEditingContentId(content.id);
  }

  function updateContent(contentId: string, patch: Partial<GameContent>) {
    setDraft(current => ({
      ...current,
      contents: current.contents.map(content =>
        content.id === contentId ? { ...content, ...patch } : content
      ),
    }));
  }

  function beginContentEdit(contentId: string) {
    setContentEditSnapshot(structuredClone(draft.contents));
    setEditingContentId(contentId);
  }

  function saveContentEdit() {
    const content = draft.contents.find(item => item.id === editingContentId);
    if (!content?.title.trim()) return;
    const contents = draft.contents.map(item =>
      item.id === content.id ? { ...item, title: item.title.trim() } : item
    );
    const stored = data.games.find(item => item.id === draft.id);
    setDraft(current => ({ ...current, contents }));
    if (stored) onSave({ ...stored, contents }, false);
    setContentEditSnapshot(undefined);
    setEditingContentId(null);
  }

  function discardContentEdit() {
    if (contentEditSnapshot) {
      setDraft(current => ({ ...current, contents: structuredClone(contentEditSnapshot) }));
    }
    setContentEditSnapshot(undefined);
    setEditingContentId(null);
  }

  function removeContent(contentId: string) {
    setDraft(current => ({
      ...current,
      contents: current.contents.filter(content => content.id !== contentId),
      playthroughs: current.playthroughs.map(playthrough =>
        playthrough.contentId === contentId
          ? {
              ...playthrough,
              contentId: undefined,
              contentTitle:
                playthrough.contentTitle ??
                current.contents.find(content => content.id === contentId)?.title,
              contentType:
                playthrough.contentType ??
                current.contents.find(content => content.id === contentId)?.type,
            }
          : playthrough
      ),
    }));
    if (data.games.some(item => item.id === draft.id)) onRemoveContent(draft.id, contentId);
    setContentEditSnapshot(undefined);
    setEditingContentId(current => (current === contentId ? null : current));
  }

  function moveContent(contentId: string, direction: -1 | 1) {
    const index = draft.contents.findIndex(content => content.id === contentId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= draft.contents.length) return;
    const contents = [...draft.contents];
    [contents[index], contents[target]] = [contents[target], contents[index]];
    const stored = data.games.find(item => item.id === draft.id);
    setDraft(current => ({ ...current, contents }));
    if (stored) onSave({ ...stored, contents }, false);
  }

  return {
    editingContentId,
    addContent,
    updateContent,
    beginContentEdit,
    saveContentEdit,
    discardContentEdit,
    removeContent,
    moveContent,
  };
}

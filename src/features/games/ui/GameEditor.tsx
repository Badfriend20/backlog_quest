import type { GameEditorProps } from "./gameEditorTypes";
import { Button, Modal, ModalActions } from "../../../shared/ui";
import { QuickCopyModal } from "./QuickCopyModal";
import { GameGeneralPanel } from "./GameGeneralPanel";
import { GameCopiesPanel } from "./GameCopiesPanel";
import { GamePlaythroughsPanel } from "./GamePlaythroughsPanel";
import { useGameEditor } from "./useGameEditor";
import { GamesScope } from "./GamesStyles";
import { capitalizeTerm, useVocabulary } from "../../../shared/vocabulary";

export function GameEditor({
  game,
  data,
  missionIntent,
  onClose,
  onSave,
  onCopyPlatformsChange,
  onResolveMissionRelation,
  onRemoveContent,
  onRemoveCopy,
  onRemovePlaythrough,
}: GameEditorProps) {
  const terms = useVocabulary();
  const editor = useGameEditor({
    game,
    data,
    missionIntent,
    onSave,
    onCopyPlatformsChange,
    onResolveMissionRelation,
    onRemoveContent,
    onRemoveCopy,
    onRemovePlaythrough,
  });
  const {
    isNew,
    draft,
    tab,
    setTab,
    submit,
    showQuickOptions,
    setShowQuickOptions,
    quickPresets,
    existingQuickKeys,
    addCopyFromPreset,
  } = editor;
  return (
    <GamesScope>
      <Modal
        title={isNew ? `Agregar ${terms.activity}` : draft.title}
        eyebrow={isNew ? "NUEVO REGISTRO" : draft.id}
        onClose={onClose}
      >
        <form onSubmit={submit}>
          <div className="editor-tabs" role="tablist" aria-label={`Secciones de ${terms.activity}`}>
            <button
              type="button"
              className={tab === "general" ? "active" : ""}
              onClick={() => setTab("general")}
            >
              General
            </button>
            <button
              type="button"
              className={tab === "copies" ? "active" : ""}
              onClick={() => setTab("copies")}
            >
              {capitalizeTerm(terms.variants)} ({draft.copies.length})
            </button>
            <button
              type="button"
              className={tab === "playthroughs" ? "active" : ""}
              onClick={() => setTab("playthroughs")}
            >
              {capitalizeTerm(terms.journeys)} ({draft.playthroughs.length})
            </button>
          </div>
          {tab === "general" && <GameGeneralPanel data={data} editor={editor} />}
          {tab === "copies" && <GameCopiesPanel data={data} editor={editor} />}
          {tab === "playthroughs" && <GamePlaythroughsPanel data={data} editor={editor} />}
          {tab === "general" && (
            <ModalActions>
              <Button onClick={onClose}>Cancelar</Button>
              <Button type="submit" variant="primary">
                Guardar cambios generales
              </Button>
            </ModalActions>
          )}
        </form>
      </Modal>
      {showQuickOptions && (
        <QuickCopyModal
          data={data}
          presets={quickPresets}
          existingKeys={existingQuickKeys}
          onUse={addCopyFromPreset}
          onClose={() => setShowQuickOptions(false)}
        />
      )}
    </GamesScope>
  );
}

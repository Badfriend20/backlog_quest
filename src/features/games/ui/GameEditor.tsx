import type { GameEditorProps } from "./gameEditorTypes";
import { Modal } from "../../../shared/ui";
import { QuickCopyModal } from "./QuickCopyModal";
import { GameGeneralPanel } from "./GameGeneralPanel";
import { GameCopiesPanel } from "./GameCopiesPanel";
import { GamePlaythroughsPanel } from "./GamePlaythroughsPanel";
import { useGameEditor } from "./useGameEditor";
import { GamesStyles } from "./GamesStyles";

export function GameEditor({ game, data, onClose, onSave }: GameEditorProps) {
  const editor = useGameEditor({ game, data, onSave });
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
    <>
      <GamesStyles />
      <Modal
        title={isNew ? "Agregar juego" : draft.title}
        eyebrow={isNew ? "NUEVO REGISTRO" : draft.id}
        onClose={onClose}
      >
        <form onSubmit={submit}>
          <div className="editor-tabs" role="tablist" aria-label="Secciones del juego">
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
              Copias ({draft.copies.length})
            </button>
            <button
              type="button"
              className={tab === "playthroughs" ? "active" : ""}
              onClick={() => setTab("playthroughs")}
            >
              Partidas ({draft.playthroughs.length})
            </button>
          </div>
          {tab === "general" && <GameGeneralPanel data={data} editor={editor} />}
          {tab === "copies" && <GameCopiesPanel data={data} editor={editor} />}
          {tab === "playthroughs" && <GamePlaythroughsPanel data={data} editor={editor} />}
          {tab === "general" && (
            <div className="modal-actions">
              <button type="button" className="ghost-button" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="primary-button">
                Guardar cambios generales
              </button>
            </div>
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
    </>
  );
}

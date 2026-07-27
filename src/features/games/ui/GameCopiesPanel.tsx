import type { BacklogData } from "../../../shared/kernel/backlog";
import { quickCopyKey, quickCopyLabel } from "../../../shared/kernel/backlogSelectors";
import { GameCopyCard } from "./GameCopyCard";
import type { GameEditorController } from "./useGameEditor";

export function GameCopiesPanel({
  data,
  editor,
}: {
  data: BacklogData;
  editor: GameEditorController;
}) {
  const { draft, setShowQuickOptions, quickPresets, addBlankCopy, addCopyFromPreset } = editor;
  return (
    <section className="editor-panel stack-lg">
      <div className="relation-toolbar">
        <div>
          <p className="eyebrow">COPIAS Y VERSIONES</p>
          <h3>Copias del juego</h3>
          <p>Consulta cada copia en resumen y abre su edición solo cuando la necesites.</p>
        </div>
        <div>
          <button type="button" className="primary-button" onClick={addBlankCopy}>
            + Agregar copia
          </button>
        </div>
      </div>
      <section className="quick-add-section">
        <div className="quick-add-heading">
          <div>
            <p className="eyebrow">AGREGADO RÁPIDO</p>
            <h3>Configuraciones usadas recientemente</h3>
            <p>
              Se generan desde plataforma y propiedad. Guardar un juego mueve sus combinaciones al
              frente.
            </p>
          </div>
          <button
            type="button"
            className="ghost-button compact"
            onClick={() => setShowQuickOptions(true)}
          >
            Configurar
          </button>
        </div>
        <div className="quick-add-grid">
          {quickPresets.map(preset => {
            const alreadyAdded = draft.copies.some(
              copy => quickCopyKey(copy.library, copy.ownership, copy.platformId) === preset.key
            );
            return (
              <button
                type="button"
                className="quick-add-button"
                key={preset.key}
                disabled={alreadyAdded}
                onClick={() => addCopyFromPreset(preset)}
              >
                + {quickCopyLabel(preset, data.preferences.ownershipDisplayRules)}
                {alreadyAdded && <small>Ya agregada</small>}
              </button>
            );
          })}
          {!quickPresets.length && (
            <div className="empty-relation">
              Guarda una copia o configura una opción para crear tus primeros accesos rápidos.
            </div>
          )}
        </div>
      </section>
      {!draft.copies.length && (
        <div className="empty-relation">
          No hay copias. Agrega al menos una antes de activar una misión.
        </div>
      )}
      <div className="relation-card-list">
        {draft.copies.map(copy => (
          <GameCopyCard key={copy.id} data={data} copy={copy} editor={editor} />
        ))}
      </div>
    </section>
  );
}

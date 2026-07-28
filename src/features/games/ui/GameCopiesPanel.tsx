import type { BacklogData } from "../../../shared/kernel/backlog";
import { quickCopyKey, quickCopyLabel } from "../../../shared/kernel/backlogSelectors";
import { Button, EmptyState, Eyebrow, Stack } from "../../../shared/ui";
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
    <Stack as="section" className="editor-panel">
      <div className="relation-toolbar">
        <div>
          <Eyebrow>COPIAS Y VERSIONES</Eyebrow>
          <h3>Copias del juego</h3>
          <p>Consulta cada copia en resumen y abre su edición solo cuando la necesites.</p>
        </div>
        <div>
          <Button variant="primary" onClick={addBlankCopy}>
            + Agregar copia
          </Button>
        </div>
      </div>
      <section className="quick-add-section">
        <div className="quick-add-heading">
          <div>
            <Eyebrow>AGREGADO RÁPIDO</Eyebrow>
            <h3>Configuraciones usadas recientemente</h3>
            <p>
              Se generan desde plataforma y propiedad. Guardar un juego mueve sus combinaciones al
              frente.
            </p>
          </div>
          <Button size="compact" onClick={() => setShowQuickOptions(true)}>
            Configurar
          </Button>
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
            <EmptyState>
              Guarda una copia o configura una opción para crear tus primeros accesos rápidos.
            </EmptyState>
          )}
        </div>
      </section>
      {!draft.copies.length && (
        <EmptyState>No hay copias. Agrega al menos una antes de activar una misión.</EmptyState>
      )}
      <div className="relation-card-list">
        {draft.copies.map(copy => (
          <GameCopyCard key={copy.id} data={data} copy={copy} editor={editor} />
        ))}
      </div>
    </Stack>
  );
}

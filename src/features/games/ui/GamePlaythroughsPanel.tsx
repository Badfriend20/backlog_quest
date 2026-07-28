import type { BacklogData } from "../../../shared/kernel/backlog";
import { Button, EmptyState, Eyebrow, Stack } from "../../../shared/ui";
import { GamePlaythroughCard } from "./GamePlaythroughCard";
import type { GameEditorController } from "./useGameEditor";

export function GamePlaythroughsPanel({
  data,
  editor,
}: {
  data: BacklogData;
  editor: GameEditorController;
}) {
  const { draft, addPlaythrough } = editor;
  const canCreate = Boolean(draft.copies.length && draft.contents.length);

  return (
    <Stack as="section" className="editor-panel">
      <div className="relation-toolbar">
        <div>
          <Eyebrow>HISTORIAL EDITABLE</Eyebrow>
          <h3>Partidas y rejugadas</h3>
          <p>
            Consulta cada partida en resumen y abre su edición solo cuando necesites actualizarla.
          </p>
        </div>
        <Button
          variant="primary"
          disabled={!canCreate}
          title={
            canCreate
              ? undefined
              : "Agrega al menos una copia y un contenido antes de crear una partida."
          }
          onClick={addPlaythrough}
        >
          + Agregar partida
        </Button>
      </div>
      {!draft.copies.length && (
        <EmptyState>
          Para crear una partida primero necesitas registrar al menos una copia.
        </EmptyState>
      )}
      {!draft.contents.length && (
        <EmptyState>
          Para crear una partida primero necesitas registrar al menos un contenido.
        </EmptyState>
      )}
      {!draft.playthroughs.length && <EmptyState>Todavía no hay partidas registradas.</EmptyState>}
      <div className="relation-card-list">
        {draft.playthroughs.map(play => (
          <GamePlaythroughCard key={play.id} data={data} play={play} editor={editor} />
        ))}
      </div>
    </Stack>
  );
}

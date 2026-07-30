import type { QuestData } from "../../../shared/kernel/quest";
import { Button, EmptyState, Eyebrow, Stack } from "../../../shared/ui";
import { GamePlaythroughCard } from "./GamePlaythroughCard";
import type { GameEditorController } from "./useGameEditor";
import { useVocabulary } from "../../../shared/vocabulary";

export function GamePlaythroughsPanel({
  data,
  editor,
}: {
  data: QuestData;
  editor: GameEditorController;
}) {
  const terms = useVocabulary();
  const { draft, addPlaythrough } = editor;
  const canCreate = Boolean(draft.copies.length && draft.contents.length);

  return (
    <Stack as="section" className="editor-panel">
      <div className="relation-toolbar">
        <div>
          <Eyebrow>HISTORIAL EDITABLE</Eyebrow>
          <h3>
            {terms.journeys} y {terms.repetitions}
          </h3>
          <p>
            Consulta cada {terms.journey} en resumen y abre su edición cuando necesites
            actualizarla.
          </p>
        </div>
        <Button
          variant="primary"
          disabled={!canCreate}
          title={
            canCreate
              ? undefined
              : `Agrega al menos una ${terms.variant} y un ${terms.content} antes de crear un ${terms.journey}.`
          }
          onClick={addPlaythrough}
        >
          + Agregar {terms.journey}
        </Button>
      </div>
      {!draft.copies.length && (
        <EmptyState>
          Para crear un {terms.journey} primero necesitas registrar al menos una {terms.variant}.
        </EmptyState>
      )}
      {!draft.contents.length && (
        <EmptyState>
          Para crear un {terms.journey} primero necesitas registrar al menos un {terms.content}.
        </EmptyState>
      )}
      {!draft.playthroughs.length && (
        <EmptyState>Todavía no hay {terms.journeys} registrados.</EmptyState>
      )}
      <div className="relation-card-list">
        {draft.playthroughs.map(play => (
          <GamePlaythroughCard key={play.id} data={data} play={play} editor={editor} />
        ))}
      </div>
    </Stack>
  );
}

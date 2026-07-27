import type { BacklogData } from "../../../shared/kernel/backlog";
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

  return (
    <section className="editor-panel stack-lg">
      <div className="relation-toolbar">
        <div>
          <p className="eyebrow">HISTORIAL EDITABLE</p>
          <h3>Partidas y rejugadas</h3>
          <p>
            Consulta cada partida en resumen y abre su edición solo cuando necesites actualizarla.
          </p>
        </div>
        <button type="button" className="primary-button" onClick={addPlaythrough}>
          + Agregar partida
        </button>
      </div>
      {!draft.playthroughs.length && (
        <div className="empty-relation">Todavía no hay partidas registradas.</div>
      )}
      <div className="relation-card-list">
        {draft.playthroughs.map(play => (
          <GamePlaythroughCard key={play.id} data={data} play={play} editor={editor} />
        ))}
      </div>
    </section>
  );
}

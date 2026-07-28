import { Button, EmptyState, Eyebrow } from "../../../shared/ui";
import { GameContentCard } from "./GameContentCard";
import type { GameEditorController } from "./useGameEditor";

export function GameContentsSection({ editor }: { editor: GameEditorController }) {
  const { draft, addContent } = editor;

  return (
    <section className="wide-field game-contents-section">
      <div className="relation-toolbar">
        <div>
          <Eyebrow>CATÁLOGO DEL JUEGO</Eyebrow>
          <h3>Contenidos</h3>
          <p>Registra campañas, expansiones, DLC y objetivos antes de usarlos en partidas.</p>
        </div>
        <Button variant="primary" onClick={addContent}>
          + Agregar contenido
        </Button>
      </div>
      {!draft.contents.length && (
        <EmptyState>
          Agrega al menos un contenido antes de crear una misión o una partida.
        </EmptyState>
      )}
      <div className="relation-card-list">
        {draft.contents.map((content, index) => (
          <GameContentCard
            key={content.id}
            content={content}
            index={index}
            total={draft.contents.length}
            editor={editor}
          />
        ))}
      </div>
    </section>
  );
}

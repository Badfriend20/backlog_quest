import { Button, EmptyState, Eyebrow } from "../../../shared/ui";
import { GameContentCard } from "./GameContentCard";
import type { GameEditorController } from "./useGameEditor";
import { useVocabulary } from "../../../shared/vocabulary";

export function GameContentsSection({ editor }: { editor: GameEditorController }) {
  const terms = useVocabulary();
  const { draft, addContent } = editor;

  return (
    <section className="wide-field game-contents-section">
      <div className="relation-toolbar">
        <div>
          <Eyebrow>CATÁLOGO DE LA {terms.activity.toUpperCase()}</Eyebrow>
          <h3>{terms.contents}</h3>
          <p>
            Registra etapas, módulos, complementos u objetivos antes de usarlos en {terms.journeys}.
          </p>
        </div>
        <Button variant="primary" onClick={addContent}>
          + Agregar {terms.content}
        </Button>
      </div>
      {!draft.contents.length && (
        <EmptyState>
          Agrega al menos un {terms.content} antes de crear una {terms.mission} o un {terms.journey}
          .
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

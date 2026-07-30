import type { ContentType, ActivityContent } from "../../../shared/kernel/quest";
import { Button, FormGrid } from "../../../shared/ui";
import { EditableRelationCard } from "./EditableRelationCard";
import type { GameEditorController } from "./useGameEditor";

const CONTENT_TYPES: Array<{ value: ContentType; label: string }> = [
  { value: "campaign", label: "Principal" },
  { value: "dlc", label: "Complemento" },
  { value: "replay", label: "Repetición" },
  { value: "custom", label: "Personalizado" },
];

export function GameContentCard({
  content,
  index,
  total,
  editor,
}: {
  content: ActivityContent;
  index: number;
  total: number;
  editor: GameEditorController;
}) {
  const {
    editingContentId,
    beginContentEdit,
    saveContentEdit,
    discardContentEdit,
    updateContent,
    removeContent,
    moveContent,
  } = editor;
  const editing = editingContentId === content.id;
  const typeLabel =
    CONTENT_TYPES.find(option => option.value === content.type)?.label ?? content.type;

  return (
    <EditableRelationCard
      editing={editing}
      identifier={content.id}
      title={content.title || "Contenido sin nombre"}
      badges={
        <>
          <span>{typeLabel}</span>
          <span>{content.status}</span>
        </>
      }
      itemLabel="contenido"
      deleteMessage={`Se eliminará ${content.title || content.id} del catálogo. Las misiones y recorridos conservarán su descripción histórica sin quedar bloqueados.`}
      onEdit={() => beginContentEdit(content.id)}
      onRemove={() => removeContent(content.id)}
      onSave={saveContentEdit}
      onDiscard={discardContentEdit}
      summary={
        <>
          {content.notes && <p className="copy-summary-notes">{content.notes}</p>}
          <div className="content-order-actions" aria-label="Orden del contenido">
            <Button
              size="compact"
              disabled={index === 0}
              onClick={() => moveContent(content.id, -1)}
            >
              Subir
            </Button>
            <Button
              size="compact"
              disabled={index === total - 1}
              onClick={() => moveContent(content.id, 1)}
            >
              Bajar
            </Button>
          </div>
        </>
      }
      editor={
        <FormGrid $compact>
          <label className="wide-field">
            <span>Nombre del contenido</span>
            <input
              required
              value={content.title}
              placeholder="Etapa, módulo, complemento u objetivo"
              onChange={event => updateContent(content.id, { title: event.target.value })}
            />
          </label>
          <label>
            <span>Tipo</span>
            <select
              value={content.type}
              onChange={event =>
                updateContent(content.id, {
                  type: event.target.value as ContentType,
                })
              }
            >
              {CONTENT_TYPES.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="wide-field">
            <span>Notas</span>
            <textarea
              rows={2}
              value={content.notes}
              onChange={event => updateContent(content.id, { notes: event.target.value })}
            />
          </label>
        </FormGrid>
      }
    />
  );
}

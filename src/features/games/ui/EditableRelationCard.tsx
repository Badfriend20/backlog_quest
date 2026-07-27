import { useState } from "react";
import type { ReactNode } from "react";
import { ConfirmationModal } from "../../../shared/ui";

export function EditableRelationCard({
  editing,
  identifier,
  title,
  badges,
  summary,
  editor,
  itemLabel,
  deleteMessage,
  onEdit,
  onRemove,
  onSave,
  onDiscard,
}: {
  editing: boolean;
  identifier: string;
  title: ReactNode;
  badges?: ReactNode;
  summary: ReactNode;
  editor: ReactNode;
  itemLabel: string;
  deleteMessage: string;
  onEdit(): void;
  onRemove(): void;
  onSave(): void;
  onDiscard(): void;
}) {
  const [confirmingRemoval, setConfirmingRemoval] = useState(false);

  function confirmRemoval() {
    setConfirmingRemoval(false);
    onRemove();
  }

  return (
    <>
      <article className={editing ? "relation-card editing" : "relation-card"}>
        <div className="relation-card-header">
          <div>
            <span className="relation-id">{identifier}</span>
            <strong>{title}</strong>
          </div>
          {badges && <div className="relation-badges">{badges}</div>}
        </div>

        {editing ? editor : summary}

        <div className={editing ? "relation-actions split-actions" : "relation-actions"}>
          <button
            type="button"
            className="danger-button compact"
            onClick={() => setConfirmingRemoval(true)}
          >
            Eliminar {itemLabel}
          </button>
          {editing ? (
            <div className="relation-save-actions">
              <button type="button" className="ghost-button compact" onClick={onDiscard}>
                Cerrar sin guardar
              </button>
              <button type="button" className="primary-button compact" onClick={onSave}>
                Guardar y cerrar
              </button>
            </div>
          ) : (
            <button type="button" className="ghost-button compact" onClick={onEdit}>
              Editar {itemLabel}
            </button>
          )}
        </div>
      </article>

      {confirmingRemoval && (
        <ConfirmationModal
          title={`Eliminar ${itemLabel}`}
          message={deleteMessage}
          confirmLabel={`Eliminar ${itemLabel}`}
          onConfirm={confirmRemoval}
          onClose={() => setConfirmingRemoval(false)}
        />
      )}
    </>
  );
}

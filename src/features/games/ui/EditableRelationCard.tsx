import { useState } from "react";
import type { ReactNode } from "react";
import {
  Button,
  ConfirmationModal,
  RelationActions,
  RelationBadges,
  RelationCard,
  RelationHeader,
  RelationId,
} from "../../../shared/ui";

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
      <RelationCard $editing={editing}>
        <RelationHeader>
          <div>
            <RelationId>{identifier}</RelationId>
            <strong>{title}</strong>
          </div>
          {badges && <RelationBadges>{badges}</RelationBadges>}
        </RelationHeader>

        {editing ? editor : summary}

        <RelationActions $split={editing}>
          <Button variant="danger" size="compact" onClick={() => setConfirmingRemoval(true)}>
            Eliminar {itemLabel}
          </Button>
          {editing ? (
            <div className="relation-save-actions">
              <Button size="compact" onClick={onDiscard}>
                Cerrar sin guardar
              </Button>
              <Button variant="primary" size="compact" onClick={onSave}>
                Guardar y cerrar
              </Button>
            </div>
          ) : (
            <Button size="compact" onClick={onEdit}>
              Editar {itemLabel}
            </Button>
          )}
        </RelationActions>
      </RelationCard>

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

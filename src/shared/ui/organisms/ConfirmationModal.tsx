import { Modal } from "./Modal";

export function ConfirmationModal({
  title,
  message,
  confirmLabel = "Eliminar",
  onConfirm,
  onClose,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm(): void;
  onClose(): void;
}) {
  return (
    <Modal eyebrow="CONFIRMACIÓN REQUERIDA" title={title} onClose={onClose}>
      <p className="confirmation-message">{message}</p>
      <div className="modal-actions">
        <button type="button" className="ghost-button" onClick={onClose}>
          Cancelar
        </button>
        <button type="button" className="danger-button" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

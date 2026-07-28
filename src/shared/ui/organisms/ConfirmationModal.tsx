import styled from "styled-components";
import { Button } from "../atoms";
import { ModalActions } from "../layout";
import { Modal } from "./Modal";

const ConfirmationMessage = styled.p`
  color: var(--muted);
  line-height: 1.6;
`;

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
      <ConfirmationMessage>{message}</ConfirmationMessage>
      <ModalActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </ModalActions>
    </Modal>
  );
}

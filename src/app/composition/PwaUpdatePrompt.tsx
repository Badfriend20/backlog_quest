import { useRegisterSW } from "virtual:pwa-register/react";
import styled from "styled-components";
import { Button } from "../../shared/ui";

const UpdateNotice = styled.output`
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 80;
  display: flex;
  max-width: min(420px, calc(100vw - 36px));
  align-items: center;
  gap: 14px;
  padding: 13px 16px;
  border: 1px solid var(--cyan);
  background: var(--panel-2);
  box-shadow: 5px 5px 0 #050308;

  span {
    flex: 1;
  }
`;

export function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <UpdateNotice aria-live="polite">
      <span>Hay una actualización disponible.</span>
      <Button size="compact" variant="primary" onClick={() => void updateServiceWorker(true)}>
        Actualizar
      </Button>
    </UpdateNotice>
  );
}

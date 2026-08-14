import styled from "styled-components";
import { IconButton } from "./IconButton";

export interface ReorderControlsProps {
  onMoveUp(): void;
  onMoveDown(): void;
  upDisabled?: boolean;
  downDisabled?: boolean;
}

const ReorderGroup = styled.div`
  display: inline-flex;
  gap: 4px;

  ${IconButton} {
    color: var(--muted);

    &:disabled {
      opacity: 0.3;
    }
  }
`;

export function ReorderControls({
  onMoveUp,
  onMoveDown,
  upDisabled = false,
  downDisabled = false,
}: ReorderControlsProps) {
  return (
    <ReorderGroup aria-label="Controles de orden">
      <IconButton aria-label="Subir" disabled={upDisabled} onClick={onMoveUp}>
        ↑
      </IconButton>
      <IconButton aria-label="Bajar" disabled={downDisabled} onClick={onMoveDown}>
        ↓
      </IconButton>
    </ReorderGroup>
  );
}

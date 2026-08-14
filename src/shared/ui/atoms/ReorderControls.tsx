import styled from "styled-components";

export interface ReorderControlsProps {
  onMoveUp(): void;
  onMoveDown(): void;
  upDisabled?: boolean;
  downDisabled?: boolean;
}

const ReorderGroup = styled.div`
  display: inline-flex;
  gap: 4px;

  button {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    padding: 0;
    border: 1px solid var(--border);
    background: var(--panel-2);
    color: var(--muted);
    font: inherit;
    font-weight: 800;
    line-height: 1;
    cursor: pointer;
  }

  button:hover:not(:disabled),
  button:focus-visible {
    border-color: var(--cyan);
    color: var(--cyan);
  }

  button:focus-visible {
    outline: 2px solid var(--cyan);
    outline-offset: 2px;
  }

  button:disabled {
    opacity: 0.3;
    cursor: default;
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
      <button type="button" aria-label="Subir" disabled={upDisabled} onClick={onMoveUp}>
        ↑
      </button>
      <button type="button" aria-label="Bajar" disabled={downDisabled} onClick={onMoveDown}>
        ↓
      </button>
    </ReorderGroup>
  );
}

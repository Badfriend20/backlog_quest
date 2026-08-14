import styled from "styled-components";

export const RotationRecommendationRow = styled.li`
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 11px 13px;
  background: var(--panel);
  border: 1px solid var(--border);

  .rotation-number {
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    background: var(--purple-2);
    font:
      800 0.8rem ui-monospace,
      SFMono-Regular,
      Menlo,
      monospace;
  }
  .rotation-copy {
    min-width: 0;
  }
  .rotation-copy strong,
  .rotation-copy small {
    display: block;
  }
  .rotation-copy small {
    margin-top: 3px;
  }
  .rotation-reason {
    margin: 5px 0 0;
    color: var(--muted);
    font-size: 0.78rem;
  }
  .rotation-actions {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .rotation-move-menu {
    position: relative;
  }
  .rotation-menu-trigger {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border: 1px solid var(--border);
    background: var(--panel-2);
    color: var(--text);
    cursor: pointer;
    font-weight: 800;
  }
  .rotation-menu-trigger:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
  .rotation-move-menu > div {
    position: absolute;
    right: 0;
    top: calc(100% + 7px);
    z-index: 20;
    width: 180px;
    display: grid;
    padding: 6px;
    border: 1px solid var(--border);
    background: var(--panel);
    box-shadow: 5px 5px 0 rgba(4, 2, 7, 0.8);
  }
  .rotation-move-menu strong {
    padding: 7px 9px 5px;
    color: var(--muted);
    font-size: 0.7rem;
    text-transform: uppercase;
  }
  .rotation-move-menu > div button {
    border: 0;
    background: transparent;
    color: var(--text);
    text-align: left;
    padding: 9px;
    cursor: pointer;
  }
  .rotation-move-menu > div button:hover:not(:disabled) {
    background: var(--panel-2);
  }
  .rotation-move-menu > div button:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
  @media (max-width: 520px) {
    grid-template-columns: 36px minmax(0, 1fr);

    .rotation-actions {
      grid-column: 2;
      justify-self: start;
    }
  }
`;

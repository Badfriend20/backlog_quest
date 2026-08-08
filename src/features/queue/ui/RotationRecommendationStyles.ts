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
  @media (max-width: 520px) {
    grid-template-columns: 36px minmax(0, 1fr);

    > button {
      grid-column: 2;
      justify-self: start;
    }
  }
`;

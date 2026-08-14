import styled from "styled-components";

export const QueueScope = styled.div`
  display: contents;

  .rotation-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 8px;
  }
  .rotation-empty {
    margin: 0;
    padding: 14px;
    color: var(--muted);
    border: 1px dashed var(--border);
  }

  .queue-toolbar {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 16px;
  }
  .queue-toolbar label {
    display: grid;
    gap: 5px;
    color: var(--muted);
    font-size: 0.8rem;
    min-width: 220px;
  }
  .queue-toolbar > span {
    color: var(--muted);
  }
  .full-queue {
    display: grid;
    gap: 9px;
  }
  .queue-row {
    display: grid;
    grid-template-columns: 78px minmax(0, 1fr) auto;
    align-items: center;
    gap: 16px;
    background: var(--panel);
    border: 1px solid var(--border);
    padding: 13px;
  }
  .queue-position {
    display: flex;
    gap: 9px;
    align-items: center;
  }
  .queue-position > strong {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    background: var(--purple-2);
    font:
      800 0.9rem ui-monospace,
      SFMono-Regular,
      Menlo,
      monospace;
  }
  .queue-position > div {
    display: grid;
    gap: 3px;
  }
  .queue-position button {
    width: 25px;
    height: 20px;
    border: 1px solid var(--border);
    background: var(--panel-2);
    color: var(--muted);
    cursor: pointer;
    line-height: 1;
  }
  .queue-position button:disabled {
    opacity: 0.3;
    cursor: default;
  }
  .queue-main h3 {
    margin-bottom: 4px;
  }
  .queue-topline-actions {
    display: flex;
    justify-content: flex-end;
    gap: 7px;
    flex-wrap: wrap;
    min-width: 0;
  }
  .queue-main p {
    margin: 0 0 5px;
    color: var(--muted);
    font-size: 0.82rem;
  }
  .queue-dependency {
    display: inline-block;
    margin-top: 8px;
  }
  .compact-mode & .queue-row {
    padding: 9px 11px;
  }
  .queue-actions {
    min-width: 116px;
    text-align: right;
  }
  .active-label {
    color: var(--green);
    font:
      700 0.72rem ui-monospace,
      SFMono-Regular,
      Menlo,
      monospace;
  }
  @media (max-width: 1180px) {
    .queue-row {
      grid-template-columns: 68px minmax(0, 1fr);
    }
    .queue-actions {
      grid-column: 2;
      text-align: left;
    }
  }
  @media (max-width: 760px) {
    .queue-toolbar {
      align-items: stretch;
      flex-direction: column;
    }
    .queue-row {
      grid-template-columns: 58px minmax(0, 1fr);
      gap: 10px;
    }
    .queue-position {
      align-self: start;
    }
  }
  @media (max-width: 430px) {
    .queue-row {
      grid-template-columns: 1fr;
    }
    .queue-position {
      justify-content: space-between;
    }
    .queue-actions {
      grid-column: auto;
    }
  }
`;

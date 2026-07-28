import styled from "styled-components";

export const HistoryScope = styled.div`
  display: contents;

  .table-wrap {
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    -webkit-overflow-scrolling: touch;
    border: 1px solid var(--border);
  }
  table {
    width: 100%;
    min-width: 900px;
    border-collapse: collapse;
    background: var(--panel);
  }
  th,
  td {
    padding: 12px 13px;
    border-bottom: 1px solid var(--border);
    text-align: left;
    vertical-align: top;
  }
  th {
    background: var(--panel-2);
    color: var(--cyan);
    font:
      700 0.72rem ui-monospace,
      SFMono-Regular,
      Menlo,
      monospace;
    text-transform: uppercase;
  }
  td {
    color: #ddd6ea;
    font-size: 0.85rem;
  }
  .mobile-scroll-hint {
    display: none;
  }
  .table-link {
    background: none;
    border: 0;
    color: var(--text);
    cursor: pointer;
    padding: 0;
    text-align: left;
    font-weight: 700;
  }
  .table-link:hover {
    color: var(--cyan);
  }
  @media (max-width: 760px) {
    .mobile-scroll-hint {
      display: block;
      margin: -5px 0 8px;
      color: var(--muted);
      font-size: 0.78rem;
    }
  }
`;

import styled from "styled-components";

export const DashboardScope = styled.div`
  display: contents;

  .metric-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }
  .metric-card {
    padding: 18px;
    border-bottom: 4px solid var(--purple-2);
    box-shadow: var(--shadow);
  }
  .metric-card span {
    display: block;
  }
  .metric-card strong {
    display: block;
  }
  .metric-card small {
    display: block;
  }
  .metric-card span {
    color: var(--muted);
    font-size: 0.83rem;
  }
  .metric-card strong {
    margin: 6px 0 3px;
    font:
      800 2rem/1 ui-monospace,
      SFMono-Regular,
      Menlo,
      monospace;
    color: var(--cyan);
  }
  .active-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }
  .count-badge {
    display: inline-flex;
    align-items: center;
    width: fit-content;
    padding: 4px 7px;
    font:
      700 0.68rem/1.2 ui-monospace,
      SFMono-Regular,
      Menlo,
      monospace;
    border: 1px solid currentColor;
  }
  .two-column {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
    gap: 30px;
  }
  .quest-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 8px;
  }
  .quest-list li {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 11px 13px;
    background: var(--panel);
    border: 1px solid var(--border);
  }
  .quest-number {
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    background: var(--purple-2);
    font:
      800 0.8rem ui-monospace,
      SFMono-Regular,
      Menlo,
      monospace;
  }
  .quest-list strong {
    display: block;
  }
  .quest-list small {
    display: block;
  }
  .quest-list small {
    margin-top: 3px;
  }
  .platform-stack {
    display: grid;
    gap: 8px;
  }
  .platform-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    background: var(--panel);
    border: 1px solid var(--border);
    padding: 13px;
  }
  .platform-row strong {
    display: block;
  }
  .platform-row small {
    display: block;
  }
  .count-badge {
    color: var(--cyan);
  }
  @media (max-width: 1180px) {
    .active-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .metric-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 760px) {
    .metric-grid {
      grid-template-columns: 1fr;
    }
    .active-grid {
      grid-template-columns: 1fr;
    }
    .two-column {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 430px) {
    .metric-grid {
      grid-template-columns: 1fr 1fr;
    }
    .metric-card {
      padding: 13px;
    }
    .metric-card strong {
      font-size: 1.5rem;
    }
  }
  .empty-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 240px;
    border-style: dashed;
  }
  .quest-copy {
    flex: 1;
    min-width: 0;
  }
  .quest-list li > button {
    margin-left: auto;
  }
  .activity-list {
    display: grid;
    gap: 8px;
  }
  .activity-list article {
    border-left: 3px solid var(--purple-2);
    background: var(--panel);
    padding: 10px 12px;
  }
  .activity-list span {
    color: var(--cyan);
    font-size: 0.7rem;
  }
  .activity-list p {
    margin: 4px 0 0;
    color: var(--muted);
    font-size: 0.8rem;
    line-height: 1.4;
  }
`;

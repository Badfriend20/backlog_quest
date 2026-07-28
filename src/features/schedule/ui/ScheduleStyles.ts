import styled from "styled-components";

export const ScheduleScope = styled.div`
  display: contents;

  .schedule-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 9px;
  }
  .plan-mission-manager {
    padding: 16px;
    border: 1px solid var(--border);
    background: var(--panel);
  }
  .plan-mission-manager h2 + p {
    margin: 5px 0 0;
    color: var(--muted);
  }
  .plan-mission-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
    gap: 8px;
  }
  .plan-mission-row {
    display: flex;
    min-width: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 10px 12px;
    border: 1px solid var(--border);
    background: var(--panel-2);
  }
  .plan-mission-row > div:first-child {
    display: grid;
    min-width: 0;
    gap: 3px;
  }
  .plan-mission-row > div:first-child strong {
    overflow-wrap: anywhere;
  }
  .plan-mission-row > div:first-child span {
    overflow-wrap: anywhere;
  }
  .plan-mission-row > div:first-child span {
    color: var(--muted);
    font-size: 0.78rem;
  }
  .plan-mission-meta {
    color: var(--muted);
    font-size: 0.78rem;
  }
  .plan-mission-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .plan-mission-meta span {
    padding: 4px 6px;
    border: 1px solid var(--border);
  }
  .plan-mission-meta .unscheduled-label {
    border-color: var(--orange);
    color: var(--orange);
  }
  .plan-mission-row > button {
    align-self: flex-start;
    margin-top: auto;
  }
  .schedule-card {
    padding: 12px;
    background: var(--panel);
    border: 1px solid var(--border);
    min-width: 0;
  }
  .schedule-date {
    display: flex;
    justify-content: space-between;
    gap: 6px;
    padding-bottom: 9px;
    border-bottom: 1px solid var(--border);
  }
  .schedule-date span {
    color: var(--muted);
    font-size: 0.72rem;
  }
  .schedule-card > small {
    display: block;
    margin-top: 11px;
  }
  .schedule-card > p {
    margin: 8px 0 0;
    color: var(--muted);
    font-size: 0.76rem;
  }
  .schedule-slot {
    margin-top: 11px;
  }
  .schedule-slot span,
  .schedule-slot strong {
    display: block;
  }
  .schedule-slot span {
    color: var(--cyan);
    font:
      700 0.67rem ui-monospace,
      SFMono-Regular,
      Menlo,
      monospace;
    text-transform: uppercase;
  }
  .schedule-slot strong {
    margin-top: 3px;
    overflow-wrap: anywhere;
    font-size: 0.83rem;
  }
  @media (max-width: 1180px) {
    .schedule-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
  @media (max-width: 760px) {
    .schedule-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 430px) {
    .schedule-grid {
      grid-template-columns: 1fr;
    }
  }

  .schedule-mission {
    display: grid;
    gap: 3px;
    width: 100%;
    margin-top: 10px;
    padding: 9px;
    border: 1px solid var(--border);
    background: var(--panel-2);
    color: var(--text);
    text-align: left;
  }
  .schedule-mission:hover {
    border-color: var(--cyan);
  }
  .schedule-mission-open {
    display: grid;
    gap: 3px;
    width: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: left;
    cursor: pointer;
  }
  .schedule-mission span {
    color: var(--cyan);
    font:
      700 0.65rem ui-monospace,
      SFMono-Regular,
      Menlo,
      monospace;
    text-transform: uppercase;
  }
  .schedule-mission strong {
    font-size: 0.8rem;
    overflow-wrap: anywhere;
  }
  .schedule-mission small {
    font-size: 0.68rem;
  }
  .schedule-rest {
    display: grid;
    gap: 3px;
    margin-top: 12px;
    color: var(--muted);
  }
  .schedule-rest span {
    font-size: 0.8rem;
  }
`;

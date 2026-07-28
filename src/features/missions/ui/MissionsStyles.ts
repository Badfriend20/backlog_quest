import styled from "styled-components";

export const MissionsScope = styled.div`
  display: contents;

  .mission-slot-line {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 9px;
    color: var(--muted);
    font-size: 0.76rem;
  }
  .active-version {
    display: grid;
    gap: 3px;
    margin: 12px 0;
    padding: 9px 10px;
    border-left: 3px solid var(--green);
    background: rgba(126, 255, 162, 0.07);
  }
  .active-version span {
    color: var(--green);
    font:
      700 0.65rem ui-monospace,
      SFMono-Regular,
      Menlo,
      monospace;
    text-transform: uppercase;
  }
  .active-version strong {
    font-size: 0.78rem;
    overflow-wrap: anywhere;
  }
  .all-copies {
    padding-right: 3px;
  }
  .action-menu {
    position: relative;
  }
  .action-menu-trigger {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    cursor: pointer;
    border: 1px solid var(--border);
    background: var(--panel-2);
    font-weight: 800;
  }
  .action-menu > div {
    position: absolute;
    right: 0;
    bottom: calc(100% + 7px);
    z-index: 20;
    width: 220px;
    display: grid;
    background: #0c0814;
    border: 1px solid var(--border);
    box-shadow: 5px 5px 0 #040207;
    padding: 6px;
  }
  .action-menu button {
    border: 0;
    background: transparent;
    color: var(--text);
    text-align: left;
    padding: 9px;
    cursor: pointer;
  }
  .action-menu button:hover {
    background: var(--panel-2);
  }
  .danger-text {
    color: var(--red) !important;
  }
  .occupied-warning {
    padding: 10px 12px;
    background: rgba(255, 164, 94, 0.09);
    border: 1px solid var(--orange);
    color: #ffe4cc;
    font-size: 0.8rem;
  }
  .dependency-warning {
    padding: 10px 12px;
    border: 1px solid var(--orange);
    background: rgba(255, 164, 94, 0.09);
    color: #ffe4cc;
    font-size: 0.8rem;
  }
  .check-row {
    display: flex !important;
    align-items: center;
    gap: 8px !important;
    padding-bottom: 10px;
    white-space: nowrap;
  }
  .check-row input {
    width: 18px;
    height: 18px;
  }
  .occupied-warning .check-row {
    margin-top: 8px;
    padding-bottom: 0;
  }
  .compact-mode & .active-version {
    margin: 8px 0;
    padding: 7px 8px;
  }
  .mission-schedule-field {
    display: grid;
    gap: 12px;
  }
  .mission-schedule-list {
    display: grid;
    gap: 8px;
  }
  .mission-schedule-row {
    display: grid;
    gap: 12px;
    padding: 12px;
    border: 1px solid var(--border);
    background: var(--panel-alt);
  }
  .mission-schedule-heading {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 12px;
  }
  .mission-schedule-heading label {
    flex: 1;
    max-width: 320px;
  }
  .weekday-toggles {
    display: grid;
    grid-template-columns: repeat(7, minmax(36px, 44px));
    gap: 7px;
  }
  .weekday-toggle {
    min-height: 38px;
    padding: 0;
    border: 1px solid var(--border);
    border-radius: 7px;
    background: var(--panel);
    color: var(--muted);
    font: inherit;
    font-weight: 800;
    cursor: pointer;
  }
  .weekday-toggle:hover {
    border-color: var(--cyan);
  }
  .weekday-toggle.active {
    border-color: var(--purple);
    background: var(--purple);
    color: #140b22;
    box-shadow: 2px 2px 0 #3d236d;
  }
  @media (max-width: 560px) {
    .mission-schedule-heading {
      align-items: stretch;
      flex-direction: column;
    }
    .mission-schedule-heading label {
      max-width: none;
    }
    .mission-schedule-heading > button {
      justify-self: start;
      align-self: start;
    }
    .weekday-toggles {
      grid-template-columns: repeat(7, minmax(32px, 1fr));
      gap: 4px;
    }
  }
  @media (max-width: 760px) {
    .action-menu > div {
      position: fixed;
      left: 14px;
      right: 14px;
      bottom: 18px;
      width: auto;
    }
  }
`;

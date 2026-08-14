import styled from "styled-components";

export const DevicesScope = styled.div`
  display: contents;

  .status-purple {
    color: #c6a5ff;
    background: rgba(166, 115, 255, 0.1);
  }

  .platform-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 15px;
  }
  .device-view-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
  }
  .device-view-heading p:not(.eyebrow) {
    margin: 0;
    color: var(--muted);
  }
  .platform-card {
    padding: 18px;
  }
  .platform-card-title {
    display: block;
    width: 100%;
    margin: 12px 0 8px;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--text);
    font-size: 1.5rem;
    font-weight: 700;
    text-align: left;
    cursor: pointer;
  }
  .platform-card-title:hover {
    color: var(--cyan);
  }
  .platform-card-title:focus-visible {
    color: var(--cyan);
  }
  .platform-card-notes {
    margin: 0;
    color: var(--muted);
    line-height: 1.55;
  }
  .platform-metrics {
    display: flex;
    gap: 18px;
    margin-top: 14px;
  }
  .platform-metrics button {
    padding: 6px 8px;
    border: 1px solid var(--border);
    background: var(--panel-2);
    color: var(--muted);
    cursor: pointer;
  }
  .platform-metrics button:hover {
    border-color: var(--cyan);
  }
  .platform-metrics button:focus-visible {
    border-color: var(--cyan);
  }
  .platform-metrics button strong {
    color: var(--cyan);
  }
  .platform-card-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
  }
  .device-reference-summary {
    display: grid;
    gap: 4px;
    margin-top: 16px;
    padding: 12px;
    border: 1px solid var(--border);
    background: var(--panel-2);
  }
  .device-reference-summary span {
    color: var(--muted);
    font-size: 0.82rem;
  }
  .device-channel-tools {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-top: 16px;
    padding: 12px;
    border: 1px solid var(--border);
    background: var(--panel-2);
  }
  .device-channel-tools p {
    margin: 4px 0 0;
    color: var(--muted);
    font-size: 0.82rem;
  }
  .device-mission-modal-list {
    display: grid;
    gap: 14px;
  }
  @media (max-width: 1180px) {
    .platform-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 760px) {
    .platform-grid {
      grid-template-columns: 1fr;
    }
    .device-mission-modal-list {
      grid-template-columns: 1fr;
    }
    .device-view-heading {
      flex-direction: column;
      align-items: stretch;
    }
    .device-view-heading > button {
      align-self: flex-start;
    }
    .device-channel-tools {
      flex-direction: column;
    }
  }
  .device-selector {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 7px;
    min-inline-size: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }
  .device-option {
    position: relative;
    display: flex !important;
    align-items: center;
    min-height: 38px;
    gap: 8px !important;
    padding: 8px 9px;
    border: 1px solid var(--border);
    background: var(--panel-2);
    color: var(--muted) !important;
    cursor: pointer;
  }
  .device-option.selected {
    border-color: var(--green);
    background: rgba(126, 255, 162, 0.07);
    color: var(--text) !important;
  }
  .device-option input {
    width: auto;
    margin: 0;
  }
  .device-option span {
    overflow-wrap: anywhere;
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
  .device-library-grid > article {
    min-height: 190px;
  }
  @media (max-width: 960px) {
    .device-selector {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 560px) {
    .device-selector {
      grid-template-columns: 1fr;
    }
  }
`;

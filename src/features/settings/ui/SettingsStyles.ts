import styled from "styled-components";
import { CardSurface, CheckRow } from "../../../shared/ui";

export const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const SettingsCard = styled(CardSurface).attrs({ as: "section" })<{
  $wide?: boolean;
  $danger?: boolean;
}>`
  grid-column: ${({ $wide }) => ($wide ? "1 / -1" : "auto")};
  padding: 20px;
  border-color: ${({ $danger }) => ($danger ? "rgba(255, 111, 125, 0.45)" : "var(--border)")};

  > p {
    color: var(--muted);
    line-height: 1.6;
  }

  @media (max-width: 760px) {
    grid-column: auto;
  }
`;

export const SettingsSectionHeading = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;

  h2 {
    margin: 2px 0 5px;
  }

  p {
    margin: 0;
    color: var(--muted);
    line-height: 1.45;
  }

  @media (max-width: 760px) {
    flex-direction: column;
  }
`;

export const ExampleDatasetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const ExampleActionGuide = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  margin-top: 16px;
  border: 1px solid var(--border);
  background: var(--border);

  > div {
    display: grid;
    gap: 5px;
    padding: 12px 14px;
    background: var(--panel-2);
  }

  strong {
    color: var(--text);
    font-size: 0.86rem;
  }

  span {
    color: var(--muted);
    font-size: 0.8rem;
    line-height: 1.45;
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const ExampleDatasetCard = styled(CardSurface)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  background: var(--panel-2);

  > div:first-child {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
  }

  span,
  p {
    color: var(--muted);
  }

  span {
    white-space: nowrap;
    font-size: 0.72rem;
  }

  p {
    flex: 1;
    margin: 0;
    line-height: 1.45;
  }

  a {
    align-self: center;
    color: var(--cyan);
    font-size: 0.82rem;
    font-weight: 700;
  }
`;

export const SettingsScope = styled.div`
  display: contents;

  .button-stack {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .button-stack {
    margin-top: 18px;
  }
  .data-list {
    display: grid;
    gap: 8px;
    margin-bottom: 0;
  }
  .data-list div {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
  }
  .data-list dt {
    color: var(--muted);
  }
  .data-list dd {
    margin: 0;
    color: var(--cyan);
  }
  .rule-list {
    line-height: 1.8;
    color: var(--text);
  }
  .danger-zone {
    border-color: rgba(255, 111, 125, 0.45);
  }
  .error-message {
    color: var(--red) !important;
  }
  @media (max-width: 760px) {
    .custom-pair {
      grid-template-columns: 1fr;
    }
    .profile-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .profile-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 9px;
    margin: 17px 0;
  }
  .profile-option {
    position: relative;
    padding: 0;
  }
  .profile-option > button:first-child {
    width: 100%;
    min-height: 78px;
    display: grid;
    align-content: center;
    gap: 5px;
    border: 0;
    background: transparent;
    color: var(--text);
    text-align: left;
    padding: 12px;
    cursor: pointer;
  }
  .profile-option strong {
    display: block;
  }
  .profile-option small {
    display: block;
  }
  .delete-profile {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 25px;
    height: 25px;
    border: 1px solid var(--red);
    background: #2b1018;
    color: var(--red);
    cursor: pointer;
  }
  .custom-pair {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 10px;
    align-items: end;
    padding-top: 14px;
    border-top: 1px solid var(--border);
  }
  .custom-pair label {
    display: grid;
    gap: 6px;
    color: var(--muted);
    font-size: 0.8rem;
  }
  .settings-form label {
    display: grid;
    gap: 6px;
    color: var(--muted);
    font-size: 0.8rem;
  }
  .setting-subgrid label {
    display: grid;
    gap: 6px;
    color: var(--muted);
    font-size: 0.8rem;
  }
  .setting-subgrid {
    margin-top: 16px;
  }
  .settings-form {
    display: grid;
    gap: 13px;
    margin-top: 16px;
  }
  .setting-with-description {
    display: grid;
    gap: 4px;
  }
  .setting-with-description > ${CheckRow} {
    padding-bottom: 0;
  }
  .setting-with-description > small {
    padding-left: 26px;
    color: var(--muted);
    line-height: 1.4;
  }
  @media (max-width: 1180px) {
    .profile-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 430px) {
    .profile-grid {
      grid-template-columns: 1fr;
    }
  }
  .catalog-settings-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 11px;
    margin: 16px 0;
  }
  .catalog-settings-card {
    background: var(--panel-2);
    padding: 13px;
  }
  .catalog-settings-card .relation-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    color: var(--muted);
  }
  .catalog-empty-state {
    grid-column: 1 / -1;
    margin: 0;
    padding: 18px;
    border: 1px dashed var(--border);
    color: var(--muted);
  }
  .inline-actions {
    border-top: 1px solid var(--border);
    padding-top: 15px;
  }
  .theme-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
  }
  .theme-grid small {
    line-height: 1.35;
  }
  .theme-swatches {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    height: 24px;
    border: 1px solid var(--border);
  }
  .theme-swatches i {
    display: block;
  }
  .color-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    margin-top: 18px;
    padding-top: 18px;
    border-top: 1px solid var(--border);
  }
  .color-grid label {
    display: grid;
    grid-template-columns: 38px minmax(0, 1fr);
    align-items: center;
    gap: 4px 9px;
  }
  .color-grid label > span {
    grid-column: 1 / -1;
    color: var(--muted);
    font-size: 0.78rem;
  }
  .color-grid input[type="color"] {
    width: 38px;
    height: 32px;
    padding: 2px;
    cursor: pointer;
  }
  .color-grid code {
    overflow: hidden;
    color: var(--text);
    font-size: 0.75rem;
  }
  @media (max-width: 960px) {
    .theme-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .color-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .catalog-settings-list {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 560px) {
    .theme-grid {
      grid-template-columns: 1fr;
    }
    .color-grid {
      grid-template-columns: 1fr;
    }
  }
`;

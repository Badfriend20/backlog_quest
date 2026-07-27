import { createGlobalStyle } from "styled-components";

export const GamesStyles = createGlobalStyle`


.filter-panel {
  display: grid;
  grid-template-columns: minmax(220px, 1.5fr) repeat(3, minmax(140px, 0.75fr)) auto;
  gap: 12px;
  padding: 15px;
  border: 1px solid var(--border);
  background: var(--panel);
  align-items: end;
}
.filter-panel label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 0.8rem;
}
@media (max-width: 1180px) {
  .filter-panel {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 760px) {
  .filter-panel {
    grid-template-columns: 1fr;
  }
  .relation-toolbar {
    flex-direction: column;
  }
  .relation-toolbar > div:last-child {
    justify-content: flex-start;
  }
}
.planning-fields {
  padding: 14px;
  border: 1px solid var(--border);
}
.planning-fields legend {
  padding: 0 6px;
  color: var(--cyan);
  font-weight: 700;
}
.dependency-selection {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 12px;
}
.dependency-selection span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 8px;
  border: 1px solid var(--purple-2);
  background: var(--panel-2);
}
.dependency-selection button {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--red);
  cursor: pointer;
}
.full-width {
  width: 100%;
  margin-top: 8px;
}
.editor-tabs {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}
.editor-tabs button {
  border: 1px solid var(--border);
  background: var(--panel-2);
  color: var(--muted);
  padding: 9px 12px;
  border-radius: 7px;
  cursor: pointer;
  font-weight: 800;
}
.editor-panel {
  min-height: 220px;
}
.relation-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}
.relation-toolbar > div:last-child {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}
.relation-toolbar h3 {
  margin: 2px 0 6px;
}
.relation-card-list {
  display: grid;
  gap: 13px;
}
.relation-save-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}
.copy-summary-notes {
  margin: 10px 0 0;
  color: var(--muted);
}
.playthrough-link-summary {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 10px;
  padding: 9px 11px;
  border-left: 3px solid var(--green);
  background: rgba(126, 255, 162, 0.06);
  color: var(--muted);
  font-size: 0.78rem;
}
.playthrough-link-summary strong {
  color: var(--text);
}
.quick-add-section {
  border: 1px solid rgba(97, 231, 255, 0.28);
  background: rgba(97, 231, 255, 0.035);
  padding: 14px;
}
.quick-add-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}
.quick-add-heading h3 {
  margin: 2px 0 5px;
}
.quick-add-grid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px;
}
.quick-option-list {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px;
}
.quick-add-button {
  min-height: 54px;
  display: grid;
  align-content: center;
  gap: 3px;
  border: 1px solid var(--border);
  background: var(--panel-2);
  color: var(--text);
  text-align: left;
  padding: 9px 11px;
  cursor: pointer;
  font-weight: 800;
}
.quick-add-button:hover:not(:disabled) {
  border-color: var(--cyan);
  color: var(--cyan);
}
.quick-add-button:disabled {
  cursor: default;
  opacity: 0.45;
}
.quick-add-button small {
  color: var(--muted);
  font-weight: 500;
  overflow-wrap: anywhere;
}
.quick-custom-form {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}
.quick-custom-form h3 {
  margin: 2px 0 5px;
}
.field-block {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 0.8rem;
}
.field-block > span {
  font-weight: 600;
}
.field-block small {
  color: var(--muted);
}
@media (max-width: 560px) {
  .quick-add-heading {
    flex-direction: column;
  }
  .quick-add-grid {
    grid-template-columns: 1fr;
  }
  .quick-option-list {
    grid-template-columns: 1fr;
  }
}
`;

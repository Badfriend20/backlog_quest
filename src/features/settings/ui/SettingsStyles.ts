import { createGlobalStyle } from "styled-components";

export const SettingsStyles = createGlobalStyle`

.button-stack {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.settings-card {
  background: var(--panel);
  border: 1px solid var(--border);
  padding: 20px;
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
  color: #ded6ec;
}
.danger-zone {
  border-color: rgba(255, 111, 125, 0.45);
}
.error-message {
  color: var(--red) !important;
}
@media (max-width: 760px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
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
  border: 1px solid var(--border);
  background: var(--panel-2);
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
.setting-with-description .check-row {
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
.settings-section-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}
.settings-section-heading h2 {
  margin: 2px 0 5px;
}
.ownership-rule-list {
  display: grid;
  gap: 10px;
  margin: 16px 0;
}
.ownership-rule-row {
  display: grid;
  grid-template-columns: minmax(130px, 0.8fr) minmax(150px, 0.7fr) minmax(180px, 1fr);
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--panel-2);
}
.ownership-rule-row small {
  text-align: right;
}
.device-settings-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 11px;
}
.device-settings-card {
  border: 1px solid var(--border);
  background: var(--panel-2);
  padding: 13px;
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
.theme-option {
  display: grid;
  gap: 7px;
  min-width: 0;
  padding: 12px;
  border: 1px solid var(--border);
  background: var(--panel-2);
  color: var(--text);
  text-align: left;
  cursor: pointer;
}
.theme-option small {
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
  .ownership-rule-row {
    grid-template-columns: 1fr 1fr;
  }
  .ownership-rule-row > strong {
    grid-column: 1 / -1;
  }
  .device-settings-list {
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
  .settings-section-heading {
    flex-direction: column;
  }
  .ownership-rule-row {
    grid-template-columns: 1fr;
  }
  .ownership-rule-row > strong {
    grid-column: auto;
  }
}
`;

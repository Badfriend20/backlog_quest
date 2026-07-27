import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`

:root {
  color-scheme: dark;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  background: #0d0a17;
  color: #f4f0ff;
  --bg: #0d0a17;
  --panel: #171126;
  --panel-2: #211a35;
  --panel-3: #2a2042;
  --border: #443762;
  --muted: #aaa0bd;
  --text: #f4f0ff;
  --input: #0e0a18;
  --input-text: #f4f0ff;
  --purple: #a673ff;
  --purple-2: #6c3fd6;
  --pink: #ff72c6;
  --cyan: #61e7ff;
  --green: #7effa2;
  --yellow: #ffd56a;
  --orange: #ffa45e;
  --red: #ff6f7d;
  --shadow: 0 16px 44px rgba(0, 0, 0, 0.28);
}

* {
  box-sizing: border-box;
}
html {
  background: var(--bg);
}
body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background:
    radial-gradient(circle at 15% 0%, rgba(166, 115, 255, 0.12), transparent 28rem),
    radial-gradient(circle at 90% 8%, rgba(97, 231, 255, 0.08), transparent 24rem), var(--bg);
}
button {
  font: inherit;
}
input {
  font: inherit;
}
select {
  font: inherit;
}
textarea {
  font: inherit;
}
button {
  color: inherit;
}
button:focus-visible {
  outline: 3px solid rgba(97, 231, 255, 0.45);
  outline-offset: 2px;
}
input:focus-visible {
  outline: 3px solid rgba(97, 231, 255, 0.45);
  outline-offset: 2px;
}
select:focus-visible {
  outline: 3px solid rgba(97, 231, 255, 0.45);
  outline-offset: 2px;
}
textarea:focus-visible {
  outline: 3px solid rgba(97, 231, 255, 0.45);
  outline-offset: 2px;
}
h1 {
  margin-top: 0;
}
h2 {
  margin-top: 0;
}
h3 {
  margin-top: 0;
}
p {
  margin-top: 0;
}
h1 {
  margin-bottom: 0;
  font-size: clamp(1.55rem, 4vw, 2.35rem);
}
h2 {
  margin-bottom: 0;
  font-size: 1.28rem;
}
h3 {
  margin-bottom: 0.55rem;
}
small {
  color: var(--muted);
}
nav {
  display: grid;
  gap: 6px;
}
.nav-button.active {
  color: var(--text);
  background: linear-gradient(90deg, rgba(166, 115, 255, 0.18), rgba(166, 115, 255, 0.05));
  border-color: var(--purple-2);
  box-shadow: inset 3px 0 0 var(--purple);
}
.card-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.modal-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.eyebrow {
  margin-bottom: 5px;
  color: var(--cyan);
  font:
    700 0.72rem/1.2 ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  letter-spacing: 0.13em;
}

.primary-button {
  border: 0;
  cursor: pointer;
}

.ghost-button {
  border: 0;
  cursor: pointer;
}

.danger-button {
  border: 0;
  cursor: pointer;
}

.icon-button {
  border: 0;
  cursor: pointer;
}
.primary-button {
  padding: 10px 14px;
  border-radius: 7px;
  font-weight: 700;
}
.ghost-button {
  padding: 10px 14px;
  border-radius: 7px;
  font-weight: 700;
}
.danger-button {
  padding: 10px 14px;
  border-radius: 7px;
  font-weight: 700;
}
.primary-button {
  background: var(--purple);
  color: #140b22;
  box-shadow: 3px 3px 0 #3d236d;
}
.primary-button:hover {
  transform: translate(-1px, -1px);
  box-shadow: 5px 5px 0 #3d236d;
}
.ghost-button {
  background: var(--panel-2);
  border: 1px solid var(--border);
}
.ghost-button:hover {
  border-color: var(--cyan);
}
.danger-button {
  background: rgba(255, 111, 125, 0.15);
  color: #ffdfe3;
  border: 1px solid var(--red);
}
.icon-button {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: var(--panel-2);
  font-size: 1.6rem;
}
.compact {
  padding: 7px 10px;
  font-size: 0.85rem;
}

.stack-lg > * + * {
  margin-top: 22px;
}
.stack-xl > * + * {
  margin-top: 34px;
}
.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 15px;
}
.game-card {
  background: linear-gradient(145deg, var(--panel), #130f20);
  border: 1px solid var(--border);
  padding: 17px;
  min-width: 0;
  box-shadow: var(--shadow);
}
.game-card.featured {
  border-top: 3px solid var(--purple);
}
.game-card h3 {
  overflow-wrap: anywhere;
}
.game-card p {
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.5;
  min-height: 2.7em;
}
.card-topline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}
.status-pill {
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
.priority-chip {
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
.priority-chip {
  color: var(--yellow);
  background: rgba(255, 213, 106, 0.08);
}
.status-green {
  color: var(--green);
  background: rgba(126, 255, 162, 0.08);
}
.status-cyan {
  color: var(--cyan);
  background: rgba(97, 231, 255, 0.08);
}
.status-orange {
  color: var(--orange);
  background: rgba(255, 164, 94, 0.08);
}
.status-red {
  color: var(--red);
  background: rgba(255, 111, 125, 0.08);
}
.status-pink {
  color: var(--pink);
  background: rgba(255, 114, 198, 0.08);
}
.status-yellow {
  color: var(--yellow);
  background: rgba(255, 213, 106, 0.08);
}
.copy-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 14px 0;
}
.copy-chips span {
  padding: 4px 7px;
  background: var(--panel-3);
  color: var(--muted);
  border-radius: 4px;
  font-size: 0.72rem;
}
.copy-chips button {
  padding: 4px 7px;
  background: var(--panel-3);
  color: var(--muted);
  border-radius: 4px;
  font-size: 0.72rem;
}
.form-grid label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 0.8rem;
}
input {
  width: 100%;
  background: var(--input);
  color: var(--input-text);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px 11px;
}
select {
  width: 100%;
  background: var(--input);
  color: var(--input-text);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px 11px;
}
textarea {
  width: 100%;
  background: var(--input);
  color: var(--input-text);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px 11px;
}
input::placeholder {
  color: var(--muted);
  opacity: 1;
}
textarea::placeholder {
  color: var(--muted);
  opacity: 1;
}
textarea {
  resize: vertical;
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
.library-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 13px;
}
.library-card {
  color: inherit;
  text-align: left;
  cursor: pointer;
  width: 100%;
}
.library-card:hover {
  border-color: var(--cyan);
  transform: translateY(-2px);
}
.progress-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: var(--muted);
  font-size: 0.75rem;
}

.callout {
  border: 1px solid var(--purple-2);
  border-left: 5px solid var(--purple);
  padding: 16px 18px;
  background: rgba(166, 115, 255, 0.08);
}
.callout p {
  color: var(--muted);
  margin: 7px 0 0;
  line-height: 1.5;
}
.callout.mini {
  margin-top: 15px;
  padding: 10px 12px;
  font-size: 0.84rem;
}
.plan-mission-manager .section-heading {
  align-items: flex-start;
}
.plan-mission-manager .section-heading p:last-child {
  margin: 5px 0 0;
  color: var(--muted);
}
.schedule-slot {
  margin-top: 11px;
}
.schedule-slot span {
  display: block;
}
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
  font-size: 0.83rem;
  overflow-wrap: anywhere;
}
table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
  background: var(--panel);
}
th {
  padding: 12px 13px;
  border-bottom: 1px solid var(--border);
  text-align: left;
  vertical-align: top;
}
td {
  padding: 12px 13px;
  border-bottom: 1px solid var(--border);
  text-align: left;
  vertical-align: top;
}
th {
  color: var(--cyan);
  font:
    700 0.72rem ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  text-transform: uppercase;
  background: var(--panel-2);
}
td {
  color: #ddd6ea;
  font-size: 0.85rem;
}
.device-view-heading p:not(.eyebrow) {
  margin: 0;
  color: var(--muted);
}
.modal-actions.split-actions {
  justify-content: space-between;
}
.danger-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
.mini-game-list {
  display: grid;
  gap: 6px;
  margin-top: 12px;
}
.mini-game-list button {
  display: grid;
  gap: 3px;
  text-align: left;
  background: var(--panel-2);
  border: 1px solid var(--border);
  padding: 8px 9px;
  cursor: pointer;
}
.mini-game-list button small {
  color: var(--muted);
}
.mini-game-list button:hover {
  border-color: var(--cyan);
}
.mini-game-list button:focus-visible {
  border-color: var(--cyan);
}
.device-library-grid .library-card {
  min-height: 190px;
}
.device-library-grid .copy-chips {
  margin-top: 18px;
}
.settings-card > p:not(.eyebrow) {
  color: var(--muted);
  line-height: 1.6;
}
.settings-card.wide {
  grid-column: 1 / -1;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(4, 2, 8, 0.78);
  display: grid;
  place-items: center;
  padding: 18px;
}
.modal-dismiss-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: default;
}
.modal {
  position: relative;
  z-index: 1;
  margin: 0;
  width: min(820px, 100%);
  max-height: 92vh;
  overflow-y: auto;
  background: #100b1b;
  color: var(--text);
  border: 2px solid var(--purple);
  box-shadow: 8px 8px 0 #050308;
  padding: 22px;
}
.modal.modal-large {
  width: min(1400px, calc(100vw - 36px));
  max-height: 94vh;
}
.modal-header {
  position: sticky;
  top: -22px;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin: -22px -22px 22px;
  padding: 22px;
  border-bottom: 1px solid var(--border);
  background: inherit;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 13px;
}
.wide-field {
  grid-column: 1 / -1;
}
.editor-relations {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 20px;
}
.editor-relations > div {
  background: var(--panel);
  border: 1px solid var(--border);
  padding: 14px;
}
.editor-relations p {
  color: var(--muted);
  font-size: 0.82rem;
  margin-bottom: 7px;
}
.modal-actions {
  justify-content: flex-end;
  margin-top: 22px;
}
.confirmation-message {
  color: var(--muted);
  line-height: 1.6;
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
@media (max-width: 1180px) {
  .library-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 760px) {
  .topbar-actions .ghost-button {
    display: none;
  }
  .library-grid {
    grid-template-columns: 1fr;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .editor-relations {
    grid-template-columns: 1fr;
  }
  .settings-card.wide {
    grid-column: auto;
  }
  .wide-field {
    grid-column: auto;
  }
  .section-heading {
    flex-direction: column;
    align-items: flex-start;
  }
  .modal-backdrop {
    padding: 8px;
  }
  .modal {
    width: 100%;
    max-height: calc(100dvh - 16px);
    padding: 16px;
  }
  .modal.modal-large {
    width: 100%;
    max-height: calc(100dvh - 16px);
    padding: 16px;
  }
  .modal-header {
    top: -16px;
    margin: -16px -16px 18px;
    padding: 16px;
  }
  .relation-card-header {
    align-items: flex-start;
    flex-direction: column;
  }
  .relation-badges {
    justify-content: flex-start;
  }
  .relation-summary {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 430px) {
  .topbar-actions .primary-button {
    padding: 8px 10px;
  }
}

/* Backlog Quest v2 */
.field-label-with-help {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.help-tooltip {
  width: 18px;
  height: 18px;
  display: inline-grid;
  place-items: center;
  padding: 0;
  border: 1px solid var(--cyan);
  border-radius: 50%;
  background: transparent;
  color: var(--cyan);
  font:
    800 0.68rem/1 ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
}
.dependency-warning {
  padding: 10px 12px;
  background: rgba(255, 164, 94, 0.09);
  border: 1px solid var(--orange);
  color: #ffe4cc;
  font-size: 0.8rem;
}
.queue-main .dependency-warning {
  margin-top: 8px;
  display: inline-block;
}
.card-open {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}
.library-card {
  display: flex;
  flex-direction: column;
}
.library-card .card-open {
  flex: 1;
}
.profile-option.selected {
  border-color: var(--green);
  box-shadow: inset 0 -3px 0 var(--green);
}
.occupied-warning .check-row {
  margin-top: 8px;
  padding-bottom: 0;
}
.form-grid small {
  color: var(--muted);
  line-height: 1.35;
}
.compact-mode .game-card {
  padding: 12px;
}
.compact-mode .game-card p {
  min-height: auto;
  margin-bottom: 8px;
}
.compact-mode .active-version {
  margin: 8px 0;
  padding: 7px 8px;
}
.compact-mode .copy-chips {
  margin: 8px 0;
}
.compact-mode .queue-row {
  padding: 9px 11px;
}

/* Backlog Quest v2.1 · copias y partidas editables */
.editor-tabs button.active {
  border-color: var(--cyan);
  color: var(--cyan);
  background: rgba(97, 231, 255, 0.08);
}
.relation-toolbar p:not(.eyebrow) {
  margin: 0;
  color: var(--muted);
  max-width: 620px;
  line-height: 1.45;
}
.relation-card {
  border: 1px solid var(--border);
  background: var(--panel);
  padding: 14px;
}
.relation-card.editing {
  border-color: var(--cyan);
}
.relation-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 13px;
}
.relation-card-header > div:first-child {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
}
.relation-card-header strong {
  overflow-wrap: anywhere;
}
.relation-id {
  color: var(--cyan);
  font:
    800 0.68rem ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
}
.relation-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.relation-badges span {
  border: 1px solid var(--purple);
  color: #e4cdfd;
  background: rgba(173, 111, 255, 0.08);
  padding: 4px 6px;
  font:
    800 0.62rem ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
}
.compact-form {
  gap: 10px;
}
.compact-form label {
  min-width: 0;
}
.relation-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.relation-actions.split-actions {
  justify-content: space-between;
}
.relation-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
  gap: 10px;
  margin: 0;
}
.relation-summary-grid > div {
  min-width: 0;
  padding: 9px 10px;
  border: 1px solid var(--border);
  background: var(--panel-alt);
}
.relation-summary-grid dt {
  margin-bottom: 4px;
  color: var(--muted);
  font:
    700 0.66rem/1.2 ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  text-transform: uppercase;
}
.relation-summary-grid dd {
  margin: 0;
  overflow-wrap: anywhere;
  font-weight: 700;
}
.danger-button.compact {
  padding: 7px 10px;
  font-size: 0.75rem;
}
.empty-relation {
  border: 1px dashed var(--border);
  padding: 22px;
  color: var(--muted);
  text-align: center;
}
.relation-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
  margin-bottom: 17px;
}
.relation-summary > div {
  display: grid;
  gap: 4px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  background: var(--panel);
}
.relation-summary span {
  color: var(--muted);
  font-size: 0.7rem;
}
.relation-summary strong {
  font-size: 0.8rem;
  overflow-wrap: anywhere;
}

/* Backlog Quest v2.2 · agregado rápido y dispositivos normalizados */
.quick-add-heading p:not(.eyebrow) {
  margin: 0;
  color: var(--muted);
  line-height: 1.45;
}
.settings-section-heading p:not(.eyebrow) {
  margin: 0;
  color: var(--muted);
  line-height: 1.45;
}
.ownership-rule-row .check-row {
  padding: 0;
}
.ownership-rule-row label:not(.check-row) {
  display: grid;
  gap: 5px;
  color: var(--muted);
  font-size: 0.8rem;
}
.quick-custom-form > div:first-child p:not(.eyebrow) {
  margin: 0 0 14px;
  color: var(--muted);
}
.device-option.selected {
  border-color: var(--green);
  color: var(--text) !important;
  background: rgba(126, 255, 162, 0.07);
}
.device-settings-card .relation-actions {
  align-items: center;
  justify-content: space-between;
  color: var(--muted);
}
.theme-option.selected {
  border-color: var(--cyan);
  box-shadow: inset 0 0 0 1px var(--cyan);
}
`;

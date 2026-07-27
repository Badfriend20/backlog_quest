import { createGlobalStyle } from "styled-components";

export const MissionsStyles = createGlobalStyle`

.mission-slot-line {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 9px;
  color: var(--muted);
  font-size: 0.76rem;
}
.slot-chip {
  display: inline-flex;
  padding: 4px 7px;
  border: 1px solid var(--cyan);
  color: var(--cyan);
  background: rgba(97, 231, 255, 0.07);
  font:
    700 0.66rem ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
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
.copy-chip.active-copy {
  color: var(--green);
  border: 1px solid var(--green);
  background: rgba(126, 255, 162, 0.1);
}
.copy-chip {
  display: inline-flex;
}
.tooltip-anchor {
  position: relative;
  cursor: help;
}
.tooltip-anchor::after {
  content: attr(data-tooltip);
  position: absolute;
  left: 50%;
  bottom: calc(100% + 9px);
  z-index: 100;
  width: max-content;
  max-width: 260px;
  padding: 8px 10px;
  border: 1px solid var(--cyan);
  background: #090611;
  color: var(--text);
  box-shadow: 4px 4px 0 #030205;
  font:
    500 0.74rem/1.4 Inter,
    ui-sans-serif,
    system-ui,
    sans-serif;
  white-space: normal;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translate(-50%, 5px);
  transition: 0.14s ease;
}
.tooltip-anchor::before {
  content: "";
  position: absolute;
  bottom: calc(100% + 3px);
  left: 50%;
  width: 8px;
  height: 8px;
  background: #090611;
  border-right: 1px solid var(--cyan);
  border-bottom: 1px solid var(--cyan);
  transform: translateX(-50%) rotate(45deg);
  opacity: 0;
  visibility: hidden;
  z-index: 101;
}
.tooltip-anchor:hover::after {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0);
}
.tooltip-anchor:focus::after {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0);
}
.tooltip-anchor:hover::before {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0);
}
.tooltip-anchor:focus::before {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0);
}
.tooltip-anchor:hover::before {
  transform: translateX(-50%) rotate(45deg);
}
.tooltip-anchor:focus::before {
  transform: translateX(-50%) rotate(45deg);
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
.weekday-field {
  border: 1px solid var(--border);
  padding: 12px;
}
.weekday-field legend {
  padding: 0 6px;
  color: var(--muted);
  font-size: 0.8rem;
}
.weekday-field > div {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}
.weekday-field label {
  position: relative;
  display: block;
}
.weekday-field input {
  position: absolute;
  opacity: 0;
}
.weekday-field label span {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid var(--border);
  background: var(--panel-2);
  cursor: pointer;
}
.weekday-field input:checked + span {
  color: #130a21;
  background: var(--purple);
  border-color: var(--purple);
  font-weight: 800;
}
@media (max-width: 1180px) {
  .tooltip-anchor::after {
    position: fixed;
    left: 14px;
    right: 14px;
    bottom: 18px;
    width: auto;
    max-width: none;
    transform: none;
  }
  .tooltip-anchor::before {
    display: none;
  }
  .tooltip-anchor:hover::after {
    transform: none;
  }
  .tooltip-anchor:focus::after {
    transform: none;
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

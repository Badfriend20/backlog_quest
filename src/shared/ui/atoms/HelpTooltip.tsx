import styled from "styled-components";
import { tooltipAnchorStyles } from "./Tooltip";

const Label = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const HelpButton = styled.button`
  ${tooltipAnchorStyles}

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
`;

export function HelpTooltip({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <Label>
      {label}
      <HelpButton type="button" data-tooltip={tooltip} aria-label={`${label}: ${tooltip}`}>
        ?
      </HelpButton>
    </Label>
  );
}

import type { ReactNode } from "react";
import styled, { css } from "styled-components";
import { chipBaseStyles, tooltipAnchorStyles } from "../../../shared/ui";

const chipStyles = css`
  &.status-pill,
  &.priority-chip {
    ${chipBaseStyles}
  }

  &.status-pill {
    color: var(--purple);
    background: rgba(166, 115, 255, 0.08);
  }

  &.status-green {
    color: var(--green);
    background: rgba(126, 255, 162, 0.08);
  }

  &.status-cyan {
    color: var(--cyan);
    background: rgba(97, 231, 255, 0.08);
  }

  &.status-orange {
    color: var(--orange);
    background: rgba(255, 164, 94, 0.08);
  }

  &.status-red {
    color: var(--red);
    background: rgba(255, 111, 125, 0.08);
  }

  &.status-pink {
    color: var(--pink);
    background: rgba(255, 114, 198, 0.08);
  }

  &.status-yellow {
    color: var(--yellow);
    background: rgba(255, 213, 106, 0.08);
  }

  &.priority-chip {
    color: var(--yellow);
    background: rgba(255, 213, 106, 0.08);
  }

  &.slot-chip {
    display: inline-flex;
    padding: 4px 7px;
    border: 1px solid var(--cyan);
    background: rgba(97, 231, 255, 0.07);
    color: var(--cyan);
    font:
      700 0.66rem ui-monospace,
      SFMono-Regular,
      Menlo,
      monospace;
  }

  &.copy-chip {
    display: inline-flex;
    padding: 4px 7px;
    border: 0;
    border-radius: 4px;
    background: var(--panel-3);
    color: var(--muted);
    font-size: 0.72rem;
  }

  &.copy-chip.active-copy {
    border: 1px solid var(--green);
    background: rgba(126, 255, 162, 0.1);
    color: var(--green);
  }
`;

const TooltipButton = styled.button`
  ${tooltipAnchorStyles}
  ${chipStyles}
`;

const TooltipLabel = styled.span`
  ${chipStyles}
`;

export function TooltipChip({
  enabled,
  tooltip,
  className,
  children,
}: {
  enabled: boolean;
  tooltip: string;
  className: string;
  children: ReactNode;
}) {
  if (!enabled) return <TooltipLabel className={className}>{children}</TooltipLabel>;

  return (
    <TooltipButton
      type="button"
      className={className}
      data-tooltip={tooltip}
      aria-label={`${String(children)}: ${tooltip}`}
    >
      {children}
    </TooltipButton>
  );
}

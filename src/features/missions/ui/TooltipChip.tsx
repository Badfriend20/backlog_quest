import type { ReactNode } from "react";
import styled, { css } from "styled-components";
import {
  chipBaseStyles,
  chipToneStyles,
  tooltipAnchorStyles,
  type ChipTone,
} from "../../../shared/ui";

const chipStyles = css`
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

interface TooltipChipStyles {
  $tone?: ChipTone | string;
}

const sharedToneStyles = css<TooltipChipStyles>`
  ${({ $tone }) =>
    $tone &&
    css`
      ${chipBaseStyles}
      ${chipToneStyles}
    `}
`;

const TooltipButton = styled.button<TooltipChipStyles>`
  ${tooltipAnchorStyles}
  ${sharedToneStyles}
  ${chipStyles}
`;

const TooltipLabel = styled.span<TooltipChipStyles>`
  ${sharedToneStyles}
  ${chipStyles}
`;

export function TooltipChip({
  enabled,
  tooltip,
  tone,
  className,
  children,
}: Readonly<{
  enabled: boolean;
  tooltip: string;
  tone?: ChipTone | string;
  className?: string;
  children: ReactNode;
}>) {
  if (!enabled)
    return (
      <TooltipLabel $tone={tone} className={className}>
        {children}
      </TooltipLabel>
    );

  return (
    <TooltipButton
      type="button"
      $tone={tone}
      className={className}
      data-tooltip={tooltip}
      aria-label={`${String(children)}: ${tooltip}`}
    >
      {children}
    </TooltipButton>
  );
}

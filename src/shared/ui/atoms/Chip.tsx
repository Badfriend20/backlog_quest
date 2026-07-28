import type { HTMLAttributes } from "react";
import styled, { css } from "styled-components";

export type ChipTone =
  | "status-green"
  | "status-cyan"
  | "status-orange"
  | "status-red"
  | "status-pink"
  | "status-yellow"
  | "status-purple";

export const chipBaseStyles = css`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 4px 7px;
  border: 1px solid currentColor;
  font:
    700 0.68rem/1.2 ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
`;

export const chipToneStyles = css<{ $tone?: ChipTone | string }>`
  color: ${({ $tone }) => {
    if ($tone === "status-green") return "var(--green)";
    if ($tone === "status-cyan") return "var(--cyan)";
    if ($tone === "status-orange") return "var(--orange)";
    if ($tone === "status-red") return "var(--red)";
    if ($tone === "status-pink") return "var(--pink)";
    if ($tone === "status-yellow") return "var(--yellow)";
    return "var(--purple)";
  }};
  background: ${({ $tone }) => {
    if ($tone === "status-green") return "rgba(126, 255, 162, 0.08)";
    if ($tone === "status-cyan") return "rgba(97, 231, 255, 0.08)";
    if ($tone === "status-orange") return "rgba(255, 164, 94, 0.08)";
    if ($tone === "status-red") return "rgba(255, 111, 125, 0.08)";
    if ($tone === "status-pink") return "rgba(255, 114, 198, 0.08)";
    if ($tone === "status-yellow") return "rgba(255, 213, 106, 0.08)";
    return "rgba(166, 115, 255, 0.08)";
  }};
`;

const StyledStatusChip = styled.span<{ $tone?: ChipTone | string }>`
  ${chipBaseStyles}
  ${chipToneStyles}
`;

export function StatusChip({
  tone,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: ChipTone | string }) {
  return <StyledStatusChip {...props} $tone={tone} />;
}

export const PriorityChip = styled.span`
  ${chipBaseStyles}
  color: var(--yellow);
  background: rgba(255, 213, 106, 0.08);
`;

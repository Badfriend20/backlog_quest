import type { ButtonHTMLAttributes } from "react";
import styled, { css } from "styled-components";

type ButtonVariant = "primary" | "ghost" | "danger" | "warning" | "text";
type ButtonSize = "default" | "compact";

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
}>`
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  padding: ${({ $size }) => ($size === "compact" ? "7px 10px" : "10px 14px")};
  border: 0;
  border-radius: 7px;
  color: inherit;
  font: inherit;
  font-size: ${({ $size }) => ($size === "compact" ? "0.85rem" : "inherit")};
  font-weight: 700;
  cursor: pointer;

  ${({ $variant }) => {
    if ($variant === "primary") {
      return css`
        background: var(--purple);
        color: var(--primary-text, #140b22);
        box-shadow: 3px 3px 0 #3d236d;

        &:hover:not(:disabled) {
          transform: translate(-1px, -1px);
          box-shadow: 5px 5px 0 #3d236d;
        }
      `;
    }
    if ($variant === "danger") {
      return css`
        background: rgba(255, 111, 125, 0.15);
        color: var(--text);
        border: 1px solid var(--red);
      `;
    }
    if ($variant === "warning") {
      return css`
        background: rgba(255, 209, 102, 0.12);
        color: var(--warning);
        border: 1px solid var(--warning);

        &:hover:not(:disabled) {
          border-color: var(--cyan);
          color: var(--cyan);
        }
      `;
    }
    if ($variant === "text") {
      return css`
        padding: 6px;
        background: transparent;
        color: var(--cyan);
      `;
    }
    return css`
      background: var(--panel-2);
      border: 1px solid var(--border);

      &:hover:not(:disabled) {
        border-color: var(--cyan);
      }
    `;
  }}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export function Button({
  variant = "ghost",
  size = "default",
  fullWidth = false,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      {...props}
      type={type}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      data-variant={variant}
    />
  );
}

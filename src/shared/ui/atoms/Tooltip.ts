import { css } from "styled-components";

export const tooltipAnchorStyles = css`
  position: relative;
  cursor: help;

  &::after {
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

  &::before {
    content: "";
    position: absolute;
    bottom: calc(100% + 3px);
    left: 50%;
    z-index: 101;
    width: 8px;
    height: 8px;
    border-right: 1px solid var(--cyan);
    border-bottom: 1px solid var(--cyan);
    background: #090611;
    opacity: 0;
    visibility: hidden;
    transform: translateX(-50%) rotate(45deg);
  }

  &:hover::after,
  &:focus::after {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, 0);
  }

  &:hover::before,
  &:focus::before {
    opacity: 1;
    visibility: visible;
  }

  @media (max-width: 1180px) {
    &::after {
      position: fixed;
      left: 14px;
      right: 14px;
      bottom: 18px;
      width: auto;
      max-width: none;
      transform: none;
    }

    &::before {
      display: none;
    }

    &:hover::after,
    &:focus::after {
      transform: none;
    }
  }
`;

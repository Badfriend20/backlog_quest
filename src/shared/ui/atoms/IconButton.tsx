import styled from "styled-components";

export const IconButton = styled.button.attrs(props => ({
  type: props.type ?? "button",
}))`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 1px solid var(--border);
  background: var(--panel-2);
  color: var(--text);
  font: inherit;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;

  &:hover:not(:disabled),
  &:focus-visible {
    border-color: var(--cyan);
    color: var(--cyan);
  }

  &:focus-visible {
    outline: 2px solid var(--cyan);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

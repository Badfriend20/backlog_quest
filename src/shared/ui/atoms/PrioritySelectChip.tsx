import { useEffect, useId, useRef, useState } from "react";
import styled from "styled-components";
import { chipBaseStyles } from "./Chip";

export interface PrioritySelectOption {
  id: string;
  label: string;
  description?: string;
}

const PriorityMenuRoot = styled.div`
  position: relative;
  width: fit-content;
  max-width: 100%;
`;

const PriorityTrigger = styled.button`
  ${chipBaseStyles}
  min-height: 32px;
  gap: 5px;
  border-color: var(--yellow);
  background: rgba(255, 213, 106, 0.08);
  color: var(--yellow);
  cursor: pointer;

  &:hover {
    background: var(--panel-2);
  }

  &:focus-visible {
    outline: 2px solid var(--cyan);
    outline-offset: 2px;
  }
`;

const PriorityMenu = styled.div`
  position: absolute;
  top: calc(100% + 7px);
  right: 0;
  z-index: 30;
  display: grid;
  width: min(180px, calc(100vw - 28px));
  padding: 6px;
  border: 1px solid var(--border);
  background: var(--panel);
  box-shadow: 4px 4px 0 var(--background);

  > span {
    padding: 7px 9px 5px;
    color: var(--muted);
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
  }

  button {
    min-height: 38px;
    padding: 8px 9px;
    border: 0;
    background: transparent;
    color: var(--text);
    text-align: left;
    cursor: pointer;
  }

  button:hover,
  button:focus-visible,
  button[aria-checked="true"] {
    background: var(--panel-2);
    color: var(--yellow);
  }
`;

export function PrioritySelectChip({
  value,
  options,
  onChange,
}: {
  value: string;
  options: PrioritySelectOption[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = `priority-menu-${useId().replaceAll(":", "")}`;
  const current = options.find(option => option.label === value);

  useEffect(() => {
    if (!open) return;
    function closeFromOutside(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    }
    function closeFromKeyboard(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    }
    document.addEventListener("pointerdown", closeFromOutside);
    document.addEventListener("keydown", closeFromKeyboard);
    return () => {
      document.removeEventListener("pointerdown", closeFromOutside);
      document.removeEventListener("keydown", closeFromKeyboard);
    };
  }, [open]);

  return (
    <PriorityMenuRoot ref={rootRef}>
      <PriorityTrigger
        ref={triggerRef}
        type="button"
        title={current?.description}
        aria-label={`Cambiar prioridad. Actual: ${value}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(currentOpen => !currentOpen)}
      >
        {value} <span aria-hidden="true">▾</span>
      </PriorityTrigger>
      {open && (
        <PriorityMenu id={menuId} role="menu">
          <span>Prioridad</span>
          {options.map(option => (
            <button
              key={option.id}
              type="button"
              role="menuitemradio"
              aria-checked={option.label === value}
              title={option.description}
              onClick={() => {
                setOpen(false);
                onChange(option.label);
                triggerRef.current?.focus();
              }}
            >
              {option.label}
            </button>
          ))}
        </PriorityMenu>
      )}
    </PriorityMenuRoot>
  );
}

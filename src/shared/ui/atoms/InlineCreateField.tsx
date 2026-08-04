import { useState } from "react";
import styled from "styled-components";
import { Button } from "./Button";

const InlineCreateContainer = styled.div`
  display: grid;
  gap: 8px;
  align-content: start;

  label {
    display: grid;
    gap: 6px;
    color: var(--muted);
    font-size: 0.8rem;
  }

  input {
    width: 100%;
  }

  > div {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
  }
`;

export function InlineCreateField({
  buttonLabel,
  inputLabel,
  placeholder,
  onCreate,
}: {
  buttonLabel: string;
  inputLabel: string;
  placeholder: string;
  onCreate(name: string): void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  function create() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName("");
    setOpen(false);
  }

  if (!open) {
    return (
      <InlineCreateContainer>
        <Button size="compact" onClick={() => setOpen(true)}>
          {buttonLabel}
        </Button>
      </InlineCreateContainer>
    );
  }

  return (
    <InlineCreateContainer>
      <label>
        <span>{inputLabel}</span>
        <input
          maxLength={40}
          value={name}
          placeholder={placeholder}
          onChange={event => setName(event.target.value)}
          onKeyDown={event => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            create();
          }}
        />
      </label>
      <div>
        <Button variant="primary" size="compact" disabled={!name.trim()} onClick={create}>
          Agregar
        </Button>
        <Button size="compact" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </InlineCreateContainer>
  );
}

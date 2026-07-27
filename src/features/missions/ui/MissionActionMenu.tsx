import { useEffect, useRef, useState } from "react";
import type { MissionActions } from "./MissionActions";

export function MissionActionMenu({
  missionId,
  actions,
}: {
  missionId: string;
  actions: MissionActions;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = `mission-actions-${missionId}`;

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

  function run(action: (id: string) => void) {
    setOpen(false);
    action(missionId);
  }

  return (
    <div className="action-menu" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="action-menu-trigger"
        aria-label="Más acciones"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(current => !current)}
      >
        ⋯
      </button>
      {open && (
        <div id={menuId} role="menu">
          <button type="button" role="menuitem" onClick={() => run(actions.onEditMission)}>
            Cambiar plataforma o agenda
          </button>
          <button type="button" role="menuitem" onClick={() => run(actions.onPause)}>
            Pausar
          </button>
          <button type="button" role="menuitem" onClick={() => run(actions.onSendEnd)}>
            Enviar al final
          </button>
          <button
            type="button"
            role="menuitem"
            className="danger-text"
            onClick={() => run(actions.onAbandon)}
          >
            Abandonar
          </button>
        </div>
      )}
    </div>
  );
}

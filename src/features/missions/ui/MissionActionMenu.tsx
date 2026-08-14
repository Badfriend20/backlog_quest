import { IconButton, useDismissiblePopover } from "../../../shared/ui";
import type { MissionActions } from "./MissionActions";

export function MissionActionMenu({
  missionId,
  gameId,
  actions,
}: {
  missionId: string;
  gameId: string;
  actions: MissionActions;
}) {
  const { open, rootRef, triggerRef, toggle, close } = useDismissiblePopover();
  const menuId = `mission-actions-${missionId}`;

  function run(action: (id: string) => void) {
    close();
    action(missionId);
  }

  return (
    <div className="action-menu" ref={rootRef}>
      <IconButton
        ref={triggerRef}
        className="action-menu-trigger"
        aria-label="Más acciones"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={toggle}
      >
        ⋯
      </IconButton>
      {open && (
        <div id={menuId} role="menu">
          <button type="button" role="menuitem" onClick={() => run(actions.onPause)}>
            Pausar
          </button>
          <button type="button" role="menuitem" onClick={() => run(actions.onSendEnd)}>
            Enviar al final
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              close();
              actions.onEditGame(gameId);
            }}
          >
            Editar actividad
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

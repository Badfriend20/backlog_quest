import type { QueueItem } from "../../../shared/kernel/quest";
import { IconButton, useDismissiblePopover } from "../../../shared/ui";
import {
  recommendationMoveOptions,
  type RecommendationMoveTarget,
} from "../domain/recommendationMove";

export function RotationMoveMenu({
  item,
  queueLength,
  onMove,
}: {
  item: QueueItem;
  queueLength: number;
  onMove: (target: RecommendationMoveTarget) => void;
}) {
  const { open, rootRef, triggerRef, toggle, close } = useDismissiblePopover();
  const menuId = `recommendation-move-${item.gameId}`;
  const options = recommendationMoveOptions(queueLength, item.position);

  return (
    <div className="rotation-move-menu" ref={rootRef}>
      <IconButton
        ref={triggerRef}
        className="rotation-menu-trigger"
        disabled={item.pinned}
        title={item.pinned ? "Posición fijada" : "Mover en la lista"}
        aria-label={item.pinned ? "Posición fijada" : "Mover en la lista"}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={toggle}
      >
        ⋮
      </IconButton>
      {open && (
        <div id={menuId} role="menu">
          <strong>Mover en la lista</strong>
          {options.map(option => (
            <button
              key={option.id}
              type="button"
              role="menuitem"
              disabled={option.disabled}
              onClick={() => {
                close();
                onMove(option.id);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

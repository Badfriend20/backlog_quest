import { useEffect, useRef, useState } from "react";
import type { QueueItem } from "../../../shared/kernel/quest";
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
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = `recommendation-move-${item.gameId}`;
  const options = recommendationMoveOptions(queueLength, item.position);

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
    <div className="rotation-move-menu" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="rotation-menu-trigger"
        disabled={item.pinned}
        title={item.pinned ? "Posición fijada" : "Mover en la lista"}
        aria-label={item.pinned ? "Posición fijada" : "Mover en la lista"}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(current => !current)}
      >
        ⋮
      </button>
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
                setOpen(false);
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

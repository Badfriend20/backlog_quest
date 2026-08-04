import { useRef } from "react";
import { Button } from "../../../shared/ui";

const SWIPE_DISMISS_DISTANCE = 72;

export function UndoToast({
  message,
  canUndo,
  onUndo,
  onDismiss,
}: {
  message: string;
  canUndo: boolean;
  onUndo(): void;
  onDismiss(): void;
}) {
  const toastRef = useRef<HTMLOutputElement>(null);
  const gestureRef = useRef({ pointerId: -1, startX: 0, startY: 0, deltaX: 0 });

  function resetPosition() {
    if (!toastRef.current) return;
    toastRef.current.style.transform = "";
    toastRef.current.style.opacity = "";
  }

  return (
    <output
      ref={toastRef}
      className="toast"
      onPointerDown={event => {
        if ((event.target as HTMLElement).closest("button")) return;
        gestureRef.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          deltaX: 0,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={event => {
        const gesture = gestureRef.current;
        if (gesture.pointerId !== event.pointerId) return;
        const deltaX = event.clientX - gesture.startX;
        const deltaY = event.clientY - gesture.startY;
        if (Math.abs(deltaX) <= Math.abs(deltaY)) return;
        gesture.deltaX = deltaX;
        event.currentTarget.style.transform = `translateX(${deltaX}px)`;
        event.currentTarget.style.opacity = String(
          Math.max(0.35, 1 - Math.abs(deltaX) / event.currentTarget.offsetWidth)
        );
      }}
      onPointerUp={event => {
        const gesture = gestureRef.current;
        if (gesture.pointerId !== event.pointerId) return;
        gesture.pointerId = -1;
        if (
          Math.abs(gesture.deltaX) >=
          Math.min(SWIPE_DISMISS_DISTANCE, event.currentTarget.offsetWidth * 0.25)
        ) {
          onDismiss();
          return;
        }
        resetPosition();
      }}
      onPointerCancel={() => {
        gestureRef.current.pointerId = -1;
        resetPosition();
      }}
    >
      <span>{message}</span>
      <span className="toast-actions">
        {canUndo && (
          <Button variant="text" onClick={onUndo}>
            Deshacer
          </Button>
        )}
        <Button variant="text" aria-label="Descartar aviso" onClick={onDismiss}>
          ×
        </Button>
      </span>
    </output>
  );
}
